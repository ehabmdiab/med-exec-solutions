import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Build the AUH logo as 3D extruded shapes ── */

/** Outer teal wings – a tulip/U shape */
function createOuterWingsShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Left wing – starts bottom-left, curves up and inward
  s.moveTo(-1.8, -2.0);
  s.bezierCurveTo(-2.4, -1.0, -2.5, 0.8, -1.8, 2.0);
  s.bezierCurveTo(-1.4, 2.6, -0.6, 2.8, -0.2, 2.4);
  s.bezierCurveTo(0.1, 2.1, 0.0, 1.6, -0.1, 1.2);
  // Inner curve down
  s.bezierCurveTo(-0.3, 0.2, -0.5, -0.6, -0.6, -1.2);
  s.lineTo(-0.6, -2.0);
  s.lineTo(-1.8, -2.0);

  // Right wing (hole approach – we'll make it a separate shape)
  return s;
}

function createRightWingShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(1.8, -2.0);
  s.bezierCurveTo(2.4, -1.0, 2.5, 0.8, 1.8, 2.0);
  s.bezierCurveTo(1.4, 2.6, 0.6, 2.8, 0.2, 2.4);
  s.bezierCurveTo(-0.1, 2.1, 0.0, 1.6, 0.1, 1.2);
  s.bezierCurveTo(0.3, 0.2, 0.5, -0.6, 0.6, -1.2);
  s.lineTo(0.6, -2.0);
  s.lineTo(1.8, -2.0);
  return s;
}

/** Inner white U shape */
function createInnerUShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.9, -1.6);
  s.bezierCurveTo(-1.2, -0.4, -1.1, 0.6, -0.7, 1.2);
  s.bezierCurveTo(-0.4, 1.6, 0.0, 1.7, 0.0, 1.7);
  s.bezierCurveTo(0.0, 1.7, 0.4, 1.6, 0.7, 1.2);
  s.bezierCurveTo(1.1, 0.6, 1.2, -0.4, 0.9, -1.6);
  s.lineTo(0.45, -1.6);
  s.bezierCurveTo(0.6, -0.6, 0.55, 0.3, 0.35, 0.7);
  s.bezierCurveTo(0.2, 1.0, 0.0, 1.05, 0.0, 1.05);
  s.bezierCurveTo(0.0, 1.05, -0.2, 1.0, -0.35, 0.7);
  s.bezierCurveTo(-0.55, 0.3, -0.6, -0.6, -0.45, -1.6);
  s.lineTo(-0.9, -1.6);
  return s;
}

/** Orange center pill/rectangle */
function createCenterPillShape(): THREE.Shape {
  const w = 0.3, h = 1.3, r = 0.15;
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

/** Orange top arc */
function createTopArcShape(): THREE.Shape {
  const s = new THREE.Shape();
  const outerR = 0.55;
  const innerR = 0.35;
  // Outer arc
  s.absarc(0, 0, outerR, Math.PI * 0.15, Math.PI * 0.85, false);
  // Inner arc (reverse)
  s.absarc(0, 0, innerR, Math.PI * 0.85, Math.PI * 0.15, true);
  s.closePath();
  return s;
}

const extrudeSettings: THREE.ExtrudeGeometryOptions = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.04,
  bevelSegments: 4,
  curveSegments: 32,
};

function LogoGroup() {
  const groupRef = useRef<THREE.Group>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  // Geometries
  const [leftWing, rightWing, innerU, pill, arc] = useMemo(() => {
    const lw = new THREE.ExtrudeGeometry(createOuterWingsShape(), extrudeSettings);
    const rw = new THREE.ExtrudeGeometry(createRightWingShape(), extrudeSettings);
    const iu = new THREE.ExtrudeGeometry(createInnerUShape(), { ...extrudeSettings, depth: 0.55 });
    const p = new THREE.ExtrudeGeometry(createCenterPillShape(), { ...extrudeSettings, depth: 0.6 });
    const a = new THREE.ExtrudeGeometry(createTopArcShape(), { ...extrudeSettings, depth: 0.6 });
    // Center all
    [lw, rw, iu, p, a].forEach(g => g.center());
    return [lw, rw, iu, p, a];
  }, []);

  // Materials
  const tealMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#00A8A8"),
    metalness: 0.3,
    roughness: 0.25,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.5,
    emissive: new THREE.Color("#005555"),
    emissiveIntensity: 0.1,
  }), []);

  const whiteMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#FFFFFF"),
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 0.4,
    envMapIntensity: 1.0,
  }), []);

  const orangeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#E8742A"),
    metalness: 0.2,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.2,
    emissive: new THREE.Color("#8B3500"),
    emissiveIntensity: 0.15,
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
    // Smooth mouse follow
    mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.04;
    mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.04;

    const group = groupRef.current;
    // Gentle mouse-driven rotation
    group.rotation.y = mouseRef.current.x * 0.3 + Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    group.rotation.x = -mouseRef.current.y * 0.15 + Math.cos(clock.getElapsedTime() * 0.15) * 0.03;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[-0.1, 0.1]}>
      <group ref={groupRef} scale={1.0}>
        {/* Left teal wing */}
        <mesh geometry={leftWing} material={tealMat} position={[-0.05, 0, 0]} />
        {/* Right teal wing */}
        <mesh geometry={rightWing} material={tealMat} position={[0.05, 0, 0]} />
        {/* Inner white U */}
        <mesh geometry={innerU} material={whiteMat} position={[0, -0.15, 0.05]} />
        {/* Orange center pill */}
        <mesh geometry={pill} material={orangeMat} position={[0, 0.05, 0.1]} />
        {/* Orange top arc */}
        <mesh geometry={arc} material={orangeMat} position={[0, 1.65, 0.1]} />
      </group>
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.15} color="#4CC9F0" />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-2, 3, -3]} intensity={0.4} color="#00A8A8" />
      <pointLight position={[0, -2, 3]} intensity={0.6} color="#E8742A" distance={10} />
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#4CC9F0" distance={8} />
      {/* Rim light */}
      <spotLight position={[-4, 0, -3]} intensity={0.8} color="#00A8A8" angle={0.6} penumbra={0.8} />
    </>
  );
}

/** Animated particle field behind the logo */
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 400;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.08;
    meshRef.current.rotation.y = t;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4CC9F0"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Logo3DScene() {
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <SceneLighting />
        <Environment preset="city" environmentIntensity={0.4} />
        <ParticleField />
        <LogoGroup />
      </Canvas>
    </div>
  );
}
