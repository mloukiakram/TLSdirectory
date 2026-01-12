import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users } from 'lucide-react';
import type { Unit, Member, Team } from '../types';
import { MemberCard } from './MemberCard';

interface UnitCardProps {
    unit: Unit;
    onMemberClick: (member: Member) => void;
    forceExpand?: boolean;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onMemberClick, forceExpand }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTeam, setActiveTeam] = useState<Team | null>(null);
    const totalMembers = unit.teams.reduce((acc, team) => acc + team.members.length, 0);

    useEffect(() => {
        if (forceExpand === true) {
            setIsExpanded(true);
            if (unit.teams.length > 0 && !activeTeam) {
                setActiveTeam(unit.teams[0]);
            }
        } else if (forceExpand === false) {
            setIsExpanded(false);
            setActiveTeam(null);
        }
    }, [forceExpand]);

    const handleExpand = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            if (unit.teams.length > 0) {
                setActiveTeam(unit.teams[0]);
            }
        } else {
            setIsExpanded(false);
            setActiveTeam(null);
        }
    };

    const handleTeamClick = (team: Team) => {
        setActiveTeam(activeTeam?.id === team.id ? null : team);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`unit-card ${isExpanded ? 'expanded' : ''}`}
        >
            {/* Header */}
            <div
                onClick={handleExpand}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/20 transition-colors duration-150"
            >
                <div className="flex items-center gap-4">
                    {unit.supervisor ? (
                        <>
                            <div
                                onClick={(e) => { e.stopPropagation(); onMemberClick(unit.supervisor!); }}
                                className="avatar w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold cursor-pointer shadow-lg hover:scale-105 transition-transform duration-150"
                            >
                                {unit.supervisor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{unit.name}</h4>
                                <p className="text-sm text-gray-500">{unit.supervisor.name}</p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">{unit.name}</h4>
                            <p className="text-sm text-gray-400">Unit</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge px-3 py-1.5 rounded-xl text-xs font-bold">
                        {totalMembers}
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={20} className="text-gray-400" />
                    </motion.div>
                </div>
            </div>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/50">
                            {/* Team Pills */}
                            <div className="p-5 flex flex-wrap gap-3">
                                {unit.teams.map((team, idx) => (
                                    <motion.button
                                        key={team.id || idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03, duration: 0.15 }}
                                        onClick={() => handleTeamClick(team)}
                                        className={`team-pill ${activeTeam?.id === team.id ? 'active' : ''}`}
                                    >
                                        <Users size={15} />
                                        <span className="text-sm font-medium">{team.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${activeTeam?.id === team.id ? 'bg-white/20' : 'bg-white/60'
                                            }`}>
                                            {team.members.length}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Members Panel */}
                            <AnimatePresence mode="wait">
                                {activeTeam && (
                                    <motion.div
                                        key={activeTeam.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t border-white/30 bg-white/20"
                                    >
                                        <div className="p-5 grid gap-2">
                                            {activeTeam.members.map((member, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.025, duration: 0.15 }}
                                                >
                                                    <MemberCard
                                                        member={member}
                                                        compact
                                                        onClick={() => onMemberClick(member)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
