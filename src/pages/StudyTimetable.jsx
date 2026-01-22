import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Plus, Trash2, BookOpen, Clock, Bell } from 'lucide-react';
import { sendNotification } from '../utils/onesignal';

const StudyTimetable = () => {
    const { user } = useAuth();
    const { data: studySessions, add, remove } = useFirestore('study_timetable', user?.uid);

    const [formData, setFormData] = useState({
        subject: '', time: '', notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await add(formData);
        setFormData({ subject: '', time: '', notes: '' });
    };

    const testNotification = (session) => {
        sendNotification("Study Session Reminder", `Time to study ${session.subject}!`);
        alert(`Test push triggered for ${session.subject}`);
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Plan Study Session" icon={Plus}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text" placeholder="Subject (e.g. Physics)" required className="input-field w-full"
                            value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <input
                            type="time" required className="input-field w-full"
                            value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                        />
                        <textarea
                            placeholder="Study Notes (e.g. Focus on Chapter 5)" className="input-field w-full h-24 resize-none"
                            value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                        <button type="submit" className="w-full btn-primary flex items-center justify-center space-x-2">
                            <BookOpen className="w-5 h-5" />
                            <span>Add Session</span>
                        </button>
                    </form>
                </Card>

                <Card title="Study Schedule" icon={Clock}>
                    <div className="space-y-4">
                        {studySessions.length > 0 ? (
                            studySessions.sort((a, b) => a.time.localeCompare(b.time)).map(s => (
                                <div key={s.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{s.subject}</h4>
                                            <p className="text-primary-400 font-mono text-sm">{s.time}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => testNotification(s)}
                                                className="p-2 hover:bg-primary-500/20 rounded-lg text-primary-400/50 hover:text-primary-400 transition-colors"
                                                title="Test Push"
                                            >
                                                <Bell className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => remove(s.id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {s.notes && (
                                        <p className="text-sm text-white/50 bg-black/20 p-3 rounded-xl italic">
                                            "{s.notes}"
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-white/40 py-8">No study sessions planned.</p>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default StudyTimetable;
