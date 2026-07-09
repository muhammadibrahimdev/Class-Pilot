import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Icons } from '../../config/icon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const roleRoutes = {
  superadmin: '/superadmin/dashboard',
  schooladmin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  student: '/student/dashboard',
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const cardRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
    );
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(roleRoutes[user.role] || '/');
    }
  }, [isAuthenticated, user?.role]);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl border border-border shadow-xl overflow-hidden">

        {/* Left brand panel */}
        <div
          ref={panelRef}
          className="hidden md:flex flex-col justify-between bg-navy p-10 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-primary-light/10 blur-3xl" />

          <Logo light />

          <div className="relative">
            <h2 className="font-heading text-white text-2xl font-bold leading-snug mb-3 tracking-tight">
              Manage your school, effortlessly
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              One secure hub for admins, teachers, and parents to stay connected.
            </p>
          </div>

          <div className="relative flex gap-6">
            {[['500+', 'Schools'], ['10k+', 'Teachers'], ['200k+', 'Students']].map(([num, label]) => (
              <div key={label}>
                <div className="font-heading text-primary-light text-xl font-bold">{num}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div ref={cardRef} className="p-8 md:p-10 flex flex-col justify-center">
          <h2 className="font-heading text-2xl font-bold text-ink mb-1 tracking-tight">
            Welcome back
          </h2>
          <p className="text-muted text-sm mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              action={
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot Password?
                </Link>
              }
            />

            <Button type="submit" loading={loading}>
              Sign In <Icons.arrowRight size={16} />
            </Button>
          </form>

          <p className="text-center text-xs text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register your school
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}