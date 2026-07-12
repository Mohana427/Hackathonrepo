import React from 'react';
import { motion } from 'framer-motion';

export const EnterpriseBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans overflow-hidden text-slate-100">
      {/* High-End Dark Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Lighter Blue Ambient Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, -100, 0],
            y: [0, -80, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        {/* Subtle grid overlay for a technical/enterprise feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
