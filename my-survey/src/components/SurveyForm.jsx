import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { formatEmailBody } from './EmailFormatter';
import QuestionGroup from './QuestionGroup';

const MAX_DB_SIZE_TB = 12500;

export default function SurveyForm() {
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

    // Basic required checks for all except optional/custom fields
    Object.entries(form).forEach(([key, value]) => {
      // skip “instances” if custom value entered
      if (key === 'instances' && form.instancesCustom.trim()) return;
      // skip “dbSizeValue” if custom entered
      if (key === 'dbSizeValue' && form.dbSizeCustom.trim()) return;

      if (
        !value &&
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

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please correct the highlighted errors.', {
        style: { background: '#fee2e2', color: '#991b1b' }
      });
      return;
    }

    setSubmitted(true);
    toast.success('Form submitted successfully!', {
      style: { background: '#dcfce7', color: '#166534' }
    });

    const emailBody = formatEmailBody({
      ...form,
      infrastructure:
        form.infrastructure === 'Other Cloud'
          ? `Other Cloud: ${form.infrastructureOtherText}`
          : form.infrastructure,
      instances: form.instancesCustom.trim() || form.instances,
      dbSizeValue: form.dbSizeCustom.trim() || form.dbSizeValue + ' ' + form.dbSizeUnit,
    });

    console.log('Email to: Ahmed.Obeid@zaintech.com\n' + emailBody);

    setTimeout(() => setSubmitted(false), 5000);
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
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Company Logo" className="h-16 drop-shadow-lg" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          SQL Server Migration Assessment
        </h2>

        <QuestionGroup
          form={form}
          errors={errors}
          onChange={handleChange}
          today={today}
          maxDate={maxDate}
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 mt-6"
          onClick={handleSubmit}
          disabled={submitted}
        >
          {submitted ? 'Submission Complete' : 'Submit Assessment'}
        </button>
    </div>
  );
}
