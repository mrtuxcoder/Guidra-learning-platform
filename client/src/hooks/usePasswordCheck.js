import { useState, useEffect } from 'react';
import { checkPasswordStatus } from '../api/password';
import { getStoredToken} from '../api/utils/cookies';

export const usePasswordCheck = () => {
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState(null);
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    const checkPassword = async () => {
      const token = getStoredToken();
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await checkPasswordStatus();
        const { needsPasswordSetup, authProvider, hasPassword } = response.data;
        
        setNeedsPasswordSetup(needsPasswordSetup);
        setAuthProvider(authProvider);
        setHasPassword(hasPassword);
      } catch (error) {
        console.error('Error checking password status:', error);
        // Don't show modal on error
        setNeedsPasswordSetup(false);
      } finally {
        setLoading(false);
      }
    };

    checkPassword();
  }, []);

  return {
    needsPasswordSetup,
    loading,
    authProvider,
    hasPassword,
    setNeedsPasswordSetup // Allow manual override
  };
};