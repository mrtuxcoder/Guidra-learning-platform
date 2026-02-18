import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";

export const usePasswordCheck = () => {
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState(null);
  const [hasPassword, setHasPassword] = useState(false);

  // Get password info from shared UserContext instead of separate API call
  const { authInfo, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (authInfo) {
        setNeedsPasswordSetup(authInfo.needsPasswordSetup || false);
        setAuthProvider(authInfo.authProvider || null);
        setHasPassword(authInfo.hasPassword || false);
      }
      setLoading(false);
    }
  }, [authInfo, isLoading]);

  return {
    needsPasswordSetup,
    loading,
    authProvider,
    hasPassword,
    setNeedsPasswordSetup, // Allow manual override
  };
};


