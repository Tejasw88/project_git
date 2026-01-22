import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass-card sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Trackie
                </span>
            </div>

            {user && (
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-sm font-medium text-white">{user.displayName}</span>
                        <span className="text-xs text-white/50">{user.email}</span>
                    </div>
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-primary-500 shadow-lg"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <UserIcon className="w-5 h-5 text-white/50" />
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 text-white/50 group-hover:text-red-400" />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
