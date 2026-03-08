import { useState, useEffect } from 'react';
import { getUnits, getLocations, addUnit, updateUnit, deleteUnit } from '../lib/dataService';

interface UnitRow {
    id: string;
    name: string;
    type: string;
    location_id: string;
    supervisor_name: string | null;
    supervisor_role: string | null;
    supervisor_telegram: string | null;
    locations?: { name: string } | null;
}

interface LocOption {
    id: string;
    name: string;
}

export default function UnitManager() {
    const [units, setUnits] = useState<UnitRow[]>([]);
    const [locations, setLocations] = useState<LocOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', type: 'unit', location_id: '',
        supervisor_name: '', supervisor_role: '', supervisor_telegram: '',
    });

    const load = async () => {
        setLoading(true);
        const [u, l] = await Promise.all([getUnits(), getLocations()]);
        setUnits(u);
        setLocations(l);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => setForm({ name: '', type: 'unit', location_id: '', supervisor_name: '', supervisor_role: '', supervisor_telegram: '' });

    const handleAdd = async () => {
        if (!form.name.trim() || !form.location_id) return;
        setSaving(true);
        await addUnit({
            name: form.name,
            type: form.type,
            location_id: form.location_id,
            supervisor_name: form.supervisor_name || undefined,
            supervisor_role: form.supervisor_role || undefined,
            supervisor_telegram: form.supervisor_telegram || undefined,
        });
        resetForm();
        setShowAdd(false);
        setSaving(false);
        load();
    };

    const handleUpdate = async (id: string) => {
        if (!form.name.trim() || !form.location_id) return;
        setSaving(true);
        await updateUnit(id, {
            name: form.name,
            type: form.type,
            location_id: form.location_id,
            supervisor_name: form.supervisor_name || '',
            supervisor_role: form.supervisor_role || '',
            supervisor_telegram: form.supervisor_telegram || '',
        });
        setEditingId(null);
        resetForm();
        setSaving(false);
        load();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete unit "${name}" and ALL its teams and members?`)) return;
        await deleteUnit(id);
        load();
    };

    const startEdit = (u: UnitRow) => {
        setEditingId(u.id);
        setShowAdd(false);
        setForm({
            name: u.name,
            type: u.type || 'unit',
            location_id: u.location_id,
            supervisor_name: u.supervisor_name || '',
            supervisor_role: u.supervisor_role || '',
            supervisor_telegram: u.supervisor_telegram || '',
        });
    };

    const cancelEdit = () => { setEditingId(null); setShowAdd(false); resetForm(); };

    const getLocName = (locId: string) => locations.find((l) => l.id === locId)?.name || '—';

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">Units</h2>
                <button onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); if (locations.length) setForm(f => ({ ...f, location_id: locations[0].id })); }} className="admin-btn-primary">+ Add Unit</button>
            </div>

            {showAdd && (
                <div className="admin-form-card">
                    <h3 className="admin-form-title">New Unit</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Name *</label>
                            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. GML" autoFocus />
                        </div>
                        <div className="admin-field">
                            <label>Location *</label>
                            <select className="admin-select" value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })}>
                                <option value="">Select location...</option>
                                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Type</label>
                            <select className="admin-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                <option value="unit">Unit</option>
                                <option value="special">Special</option>
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Supervisor Name</label>
                            <input className="admin-input" value={form.supervisor_name} onChange={(e) => setForm({ ...form, supervisor_name: e.target.value })} placeholder="Optional" />
                        </div>
                        <div className="admin-field">
                            <label>Supervisor Role</label>
                            <input className="admin-input" value={form.supervisor_role} onChange={(e) => setForm({ ...form, supervisor_role: e.target.value })} placeholder="Optional" />
                        </div>
                        <div className="admin-field">
                            <label>Supervisor Telegram</label>
                            <input className="admin-input" value={form.supervisor_telegram} onChange={(e) => setForm({ ...form, supervisor_telegram: e.target.value })} placeholder="Optional" />
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button onClick={cancelEdit} className="admin-btn-secondary">Cancel</button>
                        <button onClick={handleAdd} className="admin-btn-primary" disabled={saving || !form.name.trim() || !form.location_id}>{saving ? 'Saving...' : 'Add Unit'}</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="admin-loading">Loading units...</div>
            ) : units.length === 0 ? (
                <div className="admin-empty">No units yet.</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Supervisor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((u) => (
                                <tr key={u.id}>
                                    {editingId === u.id ? (
                                        <>
                                            <td><input className="admin-input-inline" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
                                            <td>
                                                <select className="admin-select-inline" value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })}>
                                                    {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <select className="admin-select-inline" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                                    <option value="unit">Unit</option>
                                                    <option value="special">Special</option>
                                                </select>
                                            </td>
                                            <td><input className="admin-input-inline" value={form.supervisor_name} onChange={(e) => setForm({ ...form, supervisor_name: e.target.value })} placeholder="Name" /></td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => handleUpdate(u.id)} className="admin-btn-save" disabled={saving}>Save</button>
                                                    <button onClick={cancelEdit} className="admin-btn-cancel">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="admin-cell-primary">{u.name}</td>
                                            <td className="admin-cell-secondary">{getLocName(u.location_id)}</td>
                                            <td><span className={`admin-badge ${u.type === 'special' ? 'special' : ''}`}>{u.type}</span></td>
                                            <td className="admin-cell-secondary">{u.supervisor_name || '—'}</td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => startEdit(u)} className="admin-btn-edit">Edit</button>
                                                    <button onClick={() => handleDelete(u.id, u.name)} className="admin-btn-delete">Delete</button>
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
