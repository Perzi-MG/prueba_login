'use client';

import { useState, useTransition } from 'react';
import type { Material, AvailableProduct } from '@/lib/actions/materials';
import { createLoan } from '@/lib/actions/loans';
import type { Loan } from '@/lib/actions/loans';
import ConfirmationView from './ConfirmationView';

// One entry per material type in the UI, but maps to N product unit IDs in the payload
type SelectedItem = {
  materialId: string;
  materialName: string;
  // Ordered list of available product IDs for this material type
  availableProductIds: string[];
  // How many units the student wants (1 to availableProductIds.length)
  quantity: number;
};

type StudentIdentity = {
  userId: string;
  studentName: string;
  file: string;      // expediente
  degree: string;    // carrera
};

type Props = {
  materials: Material[];
  availableProducts: AvailableProduct[];
  student: StudentIdentity;
};

export default function NewLoanForm({ materials, availableProducts, student }: Props) {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submittedLoan, setSubmittedLoan] = useState<Loan | null>(null);
  const [isPending, startTransition] = useTransition();

  // --- Material search autocomplete ---
  const filteredMaterials = search.trim().length > 0
    ? materials.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.category?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  /** Get the list of available product IDs for a given material type */
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
      {
        materialId: material._id,
        materialName: material.name,
        availableProductIds: ids,
        quantity: 1,
      },
    ]);
    setError(null);
  }

  function updateQuantity(materialId: string, delta: number) {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.materialId === materialId
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, item.quantity + delta),
                item.availableProductIds.length
              ),
            }
          : item
      )
    );
  }

  function removeItem(materialId: string) {
    setSelectedItems((prev) => prev.filter((i) => i.materialId !== materialId));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim();
    const teacher = (form.elements.namedItem('teacher') as HTMLInputElement).value.trim();
    const classroom = (form.elements.namedItem('classroom') as HTMLInputElement).value.trim();
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value.trim();

    if (!subject || !teacher || !classroom) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (selectedItems.length === 0) {
      setError('Selecciona al menos un material.');
      return;
    }

    // Flatten: for each material, take the first N product IDs where N = quantity
    const products = selectedItems.flatMap((item) =>
      item.availableProductIds.slice(0, item.quantity)
    );

    const payload = {
      ...student,
      subject,
      teacher,
      classroom,
      products,
      ...(notes ? { notes } : {}),
    };

    startTransition(async () => {
      const result = await createLoan(payload);
      if (result.success) {
        setSubmittedLoan(result.loan);
      } else {
        setError(result.error);
      }
    });
  }

  if (submittedLoan) {
    return <ConfirmationView loan={submittedLoan} onNewRequest={() => setSubmittedLoan(null)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Section title */}
      <div>
        <h2 className="text-white text-lg font-semibold">Nueva solicitud</h2>
        <p className="text-slate-400 text-sm mt-0.5">Completa los datos y selecciona el material</p>
      </div>

      {/* Fields row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-slate-300 text-sm font-medium">Materia</label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Ej. Redes I"
            required
            className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="teacher" className="text-slate-300 text-sm font-medium">Profesor</label>
          <input
            id="teacher"
            name="teacher"
            type="text"
            placeholder="Ej. Dr. García"
            required
            className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="classroom" className="text-slate-300 text-sm font-medium">Salón</label>
          <input
            id="classroom"
            name="classroom"
            type="text"
            placeholder="Ej. L-301"
            required
            className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Material search */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="material-search" className="text-slate-300 text-sm font-medium">
          Buscar material
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="material-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Escribe el nombre o categoría del material…"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />

          {/* Dropdown */}
          {filteredMaterials.length > 0 && (
            <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
              {filteredMaterials.slice(0, 6).map((m) => {
                const ids = getAvailableProductIdsForMaterial(m._id);
                const qty = ids.length;
                const isOut = qty === 0;
                const isAlready = !!selectedItems.find((i) => i.materialId === m._id);
                return (
                  <button
                    key={m._id}
                    type="button"
                    disabled={isOut || isAlready}
                    onClick={() => handleAddMaterial(m)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                      isOut || isAlready ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-700 cursor-pointer'
                    }`}
                  >
                    <div>
                      <span className="text-white font-medium">{m.name}</span>
                      {m.category && (
                        <span className="ml-2 text-slate-400 text-xs">{m.category}</span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isAlready
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : isOut
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isAlready ? 'Ya agregado' : isOut ? 'Sin stock' : `${qty} disp.`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {search.trim().length > 0 && filteredMaterials.length === 0 && (
            <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 text-sm shadow-xl">
              No se encontraron materiales con ese nombre.
            </div>
          )}
        </div>
      </div>

      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-slate-300 text-sm font-medium">Material seleccionado</p>
          <div className="flex flex-col gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.materialId}
                className="flex items-center justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 gap-4"
              >
                <span className="text-white text-sm font-medium flex-1 truncate">{item.materialName}</span>

                {/* Qty control */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.materialId, -1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center text-base leading-none transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white text-sm font-semibold w-5 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.materialId, +1)}
                    disabled={item.quantity >= item.availableProductIds.length}
                    className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center text-base leading-none transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Stock badge */}
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {item.availableProductIds.length} disp.
                </span>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.materialId)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  aria-label="Quitar material"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-slate-300 text-sm font-medium">
          Notas <span className="text-slate-500 font-normal">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Ej. Préstamo para práctica de cableado estructurado"
          className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        id="loan-submit-btn"
        disabled={isPending || selectedItems.length === 0}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 text-sm transition-colors shadow-lg shadow-indigo-600/20"
      >
        {isPending ? 'Enviando solicitud…' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
