import { Filter } from 'lucide-react';

interface FilterPanelProps {
    locations: string[];
    selectedLocation: string | null;
    onSelectLocation: (loc: string | null) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ locations, selectedLocation, onSelectLocation }) => {
    return (
        <div className="flex items-center gap-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-white/30 text-xs font-medium whitespace-nowrap">
                <Filter size={14} />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onSelectLocation(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${selectedLocation === null
                            ? 'btn-accent'
                            : 'btn-glass text-white/60 hover:text-white/80'
                        }`}
                >
                    All
                </button>
                {locations.map(loc => (
                    <button
                        key={loc}
                        onClick={() => onSelectLocation(loc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${selectedLocation === loc
                                ? 'btn-accent'
                                : 'btn-glass text-white/60 hover:text-white/80'
                            }`}
                    >
                        {loc.length > 18 ? loc.substring(0, 16) + '...' : loc}
                    </button>
                ))}
            </div>
        </div>
    );
};
