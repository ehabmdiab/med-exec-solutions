import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

const DEPTH = 0.18;
const ORANGE = "#F36C21";
const TEAL_LEFT = "#6FC1A6";
const TEAL_RIGHT = "#2F7F89";

/* ─── Build the outer U shape with the inner cavity as a TRUE HOLE ─── */

function buildOuterUShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Outer shell — a wide, rounded, shield-like U
  // Start top-left, clockwise
  shape.moveTo(-1.28, 1.4);

  // Left outer wall — gentle outward bulge then straight down
  shape.bezierCurveTo(-1.42, 1.15, -1.48, 0.5, -1.48, -0.15);

  // Bottom-left → bottom-center: wide smooth curve
  shape.bezierCurveTo(-1.48, -1.2, -0.88, -1.78, 0, -1.78);

  // Bottom-center → bottom-right
  shape.bezierCurveTo(0.88, -1.78, 1.48, -1.2, 1.48, -0.15);

  // Right outer wall going up
  shape.bezierCurveTo(1.48, 0.5, 1.42, 1.15, 1.28, 1.4);

  // Right wing tip — smooth inward curve
  shape.bezierCurveTo(1.18, 1.35, 1.08, 1.18, 1.02, 0.9);

  // Right inner wall going down
  shape.lineTo(1.02, -0.1);

  // Inner bottom-right curve
  shape.bezierCurveTo(1.02, -0.88, 0.58, -1.28, 0, -1.28);

  // Inner bottom-left curve
  shape.bezierCurveTo(-0.58, -1.28, -1.02, -0.88, -1.02, -0.1);

  // Left inner wall going up
  shape.lineTo(-1.02, 0.9);

  // Left wing tip
  shape.bezierCurveTo(-1.08, 1.18, -1.18, 1.35, -1.28, 1.4);

  shape.closePath();

  // ─── HOLE: the inner white negative space ───
  // Wide vertical cavity with two legs and a center bump (tooth) pushing up
  const hole = new THREE.Path();

  // Top-left of cavity
  hole.moveTo(-0.56, 1.0);

  // Left leg going down
  hole.lineTo(-0.56, -0.25);

  // Left leg bottom — rounded outward then inward
  hole.bezierCurveTo(-0.56, -0.62, -0.48, -0.82, -0.35, -0.88);

  // Curve toward center tooth — left side going up
  hole.bezierCurveTo(-0.24, -0.92, -0.16, -0.78, -0.12, -0.58);

  // Center tooth — smooth upward bump
  hole.bezierCurveTo(-0.08, -0.42, -0.04, -0.34, 0, -0.32);
  hole.bezierCurveTo(0.04, -0.34, 0.08, -0.42, 0.12, -0.58);

  // Right side of tooth going back down
  hole.bezierCurveTo(0.16, -0.78, 0.24, -0.92, 0.35, -0.88);

  // Right leg bottom
  hole.bezierCurveTo(0.48, -0.82, 0.56, -0.62, 0.56, -0.25);

  // Right leg going up
  hole.lineTo(0.56, 1.0);

  // Close top
  hole.lineTo(-0.56, 1.0);

  hole.closePath();
  shape.holes.push(hole);

  return shape;
}

function buildTopArc(): THREE.Shape {
  const shape = new THREE.Shape();
  const outerR = 0.42;
  const innerR = 0.26;
  shape.absarc(0, 0, outerR, Math.PI * 0.1, Math.PI * 0.9, false);
  shape.absarc(0, 0, innerR, Math.PI * 0.9, Math.PI * 0.1, true);
  shape.closePath();
  return shape;
}

function buildPillar(): THREE.Shape {
  const w = 0.3;
  const h = 0.76;
  const r = 0.09;
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
    bevelThickness: 0.018,
    bevelSize: 0.012,
    bevelSegments: 5,
    curveSegments: 72,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/* ─── Apply left-right gradient via vertex colors ─── */

function applyGradientColors(geometry: THREE.BufferGeometry) {
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const leftCol = new THREE.Color(TEAL_LEFT);
  const rightCol = new THREE.Color(TEAL_RIGHT);
  const tmpCol = new THREE.Color();

  // Find x bounds
  let minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = (x - minX) / (maxX - minX || 1);
    tmpCol.copy(leftCol).lerp(rightCol, t);
    colors[i * 3] = tmpCol.r;
    colors[i * 3 + 1] = tmpCol.g;
    colors[i * 3 + 2] = tmpCol.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/* ─── Logo mesh group ─── */

function LogoGroup({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const currentScale = useRef(1);
  const currentEmissive = useRef(0);

  const { baseGeo, arcGeo, pillarGeo } = useMemo(() => {
    const base = makeGeometry(buildOuterUShape());
    applyGradientColors(base);
    return {
      baseGeo: base,
      arcGeo: makeGeometry(buildTopArc(), 0.14),
      pillarGeo: makeGeometry(buildPillar(), 0.14),
    };
  }, []);

  const materials = useMemo(() => ({
    base: new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.2,
      roughness: 0.4,
      emissive: new THREE.Color(TEAL_LEFT).lerp(new THREE.Color(TEAL_RIGHT), 0.5),
      emissiveIntensity: 0,
    }),
    orange: new THREE.MeshStandardMaterial({
      color: ORANGE,
      metalness: 0.2,
      roughness: 0.4,
      emissive: new THREE.Color(ORANGE),
      emissiveIntensity: 0,
    }),
  }), []);

  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Tilt toward cursor on hover
    const targetRotY = hovered ? pointer.x * 0.28 : 0;
    const targetRotX = hovered ? -pointer.y * 0.18 : 0;
    const idle = clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY + Math.sin(idle * 0.5) * 0.025, delta * 4);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX + Math.cos(idle * 0.4) * 0.015, delta * 4);

    // Floating
    g.position.y = Math.sin(idle * 0.8) * 0.05;

    // Scale
    const targetScale = hovered ? 1.05 : 1;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 5);
    g.scale.setScalar(currentScale.current);

    // Emissive
    const targetEm = hovered ? 0.12 : 0;
    currentEmissive.current = THREE.MathUtils.lerp(currentEmissive.current, targetEm, delta * 5);
    materials.base.emissiveIntensity = currentEmissive.current;
    materials.orange.emissiveIntensity = currentEmissive.current * 1.4;
  });

  return (
    <group ref={groupRef}>
      {/* Teal U-shape with true hole cutout */}
      <mesh geometry={baseGeo} material={materials.base} castShadow />
      {/* Orange pillar centered inside cavity */}
      <mesh geometry={pillarGeo} material={materials.orange} position={[0, 0.18, 0.02]} castShadow />
      {/* Orange arc floating above */}
      <mesh geometry={arcGeo} material={materials.orange} position={[0, 0.88, 0.02]} scale={[0.85, 0.5, 1]} castShadow />
      {/* Shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ─── Lighting ─── */

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2, 4, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={8}
      />
      <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#B0E0E6" />
      <directionalLight position={[0, 1, -4]} intensity={0.45} color="#FFE4C4" />
    </>
  );
}

/* ─── Background particles ─── */

function BackgroundLines() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const count = 160;
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
      <pointsMaterial size={0.015} color="#999999" transparent opacity={0.12} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ─── Interactive scene ─── */

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const isCompact = viewport.width < 6.2;
  const logoPosition: [number, number, number] = isCompact ? [0, -0.2, 0] : [2.2, 0, 0];
  const logoScale = isCompact ? 0.6 : 0.85;

  return (
    <>
      <StudioLighting />
      <Environment preset="studio" environmentIntensity={0.3} />
      <BackgroundLines />
      <group position={logoPosition} scale={logoScale}>
        <LogoGroup hovered={hovered} />
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

/* ─── Exported component ─── */

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
