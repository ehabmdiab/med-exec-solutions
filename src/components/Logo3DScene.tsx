import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Build exact geometry from user spec ─── */

function buildMainShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-2, -4);
  shape.quadraticCurveTo(-3, -2, -3, 1);
  shape.quadraticCurveTo(-3, 4, -1.5, 5);
  shape.quadraticCurveTo(-0.5, 5.5, 0, 4.2);
  shape.quadraticCurveTo(0.5, 5.5, 1.5, 5);
  shape.quadraticCurveTo(3, 4, 3, 1);
  shape.quadraticCurveTo(3, -2, 2, -4);
  shape.quadraticCurveTo(0, -5.5, -2, -4);

  const hole = new THREE.Path();
  hole.moveTo(-1.2, -3);
  hole.quadraticCurveTo(-2, -1.5, -2, 1);
  hole.quadraticCurveTo(-2, 3.5, -1, 4);
  hole.quadraticCurveTo(-0.3, 4.5, 0, 3.5);
  hole.quadraticCurveTo(0.3, 4.5, 1, 4);
  hole.quadraticCurveTo(2, 3.5, 2, 1);
  hole.quadraticCurveTo(2, -1.5, 1.2, -3);
  hole.quadraticCurveTo(0, -2, -1.2, -3);
  shape.holes.push(hole);

  return shape;
}

function buildArcShape(): THREE.Shape {
  const arcShape = new THREE.Shape();
  arcShape.absarc(0, 5.8, 1.2, Math.PI * 0.1, Math.PI * 0.9, false);
  const arcHole = new THREE.Path();
  arcHole.absarc(0, 5.8, 0.8, Math.PI * 0.1, Math.PI * 0.9, false);
  arcShape.holes.push(arcHole);
  return arcShape;
}

function buildBarShape(): THREE.Shape {
  const w = 0.8, h = 2.2, r = 0.3;
  const barShape = new THREE.Shape();
  barShape.moveTo(-w / 2 + r, -h / 2);
  barShape.lineTo(w / 2 - r, -h / 2);
  barShape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  barShape.lineTo(w / 2, h / 2 - r);
  barShape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  barShape.lineTo(-w / 2 + r, h / 2);
  barShape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  barShape.lineTo(-w / 2, -h / 2 + r);
  barShape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return barShape;
}

/* ─── Logo group with hover interaction ─── */

function LogoGroup({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const scaleRef = useRef(1);

  const { mainGeo, arcGeo, barGeo } = useMemo(() => ({
    mainGeo: new THREE.ShapeGeometry(buildMainShape(), 64),
    arcGeo: new THREE.ShapeGeometry(buildArcShape(), 64),
    barGeo: new THREE.ShapeGeometry(buildBarShape(), 32),
  }), []);

  const mats = useMemo(() => ({
    teal: new THREE.MeshStandardMaterial({ color: 0x5fb3a7, side: THREE.DoubleSide, roughness: 0.4 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff6a1a, side: THREE.DoubleSide, roughness: 0.35 }),
  }), []);

  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const targetRotY = hovered ? pointer.x * 0.5 : 0;
    const targetRotX = hovered ? pointer.y * 0.5 : 0;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY, delta * 4);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX, delta * 4);

    // Floating
    g.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;

    // Scale
    const ts = hovered ? 1.05 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, ts, delta * 5);
    g.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={mainGeo} material={mats.teal} />
      <mesh geometry={arcGeo} material={mats.orange} />
      <mesh geometry={barGeo} material={mats.orange} position={[0, 1.5, 0.05]} />
    </group>
  );
}

/* ─── Scene ─── */

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const isCompact = viewport.width < 6.2;
  const pos: [number, number, number] = isCompact ? [0, -0.2, 0] : [2.2, 0, 0];
  const sc = isCompact ? 0.45 : 0.65;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, 2, 2]} intensity={0.4} color="#B0E0E6" />
      <group position={pos} scale={sc}>
        <LogoGroup hovered={hovered} />
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          position={[0, 1, 0.5]}
        >
          <planeGeometry args={[8, 13]} />
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
        camera={{ position: [0, 0, 14], fov: 40 }}
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
