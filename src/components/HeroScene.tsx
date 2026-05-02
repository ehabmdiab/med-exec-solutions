import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const mesh = useRef<THREE.Points>(null!);
  const count = 600;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15;
    mesh.current.rotation.y = t;
    mesh.current.rotation.x = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#4CC9F0"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingRing({ radius = 3, tube = 0.015, speed = 0.3, axis = "y" }: { radius?: number; tube?: number; speed?: number; axis?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (axis === "y") ref.current.rotation.y = t;
    else ref.current.rotation.x = t;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshBasicMaterial color="#00A8A8" transparent opacity={0.25} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Particles />
        <FloatingRing radius={3.2} tube={0.012} speed={0.2} axis="y" />
        <FloatingRing radius={2.4} tube={0.01} speed={-0.15} axis="x" />
      </Canvas>
    </div>
  );
}
