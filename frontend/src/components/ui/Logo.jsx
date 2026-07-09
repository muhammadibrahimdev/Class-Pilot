import { Icons } from '../../config/icon';

export default function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <Icons.school size={18} className="text-white" />
      </div>
      <span className={`font-heading text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        ClassPilot
      </span>
    </div>
  );
}