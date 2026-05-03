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
  shape.moveTo(-0.52, 1.2);
  shape.bezierCurveTo(-0.36, 0.74, -0.28, 0.16, -0.3, -0.42);
  shape.bezierCurveTo(-0.32, -0.8, -0.43, -1.04, -0.64, -1.08);
  shape.bezierCurveTo(-0.4, -1.2, -0.18, -1.18, -0.03, -0.88);
  shape.bezierCurveTo(0.12, -1.18, 0.36, -1.2, 0.62, -1.08);
  shape.bezierCurveTo(0.42, -1.04, 0.31, -0.8, 0.29, -0.42);
  shape.bezierCurveTo(0.27, 0.16, 0.36, 0.74, 0.52, 1.2);
  shape.bezierCurveTo(0.2, 1.34, -0.2, 1.34, -0.52, 1.2);
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

function ExactLogoPlanes({ dissolveProgress }: { dissolveProgress: DissolveRef }) {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useLogoTexture();
  const { pointer } = useThree();

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.04,
        roughness: 0.32,
        metalness: 0.08,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [texture],
  );

  const depthMaterials = useMemo(
    () =>
      Array.from(
        { length: 10 },
        (_, i) =>
          new THREE.MeshBasicMaterial({
            map: texture,
            color: new THREE.Color(i < 5 ? "#178f92" : "#0d6f80"),
            transparent: true,
            alphaTest: 0.04,
            opacity: 0.11,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
      ),
    [texture],
  );

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.28 + Math.sin(clock.elapsedTime * 0.22) * 0.035, delta * 3);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.14 + Math.cos(clock.elapsedTime * 0.18) * 0.02, delta * 3);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointer.x * 0.025, delta * 2.6);

    const opacity = 1 - dissolveProgress.current * 0.94;
    frontMaterial.opacity = opacity;
    depthMaterials.forEach((material, index) => {
      material.opacity = (0.12 - index * 0.006) * opacity;
    });
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.24} floatingRange={[-0.07, 0.07]}>
      <group ref={groupRef}>
        <InnerVNegativeSpace progress={dissolveProgress} />
        {depthMaterials.map((material, index) => (
          <mesh key={index} material={material} position={[0, 0, -0.14 + index * 0.014]} scale={[1 + index * 0.003, 1 + index * 0.003, 1]}>
            <planeGeometry args={[LOGO_WIDTH, LOGO_HEIGHT, 1, 1]} />
          </mesh>
        ))}
        <mesh material={frontMaterial} position={[0, 0, 0.04]}>
          <planeGeometry args={[LOGO_WIDTH, LOGO_HEIGHT, 1, 1]} />
        </mesh>
      </group>
    </Float>
  );
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
      const outward = new THREE.Vector3(px, py, 0.55).normalize();
      const lift = Math.random() * 0.9 + 0.45;

      base[i * 3] = px;
      base[i * 3 + 1] = py;
      base[i * 3 + 2] = pz;
      velocity[i * 3] = outward.x * (0.7 + Math.random() * 1.4) + (Math.random() - 0.5) * 1.1;
      velocity[i * 3 + 1] = outward.y * (0.7 + Math.random() * 1.4) + (Math.random() - 0.5) * 1.1;
      velocity[i * 3 + 2] = lift + Math.random() * 1.2;
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
      const wobble = Math.sin(time * 2.2 + i * 0.37) * 0.045 * progress;
      positions[i * 3] = basePositions[i * 3] + velocities[i * 3] * progress * 1.55 + wobble;
      positions[i * 3 + 1] = basePositions[i * 3 + 1] + velocities[i * 3 + 1] * progress * 1.55 + wobble * 0.5;
      positions[i * 3 + 2] = basePositions[i * 3 + 2] + velocities[i * 3 + 2] * progress * 1.35;
    }

    positionAttribute.needsUpdate = true;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = Math.min(0.95, progress * 1.2);
    material.size = THREE.MathUtils.lerp(0.014, 0.038, progress);
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
  const logoPosition: [number, number, number] = isCompact ? [0.95, -1.05, 0] : [2.55, 0.02, 0];
  const logoScale = isCompact ? 0.47 : 0.78;

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
