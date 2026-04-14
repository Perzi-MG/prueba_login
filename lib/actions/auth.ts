'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        return { error: 'Invalid credentials' };
    }

    const { accessToken } = await response.json();
    console.log(accessToken);


    const cookieStore = await cookies();
    cookieStore.set('session', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });

    redirect('/dashboard');


}

export async function loginStudent(_prevState: unknown, formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        return { error: 'Credenciales incorrectas. Verifica tu usuario y contraseña.' };
    }

    const { accessToken } = await response.json();

    const cookieStore = await cookies();
    cookieStore.set('session', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });

    redirect('/loan-request');
}