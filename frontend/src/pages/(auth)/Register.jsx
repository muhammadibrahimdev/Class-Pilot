import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { Icons } from '../../config/icon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import StepDots from '../../components/ui/StepDots';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(0);
  const stepRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'schooladmin',
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [step]);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goNext = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const goBack = () => setStep(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-sm bg-white border border-border rounded-2xl shadow-xl p-8">
        <Logo />
        <p className="text-muted text-xs mb-6">
          {step === 0 ? 'Step 1 — Your details' : 'Step 2 — School details'}
        </p>

        <StepDots total={2} current={step} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div ref={stepRef}>
          {step === 0 && (
            <form onSubmit={goNext}>
              <Input
                label="Full Name"
                icon={Icons.user}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
              <Input
                label="Email Address"
                icon={Icons.email}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@school.edu"
                required
              />
              <Input
                label="Password"
                icon={Icons.password}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <Button type="submit">
                Continue <Icons.arrowRight size={16} />
              </Button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <Input
                label="School Name"
                icon={Icons.school}
                type="text"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
                placeholder="Greenwood High School"
                required
              />
              <Input
                label="School Email"
                icon={Icons.email}
                type="email"
                name="schoolEmail"
                value={form.schoolEmail}
                onChange={handleChange}
                placeholder="contact@greenwood.edu"
                required
              />
              <Input
                label="School Phone"
                icon={Icons.phone}
                type="tel"
                name="schoolPhone"
                value={form.schoolPhone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                required
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-ink border border-border hover:bg-surface transition"
                >
                  Back
                </button>
                <div className="flex-1">
                  <Button type="submit" loading={loading}>
                    Create Account
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}