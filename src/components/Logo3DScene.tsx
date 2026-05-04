import { Suspense, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   1. GEOMETRY — exact SVG-derived shapes
   ═══════════════════════════════════════════ */

// Normalize SVG coords: SVG is 248×288, center ~(124,144), scale 1/28
// Y is flipped (SVG y-down → 3D y-up)
const S = 1 / 28;
const CX = 124;
const CY = 144;
function sv(x: number, y: number): [number, number] {
  return [(x - CX) * S, -(y - CY) * S];
}

function buildOuterShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Outer teal U-shape derived from SVG path #56B0AC translated at (15,9)
  // Key outline points extracted and smoothed
  const ox = 15, oy = 9;
  const pts: Array<{ cmd: string; args: number[] }> = [
    { cmd: "M", args: [ox + 0, oy + 0] },
    // Right side going down
    { cmd: "C", args: [ox + 0, oy + 0, ox + 223, oy + 0, ox + 223, oy + 0] },
    // Right edge down
    { cmd: "C", args: [ox + 223, oy + 69, ox + 223, oy + 138, ox + 223, oy + 163] },
    // Bottom-right curve
    { cmd: "C", args: [ox + 216, oy + 214, ox + 199, oy + 244, ox + 163, oy + 264] },
    // Bottom center
    { cmd: "C", args: [ox + 136, oy + 278, ox + 107, oy + 278, ox + 80, oy + 272] },
    // Bottom-left curve
    { cmd: "C", args: [ox + 42, oy + 255, ox + 16, oy + 224, ox + 5, oy + 190] },
    // Left edge up
    { cmd: "C", args: [ox - 2, oy + 163, ox + 0, oy + 100, ox + 0, oy + 0] },
  ];

  const [mx, my] = sv(pts[0].args[0], pts[0].args[1]);
  shape.moveTo(mx, my);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i].args;
    const [c1x, c1y] = sv(a[0], a[1]);
    const [c2x, c2y] = sv(a[2], a[3]);
    const [ex, ey] = sv(a[4], a[5]);
    shape.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
  }
  shape.closePath();

  // Inner hole — V-shaped cutout from the white area
  // Derived from SVG path #EFF1F0 translated at (238,60)
  const hole = new THREE.Path();
  const hx = 238, hy = 60;
  // The white path goes from (238,60) with negative x offsets, creating the inner cavity
  // Key boundary: roughly from x=87 to x=238, y=60 to y=288
  // Simplified to clean V/U inner cutout

  // Inner hole outline (clockwise for Three.js hole convention)
  const hPts: Array<{ cmd: string; args: number[] }> = [
    { cmd: "M", args: [hx + 0, hy + 0] }, // top-right of hole
    // Right inner edge going down
    { cmd: "C", args: [hx + 0, hy + 60, hx - 5, hy + 120, hx - 20, hy + 155] },
    // Bottom-right curve
    { cmd: "C", args: [hx - 40, hy + 195, hx - 70, hy + 215, hx - 100, hy + 224] },
    // Bottom-left
    { cmd: "C", args: [hx - 120, hy + 228, hx - 140, hy + 228, hx - 151, hy + 228] },
    // Left inner edge going up (from SVG path 5 endpoint)
    { cmd: "C", args: [hx - 151, hy + 228, hx - 151, hy + 150, hx - 151, hy + 0] },
    // Inner top: spans from left to right — but we need inner edges
  ];

  // More accurate inner hole based on the actual white region visible in the logo
  // The inner cutout is a narrower U opening at top
  const innerLeft = 40;   // SVG x
  const innerRight = 210; // SVG x
  const innerTop = 60;    // SVG y
  const innerBottomY = 250;

  const [hlx, hly] = sv(innerLeft, innerTop);
  hole.moveTo(hlx, hly);
  // Left inner wall down
  const [hl2x, hl2y] = sv(innerLeft + 5, innerBottomY - 50);
  hole.bezierCurveTo(hlx, hly - 1, hlx + 0.2, hl2y + 1, hl2x, hl2y);
  // Bottom-left curve
  const [hbx, hby] = sv(CX, innerBottomY);
  hole.bezierCurveTo(hl2x + 0.5, hl2y - 1.5, hbx - 1, hby, hbx, hby);
  // Bottom-right curve
  const [hr2x, hr2y] = sv(innerRight - 5, innerBottomY - 50);
  hole.bezierCurveTo(hbx + 1, hby, hr2x - 0.5, hr2y - 1.5, hr2x, hr2y);
  // Right inner wall up
  const [hrx, hry] = sv(innerRight, innerTop);
  hole.bezierCurveTo(hr2x - 0.2, hr2y + 1, hrx, hry - 1, hrx, hry);
  hole.closePath();

  shape.holes.push(hole);
  return shape;
}

function buildArcShape(): THREE.Shape {
  // Orange arc at top — SVG path #F36F2C translated at (157.8828125, 20.37109375)
  // It's a thick arc spanning roughly from x=86 to x=170, top of the logo
  const arc = new THREE.Shape();
  const cx = 124, cy = 28;
  const outerR = 2.6;
  const innerR = 1.7;

  // Outer arc (top semicircle)
  const startAngle = Math.PI * 0.08;
  const endAngle = Math.PI * 0.92;

  // Draw outer arc
  const [osx, osy] = sv(cx + Math.cos(startAngle) * outerR * 28, cy - Math.sin(startAngle) * outerR * 28);
  arc.moveTo(osx, osy);
  // Approximate arc with bezier
  const segments = 16;
  for (let i = 1; i <= segments; i++) {
    const a = startAngle + (endAngle - startAngle) * (i / segments);
    const [px, py] = sv(cx + Math.cos(a) * outerR * 28, cy - Math.sin(a) * outerR * 28);
    arc.lineTo(px, py);
  }
  // Inner arc back
  for (let i = segments; i >= 0; i--) {
    const a = startAngle + (endAngle - startAngle) * (i / segments);
    const [px, py] = sv(cx + Math.cos(a) * innerR * 28, cy - Math.sin(a) * innerR * 28);
    arc.lineTo(px, py);
  }
  arc.closePath();
  return arc;
}

function buildBarShape(): THREE.Shape {
  // Orange vertical bar — SVG path #F46E2A translated at (114.056884765625, 78.757080078125)
  // Approximately from x=109 to x=143, y=79 to y=167
  const bar = new THREE.Shape();
  const bx = 114, by = 79;
  const w = 29, h = 87;
  const r = 6;

  const [lx, ty] = sv(bx, by + r);
  bar.moveTo(lx, ty);
  // Top-left corner
  const [tlx, tly] = sv(bx, by);
  const [trx1, try1] = sv(bx + r, by);
  bar.quadraticCurveTo(tlx, tly, trx1, try1);
  // Top edge
  const [trx, tryy] = sv(bx + w - r, by);
  bar.lineTo(trx, tryy);
  // Top-right corner
  const [trx2, try2] = sv(bx + w, by);
  const [rrx, rry] = sv(bx + w, by + r);
  bar.quadraticCurveTo(trx2, try2, rrx, rry);
  // Right edge down
  const [brx, bry] = sv(bx + w, by + h - r);
  bar.lineTo(brx, bry);
  // Bottom-right corner
  const [brx2, bry2] = sv(bx + w, by + h);
  const [bbx, bby] = sv(bx + w - r, by + h);
  bar.quadraticCurveTo(brx2, bry2, bbx, bby);
  // Bottom edge
  const [blx, bly] = sv(bx + r, by + h);
  bar.lineTo(blx, bly);
  // Bottom-left corner
  const [blx2, bly2] = sv(bx, by + h);
  const [llx, lly] = sv(bx, by + h - r);
  bar.quadraticCurveTo(blx2, bly2, llx, lly);
  bar.closePath();
  return bar;
}

/* ═══════════════════════════════════════════
   2. CUSTOM SHADER MATERIAL — gradient + specular sweep
   ═══════════════════════════════════════════ */

function createSweepMaterial(
  colorLeft: THREE.Color,
  colorRight: THREE.Color,
  useGradient: boolean
) {
  const mat = new THREE.MeshStandardMaterial({
    color: useGradient ? 0xffffff : colorLeft,
    metalness: 0.25,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });

  mat.onBeforeCompile = (shader) => {
    // Add uniforms
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uSweepIntensity = { value: 0 };
    shader.uniforms.uColorLeft = { value: colorLeft };
    shader.uniforms.uColorRight = { value: colorRight };
    shader.uniforms.uUseGradient = { value: useGradient ? 1.0 : 0.0 };
    shader.uniforms.uBoundsMin = { value: -4.0 };
    shader.uniforms.uBoundsMax = { value: 4.0 };

    // Store reference for animation
    (mat as any).userData = { shader };

    // Vertex shader: pass world position
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       varying vec3 vWorldPos;
       varying vec3 vWorldNormal;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
       vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
       vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);`
    );

    // Fragment shader: gradient + specular sweep
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
       uniform float uTime;
       uniform float uSweepIntensity;
       uniform vec3 uColorLeft;
       uniform vec3 uColorRight;
       uniform float uUseGradient;
       uniform float uBoundsMin;
       uniform float uBoundsMax;
       varying vec3 vWorldPos;
       varying vec3 vWorldNormal;`
    );

    // Inject gradient into diffuse color
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
       if (uUseGradient > 0.5) {
         float gradT = clamp((vWorldPos.x - uBoundsMin) / (uBoundsMax - uBoundsMin), 0.0, 1.0);
         vec3 gradColor = mix(uColorLeft, uColorRight, gradT);
         diffuseColor.rgb = gradColor;
       }`
    );

    // Inject specular sweep after lighting
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `// Specular sweep (knife flash)
       {
         vec3 sweepDir = normalize(vec3(1.0, 0.3, 0.0));
         float sweepPos = dot(vWorldPos, sweepDir);
         float timeOffset = uTime * 3.5;
         float sweepCenter = mod(timeOffset, 14.0) - 7.0;
         
         float dist = sweepPos - sweepCenter;
         
         // Sharp core + soft glow falloff
         float core = smoothstep(-0.08, 0.0, dist) * (1.0 - smoothstep(0.0, 0.08, dist));
         float glow = smoothstep(-0.4, 0.0, dist) * (1.0 - smoothstep(0.0, 0.4, dist));
         float sweepVal = core * 1.5 + glow * 0.4;
         
         // Specular integration — respect surface normal
         vec3 viewDir = normalize(cameraPosition - vWorldPos);
         vec3 lightDir = normalize(vec3(2.0, 4.0, 5.0));
         vec3 halfDir = normalize(viewDir + lightDir);
         float specAngle = max(dot(normalize(vWorldNormal), halfDir), 0.0);
         float spec = pow(specAngle, 64.0);
         
         // Warm white sweep color
         vec3 sweepColor = vec3(1.0, 0.95, 0.9);
         
         float finalSweep = sweepVal * uSweepIntensity * (0.6 + spec * 1.4);
         gl_FragColor.rgb += sweepColor * finalSweep * 0.9;
         gl_FragColor.rgb = min(gl_FragColor.rgb, vec3(1.5)); // energy conservation
       }
       #include <dithering_fragment>`
    );
  };

  return mat;
}

/* ═══════════════════════════════════════════
   3. LOGO GROUP — hover interaction
   ═══════════════════════════════════════════ */

function LogoGroup({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const scaleRef = useRef(1);
  const sweepRef = useRef(0);
  const sweepTimeRef = useRef(0);

  const { mainGeo, arcGeo, barGeo } = useMemo(() => {
    const extOpts: THREE.ExtrudeGeometryOptions = {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 64,
    };
    return {
      mainGeo: new THREE.ExtrudeGeometry(buildOuterShape(), extOpts),
      arcGeo: new THREE.ExtrudeGeometry(buildArcShape(), { ...extOpts, depth: 0.14 }),
      barGeo: new THREE.ExtrudeGeometry(buildBarShape(), { ...extOpts, depth: 0.16 }),
    };
  }, []);

  const mats = useMemo(() => ({
    teal: createSweepMaterial(
      new THREE.Color(0x6FC1A6),
      new THREE.Color(0x2F7F89),
      true
    ),
    orange: createSweepMaterial(
      new THREE.Color(0xF36C21),
      new THREE.Color(0xF36C21),
      false
    ),
  }), []);

  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Hover rotation
    const targetRotY = hovered ? pointer.x * 0.4 : 0;
    const targetRotX = hovered ? pointer.y * 0.3 : 0;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY, delta * 4);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX, delta * 4);

    // Floating
    g.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;

    // Scale
    const ts = hovered ? 1.05 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, ts, delta * 5);
    g.scale.setScalar(scaleRef.current);

    // Sweep intensity (smooth transition)
    const targetSweep = hovered ? 1 : 0;
    sweepRef.current = THREE.MathUtils.lerp(sweepRef.current, targetSweep, delta * 3);

    // Sweep time only advances when active
    if (sweepRef.current > 0.01) {
      sweepTimeRef.current += delta;
    }

    // Update shader uniforms
    for (const mat of [mats.teal, mats.orange]) {
      const sd = (mat as any).userData?.shader;
      if (sd) {
        sd.uniforms.uTime.value = sweepTimeRef.current;
        sd.uniforms.uSweepIntensity.value = sweepRef.current;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={mainGeo} material={mats.teal} castShadow />
      <mesh geometry={arcGeo} material={mats.orange} castShadow />
      <mesh geometry={barGeo} material={mats.orange} castShadow />
    </group>
  );
}

/* ═══════════════════════════════════════════
   4. STUDIO LIGHTING
   ═══════════════════════════════════════════ */

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[2, 4, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#B0E0E6" />
      <directionalLight position={[0, 1, -4]} intensity={0.3} color="#FFE4D6" />
    </>
  );
}

/* ═══════════════════════════════════════════
   5. BACKGROUND PARTICLES
   ═══════════════════════════════════════════ */

function BackgroundParticles() {
  const ref = useRef<THREE.Points>(null!);
  const { positions } = useMemo(() => {
    const count = 150;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return { positions: arr };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#999999" size={0.04} transparent opacity={0.12} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════
   6. SCENE WRAPPER
   ═══════════════════════════════════════════ */

function InteractiveScene() {
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const isCompact = viewport.width < 6.2;
  const pos: [number, number, number] = isCompact ? [0, -0.2, 0] : [2.2, 0, 0];
  const sc = isCompact ? 0.5 : 0.7;

  return (
    <>
      <StudioLighting />
      <BackgroundParticles />
      <group position={pos} scale={sc}>
        <LogoGroup hovered={hovered} />
        {/* Invisible hover plane */}
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          position={[0, 0.5, 0.5]}
        >
          <planeGeometry args={[10, 14]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* Shadow catcher */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -5.5, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <shadowMaterial transparent opacity={0.15} />
        </mesh>
      </group>
    </>
  );
}

export function Logo3DScene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-auto opacity-95">
      <Canvas
        camera={{ position: [0, 0.5, 12], fov: 40 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
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
