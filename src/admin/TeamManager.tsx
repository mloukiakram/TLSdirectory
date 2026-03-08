import { useState, useEffect } from 'react';
import { getTeams, getUnits, addTeam, updateTeam, deleteTeam } from '../lib/dataService';

interface TeamRow {
    id: string;
    name: string;
    unit_id: string;
    units?: { name: string; location_id: string; locations?: { name: string } | null } | null;
}

interface UnitOption {
    id: string;
    name: string;
    location_id: string;
}

export default function TeamManager() {
    const [teams, setTeams] = useState<TeamRow[]>([]);
    const [units, setUnits] = useState<UnitOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', unit_id: '' });

    const load = async () => {
        setLoading(true);
        const [t, u] = await Promise.all([getTeams(), getUnits()]);
        setTeams(t);
        setUnits(u);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.name.trim() || !form.unit_id) return;
        setSaving(true);
        await addTeam({ name: form.name, unit_id: form.unit_id });
        setForm({ name: '', unit_id: '' });
        setShowAdd(false);
        setSaving(false);
        load();
    };

    const handleUpdate = async (id: string) => {
        if (!form.name.trim() || !form.unit_id) return;
        setSaving(true);
        await updateTeam(id, { name: form.name, unit_id: form.unit_id });
        setEditingId(null);
        setForm({ name: '', unit_id: '' });
        setSaving(false);
        load();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete team "${name}" and ALL its members?`)) return;
        await deleteTeam(id);
        load();
    };

    const startEdit = (t: TeamRow) => {
        setEditingId(t.id);
        setShowAdd(false);
        setForm({ name: t.name, unit_id: t.unit_id });
    };

    const cancelEdit = () => { setEditingId(null); setShowAdd(false); setForm({ name: '', unit_id: '' }); };

    const getUnitLabel = (t: TeamRow) => {
        const unitName = t.units?.name || units.find(u => u.id === t.unit_id)?.name || '—';
        const locName = t.units?.locations?.name || '';
        return locName ? `${unitName} (${locName})` : unitName;
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">Teams</h2>
                <button onClick={() => { setShowAdd(true); setEditingId(null); setForm({ name: '', unit_id: units[0]?.id || '' }); }} className="admin-btn-primary">+ Add Team</button>
            </div>

            {showAdd && (
                <div className="admin-form-card">
                    <h3 className="admin-form-title">New Team</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Team Name *</label>
                            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gmail Team" autoFocus />
                        </div>
                        <div className="admin-field">
                            <label>Parent Unit *</label>
                            <select className="admin-select" value={form.unit_id} onChange={(e) => setForm({ ...form, unit_id: e.target.value })}>
                                <option value="">Select unit...</option>
                                {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button onClick={cancelEdit} className="admin-btn-secondary">Cancel</button>
                        <button onClick={handleAdd} className="admin-btn-primary" disabled={saving || !form.name.trim() || !form.unit_id}>{saving ? 'Saving...' : 'Add Team'}</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="admin-loading">Loading teams...</div>
            ) : teams.length === 0 ? (
                <div className="admin-empty">No teams yet.</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Parent Unit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((t) => (
                                <tr key={t.id}>
                                    {editingId === t.id ? (
                                        <>
                                            <td><input className="admin-input-inline" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
                                            <td>
                                                <select className="admin-select-inline" value={form.unit_id} onChange={(e) => setForm({ ...form, unit_id: e.target.value })}>
                                                    {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => handleUpdate(t.id)} className="admin-btn-save" disabled={saving}>Save</button>
                                                    <button onClick={cancelEdit} className="admin-btn-cancel">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="admin-cell-primary">{t.name}</td>
                                            <td className="admin-cell-secondary">{getUnitLabel(t)}</td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => startEdit(t)} className="admin-btn-edit">Edit</button>
                                                    <button onClick={() => handleDelete(t.id, t.name)} className="admin-btn-delete">Delete</button>
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
