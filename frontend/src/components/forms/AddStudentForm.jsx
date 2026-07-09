import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Icons } from '../../config/icon';

const DUMMY_CLASSES = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A'];

export default function AddStudentForm({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    rollNo: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    assignedClass: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Add Student form data:', form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <Input
        label="Student Full Name"
        icon={Icons.user}
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ali Hassan"
        required
      />
      <Input
        label="Roll Number"
        icon={Icons.hash}
        type="text"
        name="rollNo"
        value={form.rollNo}
        onChange={handleChange}
        placeholder="e.g. 001"
        required
      />

      {/* Class select */}
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

      <p className="text-xs font-semibold text-muted uppercase tracking-wide pt-1 pb-2">
        Parent Details
      </p>

      <Input
        label="Parent Name"
        icon={Icons.user}
        type="text"
        name="parentName"
        value={form.parentName}
        onChange={handleChange}
        placeholder="Mr. Hassan Ali"
        required
      />
      <Input
        label="Parent Email"
        icon={Icons.email}
        type="email"
        name="parentEmail"
        value={form.parentEmail}
        onChange={handleChange}
        placeholder="parent@email.com"
        required
      />
      <Input
        label="Parent Phone"
        icon={Icons.phone}
        type="tel"
        name="parentPhone"
        value={form.parentPhone}
        onChange={handleChange}
        placeholder="+92 300 1234567"
        required
      />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-ink border border-border hover:bg-surface transition"
        >
          Cancel
        </button>
        <div className="flex-1">
          <Button type="submit">Add Student</Button>
        </div>
      </div>
    </form>
  );
}