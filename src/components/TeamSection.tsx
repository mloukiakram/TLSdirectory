import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import type { Team, Member } from '../types';
import { MemberCard } from './MemberCard';

interface TeamSectionProps {
    team: Team;
    onMemberClick: (member: Member) => void;
    forceExpand?: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team, onMemberClick, forceExpand }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Respond to force expand/collapse
    useEffect(() => {
        if (forceExpand !== undefined) {
            setIsExpanded(forceExpand);
        }
    }, [forceExpand]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -8 },
        show: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -8 }
    };

    return (
        <div className="border-b border-gray-100 last:border-0">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="team-header group"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors"
                    >
                        <ChevronRight size={12} className="text-gray-400 group-hover:text-purple-500" />
                    </motion.div>
                    <h5 className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                        {team.name}
                    </h5>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={12} className="text-gray-300" />
                    <span className="text-xs text-gray-400 font-medium">{team.members.length}</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        variants={containerVariants}
                        className="overflow-hidden pb-2 px-2"
                    >
                        {team.members.map((member, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <MemberCard
                                    member={member}
                                    compact
                                    onClick={() => onMemberClick(member)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
