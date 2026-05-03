import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

const DEPTH = 0.18;
const ORANGE = "#F36C21";
const TEAL_LEFT = "#6FC1A6";
const TEAL_RIGHT = "#2F7F89";

/* ── Shape builders ─────────────────────────────────────── */

function buildUShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Outer U path - start top-left, go down, curve bottom, up right
  shape.moveTo(-1.4, 1.6);
  // Left outer edge going down
  shape.bezierCurveTo(-1.4, 1.6, -1.42, 0.6, -1.42, -0.2);
  shape.bezierCurveTo(-1.42, -1.1, -0.9, -1.7, 0, -1.7);
  shape.bezierCurveTo(0.9, -1.7, 1.42, -1.1, 1.42, -0.2);
  shape.bezierCurveTo(1.42, 0.6, 1.4, 1.6, 1.4, 1.6);
  // Top-right wing tip curves inward
  shape.bezierCurveTo(1.2, 1.5, 1.05, 1.3, 1.0, 1.0);
  shape.lineTo(1.0, -0.15);
  shape.bezierCurveTo(1.0, -0.85, 0.6, -1.2, 0, -1.2);
  shape.bezierCurveTo(-0.6, -1.2, -1.0, -0.85, -1.0, -0.15);
  shape.lineTo(-1.0, 1.0);
  shape.bezierCurveTo(-1.05, 1.3, -1.2, 1.5, -1.4, 1.6);
  shape.closePath();
  return shape;
}

function buildLeftHalf(): THREE.Shape {
  // Left half of U for teal-left color
  const shape = new THREE.Shape();
  shape.moveTo(-1.4, 1.6);
  shape.bezierCurveTo(-1.4, 1.6, -1.42, 0.6, -1.42, -0.2);
  shape.bezierCurveTo(-1.42, -1.1, -0.9, -1.7, 0, -1.7);
  shape.lineTo(0, -1.2);
  shape.bezierCurveTo(-0.6, -1.2, -1.0, -0.85, -1.0, -0.15);
  shape.lineTo(-1.0, 1.0);
  shape.bezierCurveTo(-1.05, 1.3, -1.2, 1.5, -1.4, 1.6);
  shape.closePath();
  return shape;
}

function buildRightHalf(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(1.4, 1.6);
  shape.bezierCurveTo(1.4, 1.6, 1.42, 0.6, 1.42, -0.2);
  shape.bezierCurveTo(1.42, -1.1, 0.9, -1.7, 0, -1.7);
  shape.lineTo(0, -1.2);
  shape.bezierCurveTo(0.6, -1.2, 1.0, -0.85, 1.0, -0.15);
  shape.lineTo(1.0, 1.0);
  shape.bezierCurveTo(1.05, 1.3, 1.2, 1.5, 1.4, 1.6);
  shape.closePath();
  return shape;
}

function buildTopArc(): THREE.Shape {
  // Floating arc above the pillar - like a rounded cap/horseshoe
  const shape = new THREE.Shape();
  const outerR = 0.48;
  const innerR = 0.3;
  // Arc from ~20° to ~160°
  shape.absarc(0, 0, outerR, Math.PI * 0.08, Math.PI * 0.92, false);
  shape.absarc(0, 0, innerR, Math.PI * 0.92, Math.PI * 0.08, true);
  shape.closePath();
  return shape;
}

function buildPillar(): THREE.Shape {
  // Vertical rounded rectangle
  const w = 0.32;
  const h = 0.82;
  const r = 0.1;
  const hw = w / 2;
  const hh = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  shape.closePath();
  return shape;
}

function makeGeometry(shape: THREE.Shape, depth = DEPTH) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 5,
    curveSegments: 64,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/* ── Logo mesh group ────────────────────────────────────── */

function LogoGroup({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const targetScale = useRef(1);
  const currentScale = useRef(1);
  const targetEmissive = useRef(0);
  const currentEmissive = useRef(0);

  const geometries = useMemo(() => ({
    left: makeGeometry(buildLeftHalf()),
    right: makeGeometry(buildRightHalf()),
    arc: makeGeometry(buildTopArc(), 0.16),
    pillar: makeGeometry(buildPillar(), 0.16),
  }), []);

  const materials = useMemo(() => ({
    left: new THREE.MeshStandardMaterial({
      color: TEAL_LEFT,
      metalness: 0.2,
      roughness: 0.4,
      emissive: TEAL_LEFT,
      emissiveIntensity: 0,
    }),
    right: new THREE.MeshStandardMaterial({
      color: TEAL_RIGHT,
      metalness: 0.2,
      roughness: 0.4,
      emissive: TEAL_RIGHT,
      emissiveIntensity: 0,
    }),
    orange: new THREE.MeshStandardMaterial({
      color: ORANGE,
      metalness: 0.2,
      roughness: 0.4,
      emissive: ORANGE,
      emissiveIntensity: 0,
    }),
  }), []);

  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Target rotation toward cursor
    const targetRotY = hovered ? pointer.x * 0.3 : 0;
    const targetRotX = hovered ? -pointer.y * 0.2 : 0;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY + Math.sin(clock.elapsedTime * 0.5) * 0.03, delta * 4);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX + Math.cos(clock.elapsedTime * 0.4) * 0.02, delta * 4);

    // Floating
    g.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.06;

    // Scale
    targetScale.current = hovered ? 1.05 : 1;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, delta * 5);
    g.scale.setScalar(currentScale.current);

    // Emissive
    targetEmissive.current = hovered ? 0.15 : 0;
    currentEmissive.current = THREE.MathUtils.lerp(currentEmissive.current, targetEmissive.current, delta * 5);
    materials.left.emissiveIntensity = currentEmissive.current;
    materials.right.emissiveIntensity = currentEmissive.current;
    materials.orange.emissiveIntensity = currentEmissive.current * 1.5;
  });

  return (
    <group ref={groupRef}>
      {/* Teal U-shape halves */}
      <mesh geometry={geometries.left} material={materials.left} />
      <mesh geometry={geometries.right} material={materials.right} />
      {/* Orange pillar centered */}
      <mesh geometry={geometries.pillar} material={materials.orange} position={[0, 0.05, 0.02]} />
      {/* Orange arc floating above */}
      <mesh geometry={geometries.arc} material={materials.orange} position={[0, 0.95, 0.02]} scale={[0.9, 0.55, 1]} />
      {/* Shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <shadowMaterial opacity={0.15} />
      </mesh>
    </group>
  );
}

/* ── Lighting ───────────────────────────────────────────── */

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Key light - top front */}
      <directionalLight
        position={[2, 4, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={8}
      />
      {/* Fill light - side */}
      <directionalLight position={[-3, 2, 2]} intensity={0.6} color="#B0E0E6" />
      {/* Rim light - back */}
      <directionalLight position={[0, 1, -4]} intensity={0.5} color="#FFE4C4" />
    </>
  );
}

/* ── Background particles (subtle abstract lines) ──────── */

function BackgroundLines() {
  const ref = useRef<THREE.Points>(null!);
  const count = 180;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 16;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = -3 - Math.random() * 5;
    }
    return p;
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#999999" transparent opacity={0.15} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Interactive scene ──────────────────────────────────── */

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const isCompact = viewport.width < 6.2;
  const logoPosition: [number, number, number] = isCompact ? [0, -0.3, 0] : [2.2, 0, 0];
  const logoScale = isCompact ? 0.6 : 0.85;

  return (
    <>
      <StudioLighting />
      <Environment preset="studio" environmentIntensity={0.3} />
      <BackgroundLines />
      <group position={logoPosition} scale={logoScale}>
        <LogoGroup hovered={hovered} />
        {/* Invisible hover plane */}
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          position={[0, 0, 0.3]}
        >
          <planeGeometry args={[3.2, 3.8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

/* ── Exported component ─────────────────────────────────── */

export function Logo3DScene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-auto opacity-95">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        shadows
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <InteractiveScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
