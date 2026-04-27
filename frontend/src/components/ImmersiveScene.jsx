import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls, Sparkles } from '@react-three/drei';

const CoreGlyph = () => {
    const groupRef = useRef(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += delta * 0.25;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.22;
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.4} rotationIntensity={0.8} floatIntensity={0.9}>
                <mesh castShadow position={[-1.2, 0.2, 0]}>
                    <torusKnotGeometry args={[0.6, 0.18, 180, 28]} />
                    <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.2} />
                </mesh>
            </Float>

            <Float speed={1.2} rotationIntensity={1} floatIntensity={1.3}>
                <mesh castShadow position={[1.2, -0.2, -0.4]}>
                    <icosahedronGeometry args={[0.72, 1]} />
                    <meshStandardMaterial color="#06b6d4" metalness={0.52} roughness={0.25} />
                </mesh>
            </Float>

            <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1}>
                <mesh castShadow position={[0, 0.95, 0.2]}>
                    <octahedronGeometry args={[0.42, 0]} />
                    <meshStandardMaterial color="#10b981" metalness={0.45} roughness={0.3} />
                </mesh>
            </Float>
        </group>
    );
};

const ImmersiveScene = () => {
    return (
        <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 46 }}>
                <color attach="background" args={['#eef4ff']} />
                <fog attach="fog" args={['#eef4ff', 5.5, 11]} />
                <ambientLight intensity={0.55} />
                <directionalLight position={[4, 6, 5]} intensity={1.2} />
                <directionalLight position={[-4, -2, -3]} intensity={0.5} />
                <CoreGlyph />
                <Sparkles count={110} size={2.1} speed={0.25} color="#6366f1" scale={[8, 4, 5]} />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
            </Canvas>
        </div>
    );
};

export default ImmersiveScene;
