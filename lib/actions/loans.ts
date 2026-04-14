'use server';

import { cookies } from 'next/headers';

export type LoanItem = {
  productId: string;
  materialName: string;
  location?: string;
};

export type Loan = {
  _id: string;
  userId: string;
  studentName: string;
  file: string;
  degree: string;
  subject: string;
  teacher: string;
  classroom: string;
  products: string[];
  notes?: string;
  status: 'pending' | 'active' | 'returned';
  createdAt: string;
  items?: LoanItem[];
};

export type CreateLoanPayload = {
  userId: string;
  studentName: string;
  file: string;
  degree: string;
  subject: string;
  teacher: string;
  classroom: string;
  products: string[]; // array of product unit IDs
  notes?: string;
};

type ActionResult = { success: true; loan: Loan } | { success: false; error: string };

async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('session')?.value;
}

/**
 * Returns the active (non-returned) loan for the currently authenticated student,
 * or null if they have no open loan.
 */
export async function getActiveLoan(): Promise<Loan | null> {
  const token = await getAuthToken();

  try {
    const profileRes = await fetch('http://localhost:4000/auth/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!profileRes.ok) return null;

    const profile = await profileRes.json();
    const id = profile.userId;

    const loanRes = await fetch(
      `http://localhost:4000/loans/user/${id}/active`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );

    if (!loanRes.ok) return null;

    const loans: Loan[] = await loanRes.json();
    const active = loans.find((l) => l.status === 'pending' || l.status === 'active');
    return active ?? null;
  } catch {
    return null;
  }
}

/**
 * Creates a new loan request. All student identity fields come from the server
 * profile, the rest from the form.
 */
export async function createLoan(payload: CreateLoanPayload): Promise<ActionResult> {
  const token = await getAuthToken();

  try {
    const res = await fetch('http://localhost:4000/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body?.message ?? 'Error al crear la solicitud' };
    }

    const loan: Loan = await res.json();
    return { success: true, loan };
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' };
  }
}

/**
 * Adds more product units to an existing open loan.
 */
export async function addItemsToLoan(
  loanId: string,
  productIds: string[]
): Promise<ActionResult> {
  const token = await getAuthToken();

  try {
    const res = await fetch(`http://localhost:4000/loans/${loanId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ products: productIds }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body?.message ?? 'Error al añadir materiales' };
    }

    const loan: Loan = await res.json();
    return { success: true, loan };
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' };
  }
}
