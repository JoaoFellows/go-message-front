"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/services/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin"); // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;