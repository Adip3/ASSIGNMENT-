import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Loader, Check } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useApp();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker',
    company: '',
    headline: '',
    location: '',
    agreement: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (currentStep === 3) {
      if (formData.role === 'job_poster' && !formData.company) {
        newErrors.company = 'Company name is required for recruiters';
      }
      
      if (!formData.agreement) {
        newErrors.agreement = 'You must agree to the terms';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setLoading(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company: formData.company,
        headline: formData.headline,
        location: formData.location
      });
      
      if (result.success) {
        showNotification('Registration successful! Welcome to LinkedIn Clone!', 'success');
        navigate('/');
      } else {
        showNotification(result.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showNotification('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span>in</span>
          </Link>
          <h1>Make the most of your professional life</h1>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Basic Info</p>
          </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Password</p>
          </div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <button 
                type="button"
                onClick={handleNext}
                className="btn btn-primary btn-full"
              >
                Continue
              </button>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password (6+ characters)"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Password strength indicator */}
              <div className="password-strength">
                <p>Password strength:</p>
                <div className="strength-bars">
                  <div className={`bar ${formData.password.length >= 6 ? 'active' : ''}`}></div>
                  <div className={`bar ${formData.password.length >= 8 ? 'active' : ''}`}></div>
                  <div className={`bar ${formData.password.length >= 10 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'active' : ''}`}></div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Profile Info */}
          {step === 3 && (
            <>
              <div className="form-group">
                <label>I am a</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="job_poster">Recruiter / Hiring Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {formData.role === 'job_poster' && (
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={handleChange}
                    className={`form-input ${errors.company ? 'error' : ''}`}
                  />
                  {errors.company && <span className="error-message">{errors.company}</span>}
                </div>
              )}

              <div className="form-group">
                <label>Professional Headline (Optional)</label>
                <input
                  type="text"
                  name="headline"
                  placeholder="e.g., Software Developer at TechCorp"
                  value={formData.headline}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the {' '}
                    <Link to="/terms" className="auth-link">Terms of Service</Link>
                    {' '} and {' '}
                    <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreement && <span className="error-message">{errors.agreement}</span>}
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !formData.agreement}
                >
                  {loading ? (
                    <>
                      <Loader className="spinner" size={20} />
                      Creating account...
                    </>
                  ) : (
                    'Agree & Join'
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Already on LinkedIn? {' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;