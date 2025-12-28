import React from 'react';
import { mockUser } from '../data/mockData';
import { Settings, LogOut, Shield, User } from 'lucide-react';

const AccountPage = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Account</h1>

        {/* Profile Section */}
        <div className="glass-strong rounded-2xl p-8 flex items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-electric/30 shadow-glow-purple">
            <img 
              src={mockUser.avatar_path} 
              alt={mockUser.username} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{mockUser.username}</h2>
              {mockUser.is_admin && (
                <span className="px-3 py-1 rounded-full bg-purple-electric/20 text-purple-electric text-xs font-bold border border-purple-electric/30">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-white/60 mb-6">Premium Member since Dec 2025</p>
            <div className="flex gap-4">
              <button className="btn-glow px-6 py-2 text-sm">Edit Profile</button>
              {mockUser.is_admin && (
                <button className="glass px-6 py-2 text-sm rounded-xl hover:glass-strong transition-all">
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-6 hover:glass-strong transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-purple-electric/20 transition-colors">
                <Settings size={24} className="text-white/70 group-hover:text-purple-electric" />
              </div>
              <div>
                <h3 className="font-semibold">General Settings</h3>
                <p className="text-sm text-white/50">App behavior, theme, and language</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-6 hover:glass-strong transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-purple-electric/20 transition-colors">
                <Shield size={24} className="text-white/70 group-hover:text-purple-electric" />
              </div>
              <div>
                <h3 className="font-semibold">Privacy & Security</h3>
                <p className="text-sm text-white/50">Manage your data and account security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-8 border-t border-white/5">
          <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-4 py-2 rounded-lg hover:bg-red-400/10">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
