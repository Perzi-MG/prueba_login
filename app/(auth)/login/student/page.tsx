'use client';

import { useActionState } from 'react';
import { loginStudent } from '@/lib/actions/auth';
import Link from 'next/link';

type State = { error?: string } | undefined;

export default function StudentLoginPage() {
  const [state, action, pending] = useActionState<State, FormData>(
    loginStudent,
    undefined
  );

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Lab de Redes</h1>
          <p className="text-slate-400 text-sm mt-1">Solicitud de material</p>
        </div>

        {/* Form card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-lg font-semibold mb-1">Ingresa como alumno</h2>
          <p className="text-slate-400 text-sm mb-6">Usa tus credenciales del laboratorio</p>

          <form action={action} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="student-username" className="text-slate-300 text-sm font-medium">
                Usuario / Expediente
              </label>
              <input
                id="student-username"
                type="text"
                name="username"
                placeholder="Ej. 123456"
                required
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="student-password" className="text-slate-300 text-sm font-medium">
                Contraseña
              </label>
              <input
                id="student-password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Error message */}
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="student-login-submit"
              disabled={pending}
              className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              {pending ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Admin link */}
        <p className="text-center text-slate-500 text-sm mt-6">
          ¿Eres supervisor o admin?{' '}
          <Link href="/login/admin" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            Ingresa aquí
          </Link>
        </p>
      </div>
    </div>
  );
}