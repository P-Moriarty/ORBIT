"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useSceneMotion } from "@/hooks/useSceneMotion";

function OrbitalSystem({ shouldAnimate }: { shouldAnimate: boolean }) {
  const system = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!shouldAnimate || !system.current) return;
    system.current.rotation.y += delta * 0.12;
    system.current.rotation.z += delta * 0.025;
  });

  return (
    <group ref={system}>
      <mesh>
        <torusGeometry args={[1.15, 0.012, 8, 128]} />
        <meshStandardMaterial
          color="#7c9cff"
          emissive="#4169e1"
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      <mesh rotation={[0.85, 0.35, 0.1]}>
        <torusGeometry args={[1.5, 0.01, 8, 128]} />
        <meshStandardMaterial
          color="#d4e0ff"
          emissive="#647dff"
          emissiveIntensity={0.45}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      <mesh rotation={[-0.65, 0.7, 0.25]}>
        <torusGeometry args={[1.85, 0.008, 8, 128]} />
        <meshStandardMaterial
          color="#6177c9"
          emissive="#304db3"
          emissiveIntensity={0.55}
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>

      <Float
        enabled={shouldAnimate}
        speed={1.5}
        rotationIntensity={0.35}
        floatIntensity={0.2}
      >
        <mesh>
          <icosahedronGeometry args={[0.56, 2]} />
          <meshPhysicalMaterial
            color="#385fd4"
            emissive="#10275e"
            emissiveIntensity={0.8}
            metalness={0.72}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
      </Float>

      {[
        [1.15, 0, 0],
        [-1.15, 0, 0],
        [0, 1.5, 0],
        [0, -1.5, 0],
        [1.31, 0, 1.31],
        [-1.31, 0, -1.31],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[index < 2 ? 0.075 : 0.05, 16, 16]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#b9cbff" : "#6f8fff"}
            emissive="#4169e1"
            emissiveIntensity={1.2}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SoundscapeScene() {
  const { containerRef, shouldAnimate } = useSceneMotion();

  return (
    <section className="mx-auto max-w-7xl pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#111827] via-[#0d101b] to-[#090a0f]">
        <div className="grid items-center gap-2 md:grid-cols-[1fr_0.85fr] md:gap-8">
          <div
            ref={containerRef}
            aria-hidden="true"
            className="h-72 min-w-0 sm:h-80 md:h-90"
          >
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.55} />
              <pointLight position={[2, 2, 3]} intensity={35} color="#8ba6ff" />
              <pointLight
                position={[-3, -1, -2]}
                intensity={24}
                color="#3c57c8"
              />
              <OrbitalSystem shouldAnimate={shouldAnimate} />
              <Sparkles
                count={shouldAnimate ? 55 : 0}
                scale={[5.5, 3.5, 1.5]}
                size={2}
                speed={shouldAnimate ? 0.25 : 0}
                color="#a9bcff"
              />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 2.8}
                maxPolarAngle={Math.PI / 1.8}
                autoRotate={shouldAnimate}
                autoRotateSpeed={0.35}
              />
            </Canvas>
          </div>

          <div className="px-6 pb-8 md:py-10 md:pl-0 md:pr-10">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
              Hear the space around you
            </p>
            <h2 className="mt-4 max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
              Designed to move in every direction.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400">
              A living sound field, rendered in 3D. Orbit the scene and explore
              the layers of light, motion, and detail behind Orbit One.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Spatial design
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                360° movement
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Real-time 3D
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
