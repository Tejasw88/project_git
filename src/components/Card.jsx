import React from 'react';

const Card = ({ title, children, icon: Icon, action, className = "" }) => {
    return (
        <div className={`glass-card rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/20 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {Icon && (
                        <div className="p-2 bg-primary-500/20 rounded-lg">
                            <Icon className="w-5 h-5 text-primary-400" />
                        </div>
                    )}
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                {action && (
                    <div>{action}</div>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Card;
