'use server';

import { cookies } from 'next/headers';

export type Material = {
  _id: string;
  name: string;
  category: string;
  model: string;
  imageUrl?: string;
};

export type AvailableProduct = {
  _id: string;
  materialId: Material;
  location: string;
  isFunctional: boolean;
};

/**
 * Fetches the full materials catalogue from the backend.
 * Returns an empty array on error so the UI can handle it gracefully.
 */
export async function getMaterials(): Promise<Material[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  try {
    const res = await fetch('http://localhost:4000/materials', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

/**
 * Fetches available products (units that can be loaned right now).
 */
export async function getAvailableProducts(): Promise<AvailableProduct[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  try {
    const res = await fetch('http://localhost:4000/products/available', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}
