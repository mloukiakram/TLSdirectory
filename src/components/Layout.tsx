import type { ReactNode } from 'react';
import { useState } from 'react';
import { Filter, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: ReactNode;
    locations: string[];
    selectedLocation: string | null;
    onSelectLocation: (loc: string | null) => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    locations,
    selectedLocation,
    onSelectLocation,
    onExpandAll,
    onCollapseAll
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="min-h-screen font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 navbar">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="avatar w-10 h-10 rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-150">
                            <span className="font-bold">TL</span>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-gray-900">Traffic Loop</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onExpandAll}
                            className="btn-icon hover:scale-105 active:scale-95 transition-transform duration-150"
                            title="Expand All"
                        >
                            <Maximize2 size={18} />
                        </button>
                        <button
                            onClick={onCollapseAll}
                            className="btn-icon hover:scale-105 active:scale-95 transition-transform duration-150"
                            title="Collapse All"
                        >
                            <Minimize2 size={18} />
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-icon hover:scale-105 active:scale-95 transition-all duration-150 ${showFilters ? 'bg-gray-900 text-white' : ''}`}
                        >
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence initial={false}>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-white/50 bg-white/80 backdrop-blur-lg"
                        >
                            <div className="container mx-auto px-4 py-4">
                                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Location</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onSelectLocation(null)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${selectedLocation === null
                                                    ? 'bg-gray-900 text-white shadow-lg'
                                                    : 'bg-white/60 text-gray-600 hover:bg-white'
                                                }`}
                                        >
                                            All
                                        </button>
                                        {locations.map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => onSelectLocation(loc)}
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${selectedLocation === loc
                                                        ? 'bg-gray-900 text-white shadow-lg'
                                                        : 'bg-white/60 text-gray-600 hover:bg-white'
                                                    }`}
                                            >
                                                {loc.length > 20 ? loc.substring(0, 18) + '...' : loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="text-center py-8 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Traffic Loop Solutions
            </footer>
        </div>
    );
};
