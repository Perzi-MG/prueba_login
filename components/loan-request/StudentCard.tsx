type StudentCardProps = {
  name: string;
  username: string;
  career: string;
  role: string;
};

export default function StudentCard({ name, username, career, role }: StudentCardProps) {
  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-base truncate">{name}</p>
        <p className="text-slate-400 text-sm truncate">{career} · #{username}</p>
      </div>

      {/* Date */}
      <div className="hidden sm:flex flex-col items-end shrink-0">
        <span className="text-xs text-slate-500 capitalize">{today}</span>
        <span className="text-xs text-indigo-400 font-medium mt-0.5 capitalize">{role}</span>
      </div>
    </div>
  );
}
