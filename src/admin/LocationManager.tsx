import { useState, useEffect } from 'react';
import { getLocations, addLocation, updateLocation, deleteLocation } from '../lib/dataService';

interface LocationRow {
    id: string;
    name: string;
    map_url: string | null;
    position: number;
}

export default function LocationManager() {
    const [locations, setLocations] = useState<LocationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', map_url: '' });
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        const data = await getLocations();
        setLocations(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.name.trim()) return;
        setSaving(true);
        await addLocation({ name: form.name, map_url: form.map_url || undefined });
        setForm({ name: '', map_url: '' });
        setShowAdd(false);
        setSaving(false);
        load();
    };

    const handleUpdate = async (id: string) => {
        if (!form.name.trim()) return;
        setSaving(true);
        await updateLocation(id, { name: form.name, map_url: form.map_url || undefined });
        setEditingId(null);
        setForm({ name: '', map_url: '' });
        setSaving(false);
        load();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete location "${name}" and ALL its units, teams, and members?`)) return;
        await deleteLocation(id);
        load();
    };

    const startEdit = (loc: LocationRow) => {
        setEditingId(loc.id);
        setForm({ name: loc.name, map_url: loc.map_url || '' });
        setShowAdd(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setShowAdd(false);
        setForm({ name: '', map_url: '' });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">Locations</h2>
                <button
                    onClick={() => { setShowAdd(true); setEditingId(null); setForm({ name: '', map_url: '' }); }}
                    className="admin-btn-primary"
                >
                    + Add Location
                </button>
            </div>

            {showAdd && (
                <div className="admin-form-card">
                    <h3 className="admin-form-title">New Location</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Name *</label>
                            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. California (Avenue Banafsaj)" autoFocus />
                        </div>
                        <div className="admin-field">
                            <label>Google Maps Embed URL</label>
                            <input className="admin-input" value={form.map_url} onChange={(e) => setForm({ ...form, map_url: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button onClick={cancelEdit} className="admin-btn-secondary">Cancel</button>
                        <button onClick={handleAdd} className="admin-btn-primary" disabled={saving || !form.name.trim()}>
                            {saving ? 'Saving...' : 'Add Location'}
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="admin-loading">Loading locations...</div>
            ) : locations.length === 0 ? (
                <div className="admin-empty">No locations yet. Click "Add Location" to create one.</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Map URL</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((loc) => (
                                <tr key={loc.id}>
                                    {editingId === loc.id ? (
                                        <>
                                            <td>
                                                <input className="admin-input-inline" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
                                            </td>
                                            <td>
                                                <input className="admin-input-inline" value={form.map_url} onChange={(e) => setForm({ ...form, map_url: e.target.value })} />
                                            </td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => handleUpdate(loc.id)} className="admin-btn-save" disabled={saving}>Save</button>
                                                    <button onClick={cancelEdit} className="admin-btn-cancel">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="admin-cell-primary">{loc.name}</td>
                                            <td className="admin-cell-secondary">{loc.map_url ? 'Set' : '—'}</td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => startEdit(loc)} className="admin-btn-edit">Edit</button>
                                                    <button onClick={() => handleDelete(loc.id, loc.name)} className="admin-btn-delete">Delete</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
