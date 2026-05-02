import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── fullscreen quad with metaball ray-march shader ── */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  // Smooth-min for metaball blending
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float sdSphere(vec3 p, vec3 center, float r) {
    return length(p - center) - r;
  }

  float map(vec3 p) {
    float t = uTime * 0.4;

    // 5 blobs orbiting and pulsing
    vec3 c1 = vec3(
      sin(t * 0.7) * 1.8,
      cos(t * 0.5) * 1.2,
      sin(t * 0.3) * 0.8
    );
    vec3 c2 = vec3(
      cos(t * 0.6) * 1.5 + uMouse.x * 1.5,
      sin(t * 0.8) * 1.0 + uMouse.y * 1.0,
      cos(t * 0.4) * 0.6
    );
    vec3 c3 = vec3(
      sin(t * 0.9 + 2.0) * 2.0,
      cos(t * 0.4 + 1.0) * 1.5,
      sin(t * 0.6 + 3.0) * 1.0
    );
    vec3 c4 = vec3(
      cos(t * 0.5 + 4.0) * 1.2,
      sin(t * 0.7 + 2.0) * 1.8,
      cos(t * 0.8) * 0.5
    );
    vec3 c5 = vec3(
      sin(t * 0.3 + 1.5) * 2.2,
      cos(t * 0.6 + 3.5) * 0.8,
      sin(t * 0.5 + 0.5) * 1.2
    );

    float r1 = 0.8 + 0.15 * sin(t * 1.2);
    float r2 = 0.7 + 0.1 * cos(t * 1.5);
    float r3 = 0.6 + 0.12 * sin(t * 0.9);
    float r4 = 0.65 + 0.1 * cos(t * 1.1);
    float r5 = 0.55 + 0.08 * sin(t * 1.4);

    float d = sdSphere(p, c1, r1);
    d = smin(d, sdSphere(p, c2, r2), 0.6);
    d = smin(d, sdSphere(p, c3, r3), 0.6);
    d = smin(d, sdSphere(p, c4, r4), 0.6);
    d = smin(d, sdSphere(p, c5, r5), 0.6);

    return d;
  }

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    // Camera
    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    // Ray march
    float totalDist = 0.0;
    float minDist = 100.0;
    bool hit = false;

    for (int i = 0; i < 64; i++) {
      vec3 p = ro + rd * totalDist;
      float d = map(p);
      minDist = min(minDist, d);
      if (d < 0.005) {
        hit = true;
        break;
      }
      if (totalDist > 20.0) break;
      totalDist += d;
    }

    // Colors: brand deep blue → teal gradient
    vec3 bgDark = vec3(0.039, 0.145, 0.251);   // #0A2540
    vec3 bgLight = vec3(0.055, 0.18, 0.30);

    // Background with subtle radial gradient
    float bgGrad = length(uv) * 0.4;
    vec3 bg = mix(bgLight, bgDark, bgGrad);

    // Glow around blobs even when not hit
    float glow = exp(-minDist * 2.5) * 0.35;
    vec3 glowColor = vec3(0.0, 0.66, 0.66);  // #00A8A8

    vec3 color = bg + glowColor * glow;

    if (hit) {
      vec3 p = ro + rd * totalDist;
      vec3 n = calcNormal(p);

      // Lighting
      vec3 lightDir = normalize(vec3(1.0, 1.5, 2.0));
      float diff = max(dot(n, lightDir), 0.0);

      vec3 viewDir = normalize(-rd);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(n, halfDir), 0.0), 32.0);

      // Fresnel for edge glow
      float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

      // Base color: teal with slight gradient based on normal
      vec3 teal = vec3(0.0, 0.66, 0.66);
      vec3 blue = vec3(0.15, 0.35, 0.65);
      vec3 baseColor = mix(teal, blue, n.y * 0.5 + 0.5);

      // Ambient
      vec3 ambient = baseColor * 0.15;

      // Combine
      color = ambient + baseColor * diff * 0.6 + vec3(0.7, 0.9, 1.0) * spec * 0.4;
      color += teal * fresnel * 0.5;

      // Depth fog
      float fog = 1.0 - exp(-totalDist * 0.08);
      color = mix(color, bg, fog);
    }

    // Vignette
    float vig = 1.0 - length(uv) * 0.5;
    color *= vig;

    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.9));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function MetaballMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    // Smooth mouse lerp
    mouseRef.current.x += (targetMouse.current.x - mouseRef.current.x) * 0.03;
    mouseRef.current.y += (targetMouse.current.y - mouseRef.current.y) * 0.03;
    uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function MetaballHero() {
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "#0A2540" }}
      >
        <MetaballMesh />
      </Canvas>
    </div>
  );
}
