'use client';

import { useState, useTransition } from 'react';
import type { Loan } from '@/lib/actions/loans';
import type { Material, AvailableProduct } from '@/lib/actions/materials';
import { addItemsToLoan } from '@/lib/actions/loans';
import ConfirmationView from './ConfirmationView';

type SelectedItem = {
  materialId: string;
  materialName: string;
  availableProductIds: string[];
  quantity: number;
};

type StudentIdentity = {
  userId: string;
  studentName: string;
  file: string;
  degree: string;
};

type Props = {
  loan: Loan;
  materials: Material[];
  availableProducts: AvailableProduct[];
  student: StudentIdentity;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Esperando entrega',
  active: 'En préstamo',
  returned: 'Devuelto',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  returned: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function ActiveLoanView({ loan: initialLoan, materials, availableProducts }: Props) {
  const [loan, setLoan] = useState<Loan>(initialLoan);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const statusLabel = STATUS_LABELS[loan.status] ?? loan.status;
  const statusColor = STATUS_COLORS[loan.status] ?? STATUS_COLORS.pending;

  // -- Material search --
  const filteredMaterials = search.trim().length > 0
    ? materials.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category?.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  function getAvailableProductIdsForMaterial(materialId: string): string[] {
    return availableProducts
      .filter((p) => {
        const mid = typeof p.materialId === 'object'
          ? (p.materialId as { _id: string })._id
          : p.materialId as unknown as string;
        return mid === materialId;
      })
      .map((p) => p._id);
  }

  function handleAddMaterial(material: Material) {
    setSearch('');
    if (selectedItems.find((i) => i.materialId === material._id)) return;
    const ids = getAvailableProductIdsForMaterial(material._id);
    if (ids.length === 0) {
      setError(`No hay unidades disponibles de "${material.name}".`);
      return;
    }
    setSelectedItems((prev) => [
      ...prev,
      { materialId: material._id, materialName: material.name, availableProductIds: ids, quantity: 1 },
    ]);
    setError(null);
  }

  function updateQuantity(materialId: string, delta: number) {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.materialId === materialId
          ? { ...i, quantity: Math.min(Math.max(1, i.quantity + delta), i.availableProductIds.length) }
          : i
      )
    );
  }

  function removeItem(materialId: string) {
    setSelectedItems((prev) => prev.filter((i) => i.materialId !== materialId));
  }

  function handleAddSubmit() {
    setError(null);
    if (selectedItems.length === 0) {
      setError('Selecciona al menos un material.');
      return;
    }
    // Flatten: take the first N product IDs for each material, where N = quantity
    const productIds = selectedItems.flatMap((i) =>
      i.availableProductIds.slice(0, i.quantity)
    );
    startTransition(async () => {
      const result = await addItemsToLoan(loan._id, productIds);
      if (result.success) {
        setLoan(result.loan);
        setSelectedItems([]);
        setShowAddForm(false);
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return <ConfirmationView loan={loan} onNewRequest={() => setSubmitted(false)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-semibold">Solicitud activa</h2>
          <p className="text-slate-400 text-sm mt-0.5">Ya tienes un préstamo en curso</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Loan details */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Materia</p>
            <p className="text-white font-medium">{loan.subject}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Profesor</p>
            <p className="text-white font-medium">{loan.teacher}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Salón</p>
            <p className="text-white font-medium">{loan.classroom}</p>
          </div>
        </div>

        {/* Items list — products is an array of IDs, so just show the count */}
        {loan.products && loan.products.length > 0 && (
          <div className="border-t border-slate-700/60 pt-4">
            <p className="text-slate-400 text-xs font-medium mb-2">PRODUCTOS SOLICITADOS</p>
            <p className="text-white text-sm">{loan.products.length} unidad{loan.products.length !== 1 ? 'es' : ''}</p>
          </div>
        )}
        {/* Populated items (if backend populates them) */}
        {loan.items && loan.items.length > 0 && (
          <div className="border-t border-slate-700/60 pt-4">
            <p className="text-slate-400 text-xs font-medium mb-3">MATERIAL SOLICITADO</p>
            <div className="flex flex-col gap-2">
              {loan.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-white">{item.materialName}</span>
                  {item.location && (
                    <span className="text-xs text-slate-500 bg-slate-700/50 rounded px-2 py-0.5">{item.location}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add more materials */}
      {!showAddForm ? (
        <button
          id="add-material-btn"
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 w-full border border-dashed border-slate-600 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-xl py-3.5 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Añadir más material
        </button>
      ) : (
        <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-white font-medium text-sm">Añadir material al préstamo</p>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="add-material-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar material…"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {filteredMaterials.length > 0 && (
              <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                {filteredMaterials.slice(0, 5).map((m) => {
                  const ids = getAvailableProductIdsForMaterial(m._id);
                  const qty = ids.length;
                  const isOut = qty === 0;
                  return (
                    <button
                      key={m._id}
                      type="button"
                      disabled={isOut}
                      onClick={() => handleAddMaterial(m)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${isOut ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-700 cursor-pointer'}`}
                    >
                      <span className="text-white font-medium">{m.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isOut ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {isOut ? 'Sin stock' : `${qty} disp.`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected */}
          {selectedItems.length > 0 && (
            <div className="flex flex-col gap-2">
              {selectedItems.map((item) => (
                <div key={item.materialId} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 gap-3">
                  <span className="text-white text-sm flex-1 truncate">{item.materialName}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(item.materialId, -1)} disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors">−</button>
                    <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.materialId, +1)} disabled={item.quantity >= item.availableProductIds.length}
                      className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors">+</button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.materialId)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => { setShowAddForm(false); setSelectedItems([]); setError(null); }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl py-3 text-sm transition-colors">
              Cancelar
            </button>
            <button
              type="button"
              id="add-items-submit-btn"
              disabled={isPending || selectedItems.length === 0}
              onClick={handleAddSubmit}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              {isPending ? 'Añadiendo…' : 'Confirmar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
