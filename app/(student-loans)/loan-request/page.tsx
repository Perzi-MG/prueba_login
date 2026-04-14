import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudentCard from '@/components/loan-request/StudentCard';
import NewLoanForm from '@/components/loan-request/NewLoanForm';
import ActiveLoanView from '@/components/loan-request/ActiveLoanView';
import { getMaterials, getAvailableProducts } from '@/lib/actions/materials';
import { getActiveLoan } from '@/lib/actions/loans';

export const metadata = {
  title: 'Solicitud de material — Lab de Redes',
  description: 'Solicita material del laboratorio de redes de la UAQ.',
};

async function getStudentProfile(token: string) {
  try {
    const res = await fetch('http://localhost:4000/auth/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function LoanRequestPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    redirect('/login/student');
  }

  // Fetch all data in parallel
  const [profile, materials, availableProducts, activeLoan] = await Promise.all([
    getStudentProfile(token),
    getMaterials(),
    getAvailableProducts(),
    getActiveLoan(),
  ]);

  if (!profile) {
    redirect('/login/student');
  }

  const displayName: string = profile.name ?? profile.fullName ?? profile.username ?? 'Alumno';
  const career: string = profile.degree ?? profile.career ?? profile.carrera ?? 'Ingeniería en Sistemas';
  const role: string = profile.role ?? 'alumno';
  const expediente: string = profile.file ?? profile.username ?? profile.expediente ?? '—';

  // Student identity passed to loan forms — matches the backend POST /prestamos payload
  const studentIdentity = {
    userId: profile._id ?? profile.userId ?? '',
    studentName: displayName,
    file: expediente,
    degree: career,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-3xl rounded-full" />
      </div>

      {/* Header bar */}
      <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Lab de Redes</span>
          </div>
          <form action={async () => {
            'use server';
            const cs = await cookies();
            cs.delete('session');
            redirect('/login/student');
          }}>
            <button
              type="submit"
              id="logout-btn"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Student card */}
        <StudentCard
          name={displayName}
          username={expediente}
          career={career}
          role={role}
        />

        {/* Divider with label */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            {activeLoan ? 'Tu solicitud actual' : 'Nueva solicitud'}
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Loan content area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {activeLoan ? (
            <ActiveLoanView
              loan={activeLoan}
              materials={materials}
              availableProducts={availableProducts}
              student={studentIdentity}
            />
          ) : (
            <NewLoanForm
              materials={materials}
              availableProducts={availableProducts}
              student={studentIdentity}
            />
          )}
        </div>

        {/* Empty catalog notice */}
        {materials.length === 0 && (
          <p className="text-center text-slate-500 text-sm">
            No se pudo cargar el catálogo de materiales. Verifica tu conexión con el servidor.
          </p>
        )}
      </main>
    </div>
  );
}
