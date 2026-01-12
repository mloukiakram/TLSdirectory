import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Member } from '../types';
import { companyData } from '../data/companyData';

interface SpotlightProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMember: (member: Member) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onSelectMember }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const allMembers: (Member & { unitName?: string; teamName?: string })[] = [];
    companyData.executives.forEach(exec => {
        allMembers.push({ ...exec, unitName: 'Leadership' });
    });
    companyData.locations.forEach(loc => {
        loc.units.forEach(unit => {
            unit.teams.forEach(team => {
                team.members.forEach(member => {
                    allMembers.push({ ...member, unitName: unit.name, teamName: team.name });
                });
            });
            if (unit.supervisor) {
                allMembers.push({ ...unit.supervisor, unitName: unit.name, teamName: 'Supervisor' });
            }
        });
    });

    const results = query.trim()
        ? allMembers.filter(m =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.role?.toLowerCase().includes(query.toLowerCase()) ||
            m.unitName?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
        : allMembers.slice(0, 6);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        setQuery('');
        setSelectedIndex(0);
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            onSelectMember(results[selectedIndex]);
            onClose();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: -12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -12 }}
                    transition={{ duration: 0.15 }}
                    className="w-full max-w-2xl modal-content overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-4 px-6 py-5 border-b border-[var(--border-subtle)]">
                        <span className="text-[var(--text-tertiary)]">⌕</span>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for anyone..."
                            value={query}
                            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none text-lg text-[var(--text-primary)] placeholder:text-[var(--text-quaternary)] font-medium"
                        />
                        <kbd className="text-[11px] text-[var(--text-quaternary)] px-2 py-1 bg-[var(--bg-secondary)] rounded text-mono border border-[var(--border-subtle)]">ESC</kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {results.length > 0 ? (
                            <div className="space-y-0.5">
                                {results.map((member, idx) => (
                                    <motion.div
                                        key={`${member.name}-${idx}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        onClick={() => { onSelectMember(member); onClose(); }}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition-all ${selectedIndex === idx
                                                ? 'bg-[var(--accent)] text-white'
                                                : 'hover:bg-[var(--bg-secondary)]'
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${selectedIndex === idx ? 'bg-white/20' : 'avatar'
                                            }`}>
                                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold truncate">
                                                {member.name}
                                            </h4>
                                            <p className={`text-sm truncate ${selectedIndex === idx ? 'opacity-70' : 'text-[var(--text-tertiary)]'}`}>
                                                {member.unitName} {member.teamName ? `· ${member.teamName}` : ''}
                                            </p>
                                        </div>
                                        {member.role && (
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${selectedIndex === idx ? 'bg-white/20' : 'badge'
                                                }`}>
                                                {member.role}
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-[var(--text-tertiary)]">
                                No results for "{query}"
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-quaternary)]">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-mono">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-mono">↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-mono">↵</kbd>
                                Select
                            </span>
                        </div>
                        <span>{allMembers.length} people</span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
