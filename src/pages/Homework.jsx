import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Plus, Trash2, CheckCircle, AlertCircle, Calendar as CalendarIcon, Send } from 'lucide-react';
import { sendNotification } from '../utils/onesignal';

const Homework = () => {
    const { user } = useAuth();
    const { data: tasks, add, remove, update } = useFirestore('homework', user?.uid);

    const [formData, setFormData] = useState({
        subject: '', description: '', dueDate: '', status: 'pending'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await add(formData);
        setFormData({ subject: '', description: '', dueDate: '', status: 'pending' });
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        await update(task.id, { status: newStatus });
    };

    const testDeadlinePush = (task) => {
        sendNotification("Homework Deadline", `${task.subject} is due soon!`);
        alert(`Deadline push triggered for ${task.subject}`);
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Add Assignment" icon={Plus}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text" placeholder="Subject (e.g. Computer Science)" required className="input-field w-full"
                            value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <input
                            type="date" required className="input-field w-full"
                            value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                        <textarea
                            placeholder="Task Description" required className="input-field w-full h-24 resize-none"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <button type="submit" className="w-full btn-primary flex items-center justify-center space-x-2">
                            <Send className="w-5 h-5" />
                            <span>Add Task</span>
                        </button>
                    </form>
                </Card>

                <Card title="Assignments" icon={List}>
                    <div className="space-y-4">
                        {tasks.length > 0 ? (
                            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map(t => (
                                <div key={t.id} className={`p-4 rounded-2xl border transition-all ${t.status === 'completed'
                                        ? 'bg-green-500/5 border-green-500/20 opacity-60'
                                        : 'bg-white/5 border-white/10'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start space-x-3">
                                            <button onClick={() => toggleStatus(t)} className="mt-1">
                                                {t.status === 'completed'
                                                    ? <CheckCircle className="w-5 h-5 text-green-400" />
                                                    : <AlertCircle className="w-5 h-5 text-amber-400" />
                                                }
                                            </button>
                                            <div>
                                                <h4 className={`font-bold text-white ${t.status === 'completed' ? 'line-through' : ''}`}>
                                                    {t.subject}
                                                </h4>
                                                <p className="text-sm text-white/50">{t.description}</p>
                                                <div className="flex items-center space-x-2 mt-2 text-xs font-semibold text-primary-400">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    <span>Due: {t.dueDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => testDeadlinePush(t)} className="p-1 text-white/20 hover:text-primary-400"><Bell className="w-4 h-4" /></button>
                                            <button onClick={() => remove(t.id)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-white/40 py-8">No assignments yet. Stay organized!</p>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

// Re-using List icon from lucide
import { List, Bell } from 'lucide-react';

export default Homework;
