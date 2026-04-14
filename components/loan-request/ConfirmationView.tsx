import type { Loan } from '@/lib/actions/loans';

type Props = {
  loan: Loan;
  onNewRequest: () => void;
};

export default function ConfirmationView({ loan, onNewRequest }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <h2 className="text-white text-2xl font-bold">¡Solicitud enviada!</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
          Tu solicitud fue registrada. El supervisor del laboratorio la atenderá en breve.
        </p>
      </div>

      {/* Summary card */}
      <div className="w-full max-w-sm bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 text-left flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Materia</span>
          <span className="text-white font-medium">{loan.subject}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Profesor</span>
          <span className="text-white font-medium">{loan.teacher}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Salón</span>
          <span className="text-white font-medium">{loan.classroom}</span>
        </div>

        {loan.items && loan.items.length > 0 ? (
          <>
            <div className="border-t border-slate-700/60 pt-3">
              <span className="text-slate-400 text-sm">Material solicitado</span>
              <ul className="mt-2 flex flex-col gap-1.5">
                {loan.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-white">{item.materialName}</span>
                    {item.location && (
                      <span className="text-slate-400 text-xs">{item.location}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : loan.products && loan.products.length > 0 ? (
          <div className="border-t border-slate-700/60 pt-3 flex justify-between text-sm">
            <span className="text-slate-400">Unidades solicitadas</span>
            <span className="text-white font-medium">{loan.products.length}</span>
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          id="new-request-btn"
          onClick={onNewRequest}
          type="button"
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
        >
          Nueva solicitud
        </button>
      </div>
    </div>
  );
}
