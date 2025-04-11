import { useEffect, useState } from "react";

function mockCheckAuth() {
  return new Promise<{ isAuthenticated: boolean; hasTeam: boolean }>(
    (resolve) =>
      setTimeout(() => resolve({ isAuthenticated: true, hasTeam: false }), 1000)
  );
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean>(false);

  useEffect(() => {
    // Simulate async login check
    mockCheckAuth().then(({ isAuthenticated, hasTeam }) => {
      setIsAuthenticated(isAuthenticated);
      setHasTeam(hasTeam);
    });
  }, []);

  return { isAuthenticated, hasTeam };
}
