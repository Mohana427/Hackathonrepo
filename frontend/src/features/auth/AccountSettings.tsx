import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/AuthContext';
import { User, Mail, Lock, Bell, Shield, ArrowLeft, Save, Globe, Eye } from 'lucide-react';
import { Button } from '../../shared/Button';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsSection = 'profile' | 'security' | 'notifications' | 'privacy';

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    notifications: true,
    twoFactor: false,
    profileVisibility: 'public',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings...', formData);
    alert('Settings updated successfully!');
  };

  const sections: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy & Access', icon: <Shield size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="secondary" 
          className="p-2 rounded-full bg-white/10 border-white/20 hover:bg-white/20 transition-all" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-4xl font-black text-white tracking-tight">Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation - Liquid Glass */}
        <div className="lg:col-span-1 space-y-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group ${
                activeSection === section.id 
                ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30' 
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-200 hover:border-white/20 backdrop-blur-xl'
              }`}
            >
              <span className={`${activeSection === section.id ? 'text-blue-300' : 'group-hover:text-slate-200'} transition-colors`}>
                {section.icon}
              </span>
              <span className="font-semibold text-sm">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area - Enhanced Liquid Glass */}
        <motion.div 
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <form onSubmit={handleSave} className="relative z-10 space-y-8">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <div className="relative group">
                        <User size={18} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white p-3 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white p-3 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Security & Password</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Notification Preferences</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Bell size={20} className="text-blue-400" />
                        <div>
                          <span className="block text-white font-medium">Email Notifications</span>
                          <span className="block text-xs text-slate-400">Get alerts for allocation and booking updates</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.notifications}
                        onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600" 
                      />
                    </label>
                  </div>
                </motion.div>
              )}

              {activeSection === 'privacy' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Privacy & Access</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Profile Visibility</label>
                      <select 
                        value={formData.profileVisibility}
                        onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="internal">Internal Only</option>
                      </select>
                    </div>
                    <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Eye size={20} className="text-blue-400" />
                        <div>
                          <span className="block text-white font-medium">Allow others to see my bookings</span>
                          <span className="block text-xs text-slate-400">Colleagues can see when you have an asset booked</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600" 
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 flex justify-end gap-4">
              <Button 
                type="button" 
                variant="secondary" 
                className="bg-white/5 border-white/10 hover:bg-white/10" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="flex items-center gap-2 px-8 shadow-lg shadow-blue-500/30"
              >
                <Save size={18} /> Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
