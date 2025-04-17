// src/hocs/withAuth.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Ensuring this only runs on the client
      if (typeof window !== "undefined") {
        const checkAuth = () => {
          try {
            const token = localStorage.getItem("accessToken");
            const clientId = localStorage.getItem("x-client-id");

            if (!token || !clientId) {
              router.replace("/signin");
              return;
            }

            setIsAuthenticated(true);
          } catch (error) {
            console.error("Auth check error:", error);
          } finally {
            setIsLoading(false);
          }
        };

        checkAuth();
      }
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Add displayName for better debugging
  Wrapper.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Wrapper;
};

export default withAuth;
