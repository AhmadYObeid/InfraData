import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { PublicClientApplication } from '@azure/msal-browser';
import { Toaster, toast } from 'react-hot-toast';

import { formatEmailBody } from './EmailFormatter';
import QuestionGroup from './QuestionGroup';
import { isDevelopment, getRedirectUri } from '../utils/environment';

const MAX_DB_SIZE_TB = 12500;
// MSAL setup
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENTID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY_URL,
    redirectUri: getRedirectUri(),
  }
};
const msalInstance = new PublicClientApplication(msalConfig);
const loginRequest = { scopes: ['User.Read'] };
// Function URL
const FUNCTION_URL = import.meta.env.VITE_EMAIL_FUNCTION_URL;

export default function SurveyForm() {
  const authInit = useRef(false);

  // Debug environment
  console.log('[ENV]', 'MODE=', import.meta.env.MODE, 'DEV=', import.meta.env.DEV, 'PROD=', import.meta.env.PROD);

  const [form, setForm] = useState({
    infrastructure: '',
    infrastructureOtherText: '',
    sqlVersions: '',
    instances: '',
    instancesCustom: '',
    dbSizeValue: '',
    dbSizeUnit: 'GB',
    dbSizeCustom: '',
    appTypes: '',
    reasons: '',
    compliance: '',
    complianceDetails: '',
    goLive: '',
    peakTimes: '',
    downtime: '',
    syncRequired: '',
    syncRequiredDetails: '',
    deploymentModel: '',
    deploymentModelDetails: '',
    postMigration: '',
    postMigrationDetails: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({instances: false, dbSize: false});
  const [user, setUser] = useState(
    isDevelopment()
      ? {
          homeAccountId: "dev-homeAccountId",
          environment: "dev",
          tenantId: "dev-tenantId",
          username: import.meta.env.VITE_DEV_USER_EMAIL || 'ahmed.obeid@zaintech.com',
          name:     import.meta.env.VITE_DEV_USER_NAME  || 'Dev User',
          localAccountId: "dev-localAccountId",
        }
      : null
  );


  useEffect(() => {
    if (isDevelopment()) return;
    if (authInit.current) return;
    authInit.current = true;
    const initAuth = async () => {
      try {
        // await msal instance initialization
        await msalInstance.initialize();
        const response = await msalInstance.handleRedirectPromise();
        let account = response?.account || msalInstance.getAllAccounts()[0];
        if (!account) {
          // Popup login to get account in single page
          const loginResponse = await msalInstance.loginPopup(loginRequest);
          account = loginResponse.account;
        }
        setUser(account);
      } catch (e) {
        // ignore concurrent interaction errors
        if (e.errorCode === 'interaction_in_progress' || e.message?.includes('Interaction is currently in progress')) {
          return;
        }
        // fallback to redirect if popup fails
        if (e.errorCode === 'popup_window_error' || e.message?.includes('Error opening popup window')) {
          msalInstance.loginRedirect(loginRequest);
          return;
        }
        console.error('MSAL authentication error:', e);
      }
    };
    initAuth();
  }, []);

  // show loading until user is available
  if (!user) return (<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>);

  // Generic handler
  const handleChange = (field, value, markTouched = false) => {
  setForm(prev => ({ ...prev, [field]: value }));
  setErrors(prev => ({ ...prev, [field]: false }));
  if (markTouched) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };


  // Validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      // skip “instances” if custom entered
      if (key === 'instances' && form.instancesCustom.trim()) return;
      // skip “dbSizeValue” if custom entered
      if (key === 'dbSizeValue' && form.dbSizeCustom.trim()) return;

      // *** treat empty-or-all-spaces as empty ***
      const empty = typeof value === 'string'
        ? !value.trim()
        : value === '' || value == null;

      if (
        empty &&
        !key.endsWith('Custom') &&
        !key.endsWith('Details') &&
        key !== 'infrastructureOtherText'
      ) {
        newErrors[key] = true;
        valid = false;
      }
    });

    // Q1: If infrastructure == "Other Cloud", infrastructureOtherText must be filled
    if (form.infrastructure === 'Other Cloud' && !form.infrastructureOtherText.trim()) {
      newErrors.infrastructureOtherText = true;
      valid = false;
    }

    // Q3: Validate instances
    let instancesValue = form.instances;
    if (form.instancesCustom.trim()) {
      instancesValue = form.instancesCustom;
    }
    const instancesNum = parseInt(instancesValue);
    if (!form.instancesCustom.trim() && (!form.instances || !touched.instances) || isNaN(instancesNum) || instancesNum < 1 || instancesNum > 99999) {
      toast('Number of instances must be between 1 and 99,999.', {
        icon: '⚠️',
        style: { background: '#fef3c7', color: '#92400e' }
      });
      newErrors.instances = true;
      newErrors.instancesCustom = true;
      valid = false;
    }

    // Q4: Validate DB Size
    let dbSizeValue = form.dbSizeValue;
    if (form.dbSizeCustom.trim()) {
      dbSizeValue = form.dbSizeCustom;
    }
    const dbSizeNum = parseFloat(dbSizeValue);
    if (isNaN(dbSizeNum)) {
      toast.error('Database size must be a valid number.', {
        style: { background: '#fee2e2', color: '#991b1b' }
      });
      newErrors.dbSizeValue = true;
      newErrors.dbSizeCustom = true;
      valid = false;
    } else {
      const dbSizeInTB = form.dbSizeUnit === 'GB' ? dbSizeNum / 1024 : dbSizeNum;
      if (!form.instancesCustom.trim() && (!form.instances || !touched.instances) || dbSizeInTB > MAX_DB_SIZE_TB) {
        toast('Warning: Database size exceeds the maximum allowed (12.5 PB).', {
          icon: '⚠️',
          style: { background: '#fef3c7', color: '#92400e' }
        });
        newErrors.dbSizeValue = true;
        newErrors.dbSizeCustom = true;
        valid = false;
      }
    }

    // Q7: Compliance details required if 'Yes'
    if (form.compliance === 'Yes' && !form.complianceDetails.trim()) {
      newErrors.complianceDetails = true;
      valid = false;
    }

    // Q8: Validate go-live date range
    if (form.goLive) {
      const goLiveDate = new Date(form.goLive);
      const minDateObj = new Date(today);
      const maxDateObj = new Date(maxDate);
      if (goLiveDate < minDateObj || goLiveDate > maxDateObj) {
        toast.error('Please correct the highlighted errors.', {
          style: { background: '#fee2e2', color: '#991b1b' }
        });
        newErrors.goLive = true;
        valid = false;
      }
    }

    // Q11: syncRequiredDetails mandatory if syncRequired = Yes
    if (form.syncRequired === 'Yes' && !form.syncRequiredDetails.trim()) {
      newErrors.syncRequiredDetails = true;
      valid = false;
    }

    // Q12: deploymentModelDetails always required
    if (!form.deploymentModelDetails.trim()) {
      newErrors.deploymentModelDetails = true;
      valid = false;
    }

    // Q13: postMigrationDetails always required
    if (!form.postMigrationDetails.trim()) {
      newErrors.postMigrationDetails = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // read in your env values
  const EMAIL_TO     = import.meta.env.VITE_EMAIL_TO || 'ahmed.obeid@zaintech.com';

  // Placeholder user info (will be replaced with actual Microsoft auth later)
  const USER_EMAIL = user.username;
  const USER_NAME = user.name;

  const handleSubmit = async () => {
    // run your existing validation
    if (!validateForm()) {
      toast.error('Please correct the highlighted errors.', {
        style: { background: '#fee2e2', color: '#991b1b' }
      });
      return;
    }

    setSubmitted(true);
    toast.success('Sending your responses…', {
      style: { background: '#bfdbfe', color: '#1e40af' }
    });

    // build a human-readable, parseable body
    const emailBody = formatEmailBody({
      ...form,
      infrastructure:
        form.infrastructure === 'Other Cloud'
          ? `Other Cloud: ${form.infrastructureOtherText}`
          : form.infrastructure,
      instances: form.instancesCustom.trim() || form.instances,
      dbSizeValue:
        form.dbSizeCustom.trim()
          ? `${form.dbSizeCustom} ${form.dbSizeUnit}`
          : `${form.dbSizeValue} ${form.dbSizeUnit}`,
    });

    // Create subject line with user email
    const subjectLine = `Windows & SQL Server Migration from: ${user.username}`;

    console.log('🌐 sending to:', FUNCTION_URL)
    console.log('📧 subject:', subjectLine)
    try {
        const payload = {
          // required by your email function:
          name:        user.name,
          email:       user.username,
          toEmail:     EMAIL_TO,
          companyName: 'MyWebAhmed',
          subject:     subjectLine,
          message:     emailBody,
        }
        console.log('📨 payload:', payload)
        console.log('📨 payload JSON:', JSON.stringify(payload, null, 2))

        const res = await fetch(FUNCTION_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        })
        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt || res.statusText)
        }
        toast.success('Email sent successfully!', {
          style: { background: '#dcfce7', color: '#166534' }
        })
      } catch (err) {
        console.error(err)
        toast.error(`Failed to send email: ${err.message}`, {
          style: { background: '#fee2e2', color: '#991b1b' }
        })
      } finally {
        // re-enable the button after a short delay
        setTimeout(() => setSubmitted(false), 5000);
      }
  };

  // Date range
  const today = new Date().toISOString().split('T')[0];
  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 10);
    return d.toISOString().split('T')[0];
  })();

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl w-full">
      <Toaster position="bottom-right" />
        <div className="flex justify-center mb-10">
          <img src="/logo.svg" alt="Company Logo" className="h-16 drop-shadow-lg" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Windows & SQL Server Migration
        </h2>

        <QuestionGroup
          form={form}
          errors={errors}
          onChange={handleChange}
          today={today}
          maxDate={maxDate}
        />

        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 mt-6"
        >
          {submitted ? 'Submitting…' : 'Submit Assessment'}
        </button>
    </div>
  );
}