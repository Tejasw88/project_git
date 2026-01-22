import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-900">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
