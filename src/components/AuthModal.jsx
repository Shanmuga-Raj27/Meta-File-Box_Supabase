import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal() {
  const { isAuthModalOpen, authMode, closeAuthModal, openAuthModal, login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
        await login(formData.email, formData.password);
      }
      closeAuthModal();
      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
    } catch (err) {
      setError(err.message || (authMode === 'login' ? 'Invalid email or password' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeAuthModal}>
          <FiX />
        </button>
        
        <div className="auth-header">
          <h1 className="auth-title">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {authMode === 'login' 
              ? 'Sign in to access your secure files' 
              : 'Join Meta File Box today'}
          </p>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-input"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={authMode === 'login' ? 'Enter your password' : 'Create a secure password'}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
            {loading 
              ? (authMode === 'login' ? 'Signing in...' : 'Creating account...') 
              : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: 24, textAlign: 'center' }}>
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="auth-link-btn" 
            onClick={() => openAuthModal(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
