import { useState, useEffect } from 'react';
import { getMembers, getTeams, addMember, updateMember, deleteMember } from '../lib/dataService';

interface MemberRow {
    id: string;
    name: string;
    role: string | null;
    telegram: string | null;
    team_id: string;
    teams?: {
        name: string;
        unit_id: string;
        units?: { name: string; location_id: string; locations?: { name: string } | null } | null;
    } | null;
}

interface TeamOption {
    id: string;
    name: string;
    units?: { name: string; locations?: { name: string } | null } | null;
}

export default function MemberManager() {
    const [members, setMembers] = useState<MemberRow[]>([]);
    const [teams, setTeams] = useState<TeamOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', role: '', telegram: '', team_id: '' });

    const load = async () => {
        setLoading(true);
        const [m, t] = await Promise.all([getMembers(), getTeams()]);
        setMembers(m);
        setTeams(t);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.name.trim() || !form.team_id) return;
        setSaving(true);
        await addMember({ name: form.name, role: form.role || undefined, telegram: form.telegram || undefined, team_id: form.team_id });
        setForm({ name: '', role: '', telegram: '', team_id: '' });
        setShowAdd(false);
        setSaving(false);
        load();
    };

    const handleUpdate = async (id: string) => {
        if (!form.name.trim() || !form.team_id) return;
        setSaving(true);
        await updateMember(id, { name: form.name, role: form.role || undefined, telegram: form.telegram || undefined, team_id: form.team_id });
        setEditingId(null);
        setForm({ name: '', role: '', telegram: '', team_id: '' });
        setSaving(false);
        load();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete member "${name}"?`)) return;
        await deleteMember(id);
        load();
    };

    const startEdit = (m: MemberRow) => {
        setEditingId(m.id);
        setShowAdd(false);
        setForm({ name: m.name, role: m.role || '', telegram: m.telegram || '', team_id: m.team_id });
    };

    const cancelEdit = () => { setEditingId(null); setShowAdd(false); setForm({ name: '', role: '', telegram: '', team_id: '' }); };

    const getTeamLabel = (t: TeamOption) => {
        const unitName = t.units?.name || '';
        const locName = t.units?.locations?.name || '';
        const parts = [t.name];
        if (unitName) parts.push(unitName);
        if (locName) parts.push(locName);
        return parts.join(' → ');
    };

    const getMemberPath = (m: MemberRow) => {
        const teamName = m.teams?.name || '';
        const unitName = m.teams?.units?.name || '';
        const locName = m.teams?.units?.locations?.name || '';
        return [locName, unitName, teamName].filter(Boolean).join(' → ');
    };

    const filtered = members.filter((m) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q) ||
            (m.role && m.role.toLowerCase().includes(q)) ||
            (m.telegram && m.telegram.toLowerCase().includes(q)) ||
            getMemberPath(m).toLowerCase().includes(q);
    });

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">Members</h2>
                <div className="admin-header-actions">
                    <input
                        className="admin-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search members..."
                    />
                    <button onClick={() => { setShowAdd(true); setEditingId(null); setForm({ name: '', role: '', telegram: '', team_id: teams[0]?.id || '' }); }} className="admin-btn-primary">+ Add Member</button>
                </div>
            </div>

            {showAdd && (
                <div className="admin-form-card">
                    <h3 className="admin-form-title">New Member</h3>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Name *</label>
                            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" autoFocus />
                        </div>
                        <div className="admin-field">
                            <label>Role</label>
                            <input className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Team Leader" />
                        </div>
                        <div className="admin-field">
                            <label>Telegram</label>
                            <input className="admin-input" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="@handle or phone" />
                        </div>
                        <div className="admin-field">
                            <label>Team *</label>
                            <select className="admin-select" value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })}>
                                <option value="">Select team...</option>
                                {teams.map((t) => <option key={t.id} value={t.id}>{getTeamLabel(t)}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button onClick={cancelEdit} className="admin-btn-secondary">Cancel</button>
                        <button onClick={handleAdd} className="admin-btn-primary" disabled={saving || !form.name.trim() || !form.team_id}>{saving ? 'Saving...' : 'Add Member'}</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="admin-loading">Loading members...</div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">{search ? 'No members match your search.' : 'No members yet.'}</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Telegram</th>
                                <th>Team Path</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((m) => (
                                <tr key={m.id}>
                                    {editingId === m.id ? (
                                        <>
                                            <td><input className="admin-input-inline" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
                                            <td><input className="admin-input-inline" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" /></td>
                                            <td><input className="admin-input-inline" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="Telegram" /></td>
                                            <td>
                                                <select className="admin-select-inline" value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })}>
                                                    {teams.map((t) => <option key={t.id} value={t.id}>{getTeamLabel(t)}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => handleUpdate(m.id)} className="admin-btn-save" disabled={saving}>Save</button>
                                                    <button onClick={cancelEdit} className="admin-btn-cancel">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="admin-cell-primary">{m.name}</td>
                                            <td className="admin-cell-secondary">{m.role || '—'}</td>
                                            <td className="admin-cell-mono">{m.telegram || '—'}</td>
                                            <td className="admin-cell-path">{getMemberPath(m)}</td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <button onClick={() => startEdit(m)} className="admin-btn-edit">Edit</button>
                                                    <button onClick={() => handleDelete(m.id, m.name)} className="admin-btn-delete">Delete</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="admin-table-footer">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</div>
                </div>
            )}
        </div>
    );
}
