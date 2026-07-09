// import { Users, GraduationCap, Wallet, CalendarCheck, Plus, Calendar } from 'lucide-react';
// import StatCard from '../../components/ui/StatCard';

// export default function SchoolAdminDashboard() {
//   return (
//     <div className="space-y-6">

//       {/* Page header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="font-heading text-2xl font-bold text-ink tracking-tight">
//             Operational Overview
//           </h1>
//           <p className="text-muted text-sm mt-0.5">
//             Track school performance and handle daily administrative tasks.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-ink hover:bg-surface transition">
//             <Calendar size={15} />
//             Today: Oct 24, 2023
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition">
//             <Plus size={15} />
//             New Entry
//           </button>
//         </div>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           icon={Users}
//           label="Total Teachers"
//           value={42}
//           badge="+2 this month"
//           badgeColor="green"
//         />
//         <StatCard
//           icon={GraduationCap}
//           label="Total Students"
//           value={850}
//           badge="+12 enrollment"
//           badgeColor="green"
//         />
//         <StatCard
//           icon={Wallet}
//           label="Monthly Fees"
//           value="85%"
//           sub="Collection rate"
//           badgeColor="blue"
//         />
//         <StatCard
//           icon={CalendarCheck}
//           label="Today's Attendance"
//           value="92%"
//           badge="Updated 5m ago"
//           badgeColor="blue"
//         />
//       </div>

//     </div>
//   );
// }









import { useState, useRef, useEffect } from 'react';
import { Users, GraduationCap, Wallet, CalendarCheck, Plus, Calendar, ChevronDown } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import AddTeacherForm from '../../components/forms/AddTeacherForm';
import AddStudentForm from '../../components/forms/AddStudentForm';
import AddClassForm from '../../components/forms/AddClassForm';

const MODALS = { teacher: 'teacher', student: 'student', class: 'class' };

export default function SchoolAdminDashboard() {
  const [dropdown, setDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openModal = (type) => {
    setActiveModal(type);
    setDropdown(false);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink tracking-tight">
            Operational Overview
          </h1>
          <p className="text-muted text-sm mt-0.5">
            Track school performance and handle daily administrative tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-ink hover:bg-surface transition">
            <Calendar size={15} />
            Today: Oct 24, 2023
          </button>

          {/* New Entry dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
            >
              <Plus size={15} />
              New Entry
              <ChevronDown size={14} className={`transition-transform ${dropdown ? 'rotate-180' : ''}`} />
            </button>

            {dropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-20">
                {[
                  { label: 'Add Teacher', type: MODALS.teacher },
                  { label: 'Add Student', type: MODALS.student },
                  { label: 'Add Class', type: MODALS.class },
                ].map(({ label, type }) => (
                  <button
                    key={type}
                    onClick={() => openModal(type)}
                    className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Teachers"
          value={42}
          badge="+2 this month"
          badgeColor="green"
        />
        <StatCard
          icon={GraduationCap}
          label="Total Students"
          value={850}
          badge="+12 enrollment"
          badgeColor="green"
        />
        <StatCard
          icon={Wallet}
          label="Monthly Fees"
          value="85%"
          sub="Collection rate"
          badgeColor="blue"
        />
        <StatCard
          icon={CalendarCheck}
          label="Today's Attendance"
          value="92%"
          badge="Updated 5m ago"
          badgeColor="blue"
        />
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === MODALS.teacher} onClose={closeModal} title="Add New Teacher">
        <AddTeacherForm onClose={closeModal} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.student} onClose={closeModal} title="Add New Student">
        <AddStudentForm onClose={closeModal} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.class} onClose={closeModal} title="Create New Class">
        <AddClassForm onClose={closeModal} />
      </Modal>

    </div>
  );
}