import { motion, AnimatePresence } from 'framer-motion';
import type { Member } from '../types';

interface MemberModalProps {
    member: Member | null;
    onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ member, onClose }) => {
    if (!member) return null;

    const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const handleTelegram = () => {
        if (member.telegram) {
            const tg = member.telegram.replace('@', '').replace('+', '');
            window.open(`https://t.me/${tg}`, '_blank');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 16 }}
                    transition={{ duration: 0.2 }}
                    className="modal-content w-full max-w-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all text-xl"
                    >
                        ×
                    </button>

                    <div className="p-8">
                        {/* Avatar */}
                        <div className="avatar w-24 h-24 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                            {initials}
                        </div>

                        {/* Name */}
                        <h2 className="mt-6 text-2xl font-bold text-center text-[var(--text-primary)]">
                            {member.name}
                        </h2>

                        {/* Role */}
                        {member.role && (
                            <div className="text-center mt-3">
                                <span className="badge-dark px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {member.role}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="px-8 pb-8 space-y-3">
                        {member.location && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-secondary)] text-lg">
                                    ◉
                                </div>
                                <div>
                                    <p className="text-[10px] text-[var(--text-quaternary)] uppercase tracking-widest font-bold">Location</p>
                                    <p className="text-sm text-[var(--text-primary)] font-medium">{member.location}</p>
                                </div>
                            </div>
                        )}

                        {member.telegram && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-secondary)] font-bold">
                                    @
                                </div>
                                <div>
                                    <p className="text-[10px] text-[var(--text-quaternary)] uppercase tracking-widest font-bold">Telegram</p>
                                    <p className="text-sm text-[var(--text-primary)] font-medium text-mono">{member.telegram}</p>
                                </div>
                            </div>
                        )}

                        {member.telegram && (
                            <button
                                onClick={handleTelegram}
                                className="w-full mt-4 btn-primary rounded-xl text-sm"
                            >
                                Message on Telegram
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
