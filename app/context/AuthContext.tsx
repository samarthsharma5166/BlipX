"use client";
//  step1: import session provider
import { SessionProvider } from "next-auth/react";
// step2: create interface for AuthContextProps
interface AuthContextProps {
    children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
    return <SessionProvider>{children}</SessionProvider>;
}