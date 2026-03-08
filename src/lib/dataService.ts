import { supabase } from './supabaseClient';
import type { CompanyStructure, Member, Unit, Team, LocationSection } from '../types';

// ─── READ ─────────────────────────────────────────────────────
export async function fetchCompanyData(): Promise<CompanyStructure> {
    const [execRes, locRes, unitRes, teamRes, memberRes] = await Promise.all([
        supabase.from('executives').select('*').order('position'),
        supabase.from('locations').select('*').order('position'),
        supabase.from('units').select('*').order('position'),
        supabase.from('teams').select('*').order('position'),
        supabase.from('members').select('*').order('position'),
    ]);

    const executives: Member[] = (execRes.data || []).map((e) => ({
        name: e.name,
        role: e.role || undefined,
        telegram: e.telegram || undefined,
        location: e.location || undefined,
    }));

    const membersRaw = memberRes.data || [];
    const teamsRaw = teamRes.data || [];
    const unitsRaw = unitRes.data || [];
    const locationsRaw = locRes.data || [];

    const teamMap = new Map<string, Team>();
    for (const t of teamsRaw) {
        teamMap.set(t.id, {
            id: t.id,
            name: t.name,
            members: [],
        });
    }

    for (const m of membersRaw) {
        const team = teamMap.get(m.team_id);
        if (team) {
            team.members.push({
                name: m.name,
                role: m.role || undefined,
                telegram: m.telegram || undefined,
            });
        }
    }

    const unitMap = new Map<string, Unit>();
    for (const u of unitsRaw) {
        unitMap.set(u.id, {
            id: u.id,
            name: u.name,
            type: u.type as 'unit' | 'special' | undefined,
            supervisor: u.supervisor_name
                ? { name: u.supervisor_name, role: u.supervisor_role || undefined, telegram: u.supervisor_telegram || undefined }
                : undefined,
            teams: [],
        });
    }

    for (const t of teamsRaw) {
        const unit = unitMap.get(t.unit_id);
        const team = teamMap.get(t.id);
        if (unit && team) {
            unit.teams.push(team);
        }
    }

    const locations: LocationSection[] = locationsRaw.map((loc) => ({
        id: loc.id,
        name: loc.name,
        mapUrl: loc.map_url || undefined,
        units: [],
    }));

    for (const u of unitsRaw) {
        const loc = locations.find((l) => l.id === u.location_id);
        const unit = unitMap.get(u.id);
        if (loc && unit) {
            loc.units.push(unit);
        }
    }

    return { executives, locations };
}

// ─── ADMIN PASSWORD ───────────────────────────────────────────
export async function verifyAdminPassword(password: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('admin_config')
        .select('value')
        .eq('key', 'admin_password')
        .single();
    if (error || !data) return false;
    return data.value === password;
}

export async function updateAdminPassword(newPassword: string): Promise<boolean> {
    const { error } = await supabase
        .from('admin_config')
        .upsert({ key: 'admin_password', value: newPassword });
    return !error;
}

// ─── EXECUTIVES ───────────────────────────────────────────────
export async function getExecutives() {
    const { data } = await supabase.from('executives').select('*').order('position');
    return data || [];
}

export async function addExecutive(exec: { name: string; role?: string; telegram?: string; location?: string }) {
    const { data, error } = await supabase.from('executives').insert(exec).select().single();
    return { data, error };
}

export async function updateExecutive(id: string, updates: { name?: string; role?: string; telegram?: string; location?: string }) {
    const { data, error } = await supabase.from('executives').update(updates).eq('id', id).select().single();
    return { data, error };
}

export async function deleteExecutive(id: string) {
    const { error } = await supabase.from('executives').delete().eq('id', id);
    return { error };
}

// ─── LOCATIONS ────────────────────────────────────────────────
export async function getLocations() {
    const { data } = await supabase.from('locations').select('*').order('position');
    return data || [];
}

export async function addLocation(loc: { name: string; map_url?: string }) {
    const { data, error } = await supabase.from('locations').insert(loc).select().single();
    return { data, error };
}

export async function updateLocation(id: string, updates: { name?: string; map_url?: string }) {
    const { data, error } = await supabase.from('locations').update(updates).eq('id', id).select().single();
    return { data, error };
}

export async function deleteLocation(id: string) {
    const { error } = await supabase.from('locations').delete().eq('id', id);
    return { error };
}

// ─── UNITS ────────────────────────────────────────────────────
export async function getUnits() {
    const { data } = await supabase.from('units').select('*, locations(name)').order('position');
    return data || [];
}

export async function addUnit(unit: { name: string; type?: string; location_id: string; supervisor_name?: string; supervisor_role?: string; supervisor_telegram?: string }) {
    const { data, error } = await supabase.from('units').insert(unit).select().single();
    return { data, error };
}

export async function updateUnit(id: string, updates: Partial<{ name: string; type: string; location_id: string; supervisor_name: string; supervisor_role: string; supervisor_telegram: string }>) {
    const { data, error } = await supabase.from('units').update(updates).eq('id', id).select().single();
    return { data, error };
}

export async function deleteUnit(id: string) {
    const { error } = await supabase.from('units').delete().eq('id', id);
    return { error };
}

// ─── TEAMS ────────────────────────────────────────────────────
export async function getTeams() {
    const { data } = await supabase.from('teams').select('*, units(name, location_id, locations(name))').order('position');
    return data || [];
}

export async function addTeam(team: { name: string; unit_id: string }) {
    const { data, error } = await supabase.from('teams').insert(team).select().single();
    return { data, error };
}

export async function updateTeam(id: string, updates: { name?: string; unit_id?: string }) {
    const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select().single();
    return { data, error };
}

export async function deleteTeam(id: string) {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    return { error };
}

// ─── MEMBERS ──────────────────────────────────────────────────
export async function getMembers() {
    const { data } = await supabase.from('members').select('*, teams(name, unit_id, units(name, location_id, locations(name)))').order('position');
    return data || [];
}

export async function addMember(member: { name: string; role?: string; telegram?: string; team_id: string }) {
    const { data, error } = await supabase.from('members').insert(member).select().single();
    return { data, error };
}

export async function updateMember(id: string, updates: { name?: string; role?: string; telegram?: string; team_id?: string }) {
    const { data, error } = await supabase.from('members').update(updates).eq('id', id).select().single();
    return { data, error };
}

export async function deleteMember(id: string) {
    const { error } = await supabase.from('members').delete().eq('id', id);
    return { error };
}
