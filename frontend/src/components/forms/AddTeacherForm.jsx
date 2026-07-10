import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Icons } from '../../config/icon';
import API from '../../api/axios';
import { ShieldQuestion } from 'lucide-react';
import { toast } from 'sonner';

const DUMMY_CLASSES = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A'];

export default function AddTeacherForm({ onClose, refetch, selectedTeacher }) {
  const [form, setForm] = useState({
    name: selectedTeacher?.name || '',
    email: selectedTeacher?.email || '',
    phone: selectedTeacher?.phone || '',
    password: selectedTeacher?.password || '',
    assignedClass: selectedTeacher?.assignedClass || '',
    subject: selectedTeacher?.subject || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let response;
      if (selectedTeacher) {
        response = await API.put(`/users/teacher/${selectedTeacher._id}`, form);
      } else {
        response =  await API.post('/users/teacher', form);
      }
      toast.success(response.data.message);
      refetch();
      onClose();
      setLoading(false);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
      return console.log("eror=> ", error.message);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <Input
        label="Full Name"
        icon={Icons.user}
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Dr. Sarah Ahmed"
        required
      />
      <Input
        label="Email Address"
        icon={Icons.email}
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="teacher@school.edu"
        required
      />
      <Input
        label="Phone Number"
        icon={Icons.phone}
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="+92 300 1234567"
        required
      />
      <Input
        label="Temporary Password"
        icon={Icons.password}
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Min. 6 characters"
        required
      />
      <Input
        label="Subject"
        icon={Icons.book}
        type="text"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        placeholder="Mathematics"
        required
      />

      {/* Class select — custom styled to match Input */}
      <div className="mb-4">
        <label className="text-sm font-medium text-ink block mb-1.5">
          Assign Class
        </label>
        <div className="relative">
          <Icons.book
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <select
            name="assignedClass"
            value={form.assignedClass}
            onChange={handleChange}
            className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm
              outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
              bg-white text-ink appearance-none"
          >
            <option value="">Select a class</option>
            {DUMMY_CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <Icons.chevronDown
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-ink border border-border hover:bg-surface transition"
        >
          Cancel
        </button>
        <div className="flex-1 ">
          <Button type="submit" disabled={loading}>Add Teacher</Button>
        </div>
      </div>
    </form>
  );
}