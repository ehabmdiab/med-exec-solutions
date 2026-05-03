import { Suspense, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

type DissolveRef = MutableRefObject<number>;

type ParticleSource = {
  shape: THREE.Shape;
  color: THREE.Color;
  bbox: { minX: number; maxX: number; minY: number; maxY: number };
  weight: number;
};

const LOGO_WIDTH = 2.72;
const LOGO_HEIGHT = 2.9;
const PARTICLE_COUNT = 1900;
const DEPTH = 0.24;

const hslColor = (h: number, s: number, l: number) => new THREE.Color().setHSL(h / 360, s / 100, l / 100);

function buildLeftBodyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.3, 1.48);
  shape.bezierCurveTo(-0.98, 1.23, -0.86, 0.56, -0.86, -0.36);
  shape.bezierCurveTo(-0.86, -1.02, -0.48, -1.38, 0, -1.42);
  shape.bezierCurveTo(-0.03, -1.2, -0.03, -0.91, 0, -0.68);
  shape.bezierCurveTo(-0.14, -0.62, -0.25, -0.64, -0.36, -0.78);
  shape.bezierCurveTo(-0.48, -0.94, -0.36, -1.1, -0.58, -1.1);
  shape.bezierCurveTo(-0.76, -1.1, -0.78, -0.87, -0.78, -0.54);
  shape.lineTo(-0.78, 0.62);
  shape.bezierCurveTo(-0.78, 1.03, -0.88, 1.32, -1.16, 1.45);
  shape.bezierCurveTo(-1.22, 1.49, -1.28, 1.5, -1.3, 1.48);
  shape.closePath();
  return shape;
}

function buildRightBodyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(1.3, 1.48);
  shape.bezierCurveTo(0.98, 1.23, 0.86, 0.56, 0.86, -0.36);
  shape.bezierCurveTo(0.86, -1.02, 0.48, -1.38, 0, -1.42);
  shape.bezierCurveTo(0.03, -1.2, 0.03, -0.91, 0, -0.68);
  shape.bezierCurveTo(0.14, -0.62, 0.25, -0.64, 0.36, -0.78);
  shape.bezierCurveTo(0.48, -0.94, 0.36, -1.1, 0.58, -1.1);
  shape.bezierCurveTo(0.76, -1.1, 0.78, -0.87, 0.78, -0.54);
  shape.lineTo(0.78, 0.62);
  shape.bezierCurveTo(0.78, 1.03, 0.88, 1.32, 1.16, 1.45);
  shape.bezierCurveTo(1.22, 1.49, 1.28, 1.5, 1.3, 1.48);
  shape.closePath();
  return shape;
}

function buildTopazInnerEdgeShape(side: -1 | 1) {
  const s = side;
  const shape = new THREE.Shape();
  shape.moveTo(s * 0.82, 1.2);
  shape.bezierCurveTo(s * 0.68, 0.84, s * 0.65, 0.34, s * 0.65, -0.43);
  shape.bezierCurveTo(s * 0.65, -0.82, s * 0.61, -1.0, s * 0.51, -1.0);
  shape.bezierCurveTo(s * 0.42, -1.0, s * 0.4, -0.86, s * 0.35, -0.74);
  shape.lineTo(s * 0.26, -0.62);
  shape.bezierCurveTo(s * 0.4, -0.54, s * 0.46, -0.34, s * 0.46, -0.08);
  shape.lineTo(s * 0.46, 0.74);
  shape.bezierCurveTo(s * 0.46, 1.02, s * 0.54, 1.2, s * 0.69, 1.3);
  shape.bezierCurveTo(s * 0.78, 1.34, s * 0.86, 1.3, s * 0.82, 1.2);
  shape.closePath();
  return shape;
}

function buildWhiteInnerWallShape(side: -1 | 1) {
  const s = side;
  const shape = new THREE.Shape();
  shape.moveTo(s * 0.66, 1.08);
  shape.bezierCurveTo(s * 0.55, 0.62, s * 0.52, 0.08, s * 0.52, -0.53);
  shape.bezierCurveTo(s * 0.52, -0.8, s * 0.47, -0.91, s * 0.38, -0.91);
  shape.bezierCurveTo(s * 0.28, -0.91, s * 0.22, -0.78, s * 0.19, -0.59);
  shape.bezierCurveTo(s * 0.26, -0.52, s * 0.32, -0.39, s * 0.32, -0.11);
  shape.lineTo(s * 0.32, 0.84);
  shape.bezierCurveTo(s * 0.32, 1.13, s * 0.43, 1.31, s * 0.57, 1.36);
  shape.bezierCurveTo(s * 0.67, 1.36, s * 0.71, 1.24, s * 0.66, 1.08);
  shape.closePath();
  return shape;
}

function buildCentralTopazBridgeShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.36, -0.8);
  shape.bezierCurveTo(-0.23, -0.62, -0.11, -0.54, 0, -0.54);
  shape.bezierCurveTo(0.11, -0.54, 0.23, -0.62, 0.36, -0.8);
  shape.bezierCurveTo(0.26, -0.68, 0.15, -0.62, 0, -0.62);
  shape.bezierCurveTo(-0.15, -0.62, -0.26, -0.68, -0.36, -0.8);
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
  shape.absarc(0, 0, 0.52, Math.PI * 0.05, Math.PI * 0.95, false);
  shape.absarc(0, 0, 0.33, Math.PI * 0.95, Math.PI * 0.05, true);
  shape.closePath();
  return shape;
}

function makeExtrudedGeometry(shape: THREE.Shape, depth = DEPTH) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.026,
    bevelSize: 0.018,
    bevelSegments: 6,
    curveSegments: 72,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createLogoMaterial(color: THREE.Color, clippingPlane: THREE.Plane, options: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.22,
    metalness: 0.13,
    clearcoat: 0.72,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.28,
    transparent: true,
    clippingPlanes: [clippingPlane],
    clipShadows: true,
    ...options,
  });
}

function VLogoMark({ dissolveProgress }: { dissolveProgress: DissolveRef }) {
  const groupRef = useRef<THREE.Group>(null!);
  const bladePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-0.92, -0.24, 0.28).normalize(), 4), []);
  const { pointer } = useThree();

  const [leftGeometry, rightGeometry, leftTopazEdge, rightTopazEdge, leftWhiteWall, rightWhiteWall, bridgeGeometry, pillGeometry, arcGeometry] =
    useMemo(
      () => [
        makeExtrudedGeometry(buildLeftBodyShape()),
        makeExtrudedGeometry(buildRightBodyShape()),
        makeExtrudedGeometry(buildTopazInnerEdgeShape(-1), 0.12),
        makeExtrudedGeometry(buildTopazInnerEdgeShape(1), 0.12),
        makeExtrudedGeometry(buildWhiteInnerWallShape(-1), 0.1),
        makeExtrudedGeometry(buildWhiteInnerWallShape(1), 0.1),
        makeExtrudedGeometry(buildCentralTopazBridgeShape(), 0.11),
        makeExtrudedGeometry(buildRoundedRectShape(0.34, 0.78, 0.055), 0.18),
        makeExtrudedGeometry(buildTopArcShape(), 0.18),
      ],
      [],
    );

  const materials = useMemo(() => {
    const left = createLogoMaterial(hslColor(169, 48, 64), bladePlane, { emissive: hslColor(169, 46, 18), emissiveIntensity: 0.05 });
    const right = createLogoMaterial(hslColor(186, 49, 39), bladePlane, { emissive: hslColor(186, 48, 15), emissiveIntensity: 0.05 });
    const topaz = createLogoMaterial(hslColor(174, 52, 57), bladePlane, { envMapIntensity: 1.5, clearcoat: 0.86 });
    const white = createLogoMaterial(hslColor(178, 28, 96), bladePlane, {
      roughness: 0.16,
      metalness: 0.01,
      emissive: hslColor(178, 28, 92),
      emissiveIntensity: 0.18,
      envMapIntensity: 1.7,
    });
    const orange = createLogoMaterial(hslColor(21, 91, 56), bladePlane, {
      roughness: 0.2,
      metalness: 0.12,
      emissive: hslColor(22, 88, 28),
      emissiveIntensity: 0.1,
    });
    [left, right, topaz, white, orange].forEach((material) => {
      material.toneMapped = false;
    });
    return { left, right, topaz, white, orange };
  }, [bladePlane]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.25 + Math.sin(clock.elapsedTime * 0.22) * 0.03, delta * 3);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.13 + Math.cos(clock.elapsedTime * 0.18) * 0.018, delta * 3);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointer.x * 0.02, delta * 2.6);

    const progress = dissolveProgress.current;
    bladePlane.constant = THREE.MathUtils.lerp(4, -2.35, progress);
    group.scale.setScalar(1 + progress * 0.035);

    const opacity = THREE.MathUtils.lerp(1, 0.22, progress);
    Object.values(materials).forEach((material) => {
      material.opacity = opacity;
    });
  });

  return (
    <Float speed={1.05} rotationIntensity={0.07} floatIntensity={0.22} floatingRange={[-0.06, 0.06]}>
      <group ref={groupRef}>
        <mesh geometry={leftGeometry} material={materials.left} position={[0, 0, 0.06]} />
        <mesh geometry={rightGeometry} material={materials.right} position={[0, 0, 0.06]} />
        <mesh geometry={leftTopazEdge} material={materials.topaz} position={[0, 0, 0.24]} />
        <mesh geometry={rightTopazEdge} material={materials.topaz} position={[0, 0, 0.24]} />
        <mesh geometry={leftWhiteWall} material={materials.white} position={[0, 0, 0.34]} />
        <mesh geometry={rightWhiteWall} material={materials.white} position={[0, 0, 0.34]} />
        <mesh geometry={bridgeGeometry} material={materials.topaz} position={[0, 0, 0.32]} />
        <mesh geometry={pillGeometry} material={materials.orange} position={[0, 0.24, 0.34]} />
        <mesh geometry={arcGeometry} material={materials.orange} position={[0, 1.03, 0.34]} scale={[0.84, 0.52, 1]} />
      </group>
    </Float>
  );
}

function ExactLogoPlanes({ dissolveProgress }: { dissolveProgress: DissolveRef }) {
  return <VLogoMark dissolveProgress={dissolveProgress} />;
}

function pointInPolygon(x: number, y: number, points: THREE.Vector2[]) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 0.0001) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function shapeBounds(points: THREE.Vector2[]) {
  return points.reduce(
    (bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      maxX: Math.max(bounds.maxX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxY: Math.max(bounds.maxY, point.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
}

function makeParticleSource(shape: THREE.Shape, color: string, weight: number): ParticleSource {
  const points = shape.getPoints(96);
  return { shape, color: new THREE.Color(color), bbox: shapeBounds(points), weight };
}

function pickSource(sources: ParticleSource[], totalWeight: number) {
  let target = Math.random() * totalWeight;
  for (const source of sources) {
    target -= source.weight;
    if (target <= 0) return source;
  }
  return sources[0];
}

function sampleShapePoint(source: ParticleSource) {
  const points = source.shape.getPoints(96);
  for (let attempt = 0; attempt < 80; attempt++) {
    const x = THREE.MathUtils.lerp(source.bbox.minX, source.bbox.maxX, Math.random());
    const y = THREE.MathUtils.lerp(source.bbox.minY, source.bbox.maxY, Math.random());
    if (pointInPolygon(x, y, points)) return { x, y };
  }
  return {
    x: THREE.MathUtils.lerp(source.bbox.minX, source.bbox.maxX, Math.random()),
    y: THREE.MathUtils.lerp(source.bbox.minY, source.bbox.maxY, Math.random()),
  };
}

function DissolveParticles({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const progressRef = useRef(0);

  const { basePositions, velocities, colors, sliceOffsets } = useMemo(() => {
    const sources = [
      makeParticleSource(buildLeftBodyShape(), "#74d1c1", 34),
      makeParticleSource(buildRightBodyShape(), "#2f98a2", 34),
      makeParticleSource(buildTopazInnerEdgeShape(-1), "#5fd0c6", 8),
      makeParticleSource(buildTopazInnerEdgeShape(1), "#5fd0c6", 8),
      makeParticleSource(buildWhiteInnerWallShape(-1), "#f1fbfb", 6),
      makeParticleSource(buildWhiteInnerWallShape(1), "#f1fbfb", 6),
      makeParticleSource(buildRoundedRectShape(0.34, 0.78, 0.055), "#f97322", 7),
      makeParticleSource(buildTopArcShape(), "#f97322", 7),
    ];
    const totalWeight = sources.reduce((sum, source) => sum + source.weight, 0);
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const velocity = new Float32Array(PARTICLE_COUNT * 3);
    const color = new Float32Array(PARTICLE_COUNT * 3);
    const offsets = new Float32Array(PARTICLE_COUNT);
    const bladeDirection = new THREE.Vector3(1, 0.18, 0.7).normalize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const source = pickSource(sources, totalWeight);
      const point = sampleShapePoint(source);
      const isArc = source.color.r > 0.85 && point.y < 0.45;
      const x = point.x;
      const y = isArc ? point.y + 1.03 : point.y;
      const pz = (Math.random() - 0.5) * 0.16;
      const thrust = 0.9 + Math.random() * 1.6;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = pz;
      velocity[i * 3] = bladeDirection.x * thrust + (Math.random() - 0.5) * 0.18;
      velocity[i * 3 + 1] = bladeDirection.y * thrust + Math.random() * 0.42;
      velocity[i * 3 + 2] = bladeDirection.z * thrust + (Math.random() - 0.5) * 0.35;
      color[i * 3] = source.color.r;
      color[i * 3 + 1] = source.color.g;
      color[i * 3 + 2] = source.color.b;
      offsets[i] = x * 0.88 + y * 0.24 + (Math.random() - 0.5) * 0.08;
    }

    return { basePositions: base, velocities: velocity, colors: color, sliceOffsets: offsets };
  }, []);

  const animatedPositions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;

    progressRef.current = THREE.MathUtils.damp(progressRef.current, active ? 1 : 0, 4.8, delta);
    const progress = progressRef.current;
    const time = clock.elapsedTime;
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = basePositions[i * 3];
      const py = basePositions[i * 3 + 1];
      const blade = -1.72 + progress * 3.65;
      const localProgress = THREE.MathUtils.smoothstep(blade - sliceOffsets[i], 0, 0.42);
      const shred = Math.sin(time * 12 + i * 0.41) * 0.025 * localProgress;
      positions[i * 3] = px + velocities[i * 3] * localProgress * 1.65 + shred;
      positions[i * 3 + 1] = py + velocities[i * 3 + 1] * localProgress * 1.22 - localProgress * localProgress * 0.38;
      positions[i * 3 + 2] = basePositions[i * 3 + 2] + velocities[i * 3 + 2] * localProgress * 1.35;
    }

    positionAttribute.needsUpdate = true;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = Math.min(0.98, progress * 1.45);
    material.size = THREE.MathUtils.lerp(0.012, 0.03, progress);
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[animatedPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} vertexColors transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.52} color="hsl(178 60% 96%)" />
      <directionalLight position={[3, 4, 5]} intensity={1.25} color="hsl(0 0% 100%)" />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.62} color="hsl(174 60% 70%)" />
      <pointLight position={[0, -2, 3]} intensity={0.58} color="hsl(21 100% 60%)" distance={9} />
      <spotLight position={[-4, 1, -3]} intensity={0.55} color="hsl(185 65% 58%)" angle={0.55} penumbra={0.82} />
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
      <pointsMaterial size={0.022} color="hsl(185 64% 66%)" transparent opacity={0.28} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const dissolveRef = useRef(0);
  const { viewport } = useThree();
  const isCompact = viewport.width < 6.2;
  const logoPosition: [number, number, number] = isCompact ? [1.1, -0.28, 0] : [2.5, 0.04, 0];
  const logoScale = isCompact ? 0.44 : 0.8;

  useFrame((_, delta) => {
    dissolveRef.current = THREE.MathUtils.damp(dissolveRef.current, hovered ? 1 : 0, 4.8, delta);
  });

  return (
    <>
      <SceneLighting />
      <Environment preset="city" environmentIntensity={0.42} />
      <ParticleField />
      <group position={logoPosition} scale={logoScale}>
        <DissolveParticles active={hovered} />
        <ExactLogoPlanes dissolveProgress={dissolveRef} />
        <mesh onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} position={[0, 0, 0.42]}>
          <planeGeometry args={[LOGO_WIDTH * 1.22, LOGO_HEIGHT * 1.18]} />
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
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance", localClippingEnabled: true }}
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
