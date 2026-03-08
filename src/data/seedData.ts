/**
 * Seed script — Run this ONCE to populate Supabase with the existing hardcoded data.
 * Usage: import and call seedDatabase() from a browser console or a temporary button.
 */
import { supabase } from '../lib/supabaseClient';
import { companyData } from './companyData';

export async function seedDatabase() {
    console.log('Seeding database...');

    // 1. Clear existing data (in dependency order)
    await supabase.from('members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('units').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('locations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('executives').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert executives
    for (let i = 0; i < companyData.executives.length; i++) {
        const exec = companyData.executives[i];
        await supabase.from('executives').insert({
            name: exec.name,
            role: exec.role || null,
            telegram: exec.telegram || null,
            location: exec.location || null,
            position: i,
        });
    }
    console.log('Executives seeded');

    // 3. Insert locations → units → teams → members
    for (let li = 0; li < companyData.locations.length; li++) {
        const loc = companyData.locations[li];

        const { data: locData, error: locErr } = await supabase
            .from('locations')
            .insert({ name: loc.name, map_url: loc.mapUrl || null, position: li })
            .select()
            .single();

        if (locErr || !locData) {
            console.error('❌ Location insert failed:', loc.name, locErr);
            continue;
        }

        for (let ui = 0; ui < loc.units.length; ui++) {
            const unit = loc.units[ui];

            const { data: unitData, error: unitErr } = await supabase
                .from('units')
                .insert({
                    name: unit.name,
                    type: unit.type || 'unit',
                    location_id: locData.id,
                    supervisor_name: unit.supervisor?.name || null,
                    supervisor_role: unit.supervisor?.role || null,
                    supervisor_telegram: unit.supervisor?.telegram || null,
                    position: ui,
                })
                .select()
                .single();

            if (unitErr || !unitData) {
                console.error('❌ Unit insert failed:', unit.name, unitErr);
                continue;
            }

            for (let ti = 0; ti < unit.teams.length; ti++) {
                const team = unit.teams[ti];

                const { data: teamData, error: teamErr } = await supabase
                    .from('teams')
                    .insert({ name: team.name, unit_id: unitData.id, position: ti })
                    .select()
                    .single();

                if (teamErr || !teamData) {
                    console.error('❌ Team insert failed:', team.name, teamErr);
                    continue;
                }

                const memberInserts = team.members.map((m, mi) => ({
                    name: m.name,
                    role: m.role || null,
                    telegram: m.telegram || null,
                    team_id: teamData.id,
                    position: mi,
                }));

                if (memberInserts.length > 0) {
                    const { error: memErr } = await supabase.from('members').insert(memberInserts);
                    if (memErr) {
                        console.error('❌ Members insert failed for team:', team.name, memErr);
                    }
                }
            }
        }
    }

    // 4. Insert admin password
    await supabase
        .from('admin_config')
        .upsert({ key: 'admin_password', value: 'tls-admin26' });

    console.log('Database seeded successfully!');
    return true;
}
