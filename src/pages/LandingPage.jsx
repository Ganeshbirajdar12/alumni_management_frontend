import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthModal from '../components/auth/AuthModal';
import '../styles/landing.css';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            <div className="navbar-logo-icon">AM</div>
            AlumniHub
          </a>
          
          <div className="navbar-links">
            <a className="navbar-link" href="#features">Features</a>
            <a className="navbar-link" href="#how-it-works">How it Works</a>
            <a className="navbar-link" href="#testimonials">Testimonials</a>
          </div>

          <div className="navbar-buttons">
            <button className="btn-login" onClick={() => openAuth('login')}>
              Sign In
            </button>
            <button className="btn-signup" onClick={() => openAuth('register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shape hero-bg-shape-1"></div>
        <div className="hero-bg-shape hero-bg-shape-2"></div>
        <div className="hero-bg-shape hero-bg-shape-3"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Trusted by 10,000+ Alumni Worldwide
            </div>

            <h1 className="hero-title">
              Stay Connected with Your{' '}
              <span className="hero-title-gradient">Alumni Network</span>
            </h1>

            <p className="hero-subtitle">
              Reconnect with classmates, expand your professional network, 
              discover new opportunities, and give back to your alma mater — 
              all in one place.
            </p>

            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => openAuth('register')}>
                🚀 Get Started Free
              </button>
              <button className="btn-hero-secondary" onClick={() => openAuth('login')}>
                Sign In →
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">10K+</span>
                <span className="hero-stat-label">Active Alumni</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Companies</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Countries</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-card">
              <div className="hero-image-header">
                <div className="hero-image-avatar">JD</div>
                <div className="hero-image-info">
                  <h4>John Doe</h4>
                  <p>Software Engineer @ Google</p>
                </div>
                <span className="hero-image-badge">Online</span>
              </div>

              <div className="hero-image-list">
                <div className="hero-image-item">
                  <div className="hero-image-item-icon">🎓</div>
                  <div className="hero-image-item-content">
                    <h5>Computer Science</h5>
                    <p>Class of 2020</p>
                  </div>
                </div>
                <div className="hero-image-item">
                  <div className="hero-image-item-icon">💼</div>
                  <div className="hero-image-item-content">
                    <h5>Senior Software Engineer</h5>
                    <p>Google • 4 years experience</p>
                  </div>
                </div>
                <div className="hero-image-item">
                  <div className="hero-image-item-icon">🌐</div>
                  <div className="hero-image-item-content">
                    <h5>San Francisco, CA</h5>
                    <p>Available for mentorship</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Registered Alumni</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Partner Companies</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1,200+</span>
            <span className="stat-label">Jobs Posted</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">300+</span>
            <span className="stat-label">Events Hosted</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need to Stay Connected</h2>
            <p className="section-subtitle">
              Powerful features designed to help you network, grow, and give back to your alumni community.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Alumni Directory</h3>
              <p className="feature-description">
                Search and connect with alumni from your batch, department, or company. 
                Find mentors, collaborators, and old friends.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">💼</div>
              <h3 className="feature-title">Job Portal</h3>
              <p className="feature-description">
                Discover job opportunities posted by alumni. Get referrals, 
                apply directly, and advance your career.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">📅</div>
              <h3 className="feature-title">Events & Reunions</h3>
              <p className="feature-description">
                Stay updated on reunions, webinars, workshops, and networking events. 
                RSVP and connect with attendees.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon pink">💬</div>
              <h3 className="feature-title">Messaging</h3>
              <p className="feature-description">
                Connect with fellow alumni through private messages. 
                Build meaningful professional relationships.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">🎓</div>
              <h3 className="feature-title">Mentorship</h3>
              <p className="feature-description">
                Give back by mentoring students and junior alumni. 
                Share your experience and shape the next generation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">📊</div>
              <h3 className="feature-title">Analytics & Insights</h3>
              <p className="feature-description">
                Track your network growth, profile views, and engagement. 
                Get insights to improve your professional presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Get Started in 4 Easy Steps</h2>
            <p className="section-subtitle">
              Join thousands of alumni who are already reaping the benefits of our platform.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Account</h3>
              <p className="step-description">
                Sign up with your email and verify your alumni status. 
                Takes less than 2 minutes.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Complete Profile</h3>
              <p className="step-description">
                Add your academic details, work experience, and skills. 
                Help others find and connect with you.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Connect & Network</h3>
              <p className="step-description">
                Search for alumni, send connection requests, 
                and start building your professional network.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Grow & Give Back</h3>
              <p className="step-description">
                Find jobs, attend events, mentor others, 
                and stay connected with your alma mater.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">Loved by Alumni Worldwide</h2>
            <p className="section-subtitle">
              Hear what our community members have to say about their experience.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "This platform helped me reconnect with my college friends after 10 years! 
                Also landed my dream job through a referral from a senior."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">PS</div>
                <div className="testimonial-info">
                  <h5>Priya Sharma</h5>
                  <p>Product Manager @ Microsoft</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "As a fresh graduate, the mentorship program was invaluable. 
                My mentor helped me navigate my career path and land my first job."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RK</div>
                <div className="testimonial-info">
                  <h5>Rahul Kumar</h5>
                  <p>Data Scientist @ Amazon</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "The events section keeps me updated on all alumni meetups. 
                I've attended 5 reunions this year and made amazing connections."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AC</div>
                <div className="testimonial-info">
                  <h5>Anjali Chen</h5>
                  <p>Marketing Director @ Meta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Reconnect with Your Alumni Network?</h2>
          <p className="cta-subtitle">
            Join thousands of alumni who are already growing their careers and networks.
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => openAuth('register')}>
              Get Started Free
            </button>
            <button className="btn-cta-secondary" onClick={() => openAuth('login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>
                <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>
                  AM
                </div>
                AlumniHub
              </h3>
              <p>
                Connecting alumni worldwide to foster lifelong relationships, 
                professional growth, and giving back to the community.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Twitter">𝕏</a>
                <a href="#" aria-label="LinkedIn">in</a>
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Instagram">📷</a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#">Directory</a></li>
                <li><a href="#">Job Portal</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 AlumniHub. All rights reserved.</p>
            <p>Made with ❤️ for the alumni community</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={setAuthMode}
        />
      )}
    </div>
  );
};

export default LandingPage;