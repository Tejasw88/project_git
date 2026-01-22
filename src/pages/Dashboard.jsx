import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import {
    Clock, MapPin, Calendar, BookOpen,
    Navigation, CheckCircle, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, addMinutes, isAfter, parse } from 'date-fns';
import { getWalkingDirectionsUrl, getInstructionString } from '../utils/maps';

const Dashboard = () => {
    const { user } = useAuth();
    const { data: classes } = useFirestore('class_timetable', user?.uid);
    const { data: homework } = useFirestore('homework', user?.uid);
    const { data: locations } = useFirestore('class_locations', user?.uid);

    const [nextClass, setNextClass] = useState(null);
    const [countdown, setCountdown] = useState("");

    // Logic to find next class and update countdown
    useEffect(() => {
        const updateCountdown = () => {
            if (!classes.length) return;

            const now = new Date();
            const today = format(now, 'EEEE');

            const todayClasses = classes
                .filter(c => c.day === today)
                .map(c => ({
                    ...c,
                    startTimeDate: parse(c.startTime, 'HH:mm', now)
                }))
                .filter(c => isAfter(c.startTimeDate, now))
                .sort((a, b) => a.startTimeDate - b.startTimeDate);

            if (todayClasses.length > 0) {
                const next = todayClasses[0];
                setNextClass(next);

                const diff = next.startTimeDate - now;
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setCountdown(`${mins}m ${secs}s`);
            } else {
                setNextClass(null);
                setCountdown("");
            }
        };

        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [classes]);

    const pendingHomework = homework.filter(h => h.status === 'pending');

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Next Class Countdown */}
                <Card
                    title="Upcoming Class"
                    icon={Clock}
                    className="md:col-span-2 bg-gradient-to-br from-primary-600/20 to-accent-600/20"
                >
                    {nextClass ? (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{nextClass.subject}</h4>
                                <p className="text-white/60">
                                    {nextClass.classroom} • {nextClass.block}, Floor {nextClass.floor}
                                </p>
                                <div className="mt-4 flex items-center space-x-2 text-primary-400 font-mono text-xl">
                                    <AlertCircle className="w-5 h-5 animate-pulse" />
                                    <span>Starts in: {countdown}</span>
                                </div>
                            </div>
                            <a
                                href={getWalkingDirectionsUrl(nextClass.lat, nextClass.lng)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center justify-center space-x-2"
                            >
                                <Navigation className="w-5 h-5" />
                                <span>Navigate Now</span>
                            </a>
                        </div>
                    ) : (
                        <div className="py-6 text-center text-white/40">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No more classes for today!</p>
                        </div>
                    )}
                </Card>

                {/* Homework Stats */}
                <Card title="Homework" icon={BookOpen}>
                    <div className="text-center py-2">
                        <span className="text-5xl font-bold text-white">{pendingHomework.length}</span>
                        <p className="text-white/40 text-sm mt-1">Pending Assignments</p>
                        <Link to="/homework" className="mt-4 block text-primary-400 text-sm font-semibold hover:underline">
                            View All Tasks &rarr;
                        </Link>
                    </div>
                </Card>

                {/* Feature Navigation Cards */}
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/timetable" className="glass-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-blue-500/20 rounded-xl"><Calendar className="w-6 h-6 text-blue-400" /></div>
                        <span className="text-sm font-semibold">Timetable</span>
                    </Link>
                    <Link to="/study" className="glass-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-purple-500/20 rounded-xl"><BookOpen className="w-6 h-6 text-purple-400" /></div>
                        <span className="text-sm font-semibold">Study Plan</span>
                    </Link>
                    <Link to="/calendar" className="glass-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-green-500/20 rounded-xl"><Calendar className="w-6 h-6 text-green-400" /></div>
                        <span className="text-sm font-semibold">Calendar</span>
                    </Link>
                    <Link to="/locations" className="glass-card p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-red-500/20 rounded-xl"><MapPin className="w-6 h-6 text-red-400" /></div>
                        <span className="text-sm font-semibold">Map</span>
                    </Link>
                </div>

                {/* Saved Classroom Navigation */}
                <Card title="Saved Classrooms" icon={MapPin} className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {locations.length > 0 ? (
                            locations.map(loc => (
                                <div key={loc.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-primary-500/50 transition-colors">
                                    <div>
                                        <h5 className="font-bold text-white">{loc.room}</h5>
                                        <p className="text-xs text-white/50">{loc.block}, Floor {loc.floor}</p>
                                    </div>
                                    <a
                                        href={getWalkingDirectionsUrl(loc.lat, loc.lng)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-primary-500/10 rounded-xl text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all"
                                    >
                                        <Navigation className="w-5 h-5" />
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-3 text-center text-white/40 py-4">No locations saved yet.</p>
                        )}
                    </div>
                </Card>

            </div>
        </Layout>
    );
};

export default Dashboard;
