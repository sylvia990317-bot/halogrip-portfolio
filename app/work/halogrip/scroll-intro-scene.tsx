"use client";

/**
 * R3F internals for the HALOGRIP scroll intro.
 *
 * This file owns nothing but Three.js. All scroll math lives in `scroll-intro.tsx`
 * and arrives here through a single plain mutable object (`SceneState`) that a lone
 * `useFrame` reads every frame — no React state drives the continuous animation.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { CalloutRefs, SceneState } from "./scroll-intro";

const MODEL_URL = "/models/halogrip.glb";
useGLTF.preload(MODEL_URL);

/** Target size (world units) of the model's largest dimension after normalisation. */
const TARGET_SIZE = 1.9;
/** Tilt pivot sits this fraction of the model height BELOW its bounding-box centre. */
const TILT_PIVOT_FRACTION = 0.22;
/** Where the second instance parks: behind and to the right, clear of the primary. */
const SECONDARY_POSITION: [number, number, number] = [1.45, -0.08, -1.05];

/**
 * Junk nodes shipped inside the GLB. Every one of these is a camera — the name list
 * is only a defensive backstop, the `isCamera` test below is what actually does the work
 * (Three.js sanitises glTF node names, e.g. "相机 1" -> "相机_1", so name matching alone
 * is unreliable).
 *
 * NOTE: `lux_root` and `11` are deliberately NOT junk. The entire product lives under
 * `lux_root -> Default -> 11`; removing either empties the scene. (`11` carries the
 * ~1152-unit translation that reads like an outlier — it is the model's root transform.)
 */
const JUNK_NAMES = new Set([
  "top", "front", "right", "perspective", "active",
  "相机_1", "相机_2", "相机_3", "相机_4",
]);

function isJunk(object: THREE.Object3D) {
  if ((object as THREE.Camera).isCamera) return true;
  const name = object.name.toLowerCase().replace(/[\s_]+/g, "_").replace(/_?#\d+$/, "");
  return JUNK_NAMES.has(name);
}

function stripJunk(root: THREE.Object3D) {
  const doomed: THREE.Object3D[] = [];
  root.traverse((object) => {
    if (object !== root && isJunk(object)) doomed.push(object);
  });
  for (const object of doomed) object.removeFromParent();
  return root;
}

/** Bounding-box centre of a named sub-tree, expressed in `root`'s local space. */
function partCentre(root: THREE.Object3D, name: string) {
  const node = root.getObjectByName(name);
  if (!node) return null;
  const box = new THREE.Box3().setFromObject(node);
  if (box.isEmpty()) return null;
  return root.worldToLocal(box.getCenter(new THREE.Vector3()));
}

type RigProps = {
  state: SceneState;
  calloutRefs: CalloutRefs;
  onReady: () => void;
};

function Rig({ state, calloutRefs, onReady }: RigProps) {
  const { scene } = useGLTF(MODEL_URL);
  const { camera, size } = useThree();

  const riseRef = useRef<THREE.Group>(null);
  const yawRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const fitRef = useRef<THREE.Group>(null);
  const secondaryRef = useRef<THREE.Group>(null);

  /** Primary instance: our own copy of the cached glTF scene, junk removed. */
  const primary = useMemo(() => stripJunk(scene.clone(true)), [scene]);

  /** Normalisation: centre the model on the origin and scale it to a predictable size. */
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(primary);
    const size3 = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale = TARGET_SIZE / Math.max(size3.x, size3.y, size3.z);
    return { scale, centre, pivotY: -size3.y * scale * TILT_PIVOT_FRACTION };
  }, [primary]);

  /**
   * Secondary instance — an independent clone whose materials are cloned too, so its
   * opacity can be tweened without touching the primary. `transparent` is set up front
   * to avoid a shader recompile mid-sequence. (The asset has no skins/bones, so a plain
   * Object3D clone is sufficient.)
   */
  const secondary = useMemo(() => {
    const clone = primary.clone(true);
    const materials: THREE.Material[] = [];
    clone.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const source = mesh.material;
      const cloned = Array.isArray(source) ? source.map((m) => m.clone()) : source.clone();
      for (const material of Array.isArray(cloned) ? cloned : [cloned]) {
        material.transparent = true;
        material.opacity = 0;
        materials.push(material);
      }
      mesh.material = cloned;
    });
    return { root: clone, materials };
  }, [primary]);

  useEffect(() => () => {
    for (const material of secondary.materials) material.dispose();
  }, [secondary]);

  /** Callout anchors, resolved once, in `primary`-local space. */
  const anchors = useMemo(() => {
    const button1 = partCentre(primary, "按钮1");
    const button2 = partCentre(primary, "按钮2");
    const buttons = button1 && button2
      ? button1.clone().add(button2).multiplyScalar(0.5)
      : button1 ?? button2;
    const result = [buttons, partCentre(primary, "P"), partCentre(primary, "SOS"), partCentre(primary, "TAG")];
    const names: string[] = [];
    primary.traverse((o) => { if (o.name) names.push(o.name); });
    (window as unknown as Record<string, unknown>).__hg = { names, result: result.map((v) => v && v.toArray()) };
    return result;
  }, [primary]);

  useEffect(() => { onReady(); }, [onReady]);

  // Scratch objects, allocated once — nothing is created inside the frame loop.
  const scratch = useMemo(
    () => ({ point: new THREE.Vector3(), normal: new THREE.Vector3(), toCamera: new THREE.Vector3() }),
    [],
  );

  useFrame(() => {
    const rise = riseRef.current;
    const yaw = yawRef.current;
    const tilt = tiltRef.current;
    const fitGroup = fitRef.current;
    const secondaryGroup = secondaryRef.current;
    if (!rise || !yaw || !tilt || !fitGroup || !secondaryGroup) return;

    rise.position.y = state.riseY;
    yaw.rotation.y = THREE.MathUtils.degToRad(state.yaw);
    tilt.rotation.x = THREE.MathUtils.degToRad(state.tilt);

    const secondaryOpacity = state.secondaryOpacity;
    secondaryGroup.visible = secondaryOpacity > 0.002;
    secondaryGroup.rotation.y = THREE.MathUtils.degToRad(state.secondaryYaw);
    secondaryGroup.scale.setScalar(state.secondaryScale);
    if (secondaryGroup.visible) {
      for (const material of secondary.materials) material.opacity = secondaryOpacity;
    }

    // --- 3D-tracked callouts -------------------------------------------------
    // The product's features all sit on its +Z face, so a single local normal drives
    // the facing fade for all four labels.
    const arms = [state.arm0, state.arm1, state.arm2, state.arm3];
    scratch.normal.set(0, 0, 1).transformDirection(fitGroup.matrixWorld);

    for (let i = 0; i < calloutRefs.length; i += 1) {
      const element = calloutRefs[i].current;
      const anchor = anchors[i];
      if (!element) continue;
      if (!anchor || arms[i] <= 0.002) {
        if (element.style.opacity !== "0") element.style.opacity = "0";
        continue;
      }

      scratch.point.copy(anchor).applyMatrix4(fitGroup.matrixWorld);
      scratch.toCamera.copy(camera.position).sub(scratch.point).normalize();
      const facing = THREE.MathUtils.smoothstep(scratch.normal.dot(scratch.toCamera), 0.12, 0.45);

      scratch.point.project(camera);
      if (scratch.point.z > 1) {
        element.style.opacity = "0";
        continue;
      }

      const x = (scratch.point.x * 0.5 + 0.5) * size.width;
      const y = (-scratch.point.y * 0.5 + 0.5) * size.height;
      const flip = element.dataset.side === "left" ? "-100%" : "0";
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${flip}, -50%)`;
      element.style.opacity = (arms[i] * facing).toFixed(3);
    }
  });

  const fitPosition: [number, number, number] = [
    -fit.centre.x * fit.scale,
    -fit.centre.y * fit.scale - fit.pivotY,
    -fit.centre.z * fit.scale,
  ];

  return (
    <>
      <group ref={riseRef}>
        <group ref={yawRef}>
          <group ref={tiltRef} position={[0, fit.pivotY, 0]}>
            <group ref={fitRef} position={fitPosition} scale={fit.scale}>
              <primitive object={primary} />
            </group>
          </group>
        </group>
      </group>

      <group ref={secondaryRef} position={SECONDARY_POSITION} visible={false}>
        <group position={[-fit.centre.x * fit.scale, -fit.centre.y * fit.scale, -fit.centre.z * fit.scale]} scale={fit.scale}>
          <primitive object={secondary.root} />
        </group>
      </group>
    </>
  );
}

export type ScrollIntroSceneProps = {
  state: SceneState;
  calloutRefs: CalloutRefs;
  onReady: () => void;
  active: boolean;
};

export default function ScrollIntroScene({ state, calloutRefs, onReady, active }: ScrollIntroSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault fov={32} near={0.1} far={100} position={[0, 0.06, 3.4]} />
      <ambientLight intensity={0.55} />
      {/* warm key */}
      <directionalLight position={[2.6, 3.2, 3.4]} intensity={2.4} color="#fff1e0" />
      {/* cool fill */}
      <directionalLight position={[-3.2, 1.1, 1.8]} intensity={1.15} color="#cfe0ff" />
      {/* low rim, keeps the dark shell readable against the warm paper background */}
      <directionalLight position={[0, -1.8, -2.6]} intensity={0.7} color="#ffffff" />
      <Suspense fallback={null}>
        <Rig state={state} calloutRefs={calloutRefs} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
