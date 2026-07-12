import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { CheckCircle, Shield, Zap, Globe, Cpu, Clock, LayoutDashboard, UserCheck, Wrench } from 'lucide-react';

const AnimatedShape = ({ color, position, speed, distort }: { color: string, position: [number, number, number], speed: number, distort: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={1.2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <AnimatedShape color="#3b82f6" position={[-3, 1, -2]} speed={1.5} distort={0.4} />
      <AnimatedShape color="#a855f7" position={[3, -1, -3]} speed={2} distort={0.6} />
      <AnimatedShape color="#22c55e" position={[0, -3, -5]} speed={1.2} distort={0.3} />
      <AnimatedShape color="#ef4444" position={[-4, -2, -1]} speed={1.8} distort={0.5} />
    </>
  );
};

const FeatureTag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-blue-300 backdrop-blur-md">
    {children}
  </span>
);

const FeatureDetail = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <h4 className="text-lg font-bold text-white">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white overflow-x-hidden">
      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas>
          <Scene />
        </Canvas>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center text-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-9xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
              AssetFlow
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
            >
              The next generation of <span className="text-blue-400 font-semibold">Asset Intelligence</span>. 
              Real-time tracking, seamless allocation, and predictive maintenance in one fluid interface.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 flex gap-4 justify-center"
            >
              <a href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Launch Platform
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Section 1: Intelligent Tracking */}
        <section className="min-h-screen flex items-center justify-center p-8 md:p-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="space-y-6"
            >
              <div className="flex gap-2 mb-4">
                <FeatureTag>Live Sync</FeatureTag>
                <FeatureTag>Global Reach</FeatureTag>
                <FeatureTag>Audit Ready</FeatureTag>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Intelligent Tracking
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Experience complete visibility. Our digital twin architecture ensures that every 
                single piece of equipment is monitored, located, and audited in real-time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <FeatureDetail icon={Globe} title="GPS Integration" desc="Real-time geospatial coordinates for all mobile assets." />
                <FeatureDetail icon={Cpu} title="RFID Support" desc="Automated check-ins and check-outs using smart tags." />
                <FeatureDetail icon={LayoutDashboard} title="Digital Twin" desc="Virtual replicas of assets for health monitoring." />
                <FeatureDetail icon={Shield} title="Secure Audits" desc="Immutable logs for every asset movement." />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                alt="Asset Tracking Dashboard" 
                className="relative rounded-3xl shadow-2xl border border-white/10 object-cover w-full h-[500px]"
              />
            </motion.div>
          </div>
        </section>

        {/* Feature Section 2: Seamless Allocation */}
        <section className="min-h-screen flex items-center justify-center p-8 md:p-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group order-2 lg:order-1"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" 
                alt="Team Collaboration" 
                className="relative rounded-3xl shadow-2xl border border-white/10 object-cover w-full h-[500px]"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="space-y-6 order-1 lg:order-2"
            >
              <div className="flex gap-2 mb-4">
                <FeatureTag>Zero Friction</FeatureTag>
                <FeatureTag>Smart Routing</FeatureTag>
                <FeatureTag>Fast Approvals</FeatureTag>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Seamless Allocation
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Eliminate bureaucracy. Move assets between employees and departments 
                with an intuitive request system and automated return workflows.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <FeatureDetail icon={Zap} title="One-Click Transfer" desc="Instant asset reassignment with full history." />
                <FeatureDetail icon={UserCheck} title="Dept Approvals" desc="Automated workflow for department head sign-offs." />
                <FeatureDetail icon={Clock} title="Auto-Reminders" desc="Smart notifications for expected return dates." />
                <FeatureDetail icon={Shield} title="Policy Guard" desc="Ensure assets only move to authorized personnel." />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Section 3: Predictive Maintenance */}
        <section className="min-h-screen flex items-center justify-center p-8 md:p-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="space-y-6"
            >
              <div className="flex gap-2 mb-4">
                <FeatureTag>Proactive</FeatureTag>
                <FeatureTag>Cost Efficient</FeatureTag>
                <FeatureTag>Long Life</FeatureTag>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                Predictive Maintenance
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Stop downtime before it starts. Leverage intelligent scheduling 
                and detailed repair histories to maintain your assets at peak performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <FeatureDetail icon={Wrench} title="Health Scoring" desc="AI-driven scores based on usage and age." />
                <FeatureDetail icon={UserCheck} title="Tech Assign" desc="Directly link technicians to specific issues." />
                <FeatureDetail icon={Clock} title="Downtime Forecast" desc="Predict failure windows to avoid outages." />
                <FeatureDetail icon={CheckCircle} title="Full Lifecycle" desc="Track from acquisition to retirement." />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" 
                alt="Maintenance Technology" 
                className="relative rounded-3xl shadow-2xl border border-white/10 object-cover w-full h-[500px]"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="h-screen flex flex-col items-center justify-center text-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 animate-pulse"></div>
            <div className="relative px-8 py-12 bg-black rounded-full leading-none flex flex-col md:flex-row items-center gap-8 md:gap-16">
               <div className="px-4">
                 <h2 className="text-5xl md:text-8xl font-black mb-0">Ready to evolve?</h2>
               </div>
               <div className="px-4">
                 <a href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-full font-bold text-2xl transition-all transform hover:scale-110 shadow-xl">
                   Join AssetFlow
                 </a>
               </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
