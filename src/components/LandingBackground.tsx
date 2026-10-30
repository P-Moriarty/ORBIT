"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneMotion } from "@/hooks/useSceneMotion";

function StarField({ shouldAnimate }: { shouldAnimate: boolean }) {
  const field = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const values = new Float32Array(900 * 3);
    let seed = 41;

    for (let index = 0; index < values.length; index += 1) {
      seed = (seed * 16807) % 2147483647;
      values[index] = (seed / 2147483647) * 2 - 1;
    }

    for (let index = 0; index < values.length; index += 3) {
      values[index] *= 13;
      values[index + 1] *= 8;
      values[index + 2] *= 8;
    }

    return values;
  }, []);

  useFrame((_, delta) => {
    if (!shouldAnimate || !field.current) return;
    field.current.rotation.y += delta * 0.006;
    field.current.rotation.x = Math.sin(Date.now() * 0.00008) * 0.025;
  });

  return (
    <points ref={field}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9bb3ff"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.48}
        depthWrite={false}
      />
    </points>
  );
}

function OrbitLines({ shouldAnimate }: { shouldAnimate: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!shouldAnimate || !group.current) return;
    group.current.rotation.y += delta * 0.018;
    group.current.rotation.z -= delta * 0.008;
  });

  return (
    <group ref={group} position={[5, -0.5, -7]} rotation={[0.8, 0.2, -0.35]}>
      {[2.2, 3, 3.8].map((radius, index) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, 0.008, 6, 160]} />
          <meshBasicMaterial
            color={index === 1 ? "#566fcb" : "#35477f"}
            transparent
            opacity={index === 1 ? 0.24 : 0.16}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh position={[2.2, 0, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#a9beff" />
      </mesh>
      <mesh position={[-3, 0, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#718fff" />
      </mesh>
    </group>
  );
}

function ScrollOrbit({ shouldAnimate }: { shouldAnimate: boolean }) {
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (
      !shouldAnimate ||
      !orbit.current ||
      typeof window === "undefined"
    ) {
      return;
    }

    const scrollRange = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const progress = window.scrollY / scrollRange;
    const targetY = Math.sin(progress * Math.PI * 4) * 0.75;
    const targetX = Math.cos(progress * Math.PI * 2) * 0.55;

    orbit.current.position.y = THREE.MathUtils.damp(
      orbit.current.position.y,
      targetY,
      2.4,
      delta
    );
    orbit.current.position.x = THREE.MathUtils.damp(
      orbit.current.position.x,
      targetX,
      2.4,
      delta
    );
    orbit.current.rotation.x = THREE.MathUtils.damp(
      orbit.current.rotation.x,
      0.65 + progress * Math.PI * 1.5,
      2.4,
      delta
    );
    orbit.current.rotation.y = THREE.MathUtils.damp(
      orbit.current.rotation.y,
      progress * Math.PI * 3,
      2.4,
      delta
    );
    orbit.current.rotation.z = THREE.MathUtils.damp(
      orbit.current.rotation.z,
      -0.3 + progress * Math.PI,
      2.4,
      delta
    );
  });

  return (
    <group ref={orbit} position={[-4.3, 0, -5.5]}>
      <mesh>
        <torusKnotGeometry args={[1.05, 0.012, 180, 8, 2, 5]} />
        <meshBasicMaterial
          color="#7894ff"
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.35, 0]}>
        <torusGeometry args={[1.38, 0.008, 6, 120]} />
        <meshBasicMaterial
          color="#b4c5ff"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshBasicMaterial
          color="#8ba5ff"
          transparent
          opacity={0.32}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function LandingBackground() {
  const { containerRef, shouldAnimate } = useSceneMotion();

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_24%,rgba(35,55,120,0.2),transparent_48%),radial-gradient(ellipse_at_18%_78%,rgba(23,39,92,0.16),transparent_42%)]" />
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <StarField shouldAnimate={shouldAnimate} />
        <OrbitLines shouldAnimate={shouldAnimate} />
        <ScrollOrbit shouldAnimate={shouldAnimate} />
      </Canvas>
      <div className="absolute inset-0 bg-linear-to-b from-[#090a0f]/10 via-transparent to-[#090a0f]/45" />
    </div>
  );
}
