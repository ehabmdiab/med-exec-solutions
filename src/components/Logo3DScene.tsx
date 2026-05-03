import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Accurate AUH logo shapes based on reference ── */

/** Outer teal shield / tulip – two wide wings forming a W/U */
function createLeftWingShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Start bottom-center-left
  s.moveTo(-0.15, -2.2);
  // Go down-left
  s.lineTo(-0.8, -2.2);
  // Curve out to left edge
  s.bezierCurveTo(-1.6, -2.2, -2.2, -1.4, -2.4, -0.4);
  // Continue up the left side
  s.bezierCurveTo(-2.6, 0.6, -2.3, 1.6, -1.8, 2.2);
  // Curve inward at top
  s.bezierCurveTo(-1.3, 2.8, -0.7, 2.6, -0.3, 2.0);
  // Come down the inner edge
  s.bezierCurveTo(0.0, 1.5, -0.05, 0.8, -0.1, 0.0);
  // Continue down inner
  s.bezierCurveTo(-0.12, -0.8, -0.14, -1.5, -0.15, -2.2);
  return s;
}

function createRightWingShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.15, -2.2);
  s.lineTo(0.8, -2.2);
  s.bezierCurveTo(1.6, -2.2, 2.2, -1.4, 2.4, -0.4);
  s.bezierCurveTo(2.6, 0.6, 2.3, 1.6, 1.8, 2.2);
  s.bezierCurveTo(1.3, 2.8, 0.7, 2.6, 0.3, 2.0);
  s.bezierCurveTo(0.0, 1.5, 0.05, 0.8, 0.1, 0.0);
  s.bezierCurveTo(0.12, -0.8, 0.14, -1.5, 0.15, -2.2);
  return s;
}

/** Inner cutout U shape (white) – the negative space */
function createInnerUShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Outer U boundary
  s.moveTo(-0.7, -1.8);
  s.bezierCurveTo(-1.0, -1.0, -1.1, 0.0, -0.9, 0.8);
  s.bezierCurveTo(-0.7, 1.4, -0.3, 1.7, 0.0, 1.8);
  s.bezierCurveTo(0.3, 1.7, 0.7, 1.4, 0.9, 0.8);
  s.bezierCurveTo(1.1, 0.0, 1.0, -1.0, 0.7, -1.8);
  // Inner U boundary (reverse to create the U thickness)
  s.lineTo(0.35, -1.8);
  s.bezierCurveTo(0.5, -1.0, 0.55, 0.0, 0.45, 0.5);
  s.bezierCurveTo(0.35, 0.9, 0.15, 1.1, 0.0, 1.15);
  s.bezierCurveTo(-0.15, 1.1, -0.35, 0.9, -0.45, 0.5);
  s.bezierCurveTo(-0.55, 0.0, -0.5, -1.0, -0.35, -1.8);
  s.lineTo(-0.7, -1.8);
  return s;
}

/** Orange center rectangle/pill */
function createCenterPill(): THREE.Shape {
  const w = 0.22, h = 0.9, r = 0.1;
  const s = new THREE.Shape();
  s.moveTo(-w + r, -h);
  s.lineTo(w - r, -h);
  s.quadraticCurveTo(w, -h, w, -h + r);
  s.lineTo(w, h - r);
  s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(-w + r, h);
  s.quadraticCurveTo(-w, h, -w, h - r);
  s.lineTo(-w, -h + r);
  s.quadraticCurveTo(-w, -h, -w + r, -h);
  return s;
}

/** Orange top arc/dome */
function createTopArc(): THREE.Shape {
  const s = new THREE.Shape();
  const outerR = 0.45;
  const innerR = 0.28;
  s.absarc(0, 0, outerR, Math.PI * 0.18, Math.PI * 0.82, false);
  s.absarc(0, 0, innerR, Math.PI * 0.82, Math.PI * 0.18, true);
  s.closePath();
  return s;
}

/** Small inner vertical lines on the U (the "i" detail) */
function createInnerLine(): THREE.Shape {
  const w = 0.06, h = 0.5;
  const s = new THREE.Shape();
  s.moveTo(-w, -h);
  s.lineTo(w, -h);
  s.lineTo(w, h);
  s.lineTo(-w, h);
  s.closePath();
  return s;
}

const extrudeOpts: THREE.ExtrudeGeometryOptions = {
  depth: 0.45,
  bevelEnabled: true,
  bevelThickness: 0.04,
  bevelSize: 0.03,
  bevelSegments: 3,
  curveSegments: 48,
};

/* ── Dissolve Particle System ── */
function DissolveParticles({ active, logoCenter }: { active: boolean; logoCenter: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 600;
  const progressRef = useRef(0);

  const [positions, velocities, opacities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const opa = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const teal = new THREE.Color("#00A8A8");
    const orange = new THREE.Color("#E8742A");
    for (let i = 0; i < count; i++) {
      // Start at logo surface
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.8;
      const h = (Math.random() - 0.5) * 4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = h;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      // Random outward velocity
      vel[i * 3] = (Math.random() - 0.5) * 3;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 3;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2 + 1;
      opa[i] = 0;
      const c = Math.random() > 0.3 ? teal : orange;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, vel, opa, col];
  }, []);

  const initPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const targetProgress = active ? 1 : 0;
    progressRef.current += (targetProgress - progressRef.current) * delta * 3;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const p = progressRef.current;
      posArr[i * 3] = initPositions[i * 3] + velocities[i * 3] * p * 1.5;
      posArr[i * 3 + 1] = initPositions[i * 3 + 1] + velocities[i * 3 + 1] * p * 1.5;
      posArr[i * 3 + 2] = initPositions[i * 3 + 2] + velocities[i * 3 + 2] * p * 1.5;
    }
    posAttr.needsUpdate = true;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = progressRef.current * 0.8;
  });

  return (
    <points ref={pointsRef} position={logoCenter}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
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

/* ── Logo Group ── */
function LogoGroup({ dissolveProgress }: { dissolveProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const [leftWing, rightWing, innerU, pill, arc, innerLine] = useMemo(() => {
    const lw = new THREE.ExtrudeGeometry(createLeftWingShape(), extrudeOpts);
    const rw = new THREE.ExtrudeGeometry(createRightWingShape(), extrudeOpts);
    const iu = new THREE.ExtrudeGeometry(createInnerUShape(), { ...extrudeOpts, depth: 0.5 });
    const p = new THREE.ExtrudeGeometry(createCenterPill(), { ...extrudeOpts, depth: 0.55 });
    const a = new THREE.ExtrudeGeometry(createTopArc(), { ...extrudeOpts, depth: 0.55 });
    const il = new THREE.ExtrudeGeometry(createInnerLine(), { ...extrudeOpts, depth: 0.55 });
    [lw, rw, iu, p, a, il].forEach(g => g.center());
    return [lw, rw, iu, p, a, il];
  }, []);

  const tealMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#2AADAD"),
    metalness: 0.15,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.2,
    transparent: true,
  }), []);

  const tealMat2 = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1E9E9E"),
    metalness: 0.15,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.2,
    transparent: true,
  }), []);

  const whiteMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#FFFFFF"),
    metalness: 0.05,
    roughness: 0.4,
    clearcoat: 0.3,
    envMapIntensity: 0.8,
    transparent: true,
  }), []);

  const orangeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#E8742A"),
    metalness: 0.15,
    roughness: 0.25,
    clearcoat: 0.5,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.0,
    emissive: new THREE.Color("#8B3500"),
    emissiveIntensity: 0.1,
    transparent: true,
  }), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      targetRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(({ clock }) => {
    mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.04;
    mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.04;

    const group = groupRef.current;
    group.rotation.y = mouseRef.current.x * 0.25 + Math.sin(clock.getElapsedTime() * 0.2) * 0.04;
    group.rotation.x = -mouseRef.current.y * 0.12 + Math.cos(clock.getElapsedTime() * 0.15) * 0.02;

    // Apply dissolve opacity
    const opacity = 1 - dissolveProgress.current * 0.85;
    const scale = 1 + dissolveProgress.current * 0.08;
    group.scale.setScalar(scale);
    [tealMat, tealMat2, whiteMat, orangeMat].forEach(m => {
      m.opacity = opacity;
    });
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.08, 0.08]}>
      <group ref={groupRef}>
        {/* Left teal wing */}
        <mesh geometry={leftWing} material={tealMat} />
        {/* Right teal wing */}
        <mesh geometry={rightWing} material={tealMat2} />
        {/* Inner white U */}
        <mesh geometry={innerU} material={whiteMat} position={[0, -0.1, 0.04]} />
        {/* Orange center pill */}
        <mesh geometry={pill} material={orangeMat} position={[0, -0.15, 0.08]} />
        {/* Orange top arc */}
        <mesh geometry={arc} material={orangeMat} position={[0, 1.55, 0.08]} />
        {/* Inner line details */}
        <mesh geometry={innerLine} material={whiteMat} position={[-0.18, -0.3, 0.06]} />
        <mesh geometry={innerLine} material={whiteMat} position={[0.18, -0.3, 0.06]} />
      </group>
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#E0F0F0" />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#00A8A8" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#E8742A" distance={10} />
      <pointLight position={[2, 3, 2]} intensity={0.3} color="#4CC9F0" distance={8} />
      <spotLight position={[-4, 1, -3]} intensity={0.6} color="#00A8A8" angle={0.6} penumbra={0.8} />
    </>
  );
}

/** Background particle field */
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.06;
    meshRef.current.rotation.y = t;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#4CC9F0"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Interactive wrapper that tracks hover for dissolve */
function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const dissolveRef = useRef(0);
  const logoPosition: [number, number, number] = [2.5, 0, 0];

  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    dissolveRef.current += (target - dissolveRef.current) * delta * 2.5;
  });

  return (
    <>
      <SceneLighting />
      <Environment preset="city" environmentIntensity={0.35} />
      <ParticleField />
      <DissolveParticles active={hovered} logoCenter={logoPosition} />
      <group position={logoPosition} scale={0.6}>
        {/* Invisible interaction sphere */}
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          visible={false}
        >
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <LogoGroup dissolveProgress={dissolveRef} />
      </group>
    </>
  );
}

export function Logo3DScene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-auto opacity-95 hidden sm:block">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <InteractiveScene />
      </Canvas>
    </div>
  );
}
