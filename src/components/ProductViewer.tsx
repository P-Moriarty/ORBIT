"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Product } from "@/data/productsList";
import { useSceneMotion } from "@/hooks/useSceneMotion";

type Props = {
  color: string;
  deviceType: Product["deviceType"];
  configuration: Record<string, string>;
  compact?: boolean;
};

function PortableSpeaker({
  color,
  configuration,
}: Pick<Props, "color" | "configuration">) {
  const precisionGrille = configuration.grille === "precision";

  return (
    <group position={[0, 0.65, 0]}>
      <RoundedBox args={[1.8, 0.95, 0.7]} radius={0.16} smoothness={5}>
        <meshStandardMaterial color={color} metalness={0.52} roughness={0.26} />
      </RoundedBox>

      <mesh position={[0, 0, 0.36]}>
        <boxGeometry args={[1.48, 0.67, 0.035]} />
        <meshStandardMaterial
          color={precisionGrille ? "#303847" : "#171b26"}
          metalness={precisionGrille ? 0.72 : 0.3}
          roughness={precisionGrille ? 0.32 : 0.7}
        />
      </mesh>

      {[-0.42, 0.42].map((x) => (
        <group key={x} position={[x, 0, 0.39]}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.24, 0.045, 48]} />
            <meshStandardMaterial color="#303747" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <torusGeometry args={[0.18, 0.018, 10, 48]} />
            <meshStandardMaterial color="#aebfff" metalness={0.75} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <circleGeometry args={[0.145, 40]} />
            <meshStandardMaterial color="#111520" roughness={0.8} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0, -0.37]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.31, 0.035, 12, 48, Math.PI]} />
        <meshStandardMaterial color="#8998ba" metalness={0.8} roughness={0.25} />
      </mesh>
      {[-0.55, -0.28, 0, 0.28, 0.55].map((x) => (
        <mesh key={x} position={[x, -0.22, 0.08]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#c6d2ef" metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function StudioMonitor({
  color,
  configuration,
}: Pick<Props, "color" | "configuration">) {
  const landscape = configuration.orientation === "landscape";

  return (
    <group
      position={landscape ? [0, 0.95, 0] : [0, 0.75, 0]}
      rotation={[0, 0, landscape ? Math.PI / 2 : 0]}
      scale={landscape ? 0.78 : 1}
    >
      <RoundedBox args={[1.3, 1.95, 0.9]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.38} roughness={0.3} />
      </RoundedBox>

      <mesh position={[0, 0, 0.46]}>
        <boxGeometry args={[1.05, 1.68, 0.025]} />
        <meshStandardMaterial color="#161923" roughness={0.78} />
      </mesh>

      <group position={[0, 0.51, 0.51]}>
        <mesh>
          <sphereGeometry args={[0.13, 32, 24]} />
          <meshStandardMaterial color="#252b38" metalness={0.55} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <sphereGeometry args={[0.055, 24, 20]} />
          <meshStandardMaterial color="#9fb4ff" metalness={0.65} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0, -0.37, 0.51]}>
        <mesh>
          <cylinderGeometry args={[0.37, 0.37, 0.06, 48]} />
          <meshStandardMaterial color="#343b49" metalness={0.58} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <torusGeometry args={[0.29, 0.018, 10, 48]} />
          <meshStandardMaterial color="#aebeff" metalness={0.75} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.24, 48]} />
          <meshStandardMaterial color="#171b24" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <circleGeometry args={[0.06, 32]} />
          <meshStandardMaterial color="#697fc8" metalness={0.6} roughness={0.25} />
        </mesh>
      </group>

      <mesh position={[0, -1.08, 0]}>
        <boxGeometry args={[0.58, 0.16, 0.52]} />
        <meshStandardMaterial color="#262b37" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.75]} />
        <meshStandardMaterial color="#171b24" metalness={0.55} roughness={0.32} />
      </mesh>
    </group>
  );
}

function Turntable({
  color,
  configuration,
  shouldAnimate,
}: Pick<Props, "color" | "configuration"> & { shouldAnimate: boolean }) {
  const platter = useRef<THREE.Group>(null);
  const feltMat = configuration["platter-mat"] === "felt";

  useFrame((_, delta) => {
    if (shouldAnimate && platter.current) {
      platter.current.rotation.y += delta * 0.38;
    }
  });

  return (
    <group position={[0, 0.3, 0]}>
      <RoundedBox args={[2.15, 0.28, 1.55]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.48} roughness={0.27} />
      </RoundedBox>

      <group ref={platter} position={[-0.28, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.67, 0.67, 0.08, 64]} />
          <meshStandardMaterial color="#aeb6c5" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.025, 64]} />
          <meshStandardMaterial
            color={feltMat ? "#353943" : "#11131b"}
            metalness={feltMat ? 0.05 : 0.15}
            roughness={feltMat ? 0.95 : 0.62}
          />
        </mesh>
        {[0.2, 0.31, 0.42, 0.52].map((radius) => (
          <mesh key={radius} position={[0, 0.066, 0]}>
            <torusGeometry args={[radius, 0.004, 6, 64]} />
            <meshStandardMaterial color="#626a78" metalness={0.3} roughness={0.55} />
          </mesh>
        ))}
        <mesh position={[0, 0.072, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.018, 32]} />
          <meshStandardMaterial color="#7188d3" metalness={0.55} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0.72, 0.2, -0.48]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 24]} />
          <meshStandardMaterial color="#b4bfd2" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[-0.27, 0.11, 0.35]} rotation={[0.62, 0, -0.55]}>
          <cylinderGeometry args={[0.018, 0.028, 0.78, 12]} />
          <meshStandardMaterial color="#d0d7e4" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[-0.52, -0.04, 0.7]} rotation={[0.4, 0, -0.5]}>
          <boxGeometry args={[0.09, 0.08, 0.14]} />
          <meshStandardMaterial color="#242a37" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      <mesh position={[0.62, 0.16, 0.5]}>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 24]} />
        <meshStandardMaterial color="#8398df" metalness={0.65} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Headphones({
  color,
  configuration,
}: Pick<Props, "color" | "configuration">) {
  const velour = configuration.cushions === "velour";
  const headbandGeometry = useMemo(() => {
    const headband = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.74, 0.62, 0),
      new THREE.Vector3(-0.78, 1.15, 0),
      new THREE.Vector3(-0.52, 1.65, 0),
      new THREE.Vector3(0, 1.82, 0),
      new THREE.Vector3(0.52, 1.65, 0),
      new THREE.Vector3(0.78, 1.15, 0),
      new THREE.Vector3(0.74, 0.62, 0),
    ]);
    return new THREE.TubeGeometry(headband, 64, 0.09, 12, false);
  }, []);

  return (
    <group position={[0, -0.15, 0]}>
      <mesh geometry={headbandGeometry}>
        <meshStandardMaterial
          color="#252936"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.72, 0.48, 0]}
          rotation={[0, 0, side * -0.08]}
        >
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.38, 48]} />
            <meshStandardMaterial
              color={color}
              metalness={0.55}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <torusGeometry args={[0.235, 0.065, 16, 48]} />
            <meshStandardMaterial
              color={velour ? "#393d48" : "#171923"}
              roughness={velour ? 0.98 : 0.82}
            />
          </mesh>
          <mesh position={[0, 0, 0.205]}>
            <circleGeometry args={[0.17, 40]} />
            <meshStandardMaterial color="#303544" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.31, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.3, 20]} />
            <meshStandardMaterial
              color="#aeb8c8"
              metalness={0.85}
              roughness={0.22}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ProductModel({
  color,
  deviceType,
  configuration,
  shouldAnimate,
}: Props & { shouldAnimate: boolean }) {
  switch (deviceType) {
    case "portable-speaker":
      return <PortableSpeaker color={color} configuration={configuration} />;
    case "studio-monitor":
      return <StudioMonitor color={color} configuration={configuration} />;
    case "turntable":
      return (
        <Turntable
          color={color}
          configuration={configuration}
          shouldAnimate={shouldAnimate}
        />
      );
    case "headphones":
      return <Headphones color={color} configuration={configuration} />;
  }
}

export default function ProductViewer({
  color,
  deviceType,
  configuration,
  compact = false,
}: Props) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const { containerRef, shouldAnimate } = useSceneMotion();

  function setView(view: "front" | "side") {
    const camera = controls.current?.object;

    if (!camera || !controls.current) return;

    camera.position.set(
      view === "front" ? 0 : 4.6,
      0.8,
      view === "front" ? 4.6 : 0
    );

    controls.current.target.set(0, 0.65, 0);
    controls.current.update();
  }

  return (
    <section
      aria-label={compact ? "3D product preview" : "Interactive 3D product preview"}
      className={`overflow-hidden bg-[#11131b] ${
        compact
          ? "h-full w-full"
          : "rounded-2xl border border-white/10"
      }`}
    >
      <div
        ref={containerRef}
        className={`relative ${
          compact ? "h-full min-h-48 w-full" : "h-95 sm:h-125"
        }`}
      >
        <Canvas
          shadows={!compact}
          dpr={compact ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [0, 0.8, compact ? 5 : 4.6], fov: compact ? 38 : 42 }}
          gl={{ antialias: !compact, alpha: false }}
          fallback={
            <div className="grid h-full min-h-48 place-items-center px-4 text-center text-xs text-gray-400">
              3D preview is not supported in this browser.
            </div>
          }
        >
          <color attach="background" args={["#11131b"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 4]} intensity={2.5} />
          <pointLight position={[-3, 2, -2]} intensity={20} color="#647dff" />

          <ProductModel
            color={color}
            deviceType={deviceType}
            configuration={configuration}
            shouldAnimate={shouldAnimate && autoRotate}
          />

          {!compact && (
            <>
              <Suspense fallback={null}>
                <Environment preset="studio" />
              </Suspense>

              <ContactShadows
                position={[0, -0.1, 0]}
                opacity={0.3}
                scale={5}
                blur={2}
                far={3}
              />
            </>
          )}

          <OrbitControls
            ref={controls}
            enablePan={false}
            enableDamping
            dampingFactor={0.07}
            autoRotate={compact ? shouldAnimate : autoRotate && shouldAnimate}
            autoRotateSpeed={compact ? 0.8 : 1.5}
            minDistance={2.5}
            maxDistance={7}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
            target={[0, 0.65, 0]}
          />
        </Canvas>

        {!compact && (
          <>
            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <p className="rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[11px] text-gray-200 sm:text-xs">
                Drag to rotate · Pinch to zoom
              </p>
              <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
                <button
                  type="button"
                  aria-label="Show front view"
                  onClick={() => setView("front")}
                  className="min-h-10 rounded-lg bg-white/10 px-2.5 text-xs text-white hover:bg-white/20 sm:px-3"
                >
                  Front
                </button>
                <button
                  type="button"
                  aria-label="Show side view"
                  onClick={() => setView("side")}
                  className="min-h-10 rounded-lg bg-white/10 px-2.5 text-xs text-white hover:bg-white/20 sm:px-3"
                >
                  Side
                </button>
                <button
                  type="button"
                  aria-label="Reset product view"
                  onClick={() => controls.current?.reset()}
                  className="min-h-10 rounded-lg bg-white/10 px-2.5 text-xs text-white hover:bg-white/20 sm:px-3"
                >
                  Reset
                </button>
              </div>
            </div>

            <button
              type="button"
              aria-pressed={autoRotate && shouldAnimate}
              disabled={!shouldAnimate}
              onClick={() => setAutoRotate((value) => !value)}
              className="absolute bottom-4 right-4 min-h-10 rounded-lg bg-white px-3 text-xs font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {!shouldAnimate
                ? "Motion paused"
                : autoRotate
                  ? "Pause rotation"
                  : "Auto-rotate"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
