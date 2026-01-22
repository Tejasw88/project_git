import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Timetable = () => {
    const { user } = useAuth();
    const { data: classes, add, remove } = useFirestore('class_timetable', user?.uid);
    const { data: locations } = useFirestore('class_locations', user?.uid);

    const [formData, setFormData] = useState({
        subject: '', day: 'Monday', startTime: '', endTime: '', locationId: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedLoc = locations.find(l => l.id === formData.locationId);
        await add({
            ...formData,
            classroom: selectedLoc?.room || 'Unknown',
            block: selectedLoc?.block || 'N/A',
            floor: selectedLoc?.floor || 'N/A',
            lat: selectedLoc?.lat || 0,
            lng: selectedLoc?.lng || 0
        });
        setFormData({ subject: '', day: 'Monday', startTime: '', endTime: '', locationId: '' });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <Card title="Add Class" icon={Plus}>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Subject Name"
                            required
                            className="input-field"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <select
                            className="input-field"
                            value={formData.day}
                            onChange={e => setFormData({ ...formData, day: e.target.value })}
                        >
                            {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="time"
                                required
                                className="input-field"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            />
                            <input
                                type="time"
                                required
                                className="input-field"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                        <select
                            className="input-field md:col-span-2"
                            required
                            value={formData.locationId}
                            onChange={e => setFormData({ ...formData, locationId: e.target.value })}
                        >
                            <option value="">Select Saved Classroom</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.room} ({loc.block})</option>
                            ))}
                        </select>
                        <button type="submit" className="btn-primary">Add to Schedule</button>
                    </form>
                </Card>

                <div className="grid grid-cols-1 gap-6">
                    {DAYS.map(day => {
                        const dayClasses = classes.filter(c => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                        if (dayClasses.length === 0) return null;
                        return (
                            <Card key={day} title={day} icon={CalendarIcon}>
                                <div className="space-y-3">
                                    {dayClasses.map(c => (
                                        <div key={c.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-primary-400 font-mono text-sm">
                                                    {c.startTime} - {c.endTime}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{c.subject}</h4>
                                                    <p className="text-xs text-white/50">{c.classroom} • {c.block}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => remove(c.id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Timetable;
