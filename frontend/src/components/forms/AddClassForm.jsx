import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Icons } from '../../config/icon';

const DUMMY_TEACHERS = ['Dr. Sarah Ahmed', 'Mr. Ali Khan', 'Ms. Fatima Malik'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Computer Science', 'History'];

export default function AddClassForm({ onClose }) {
  const [form, setForm] = useState({
    className: '',
    section: '',
    teacher: '',
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Add Class form data:', { ...form, subjects: selectedSubjects });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <Input
        label="Class Name"
        icon={Icons.book}
        type="text"
        name="className"
        value={form.className}
        onChange={handleChange}
        placeholder="e.g. Grade 10"
        required
      />
      <Input
        label="Section"
        icon={Icons.hash}
        type="text"
        name="section"
        value={form.section}
        onChange={handleChange}
        placeholder="e.g. A"
        required
      />

      {/* Teacher select */}
      <div className="mb-4">
        <label className="text-sm font-medium text-ink block mb-1.5">
          Class Teacher
        </label>
        <div className="relative">
          <Icons.user
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <select
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm
              outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
              bg-white text-ink appearance-none"
          >
            <option value="">Select a teacher</option>
            {DUMMY_TEACHERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Icons.chevronDown
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
      </div>

      {/* Subjects multi-select */}
      <div className="mb-4">
        <label className="text-sm font-medium text-ink block mb-2">
          Subjects
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => {
            const selected = selectedSubjects.includes(subject);
            return (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                  ${selected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-muted border-border hover:border-primary hover:text-primary'
                  }`}
              >
                {subject}
              </button>
            );
          })}
        </div>
        {selectedSubjects.length === 0 && (
          <p className="text-xs text-muted mt-1.5">Select at least one subject</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-ink border border-border hover:bg-surface transition"
        >
          Cancel
        </button>
        <div className="flex-1">
          <Button type="submit">Create Class</Button>
        </div>
      </div>
    </form>
  );
}