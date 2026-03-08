import { useState } from 'react';
import { verifyAdminPassword } from '../lib/dataService';
import AdminPanel from './AdminPanel';
import './admin.css';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(
        () => sessionStorage.getItem('tls_admin_auth') === 'true'
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const valid = await verifyAdminPassword(password);
        if (valid) {
            sessionStorage.setItem('tls_admin_auth', 'true');
            setAuthenticated(true);
        } else {
            setError('Incorrect password');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('tls_admin_auth');
        setAuthenticated(false);
        setPassword('');
    };

    if (authenticated) {
        return <AdminPanel onLogout={handleLogout} />;
    }

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <div className="admin-login-icon" style={{ fontSize: '32px', fontWeight: 700 }}>TLS</div>
                <h1 className="admin-login-title">Admin Access</h1>
                <p className="admin-login-subtitle">Enter the admin password to continue</p>
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="admin-input"
                        autoFocus
                    />
                    {error && <p className="admin-error">{error}</p>}
                    <button
                        type="submit"
                        className="admin-btn-primary w-full"
                        disabled={loading || !password}
                    >
                        {loading ? 'Verifying...' : 'Unlock'}
                    </button>
                </form>
            </div>
        </div>
    );
}
