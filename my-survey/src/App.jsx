import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import SurveyForm from './components/SurveyForm';

import { PublicClientApplication } from '@azure/msal-browser';
import { isDevelopment, getRedirectUri } from './utils/environment';

// MSAL setup
const msalConfig = { auth: { clientId: import.meta.env.VITE_MSAL_CLIENTID, authority: import.meta.env.VITE_MSAL_AUTHORITY_URL, redirectUri: getRedirectUri(), } };
const msalInstance = new PublicClientApplication(msalConfig);
const loginRequest = { scopes: ['User.Read'] };

export default function App() {
  const [user, setUser] = useState(
    isDevelopment()
      ? {
          homeAccountId: "dev-homeAccountId",
          environment: "dev",
          tenantId: "dev-tenantId",
          username: import.meta.env.VITE_DEV_USER_EMAIL || 'ahmed.obeid@zaintech.com',
          name: import.meta.env.VITE_DEV_USER_NAME || 'Dev User',
          localAccountId: "dev-localAccountId",
        }
      : null
  );
  const authInit = useRef(false);

  useEffect(() => {
    if (isDevelopment()) return;
    if (authInit.current) return;
    authInit.current = true;
    const initAuth = async () => {
      try {
        await msalInstance.initialize();
        const response = await msalInstance.handleRedirectPromise();
        let account = response?.account || msalInstance.getAllAccounts()[0];
        if (!account) {
          await msalInstance.loginRedirect(loginRequest);
        } else {
          setUser(account);
        }
      } catch (error) {
        console.error(error);
      }
    };
    initAuth();
  }, []);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <SurveyForm user={user} />
    </div>
  );
}