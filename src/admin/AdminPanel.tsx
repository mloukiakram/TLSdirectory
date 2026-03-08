import { useState } from 'react';
import LocationManager from './LocationManager';
import UnitManager from './UnitManager';
import TeamManager from './TeamManager';
import MemberManager from './MemberManager';

type Tab = 'locations' | 'units' | 'teams' | 'members';

const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'locations', label: 'Locations', icon: '' },
    { key: 'units', label: 'Units', icon: '' },
    { key: 'teams', label: 'Teams', icon: '' },
    { key: 'members', label: 'Members', icon: '' },
];

interface Props {
    onLogout: () => void;
}

export default function AdminPanel({ onLogout }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('locations');

    const renderContent = () => {
        switch (activeTab) {
            case 'locations': return <LocationManager />;
            case 'units': return <UnitManager />;
            case 'teams': return <TeamManager />;
            case 'members': return <MemberManager />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2 className="admin-sidebar-title">Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <button onClick={onLogout} className="admin-btn-logout">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="admin-main">
                {renderContent()}
            </main>
        </div>
    );
}
