// File: src/components/SurveyForm.jsx
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const MAX_DB_SIZE_TB = 12500;

export default function SurveyForm() {
  const [form, setForm] = useState({
    infrastructure: '',
    sqlVersions: '',
    instances: '',
    dbSizeValue: '',
    dbSizeUnit: 'GB',
    appTypes: '',
    reasons: '',
    compliance: '',
    goLive: '',
    peakTimes: '',
    downtime: '',
    syncRequired: '',
    deploymentModel: '',
    postMigration: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value && key !== 'dbSizeUnit') {
        newErrors[key] = true;
        valid = false;
      }
    });

    const instances = parseInt(form.instances);
    if (isNaN(instances) || instances < 1 || instances > 99999) {
      toast.custom(
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <strong>Error:</strong> Number of instances must be between 1 and 99,999.
        </div>
      );
      newErrors.instances = true;
      valid = false;
    }

    const dbSize = parseFloat(form.dbSizeValue);
    if (!isNaN(dbSize)) {
      const dbSizeInTB = form.dbSizeUnit === 'GB' ? dbSize / 1024 : dbSize;
      if (dbSizeInTB > MAX_DB_SIZE_TB) {
        toast.custom(
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
            <strong>Warning:</strong> Database size exceeds the maximum allowed (12.5 PB).
          </div>
        );
        newErrors.dbSizeValue = true;
        valid = false;
      }
    } else {
      toast.custom(
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <strong>Error:</strong> Database size must be a valid number.
        </div>
      );
      newErrors.dbSizeValue = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.custom(
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <strong>Error:</strong> Please correct the highlighted errors.
        </div>
      );
      return;
    }

    setSubmitted(true);
    toast.custom(
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
        <strong>Success:</strong> Form submitted successfully! Sending to test@example.com...
      </div>
    );
    setTimeout(() => setSubmitted(false), 5000);

    const emailBody = Object.entries(form)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    console.log('Email to: test@example.com\n' + emailBody);
    // Placeholder for email integration
  };

  const today = new Date().toISOString().split('T')[0];
  const tenYearsLater = new Date();
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
  const maxDate = tenYearsLater.toISOString().split('T')[0];

  return (
    <div className="max-w-xl w-full">
      <Toaster position="bottom-right" />
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="Company Logo" className="h-16 drop-shadow-lg" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-left">
        SQL Server Migration Assessment
      </h2>

      <div className="space-y-6">
        {[{
          label: '1) Describe your current infrastructure',
          name: 'infrastructure',
          type: 'select',
          options: ['On-premises', 'Hybrid', 'Other Cloud'],
        }, {
          label: "2) SQL Server versions you're running",
          name: 'sqlVersions',
          type: 'text',
          placeholder: 'e.g. SQL Server 2016, 2019',
        }, {
          label: '3) Total number of SQL Server instances to migrate',
          name: 'instances',
          type: 'number',
          placeholder: 'e.g. 3',
        }].map(({ label, name, type, options, placeholder }) => (
          <div key={name} className="flex flex-col text-left">
            <label className={`text-gray-700 font-semibold mb-1 ${errors[name] ? 'text-red-600' : ''}`}>{label}</label>
            {type === 'select' ? (
              <select
                className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form[name]}
                onChange={(e) => handleChange(name, e.target.value)}
              >
                <option value="">-- Select --</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                placeholder={placeholder}
                className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form[name]}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* 4) DB Size */}
        <div className="flex flex-col text-left">
          <label className={`text-gray-700 font-semibold mb-1 ${errors.dbSizeValue ? 'text-red-600' : ''}`}>4) Approximate total database size (TB/GB)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              step="1"
              className={`flex-1 border ${errors.dbSizeValue ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form.dbSizeValue}
              onChange={(e) => handleChange('dbSizeValue', e.target.value)}
            />
            <select
              className="w-24 border border-gray-300 rounded px-2 py-2"
              value={form.dbSizeUnit}
              onChange={(e) => handleChange('dbSizeUnit', e.target.value)}
            >
              <option value="TB">TB</option>
              <option value="GB">GB</option>
            </select>
          </div>
        </div>

        {/* Remaining questions */}
        {[{
          label: '5) Types of applications using these databases',
          name: 'appTypes',
          type: 'text',
          placeholder: 'e.g. ERP, BI, custom apps',
        }, {
          label: '6) Primary reasons for migrating to Azure',
          name: 'reasons',
          type: 'textarea',
          placeholder: 'e.g. cost, scalability, security',
        }, {
          label: '7) Compliance/security requirements (HIPAA, GDPR, etc.)',
          name: 'compliance',
          type: 'textarea',
          placeholder: 'e.g. HIPAA, GDPR, SOC2',
        }, {
          label: '8) Target go-live date',
          name: 'goLive',
          type: 'date',
        }, {
          label: '9) Peak workload times / critical usage periods',
          name: 'peakTimes',
          type: 'textarea',
          placeholder: 'e.g. month-end processing',
        }, {
          label: '10) Acceptable downtime window during migration',
          name: 'downtime',
          type: 'text',
          placeholder: 'e.g. 2 hours, off-peak only',
        }, {
          label: '11) Real-time data synchronization required?',
          name: 'syncRequired',
          type: 'select',
          options: ['Yes', 'No', 'Yes, partially'],
        }, {
          label: '12) Preferred Azure SQL deployment model',
          name: 'deploymentModel',
          type: 'select',
          options: ['SQL Database', 'Managed Instance', 'VM'],
        }, {
          label: '13) Post-migration optimization or managed services?',
          name: 'postMigration',
          type: 'select',
          options: ['Yes', 'No', 'Maybe, need guidance'],
        }].map(({ label, name, type, options, placeholder }) => (
          <div key={name} className="flex flex-col text-left">
            <label className={`text-gray-700 font-semibold mb-1 ${errors[name] ? 'text-red-600' : ''}`}>{label}</label>
            {type === 'select' ? (
              <select
                className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form[name]}
                onChange={(e) => handleChange(name, e.target.value)}
              >
                <option value="">-- Select --</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                rows={3}
                placeholder={placeholder}
                className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form[name]}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            ) : (
              <input
                type={type}
                placeholder={placeholder}
                min={name === 'goLive' ? today : undefined}
                max={name === 'goLive' ? maxDate : undefined}
                className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={form[name]}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 mt-6"
          onClick={handleSubmit}
        >
          Submit Assessment
        </button>
      </div>
    </div>
  );
}
