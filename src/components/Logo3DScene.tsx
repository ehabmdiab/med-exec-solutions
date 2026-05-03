import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import logoTextureUrl from "@/assets/auh-logo-clean.png";

type DissolveRef = React.MutableRefObject<number>;

const LOGO_WIDTH = 2.75;
const LOGO_HEIGHT = 2.57;
const PARTICLE_COUNT = 1300;

function useLogoTexture() {
  const texture = useLoader(THREE.TextureLoader, logoTextureUrl);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  return texture;
}

function buildInnerVShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.86, 1.24);
  shape.bezierCurveTo(-0.66, 0.88, -0.6, 0.28, -0.6, -0.45);
  shape.bezierCurveTo(-0.6, -0.92, -0.47, -1.14, -0.24, -1.14);
  shape.bezierCurveTo(-0.03, -1.14, -0.19, -0.48, 0, -0.48);
  shape.bezierCurveTo(0.19, -0.48, 0.03, -1.14, 0.24, -1.14);
  shape.bezierCurveTo(0.47, -1.14, 0.6, -0.92, 0.6, -0.45);
  shape.bezierCurveTo(0.6, 0.28, 0.66, 0.88, 0.86, 1.24);
  shape.bezierCurveTo(0.36, 1.4, -0.36, 1.4, -0.86, 1.24);
  shape.closePath();
  return shape;
}

function buildLeftOuterVShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.28, 1.5);
  shape.bezierCurveTo(-0.83, 1.3, -0.66, 0.65, -0.65, -0.52);
  shape.bezierCurveTo(-0.65, -1.02, -0.47, -1.28, -0.08, -1.5);
  shape.bezierCurveTo(-0.76, -1.5, -1.31, -0.97, -1.36, -0.15);
  shape.lineTo(-1.36, 1.48);
  shape.bezierCurveTo(-1.34, 1.52, -1.31, 1.53, -1.28, 1.5);
  shape.closePath();
  return shape;
}

function buildRightOuterVShape() {
  const shape = new THREE.Shape();
  shape.moveTo(1.28, 1.5);
  shape.bezierCurveTo(0.83, 1.3, 0.66, 0.65, 0.65, -0.52);
  shape.bezierCurveTo(0.65, -1.02, 0.47, -1.28, 0.08, -1.5);
  shape.bezierCurveTo(0.76, -1.5, 1.31, -0.97, 1.36, -0.15);
  shape.lineTo(1.36, 1.48);
  shape.bezierCurveTo(1.34, 1.52, 1.31, 1.53, 1.28, 1.5);
  shape.closePath();
  return shape;
}

function buildWhiteLowerEdgeShape(side: -1 | 1) {
  const shape = new THREE.Shape();
  const s = side;
  shape.moveTo(s * 0.36, 0.95);
  shape.bezierCurveTo(s * 0.46, 0.48, s * 0.48, -0.14, s * 0.48, -0.78);
  shape.bezierCurveTo(s * 0.48, -1.04, s * 0.42, -1.16, s * 0.28, -1.16);
  shape.bezierCurveTo(s * 0.12, -1.16, s * 0.16, -0.84, s * 0.18, -0.54);
  shape.bezierCurveTo(s * 0.2, 0.04, s * 0.18, 0.58, s * 0.26, 1.02);
  shape.bezierCurveTo(s * 0.29, 1.1, s * 0.34, 1.06, s * 0.36, 0.95);
  shape.closePath();
  return shape;
}

function buildRoundedRectShape(width: number, height: number, radius: number) {
  const x = width / 2;
  const y = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-x + radius, -y);
  shape.lineTo(x - radius, -y);
  shape.quadraticCurveTo(x, -y, x, -y + radius);
  shape.lineTo(x, y - radius);
  shape.quadraticCurveTo(x, y, x - radius, y);
  shape.lineTo(-x + radius, y);
  shape.quadraticCurveTo(-x, y, -x, y - radius);
  shape.lineTo(-x, -y + radius);
  shape.quadraticCurveTo(-x, -y, -x + radius, -y);
  return shape;
}

function buildTopArcShape() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 0.5, Math.PI * 0.08, Math.PI * 0.92, false);
  shape.absarc(0, 0, 0.31, Math.PI * 0.92, Math.PI * 0.08, true);
  shape.closePath();
  return shape;
}

function InnerVNegativeSpace({ progress }: { progress: DissolveRef }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => new THREE.ShapeGeometry(buildInnerVShape(), 48), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#f8fbfb"),
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(() => {
    material.opacity = 0.94 * (1 - progress.current * 0.82);
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} position={[0, -0.05, -0.035]} scale={[1.04, 1, 1]} />;
}

function VLogoMark({ dissolveProgress }: { dissolveProgress: DissolveRef }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  const [leftGeometry, rightGeometry, innerGeometry, pillGeometry, arcGeometry, leftEdgeGeometry, rightEdgeGeometry] = useMemo(() => {
    const depthOptions: THREE.ExtrudeGeometryOptions = {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.018,
      bevelSegments: 5,
      curveSegments: 56,
    };

    const shallowOptions = { ...depthOptions, depth: 0.14, bevelThickness: 0.018, bevelSize: 0.012 };
    const geometries = [
      new THREE.ExtrudeGeometry(buildLeftOuterVShape(), depthOptions),
      new THREE.ExtrudeGeometry(buildRightOuterVShape(), depthOptions),
      new THREE.ExtrudeGeometry(buildInnerVShape(), shallowOptions),
      new THREE.ExtrudeGeometry(buildRoundedRectShape(0.32, 0.72, 0.05), depthOptions),
      new THREE.ExtrudeGeometry(buildTopArcShape(), depthOptions),
      new THREE.ExtrudeGeometry(buildWhiteLowerEdgeShape(-1), shallowOptions),
      new THREE.ExtrudeGeometry(buildWhiteLowerEdgeShape(1), shallowOptions),
    ];

    geometries.forEach((geometry) => {
      geometry.translate(0, 0, -0.1);
      geometry.computeVertexNormals();
    });

    return geometries;
  }, []);

  const leftMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#78d2c1"),
        roughness: 0.26,
        metalness: 0.12,
        clearcoat: 0.62,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.25,
        transparent: true,
      }),
    [],
  );

  const rightMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#118894"),
        roughness: 0.26,
        metalness: 0.16,
        clearcoat: 0.64,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.25,
        transparent: true,
      }),
    [],
  );

  const innerMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f7faf9"),
        roughness: 0.18,
        metalness: 0.02,
        clearcoat: 0.56,
        envMapIntensity: 1.45,
        emissive: new THREE.Color("#f7faf9"),
        emissiveIntensity: 0.16,
        transparent: true,
      }),
    [],
  );

  const orangeMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f36f24"),
        roughness: 0.22,
        metalness: 0.16,
        clearcoat: 0.56,
        clearcoatRoughness: 0.14,
        envMapIntensity: 1.05,
        emissive: new THREE.Color("#8c3300"),
        emissiveIntensity: 0.08,
        transparent: true,
      }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.3 + Math.sin(clock.elapsedTime * 0.22) * 0.035, delta * 3);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.15 + Math.cos(clock.elapsedTime * 0.18) * 0.02, delta * 3);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointer.x * 0.025, delta * 2.6);

    const progress = dissolveProgress.current;
    const opacity = 1 - progress * 0.9;
    group.scale.setScalar(1 + progress * 0.05);
    [leftMaterial, rightMaterial, innerMaterial, orangeMaterial].forEach((material) => {
      material.opacity = opacity;
    });
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.24} floatingRange={[-0.07, 0.07]}>
      <group ref={groupRef}>
        <mesh geometry={leftGeometry} material={leftMaterial} position={[0, 0, 0]} />
        <mesh geometry={rightGeometry} material={rightMaterial} position={[0, 0, 0]} />
        <mesh geometry={innerGeometry} material={innerMaterial} position={[0, 0.02, 0.29]} scale={[1.08, 1, 1]} />
        <mesh geometry={leftEdgeGeometry} material={innerMaterial} position={[0, 0.02, 0.42]} scale={[1.05, 1, 1]} />
        <mesh geometry={rightEdgeGeometry} material={innerMaterial} position={[0, 0.02, 0.42]} scale={[1.05, 1, 1]} />
        <mesh geometry={pillGeometry} material={orangeMaterial} position={[0, 0.1, 0.25]} />
        <mesh geometry={arcGeometry} material={orangeMaterial} position={[0, 0.97, 0.25]} scale={[0.82, 0.5, 1]} />
      </group>
    </Float>
  );
}

function ExactLogoPlanes({ dissolveProgress }: { dissolveProgress: DissolveRef }) {
  return <VLogoMark dissolveProgress={dissolveProgress} />;
}

function DissolveParticles({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const progressRef = useRef(0);
  const texture = useLogoTexture();

  const { basePositions, velocities, colors } = useMemo(() => {
    const image = texture.image as HTMLImageElement | undefined;
    const fallbackPositions = new Float32Array(PARTICLE_COUNT * 3);
    const fallbackVelocities = new Float32Array(PARTICLE_COUNT * 3);
    const fallbackColors = new Float32Array(PARTICLE_COUNT * 3);

    if (!image) {
      return { basePositions: fallbackPositions, velocities: fallbackVelocities, colors: fallbackColors };
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      return { basePositions: fallbackPositions, velocities: fallbackVelocities, colors: fallbackColors };
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const candidates: number[] = [];

    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const index = (y * canvas.width + x) * 4;
        if (data[index + 3] > 24) candidates.push(index);
      }
    }

    const base = new Float32Array(PARTICLE_COUNT * 3);
    const velocity = new Float32Array(PARTICLE_COUNT * 3);
    const color = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pixelIndex = candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
      const pixel = pixelIndex / 4;
      const x = pixel % canvas.width;
      const y = Math.floor(pixel / canvas.width);
      const px = (x / canvas.width - 0.5) * LOGO_WIDTH;
      const py = (0.5 - y / canvas.height) * LOGO_HEIGHT;
      const pz = (Math.random() - 0.5) * 0.12;
      const bladeDirection = new THREE.Vector3(0.9, -0.18, 0.75).normalize();
      const lift = Math.random() * 0.55 + 0.28;

      base[i * 3] = px;
      base[i * 3 + 1] = py;
      base[i * 3 + 2] = pz;
      velocity[i * 3] = bladeDirection.x * (1.1 + Math.random() * 1.7) + (Math.random() - 0.5) * 0.25;
      velocity[i * 3 + 1] = bladeDirection.y * (0.55 + Math.random() * 1.1) + lift;
      velocity[i * 3 + 2] = bladeDirection.z * (0.9 + Math.random() * 1.4);
      color[i * 3] = data[pixelIndex] / 255;
      color[i * 3 + 1] = data[pixelIndex + 1] / 255;
      color[i * 3 + 2] = data[pixelIndex + 2] / 255;
    }

    return { basePositions: base, velocities: velocity, colors: color };
  }, [texture]);

  const animatedPositions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;

    progressRef.current = THREE.MathUtils.damp(progressRef.current, active ? 1 : 0, 4.2, delta);
    const progress = progressRef.current;
    const time = clock.elapsedTime;
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = basePositions[i * 3];
      const py = basePositions[i * 3 + 1];
      const sliceCoordinate = px + py * 0.28;
      const blade = -1.7 + progress * 3.4;
      const localProgress = THREE.MathUtils.clamp((blade - sliceCoordinate) * 2.7, 0, 1);
      const wobble = Math.sin(time * 9 + i * 0.37) * 0.026 * localProgress;
      positions[i * 3] = px + velocities[i * 3] * localProgress * 1.7 + wobble;
      positions[i * 3 + 1] = py + velocities[i * 3 + 1] * localProgress * 1.35 - localProgress * localProgress * 0.48;
      positions[i * 3 + 2] = basePositions[i * 3 + 2] + velocities[i * 3 + 2] * localProgress * 1.25;
    }

    positionAttribute.needsUpdate = true;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = Math.min(0.96, progress * 1.35);
    material.size = THREE.MathUtils.lerp(0.011, 0.032, progress);
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[animatedPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.48} color="#e8fbfb" />
      <directionalLight position={[3, 4, 5]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.55} color="#73d7d0" />
      <pointLight position={[0, -2, 3]} intensity={0.55} color="#ff7a2b" distance={9} />
      <spotLight position={[-4, 1, -3]} intensity={0.55} color="#48c7d1" angle={0.55} penumbra={0.82} />
    </>
  );
}

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 260;

  const positions = useMemo(() => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      points[i * 3] = (Math.random() - 0.5) * 18;
      points[i * 3 + 1] = (Math.random() - 0.5) * 11;
      points[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return points;
  }, []);

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.elapsedTime * 0.045;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#74d5dc"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const dissolveRef = useRef(0);
  const { viewport } = useThree();
  const isCompact = viewport.width < 6.2;
  const logoPosition: [number, number, number] = isCompact ? [1.18, -0.3, 0] : [2.55, 0.02, 0];
  const logoScale = isCompact ? 0.42 : 0.78;

  useFrame((_, delta) => {
    dissolveRef.current = THREE.MathUtils.damp(dissolveRef.current, hovered ? 1 : 0, 3.9, delta);
  });

  return (
    <>
      <SceneLighting />
      <Environment preset="city" environmentIntensity={0.42} />
      <ParticleField />
      <group position={logoPosition} scale={logoScale}>
        <DissolveParticles active={hovered} />
        <ExactLogoPlanes dissolveProgress={dissolveRef} />
        <mesh onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} position={[0, 0, 0.34]}>
          <planeGeometry args={[LOGO_WIDTH * 1.18, LOGO_HEIGHT * 1.18]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

export function Logo3DScene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-auto opacity-95">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <InteractiveScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
