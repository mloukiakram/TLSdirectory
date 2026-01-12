import { motion } from 'framer-motion';
import type { Member } from '../types';
import { ArrowRight } from 'lucide-react';

interface MemberCardProps {
    member: Member;
    compact?: boolean;
    onClick?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, compact = false, onClick }) => {
    const initials = member.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const isLead = member.role?.toLowerCase().includes('lead') ||
        member.role?.toLowerCase().includes('manager') ||
        member.role?.toLowerCase().includes('supervisor');

    if (compact) {
        return (
            <motion.div
                whileHover={{ x: 8, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={onClick}
                className="member-chip group"
            >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm transition-transform duration-150 group-hover:scale-105 ${isLead ? 'avatar' : 'avatar-light'
                    }`}>
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors duration-150 truncate">
                        {member.name}
                    </h4>
                    {member.role && (
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{member.role}</p>
                    )}
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-150" />
            </motion.div>
        );
    }

    // Full Card (Executive)
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="exec-card p-6 cursor-pointer group"
        >
            <div className="flex items-start gap-5">
                <div className="avatar w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shrink-0 transition-transform duration-150 group-hover:scale-105 group-hover:rotate-3">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight truncate group-hover:text-black transition-colors duration-150">
                        {member.name}
                    </h3>
                    {member.role && (
                        <span className="inline-block mt-2 badge-dark px-3 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider">
                            {member.role}
                        </span>
                    )}
                    {member.location && (
                        <p className="mt-3 text-sm text-gray-400 truncate">{member.location}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
