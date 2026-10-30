"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useSceneMotion } from "@/hooks/useSceneMotion";

const BAR_COUNT = 48;

function Waveform({ playing }: { playing: boolean }) {
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;

    bars.current.forEach((bar, index) => {
      if (!bar) return;
      const envelope = Math.sin((index / (BAR_COUNT - 1)) * Math.PI) * 0.8 + 0.2;
      const wave =
        Math.sin(index * 0.52 - time * 2.2) * 0.28 +
        Math.sin(index * 0.19 + time * 1.4) * 0.24 +
        Math.cos(index * 0.83 - time * 0.8) * 0.12;
      const height = 0.18 + envelope * (0.35 + Math.abs(wave) * 1.65);

      bar.scale.y = playing ? height : THREE.MathUtils.damp(bar.scale.y, 0.2, 5, delta);
      bar.position.y = bar.scale.y * 0.5;
    });

    rings.current.forEach((ring, index) => {
      if (!ring) return;
      const pulse = playing ? Math.sin(time * 1.7 - index * 0.9) * 0.035 : 0;
      const scale = 1 + index * 0.23 + pulse;
      ring.scale.set(scale, scale, scale);
      ring.rotation.z += delta * (index % 2 === 0 ? 0.06 : -0.045);
    });
  });

  const barPositions = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, index) => {
        const x = (index / (BAR_COUNT - 1) - 0.5) * 5.2;
        const z = Math.sin((index / (BAR_COUNT - 1)) * Math.PI) * -0.28;
        return [x, 0, z] as [number, number, number];
      }),
    []
  );

  return (
    <group>
      <group position={[0, 0.1, 0]}>
        {barPositions.map((position, index) => (
          <mesh
            key={index}
            ref={(mesh) => {
              bars.current[index] = mesh;
            }}
            position={position}
          >
            <boxGeometry args={[0.055, 1, 0.07]} />
            <meshStandardMaterial
              color={index % 6 === 0 ? "#d5e0ff" : "#6f91ff"}
              emissive={index % 6 === 0 ? "#91aaff" : "#4169e1"}
              emissiveIntensity={index % 6 === 0 ? 1.5 : 0.8}
              metalness={0.45}
              roughness={0.28}
            />
          </mesh>
        ))}
      </group>

      <group position={[0, 0.95, -0.25]}>
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            ref={(mesh) => {
              rings.current[index] = mesh;
            }}
          >
            <torusGeometry args={[0.46, 0.012, 8, 96]} />
            <meshStandardMaterial
              color={index === 1 ? "#c4d2ff" : "#718dff"}
              emissive="#4169e1"
              emissiveIntensity={0.9 - index * 0.15}
              metalness={0.65}
              roughness={0.25}
            />
          </mesh>
        ))}
        <mesh>
          <icosahedronGeometry args={[0.2, 2]} />
          <meshPhysicalMaterial
            color="#dbe5ff"
            emissive="#4169e1"
            emissiveIntensity={1.2}
            metalness={0.6}
            roughness={0.15}
            clearcoat={1}
          />
        </mesh>
      </group>
      <Sparkles
        count={playing ? 32 : 0}
        scale={[6, 2.7, 1.4]}
        size={1.5}
        speed={playing ? 0.2 : 0}
        color="#9eb4ff"
      />
    </group>
  );
}

export default function WaveformScene() {
  const [playing, setPlaying] = useState(true);
  const { containerRef, shouldAnimate } = useSceneMotion();
  const isPlaying = playing && shouldAnimate;

  return (
    <section className="mx-auto max-w-7xl pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d101b]">
        <div className="grid items-center md:grid-cols-[0.85fr_1fr]">
          <div className="px-6 pt-8 md:py-10 md:pl-10">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
              Feel every frequency
            </p>
            <h2 className="mt-4 max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
              Sound, shaped in real time.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400">
              Watch the sound field shift and breathe. This generative waveform
              is built from live 3D geometry, with every bar responding to its
              own rhythm.
            </p>
            <button
              type="button"
              aria-pressed={playing}
              onClick={() => setPlaying((value) => !value)}
              className="mt-6 rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
            >
              {playing ? "Pause animation" : "Play animation"}
            </button>
            <p className="mt-4 text-xs text-gray-500">
              Drag the scene to explore · {isPlaying ? "Animation on" : "Paused"}
              {playing && !shouldAnimate
                ? " while off-screen or reduced motion is enabled"
                : ""}
            </p>
          </div>

          <div ref={containerRef} className="h-72 min-w-0 sm:h-80 md:h-90">
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 2.5, 6.5], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.65} />
              <pointLight position={[0, 3, 3]} intensity={40} color="#9ab0ff" />
              <pointLight
                position={[-3, 1, -2]}
                intensity={22}
                color="#3f5dcc"
              />
              <Waveform playing={isPlaying} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 3.2}
                maxPolarAngle={Math.PI / 1.85}
                autoRotate={isPlaying}
                autoRotateSpeed={0.25}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
