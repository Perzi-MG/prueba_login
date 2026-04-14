import { User } from "@/types/user";
import { cookies } from "next/headers"


async function getProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    const res = await fetch('http://localhost:4000/auth/users/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await res.json();
    return data;
}
export default async function Dashboard() {
    const user: User = await getProfile();
    return (
        <h1>Welcolme, {user.username}</h1>
    )
}