import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Calendar as CalendarIcon, AlertCircle, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const Calendar = () => {
    const { user } = useAuth();
    const { data: homework } = useFirestore('homework', user?.uid);
    const { data: classes } = useFirestore('class_timetable', user?.uid);

    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{format(today, 'MMMM yyyy')}</h2>
                    <div className="flex space-x-4 text-xs font-semibold">
                        <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-primary-500" /><span>Class</span></div>
                        <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>Homework</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <div key={d} className="text-center text-[10px] uppercase tracking-widest text-white/30 py-2">{d}</div>
                    ))}
                    {days.map(day => {
                        const dayClasses = classes.filter(c => c.day === format(day, 'EEEE'));
                        const dayHomework = homework.filter(h => isSameDay(new Date(h.dueDate), day));
                        const isToday = isSameDay(day, today);

                        return (
                            <div
                                key={day.toString()}
                                className={`aspect-square p-2 glass-card rounded-xl border relative transition-all hover:border-primary-500/50 ${isToday ? 'border-primary-500 bg-primary-500/10' : 'border-white/5'
                                    }`}
                            >
                                <span className={`text-xs font-bold leading-none ${isToday ? 'text-primary-400' : 'text-white/60'}`}>
                                    {format(day, 'd')}
                                </span>
                                <div className="mt-1 flex flex-col gap-0.5">
                                    {dayClasses.slice(0, 2).map((_, i) => (
                                        <div key={i} className="h-1 w-full bg-primary-500/50 rounded-full" />
                                    ))}
                                    {dayHomework.slice(0, 2).map((_, i) => (
                                        <div key={i} className="h-1 w-full bg-amber-500/50 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Card title="Upcoming Deadlines" icon={AlertCircle}>
                    <div className="space-y-3">
                        {homework
                            .filter(h => h.status === 'pending' && new Date(h.dueDate) >= today)
                            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                            .slice(0, 5)
                            .map(h => (
                                <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div>
                                        <h4 className="font-bold text-white">{h.subject}</h4>
                                        <p className="text-xs text-white/50">{h.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-mono text-primary-400">{h.dueDate}</span>
                                        <p className="text-[10px] text-white/30 uppercase mt-1">Pending</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Calendar;
