import { motion, AnimatePresence } from 'framer-motion';

interface MapModalProps {
    mapUrl: string | null;
    locationName: string;
    onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ mapUrl, locationName, onClose }) => {
    if (!mapUrl) return null;

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
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="modal-content w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
                        <div>
                            <h3 className="font-semibold text-[var(--text-primary)]">{locationName}</h3>
                            <p className="text-xs text-[var(--text-quaternary)]">Office Location</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all text-lg"
                        >
                            ×
                        </button>
                    </div>

                    {/* Map */}
                    <div className="flex-1 bg-[var(--bg-tertiary)]">
                        <iframe
                            src={mapUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
