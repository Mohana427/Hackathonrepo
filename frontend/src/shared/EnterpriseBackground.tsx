import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const EnterpriseBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans overflow-hidden text-slate-100">
      {/* Static Image Base Layer */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-50 grayscale"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Animated Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950 mix-blend-multiply"></div>

      {/* Interactive Dynamic Components */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] transition-opacity duration-500"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute -bottom-24 -right-24 w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        />
        
        {/* Subtle Grid with Mouse interaction */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
