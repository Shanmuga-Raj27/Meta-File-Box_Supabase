import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap, FiActivity } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const navigate = useNavigate();
  const { openAuthModal, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard automatically
  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        {/* Left Side: Branding & CTA */}
        <div className="landing-left">
          <div className="landing-brand">
            <div className="landing-logo">
              <FiShield />
            </div>
            <h1>Meta File Box</h1>
          </div>

          <h2 className="landing-tagline">
            Organize, Store, and Manage your Files <span>Intelligently</span>.
          </h2>

          <p className="landing-description">
            Experience the next generation of file management. Secure cloud storage,
            Easy tagging, Categorizing, and lightning-fast access to everything you need.
          </p>

          <div className="landing-actions">
            <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
              Get Started <FiArrowRight />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => openAuthModal('login')}>
              Login to Account
            </button>
          </div>

          <div className="landing-features">
            <div className="feature-item">
              <FiShield className="feature-icon" />
              <span>Secure Storage</span>
            </div>
            <div className="feature-item">
              <FiZap className="feature-icon" />
              <span>Instant Access</span>
            </div>
            <div className="feature-item">
              <FiActivity className="feature-icon" />
              <span>Smart Metadata</span>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="landing-right">
          <div className="landing-illustration-container">
            <img
              src="/MFB.jpeg"
              alt="Meta File Box Illustration"
              className="landing-hero-img"
              onError={(e) => {
                // Fallback icon if image doesn't load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="landing-hero-fallback" style={{ display: 'none' }}>
              <FiShield size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
