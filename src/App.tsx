import { useState, useMemo, useEffect } from 'react';
import { companyData } from './data/companyData';
import { MemberModal } from './components/MemberModal';
import { MapModal } from './components/MapModal';
import { Spotlight } from './components/Spotlight';
import { AnimatedCounter } from './components/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';
import type { Member, Unit, Team } from './types';

function App() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [mapModal, setMapModal] = useState<{ url: string; name: string } | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get all units based on selection
  const allUnits = useMemo(() => {
    if (selectedLocationId === 'all') {
      return companyData.locations.flatMap(loc => loc.units);
    }
    const loc = companyData.locations.find(l => l.id === selectedLocationId);
    return loc ? loc.units : [];
  }, [selectedLocationId]);

  // For stats: California only counts GM* units, others count all
  const unitsForStats = useMemo(() => {
    if (selectedLocationId === 'all') {
      // For "All": count everything from all locations
      return companyData.locations.flatMap(loc => loc.units);
    }

    const loc = companyData.locations.find(l => l.id === selectedLocationId);
    if (!loc) return [];

    // Only California filters for GM* units
    if (loc.name.toLowerCase().includes('california')) {
      return loc.units.filter(u => u.name.toUpperCase().startsWith('GM'));
    }

    // All other locations: count all units
    return loc.units;
  }, [selectedLocationId]);

  const stats = useMemo(() => {
    const totalUnits = unitsForStats.length;
    const totalTeams = unitsForStats.reduce((acc, u) => acc + u.teams.length, 0);
    const totalMembers = unitsForStats.reduce((acc, u) =>
      acc + u.teams.reduce((a, t) => a + t.members.length, 0), 0);
    return { totalUnits, totalTeams, totalMembers };
  }, [unitsForStats]);

  const handleLocationSelect = (locId: string) => {
    setSelectedLocationId(locId);
    setSelectedUnit(null);
    setSelectedTeam(null);
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setSelectedTeam(unit.teams[0] || null);
  };

  const selectedLocation = companyData.locations.find(l => l.id === selectedLocationId);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="nav shrink-0">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Traffic Loop" className="w-10 h-10 rounded-xl object-cover" />
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-[var(--text-primary)]">Traffic Loop</h1>
              <p className="text-xs text-[var(--text-quaternary)]">Team Directory</p>
            </div>
          </div>

          {/* Location Tabs with ALL */}
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-full p-1.5">
            <button
              onClick={() => handleLocationSelect('all')}
              className={`location-tab ${selectedLocationId === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            {companyData.locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleLocationSelect(loc.id)}
                className={`location-tab ${selectedLocationId === loc.id ? 'active' : ''}`}
              >
                {selectedLocationId === loc.id
                  ? loc.name
                  : (loc.name.length > 16 ? loc.name.substring(0, 14) + '...' : loc.name)
                }
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSpotlightOpen(true)}
              className="btn-secondary flex items-center gap-3"
            >
              <span className="text-sm">Search</span>
              <kbd className="text-[11px] text-[var(--text-quaternary)] px-2 py-0.5 bg-[var(--bg-elevated)] rounded text-mono">⌘K</kbd>
            </button>
            {selectedLocation?.mapUrl && (
              <button
                onClick={() => setMapModal({ url: selectedLocation.mapUrl!, name: selectedLocation.name })}
                className="btn-secondary"
              >
                Map
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Layout - Fixed height, no page scroll */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar - Scrollable independently */}
        <aside className="sidebar w-80 shrink-0 flex flex-col min-h-0">
          {/* Leadership - PINNED ON TOP (not scrollable) */}
          {companyData.executives.length > 0 && (
            <div className="leadership-section shrink-0">
              <p className="text-[11px] font-bold text-[var(--text-quaternary)] uppercase tracking-widest mb-3">
                Leadership
              </p>
              <div className="space-y-1">
                {companyData.executives.map((exec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedMember(exec)}
                    className="leadership-item"
                  >
                    <div className="avatar w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold">
                      {exec.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{exec.name}</h4>
                      <p className="text-xs text-[var(--text-tertiary)]">{exec.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="p-5 grid grid-cols-3 gap-3 shrink-0">
            <div className="stat-card">
              <div className="stat-value"><AnimatedCounter value={stats.totalUnits} /></div>
              <div className="stat-label">Units</div>
            </div>
            <div className="stat-card">
              <div className="stat-value"><AnimatedCounter value={stats.totalTeams} /></div>
              <div className="stat-label">Teams</div>
            </div>
            <div className="stat-card">
              <div className="stat-value"><AnimatedCounter value={stats.totalMembers} /></div>
              <div className="stat-label">People</div>
            </div>
          </div>

          <div className="divider mx-5 shrink-0" />

          {/* Units - SCROLLABLE SECTION */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <p className="text-[11px] font-bold text-[var(--text-quaternary)] uppercase tracking-widest px-4 mb-3">
              Units
            </p>
            <div className="space-y-1">
              {allUnits.map((unit, idx) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => handleUnitSelect(unit)}
                  className={`unit-item ${selectedUnit?.id === unit.id ? 'active' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${selectedUnit?.id === unit.id ? 'bg-white/20' : 'avatar'
                    }`}>
                    {unit.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{unit.name}</h4>
                    {unit.supervisor && (
                      <p className={`text-xs truncate unit-sub ${selectedUnit?.id === unit.id ? '' : 'text-[var(--text-tertiary)]'}`}>
                        {unit.supervisor.name}
                      </p>
                    )}
                  </div>
                  <span className={`unit-badge text-xs font-semibold px-2 py-1 rounded-md ${selectedUnit?.id === unit.id ? '' : 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)]'
                    }`}>
                    {unit.teams.reduce((acc, t) => acc + t.members.length, 0)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Scrollable independently */}
        <main className="flex-1 p-8 lg:p-10 overflow-y-auto bg-[var(--bg-primary)] min-h-0">
          <AnimatePresence mode="wait">
            {selectedUnit ? (
              <motion.div
                key={selectedUnit.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="mb-10">
                  <div className="flex items-center gap-6">
                    <div className="avatar w-20 h-20 rounded-2xl flex items-center justify-center text-2xl">
                      {selectedUnit.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="heading-xl">{selectedUnit.name}</h1>
                      {selectedUnit.supervisor && (
                        <p
                          className="text-[var(--text-tertiary)] mt-2 cursor-pointer hover:text-[var(--text-secondary)] transition-colors text-base"
                          onClick={() => setSelectedMember(selectedUnit.supervisor!)}
                        >
                          Supervised by <span className="text-[var(--text-primary)] font-medium">{selectedUnit.supervisor.name}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Team Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
                  {selectedUnit.teams.map((team, idx) => (
                    <motion.button
                      key={team.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => setSelectedTeam(team)}
                      className={`team-tab flex items-center gap-3 ${selectedTeam?.id === team.id ? 'active' : ''}`}
                    >
                      {team.name}
                      <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${selectedTeam?.id === team.id ? 'bg-white/20' : 'bg-[var(--bg-elevated)]'
                        }`}>
                        {team.members.length}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Members Grid */}
                <AnimatePresence mode="wait">
                  {selectedTeam && (
                    <motion.div
                      key={selectedTeam.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                      {selectedTeam.members.map((member, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => setSelectedMember({
                            ...member,
                            teamName: selectedTeam.name,
                            unitName: selectedUnit.name,
                            location: selectedLocation?.name
                          })}
                          className="member-card group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${member.role?.toLowerCase().includes('lead') ? 'avatar' : 'avatar-subtle'
                              }`}>
                              {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-[var(--text-primary)] truncate">
                                {member.name}
                              </h4>
                              {member.role && (
                                <span className="badge-dark text-[10px] font-bold uppercase tracking-wider inline-block mt-2">
                                  {member.role}
                                </span>
                              )}
                              {member.telegram && (
                                <p className="text-xs text-[var(--text-quaternary)] mt-2 truncate text-mono">{member.telegram}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center max-w-md">
                  <img src="/logo.png" alt="Traffic Loop" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-8" />
                  <h2 className="heading-lg mb-4">Welcome to Traffic Loop</h2>
                  <p className="text-[var(--text-tertiary)] mb-8 text-base leading-relaxed">
                    Select a unit from the sidebar to explore teams and members.
                  </p>
                  <button
                    onClick={() => setSpotlightOpen(true)}
                    className="btn-primary inline-flex items-center gap-3"
                  >
                    Quick Search
                    <kbd className="text-xs opacity-60 text-mono">⌘K</kbd>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Spotlight isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} onSelectMember={setSelectedMember} />
      {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      {mapModal && <MapModal mapUrl={mapModal.url} locationName={mapModal.name} onClose={() => setMapModal(null)} />}
    </div>
  );
}

export default App;
