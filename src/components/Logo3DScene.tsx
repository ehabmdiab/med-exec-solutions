import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useI18n } from "@/i18n/I18nProvider";

type SvgPathDefinition = {
  d: string;
  tx: number;
  ty: number;
};

const SVG_WIDTH = 248;
const SVG_HEIGHT = 288;
const SVG_CENTER_X = SVG_WIDTH / 2;
const SVG_CENTER_Y = SVG_HEIGHT / 2;
const SVG_SCALE = 1 / 42;

const TEAL_BASE_PATH: SvgPathDefinition = {
  d: "M0 0 C4.81432146 1.50697131 8.62286039 3.48119125 12.6875 6.4375 C13.29762939 6.8799707 13.90775879 7.32244141 14.53637695 7.77832031 C30.504403 19.64540534 41.98560147 34.97421188 50 53 C50.53496094 54.20140625 51.06992188 55.4028125 51.62109375 56.640625 C59.92421321 76.869188 58.17076064 101.37645542 58.30859375 122.84375 C58.31908595 124.45005563 58.31908595 124.45005563 58.32979012 126.08881187 C58.39176721 136.18462594 58.42907296 146.28050297 58.45629883 156.37646484 C58.47221302 161.95029076 58.50243322 167.52389816 58.54106331 173.09761047 C58.55263654 175.19938334 58.55864298 177.30119515 58.55874443 179.40299988 C58.5589376 182.33205067 58.57727362 185.26049692 58.59936523 188.18945312 C58.59478806 189.03837631 58.59021088 189.8872995 58.585495 190.76194763 C58.67448822 198.225906 60.2737365 205.46316314 64 212 C68.86993005 215.08428903 74.33171451 215.68924706 80 215 C85.10788516 213.69245665 88.24607878 211.35233981 90.9375 206.8125 C93.38869042 201.36631202 93.58611527 195.9567692 93.54858398 190.06567383 C93.59253487 184.8559888 94.72778962 182.02595536 98 178 C103.48404714 173.16881562 106.80770862 172.64510977 114.01953125 172.72265625 C119.38142736 173.22160071 121.88243358 175.91108913 125.58984375 179.5234375 C128.93371481 183.58770831 128.89308555 187.91284431 129.125 193 C129.66163581 203.20537777 129.66163581 203.20537777 135.5625 211.3125 C141.19082333 215.20903154 147.33710088 214.67247358 154 214 C159.43438689 210.48363202 161.01650371 204.95048886 163 199 C163.11061626 195.9570677 163.16458065 192.93587631 163.17358398 189.89233398 C163.1836145 188.4912867 163.1836145 188.4912867 163.19384766 187.06193542 C163.20791563 185.02727508 163.21980409 182.9925988 163.22979546 180.95791435 C163.24626777 177.71180038 163.26952162 174.46579931 163.29469299 171.21974182 C163.36520083 161.98696618 163.424794 152.75413795 163.47680664 143.52124023 C164.02073916 49.57720037 164.02073916 49.57720037 201.37890625 12.6484375 C215.0284749 0 215.0284749 0 223 0 C223.04681333 22.96651788 223.08203448 45.93302783 223.10362434 68.89958382 C223.11391733 79.5644198 223.12793969 90.22922607 223.15087891 100.89404297 C223.1708735 110.19432721 223.1837308 119.49458991 223.18817699 128.79489505 C223.19077412 133.71492549 223.19683693 138.63489433 223.21146011 143.55490494 C223.22514012 148.19563784 223.2292018 152.83628437 223.22621536 157.47703552 C223.2267609 159.17079515 223.23067579 160.86455797 223.23841095 162.55830002 C223.35520954 189.47738461 216.85482247 214.21286152 199 235 C198.45956055 235.62938477 197.91912109 236.25876953 197.36230469 236.90722656 C179.2540685 257.68341618 155.98147354 272.32902739 128 275 C123.3191858 275.18146237 118.64030147 275.1858235 113.95654297 275.18530273 C111.76900522 275.18748107 109.58197966 275.20566297 107.39453125 275.22460938 C78.00899465 275.34538669 52.47316723 264.56914987 31.6875 244 C22.65932091 234.78810797 16.18295763 225.22803171 10 214 C9.48179688 213.20464844 8.96359375 212.40929687 8.4296875 211.58984375 C6.53043566 208.14939575 5.50774996 204.64282005 4.4375 200.875 C4.22931641 200.17890625 4.02113281 199.4828125 3.80664062 198.765625 C0.35364344 186.85873814 -0.2819749 175.45410284 -0.22705078 163.13598633 C-0.22648572 161.35113532 -0.22680508 159.56628385 -0.22793579 157.78143311 C-0.22850661 152.966081 -0.21679646 148.15082975 -0.20278788 143.33550096 C-0.19023506 138.29200653 -0.18910644 133.24850947 -0.18673706 128.20500183 C-0.18053562 118.66782602 -0.16414297 109.13069638 -0.14403808 99.59354085 C-0.12163738 88.73013738 -0.11067518 77.86673164 -0.10064721 67.0033108 C-0.0797755 44.66884833 -0.04462563 22.33442676 0 0 Z ",
  tx: 15.0,
  ty: 9.0,
};

const TRUE_HOLLOW_CUTOUT_PATH: SvgPathDefinition = {
  d: "M0 0 C1.35350594 0.62469505 2.6808418 1.30570621 4 2 C5.58642776 2.77625292 5.58642776 2.77625292 7.20490456 3.56818771 C10.41244218 6.35883639 10.41244218 6.35883639 10.73828697 9.95924759 C10.76351255 11.60898053 10.75535933 13.2594177 10.7215271 14.90899658 C10.72665365 15.81896291 10.7317802 16.72892923 10.7370621 17.66647029 C10.74696358 20.72269867 10.71391633 23.77696086 10.68115234 26.83300781 C10.67946032 29.02076165 10.68040907 31.2085189 10.68380737 33.39627075 C10.68553221 39.34242237 10.65020225 45.28785101 10.60836363 51.23383427 C10.57091146 57.44513874 10.56733561 63.65645892 10.56021118 69.86785889 C10.54366819 80.29549466 10.50616536 90.72288238 10.45263672 101.15039062 C10.39756013 111.8906117 10.35515969 122.63076024 10.32958984 133.37109375 C10.32798186 134.03990743 10.32637388 134.70872111 10.32471716 135.39780188 C10.31084003 141.2155451 10.29792326 147.03329043 10.28510094 152.85103607 C10.22864558 177.90094073 10.1091233 202.95014125 10 228 C-50 228 -110 228 -160 228 C-150.34 225.03 -149.68 222.06 -149 219 C-147.85724609 219.30744141 -147.85724609 219.30744141 -146.69140625 219.62109375 C-145.14259766 220.02521484 -145.14259766 220.02521484 -143.5625 220.4375 C-142.55316406 220.70433594 -141.54382813 220.97117187 -140.50390625 221.24609375 C-131.65530378 223.14997366 -122.83138069 223.18630688 -113.82617188 223.18530273 C-111.63652062 223.1874885 -109.44737507 223.20569996 -107.2578125 223.22460938 C-99.3162394 223.25718124 -91.75935714 222.84750405 -84 221 C-83.28634277 220.83894775 -82.57268555 220.67789551 -81.83740234 220.51196289 C-53.65227087 213.79235131 -30.35408958 195.30351343 -15.18359375 170.81640625 C-4.79747896 153.1540918 -0.89614786 134.68626713 -0.79467773 114.32006836 C-0.78477814 113.08005066 -0.77487854 111.84003296 -0.76467896 110.56243896 C-0.73865075 107.18911789 -0.71672392 103.81581846 -0.69667697 100.44245982 C-0.67467843 96.90705477 -0.64735816 93.37169078 -0.62062073 89.83631897 C-0.57088002 83.15364823 -0.52587281 76.47095447 -0.48259836 69.78823906 C-0.43306592 62.17508884 -0.37820761 54.56197984 -0.32291877 46.94886959 C-0.20938493 31.29928457 -0.10248462 15.64966151 0 0 Z ",
  tx: 237.0,
  ty: 60.0,
};

const ORANGE_PILLAR_PATH: SvgPathDefinition = {
  d: "M0 0 C1.92283813 0.00616333 1.92283813 0.00616333 3.88452148 0.01245117 C4.90883522 0.0131385 4.90883522 0.0131385 5.95384216 0.01383972 C7.39714292 0.01686101 8.84044046 0.0247437 10.28369141 0.03710938 C12.50036077 0.05537662 14.71661281 0.057619 16.93334961 0.05737305 C27.79569055 0.09549524 27.79569055 0.09549524 28.94311523 1.24291992 C29.04354795 3.88492053 29.07928373 6.50080582 29.07250977 9.14331055 C29.07426208 9.97090378 29.0760144 10.79849701 29.07781982 11.65116882 C29.08223917 14.40052354 29.07930007 17.14981449 29.07592773 19.89916992 C29.07660075 21.80106621 29.07757075 23.70296241 29.0788269 25.6048584 C29.08030399 29.59636247 29.07814898 33.58784422 29.07348633 37.5793457 C29.06778904 42.70782499 29.07106798 47.83625195 29.07705879 52.96472931 C29.08066412 56.89366046 29.07952595 60.8225791 29.076931 64.75151062 C29.07626165 66.64304104 29.07709042 68.53457257 29.07941055 70.42610168 C29.08193662 73.06494169 29.07809715 75.70369573 29.07250977 78.3425293 C29.074534 79.13217575 29.07655823 79.9218222 29.0786438 80.73539734 C29.05737775 86.12865741 29.05737775 86.12865741 27.94311523 87.24291992 C23.54312579 87.46124981 19.13776712 87.42871138 14.73291016 87.42822266 C12.51827741 87.43040743 10.304144 87.44855523 8.08959961 87.4675293 C6.68790861 87.47046349 5.28621524 87.47244811 3.88452148 87.47338867 C2.60262939 87.47749756 1.3207373 87.48160645 0 87.48583984 C-3.05688477 87.24291992 -3.05688477 87.24291992 -5.05688477 85.24291992 C-5.25532091 82.60349506 -5.32963359 80.06899654 -5.31567383 77.4284668 C-5.31917847 76.62184097 -5.32268311 75.81521515 -5.32629395 74.98414612 C-5.3351179 72.30990061 -5.32925982 69.63591826 -5.32250977 66.96166992 C-5.32385623 65.10843861 -5.3257966 63.25520764 -5.32830811 61.40197754 C-5.33126027 57.51477704 -5.32695878 53.62766836 -5.31762695 49.74047852 C-5.30623236 44.74995364 -5.31279134 39.75964387 -5.32477188 34.76912689 C-5.331988 30.94136932 -5.3297037 27.11366302 -5.3245163 23.28590393 C-5.32317911 21.4454394 -5.32482991 19.60497026 -5.3294754 17.76451111 C-5.33453658 15.1953391 -5.32683629 12.62651876 -5.31567383 10.05737305 C-5.31972229 9.29159439 -5.32377075 8.52581573 -5.32794189 7.73683167 C-5.26883316 0.41869571 -5.26883316 0.41869571 0 0 Z ",
  tx: 114.056884765625,
  ty: 78.757080078125,
};

const ORANGE_ARC_PATH: SvgPathDefinition = {
  d: "M0 0 C6.01736204 4.62959404 10.54710186 8.97650689 12.1171875 16.62890625 C12.76978465 22.1162372 12.64195863 26.1171992 9.1171875 30.62890625 C8.1171875 31.62890625 8.1171875 31.62890625 5.4765625 31.8984375 C1.40254226 31.57156843 -1.05529301 30.27109167 -4.6328125 28.31640625 C-20.20622883 20.20397957 -36.0121107 19.34542513 -52.8828125 24.62890625 C-56.40038462 26.23192221 -59.69821767 28.16280676 -62.98046875 30.203125 C-66.26890956 31.81857708 -68.26560686 32.09695536 -71.8828125 31.62890625 C-74.94753982 28.48352821 -76.16191424 25.6911555 -76.4453125 21.37890625 C-76.02927033 13.64312208 -72.26359091 7.57506713 -66.7578125 2.31640625 C-48.95077704 -12.34995407 -19.05537159 -12.79982031 0 0 Z ",
  tx: 157.8828125,
  ty: 20.37109375,
};

function svgToScenePoint(x: number, y: number): THREE.Vector2 {
  return new THREE.Vector2((x - SVG_CENTER_X) * SVG_SCALE, -(y - SVG_CENTER_Y) * SVG_SCALE);
}

function parseSvgPathToThreePath({ d, tx, ty }: SvgPathDefinition, asShape: true): THREE.Shape;
function parseSvgPathToThreePath({ d, tx, ty }: SvgPathDefinition, asShape: false): THREE.Path;
function parseSvgPathToThreePath({ d, tx, ty }: SvgPathDefinition, asShape: boolean): THREE.Shape | THREE.Path {
  const target = asShape ? new THREE.Shape() : new THREE.Path();
  const tokens = d.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) ?? [];
  let index = 0;
  let command = "";

  const isCommand = (token: string) => /^[A-Za-z]$/.test(token);
  const readPoint = () => {
    const x = Number.parseFloat(tokens[index++]) + tx;
    const y = Number.parseFloat(tokens[index++]) + ty;
    return svgToScenePoint(x, y);
  };

  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++].toUpperCase();
    }

    if (command === "M") {
      const point = readPoint();
      target.moveTo(point.x, point.y);
      command = "L";
      continue;
    }

    if (command === "C") {
      const c1 = readPoint();
      const c2 = readPoint();
      const end = readPoint();
      target.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
      continue;
    }

    if (command === "L") {
      if (index >= tokens.length || isCommand(tokens[index])) continue;
      const point = readPoint();
      target.lineTo(point.x, point.y);
      continue;
    }

    if (command === "Z") {
      target.closePath();
      command = "";
      continue;
    }

    break;
  }

  return target;
}

function buildTealBaseShape() {
  const shape = parseSvgPathToThreePath(TEAL_BASE_PATH, true);
  shape.holes.push(parseSvgPathToThreePath(TRUE_HOLLOW_CUTOUT_PATH, false));
  return shape;
}

function buildPillarShape() {
  return parseSvgPathToThreePath(ORANGE_PILLAR_PATH, true);
}

function buildArcShape() {
  return parseSvgPathToThreePath(ORANGE_ARC_PATH, true);
}

type SweepMaterial = THREE.MeshStandardMaterial & {
  userData: {
    shader?: { uniforms: Record<string, { value: unknown }> };
  };
};

function createSweepMaterial(leftColor: THREE.Color, rightColor: THREE.Color, gradient: boolean): SweepMaterial {
  const material = new THREE.MeshStandardMaterial({
    color: gradient ? 0xffffff : leftColor,
    metalness: 0.34,
    roughness: 0.28,
    side: THREE.FrontSide,
  }) as SweepMaterial;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uSweepIntensity = { value: 0 };
    shader.uniforms.uLeftColor = { value: leftColor };
    shader.uniforms.uRightColor = { value: rightColor };
    shader.uniforms.uUseGradient = { value: gradient ? 1 : 0 };
    shader.uniforms.uBoundsMin = { value: -2.9 };
    shader.uniforms.uBoundsMax = { value: 2.9 };
    material.userData.shader = shader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
       varying vec3 vWorldPosition;
       varying vec3 vWorldNormal;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <worldpos_vertex>",
      `#include <worldpos_vertex>
       vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
       vWorldNormal = normalize(mat3(modelMatrix) * objectNormal);`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
       uniform float uTime;
       uniform float uSweepIntensity;
       uniform vec3 uLeftColor;
       uniform vec3 uRightColor;
       uniform float uUseGradient;
       uniform float uBoundsMin;
       uniform float uBoundsMax;
       varying vec3 vWorldPosition;
       varying vec3 vWorldNormal;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       if (uUseGradient > 0.5) {
         float gradientPosition = clamp((vWorldPosition.x - uBoundsMin) / (uBoundsMax - uBoundsMin), 0.0, 1.0);
         diffuseColor.rgb = mix(uLeftColor, uRightColor, gradientPosition);
       }`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `vec3 sweepAxis = normalize(vec3(0.92, 0.38, 0.0));
       float sweptCoordinate = dot(vWorldPosition.xy, sweepAxis.xy);
       float sweepCenter = mix(-4.6, 4.6, fract(uTime * 0.46));
       float distanceToBlade = abs(sweptCoordinate - sweepCenter);
       float bladeCore = 1.0 - smoothstep(0.0, 0.028, distanceToBlade);
       float bladeAura = 1.0 - smoothstep(0.025, 0.24, distanceToBlade);
       vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
       vec3 lightDirection = normalize(vec3(0.35, 0.82, 0.46));
       vec3 halfDirection = normalize(viewDirection + lightDirection);
       float fresnel = pow(1.0 - clamp(dot(normalize(vWorldNormal), viewDirection), 0.0, 1.0), 2.2);
       float specularResponse = pow(max(dot(normalize(vWorldNormal), halfDirection), 0.0), 84.0);
       float knifeFlash = (bladeCore * 1.85 + bladeAura * 0.36) * (0.42 + specularResponse * 1.35 + fresnel * 0.42);
       gl_FragColor.rgb += vec3(1.0, 0.93, 0.78) * knifeFlash * uSweepIntensity;
       gl_FragColor.rgb = min(gl_FragColor.rgb, vec3(1.45));
       #include <dithering_fragment>`
    );
  };

  return material;
}

function LogoGroup({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const sweepTime = useRef(0);
  const sweepStrength = useRef(0);
  const scale = useRef(1);

  const { baseGeometry, arcGeometry, pillarGeometry } = useMemo(() => {
    const extrusion: THREE.ExtrudeGeometryOptions = {
      depth: 0.04,
      bevelEnabled: false,
      curveSegments: 40,
    };

    const baseGeometry = new THREE.ExtrudeGeometry(buildTealBaseShape(), extrusion);
    const arcGeometry = new THREE.ExtrudeGeometry(buildArcShape(), { ...extrusion, depth: 0.14 });
    const pillarGeometry = new THREE.ExtrudeGeometry(buildPillarShape(), { ...extrusion, depth: 0.15 });

    // Center all geometries by the SAME offset (the base's center) so their
    // original SVG-relative positions are preserved. Centering each piece
    // independently caused the orange pillar/arc to drift, leaving stray
    // outline artifacts behind the teal shape.
    baseGeometry.computeBoundingBox();
    const bb = baseGeometry.boundingBox!;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;
    baseGeometry.translate(-cx, -cy, 0);
    arcGeometry.translate(-cx, -cy, 0);
    pillarGeometry.translate(-cx, -cy, 0);

    return { baseGeometry, arcGeometry, pillarGeometry };
  }, []);

  const materials = useMemo(() => {
    return {
      teal: createSweepMaterial(new THREE.Color("#63BDB4"), new THREE.Color("#2E8F91"), true),
      orange: createSweepMaterial(new THREE.Color("#F36F2C"), new THREE.Color("#F46E2A"), false),
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, hovered ? pointer.x * 0.34 : 0, delta * 4.5);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, hovered ? -pointer.y * 0.22 : 0, delta * 4.5);
    group.position.y = Math.sin(clock.elapsedTime * 0.78) * 0.055;

    scale.current = THREE.MathUtils.lerp(scale.current, hovered ? 1.05 : 1, delta * 5.2);
    group.scale.setScalar(scale.current);

    sweepStrength.current = THREE.MathUtils.lerp(sweepStrength.current, hovered ? 1 : 0, delta * 3.6);
    if (sweepStrength.current > 0.01) sweepTime.current += delta;

    for (const material of [materials.teal, materials.orange]) {
      const shader = material.userData.shader;
      if (!shader) continue;
      shader.uniforms.uTime.value = sweepTime.current;
      shader.uniforms.uSweepIntensity.value = sweepStrength.current;
    }
  });

  return (
    <group ref={groupRef} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh geometry={baseGeometry} material={materials.teal} castShadow receiveShadow />
      <mesh geometry={arcGeometry} material={materials.orange} castShadow receiveShadow position={[0, 0, 0.12]} />
      <mesh geometry={pillarGeometry} material={materials.orange} castShadow receiveShadow position={[0, 0, 0.14]} />
    </group>
  );
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight
        position={[2.8, 4.6, 5.2]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={0.1}
        shadow-camera-far={80}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-3.8, 2.4, 2.5]} intensity={0.55} color="#C8F5FF" />
      <directionalLight position={[0.2, 1.8, -4.4]} intensity={0.45} color="#FFE0C9" />
    </>
  );
}

function BackgroundParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const points = new Float32Array(120 * 3);
    for (let index = 0; index < points.length; index += 3) {
      points[index] = (Math.random() - 0.5) * 18;
      points[index + 1] = (Math.random() - 0.5) * 14;
      points[index + 2] = (Math.random() - 0.5) * 9 - 2;
    }
    return points;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#BEECEA" size={0.035} transparent opacity={0.11} sizeAttenuation />
    </points>
  );
}

function InteractiveScene({ mirror }: { mirror: boolean }) {
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const compact = viewport.width < 6.2;
  const sideX = mirror ? -2.25 : 2.25;
  const compactX = mirror ? -0.15 : 0.15;

  return (
    <>
      <StudioLighting />
      <group position={compact ? [compactX, -0.1, 0] : [sideX, 0.05, 0]} scale={compact ? 0.7 : 0.9}>
        <LogoGroup hovered={hovered} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
          <planeGeometry args={[80, 80]} />
          <shadowMaterial transparent opacity={0.28} />
        </mesh>
        <mesh onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} position={[0, 0.1, 0.75]}>
          <planeGeometry args={[7.2, 8.2]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

export function Logo3DScene() {
  const { dir } = useI18n();
  const mirror = dir === "rtl";
  return (
    <div className="absolute inset-0 z-[1] pointer-events-auto opacity-95">
      <Canvas
        camera={{ position: [0, 0.35, 10.5], fov: 38 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        dpr={[1, 2]}
        shadows
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <InteractiveScene mirror={mirror} />
        </Suspense>
      </Canvas>
    </div>
  );
}
