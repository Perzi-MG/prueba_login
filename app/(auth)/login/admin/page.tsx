"use client";

import { login } from "@/lib/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const handleLogin = async (formData: FormData) => {
    await login(formData);
  };

  return (
    <div className="flex flex-row items-center justify-between h-screen">
      <img src="/Fondo_Login.webp" alt="Fondo Login" className="absolute h-full w-full" />
      <div className="relative flex flex-col items-center justify-center gap-10 bg-white w-2/5 h-full rounded-lg shadow-lg opacity-70">
        <h2 className="text-2xl font-medium">Login</h2>
        <form
          action={handleLogin}
          className="flex flex-col gap-10 w-[60%]">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            required
            className="border-b border-gray-300 p-2 focus:outline-none focus:border-indigo-600 transition-colors" />
          <input
            type="password"
            name="password"
            placeholder="Contrasena"
            required
            className="border-b border-gray-300 p-2 focus:outline-none focus:border-indigo-600 transition-colors" />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded-sm p-3">Login</button>
        </form>
        <p>Eres estudiante? <Link href="/login/student" className="font-semibold">Ingresa aqui</Link></p>
      </div>
    </div>
  );
}