import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { MapPin, Navigation, Trash2, Crosshair, Save } from 'lucide-react';
import { getWalkingDirectionsUrl } from '../utils/maps';

const ClassLocation = () => {
    const { user } = useAuth();
    const { data: locations, add, remove } = useFirestore('class_locations', user?.uid);

    const [formData, setFormData] = useState({
        block: '', floor: '', room: '', lat: '', lng: ''
    });
    const [locating, setLocating] = useState(false);

    const getCurrentLocation = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData({
                    ...formData,
                    lat: pos.coords.latitude.toString(),
                    lng: pos.coords.longitude.toString()
                });
                setLocating(false);
            },
            (err) => {
                console.error(err);
                setLocating(false);
                alert("Could not get location. Please enable GPS.");
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await add({
            ...formData,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng)
        });
        setFormData({ block: '', floor: '', room: '', lat: '', lng: '' });
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Mark Classroom" icon={MapPin}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text" placeholder="Block (e.g. Block A)" required className="input-field"
                                value={formData.block} onChange={e => setFormData({ ...formData, block: e.target.value })}
                            />
                            <input
                                type="text" placeholder="Floor (e.g. 3)" required className="input-field"
                                value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })}
                            />
                        </div>
                        <input
                            type="text" placeholder="Room Number (e.g. 301)" required className="input-field w-full"
                            value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })}
                        />

                        <div className="flex gap-2">
                            <input
                                type="text" placeholder="Latitude" required className="input-field flex-1"
                                value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })}
                            />
                            <input
                                type="text" placeholder="Longitude" required className="input-field flex-1"
                                value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="w-full btn-secondary flex items-center justify-center space-x-2"
                            disabled={locating}
                        >
                            <Crosshair className={`w-5 h-5 ${locating ? 'animate-spin' : ''}`} />
                            <span>{locating ? 'Getting GPS...' : 'Use Current Location'}</span>
                        </button>

                        <button type="submit" className="w-full btn-primary flex items-center justify-center space-x-2">
                            <Save className="w-5 h-5" />
                            <span>Save Location</span>
                        </button>
                    </form>
                </Card>

                <Card title="Saved Locations" icon={Navigation}>
                    <div className="space-y-4">
                        {locations.length > 0 ? (
                            locations.map(loc => (
                                <div key={loc.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white">{loc.room}</h4>
                                        <p className="text-xs text-white/50">{loc.block}, Floor {loc.floor}</p>
                                        <p className="text-[10px] text-white/30 mt-1">{loc.lat}, {loc.lng}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <a
                                            href={getWalkingDirectionsUrl(loc.lat, loc.lng)}
                                            target="_blank" rel="noopener noreferrer"
                                            className="p-2 bg-primary-500/10 rounded-lg text-primary-400 hover:bg-primary-500 hover:text-white transition-all"
                                        >
                                            <Navigation className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => remove(loc.id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-white/40 py-8">No locations saved yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default ClassLocation;
