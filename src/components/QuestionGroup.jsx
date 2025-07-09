import React from 'react';
import SelectInput from './inputs/SelectInput';
import TextInput from './inputs/TextInput';
import TextArea from './inputs/TextArea';
import RadioGroup from './inputs/RadioGroup';
import ConditionalInput from './inputs/ConditionalInput';

export default function QuestionGroup({ form, errors, onChange, today, maxDate }) {
  return (
    <>
      {/* Q1 */}
      <SelectInput
        label="1. Describe your current infrastructure"
        value={form.infrastructure}
        onChange={val => onChange('infrastructure', val)}
        error={errors.infrastructure}
        options={['On-premises', 'Hybrid', 'Other Cloud']}
      />
      <ConditionalInput
        label="Please specify other cloud"
        value={form.infrastructureOtherText}
        onChange={val => onChange('infrastructureOtherText', val)}
        error={errors.infrastructureOtherText}
        placeholder="Type your cloud provider"
        show={form.infrastructure === 'Other Cloud'}
      />

      {/* Q2 */}
      <TextInput
        label="2. SQL Server versions you're running"
        value={form.sqlVersions}
        onChange={val => onChange('sqlVersions', val)}
        error={errors.sqlVersions}
        placeholder="e.g. SQL Server 2016, 2019"
      />

      {/* Q3 */}
      <div className="mb-10 text-left">
        <label className={`block text-gray-700 font-medium ${errors.instances||errors.instancesCustom ? 'text-red-600' : ''}`}>
          3. Total number of SQL Server instances to migrate
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={form.instancesCustom.trim() ? form.instancesCustom : form.instances || 1}
          onChange={e => {
            onChange('instancesCustom', '')
            onChange('instances', e.target.value, true)
          }}
          className="w-full mt-1"
          style={{ accentColor: '#0075ff' }}
        />
        <div className="text-sm text-gray-600 mt-1 italic">
          Selected: {form.instancesCustom.trim() || form.instances || '1'}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">Or specify custom:</span>
          <input
            type="number"
            min="1"
            max="9999"
            maxLength="4"
            className={`border rounded px-2 py-1 w-32 ${errors.instancesCustom ? 'border-red-500' : 'border-gray-300'}`}
            value={form.instancesCustom}
            onChange={e => {
              const val = e.target.value
              if (val.length <= 4) {
                onChange('instancesCustom', val)
                if (val.trim()) onChange('instances', '')
              }
            }}
          />
        </div>
      </div>

      {/* Q4 */}
      <div className="mb-10 text-left">
        <label className={`block text-gray-700 font-medium ${errors.dbSizeValue||errors.dbSizeCustom ? 'text-red-600' : ''}`}>
          4. Approximate total database size
        </label>
        <input
          type="range"
          min="1"
          max="12500"
          value={form.dbSizeCustom.trim() || form.dbSizeValue || 1}
          onChange={e => {
            onChange('dbSizeCustom', '')
            onChange('dbSizeValue', e.target.value, true)
          }}
          className="w-full mt-1"
          style={{ accentColor: '#0075ff' }}
        />
        <div className="text-sm text-gray-600 mt-1 italic">
          Selected: {form.dbSizeCustom.trim() || form.dbSizeValue || '1'} {form.dbSizeUnit}
        </div>
        <div className="mt-2">
          <span className="text-sm">Or custom size:</span>
          <input
            type="number"
            min="1"
            max="125000"
            maxLength="5"
            className={`ml-2 border rounded px-2 py-1 w-32 ${errors.dbSizeCustom ? 'border-red-500' : 'border-gray-300'}`}
            value={form.dbSizeCustom}
            onChange={e => {
              const val = e.target.value
              if (val.length <= 5) {
                onChange('dbSizeCustom', val)
                if (val.trim()) onChange('dbSizeValue', '')
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">Unit:</span>
          <select
            value={form.dbSizeUnit}
            onChange={e => onChange('dbSizeUnit', e.target.value)}
            className={`border rounded px-2 py-1 w-20 ${errors.dbSizeUnit ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option>GB</option>
            <option>TB</option>
          </select>
        </div>
      </div>

      {/* Q5 */}
      <TextInput
        label="5. Types of applications using these databases"
        value={form.appTypes}
        onChange={val => onChange('appTypes', val)}
        error={errors.appTypes}
        placeholder="e.g. ERP, BI, custom apps"
      />

      {/* Q6 */}
      <TextArea
        label="6. Primary reasons for migrating to Azure"
        value={form.reasons}
        onChange={val => onChange('reasons', val)}
        error={errors.reasons}
        placeholder="e.g. cost, scalability, security"
      />

      {/* Q7 */}
      <RadioGroup
        label="7. Compliance/security requirements (HIPAA, GDPR, etc.)"
        options={['Yes', 'No']}
        value={form.compliance}
        onChange={val => onChange('compliance', val)}
        error={errors.compliance}
      />
      <ConditionalInput
        label="Please provide more details"
        value={form.complianceDetails}
        onChange={val => onChange('complianceDetails', val)}
        error={errors.complianceDetails}
        show={form.compliance === 'Yes'}
        placeholder="e.g. HIPAA, GDPR, SOC2"
      />

      {/* Q8 */}
      <TextInput
        label="8. Target go-live date"
        type="date"
        value={form.goLive}
        onChange={val => onChange('goLive', val)}
        error={errors.goLive}
        placeholder=""
        min={today}
        max={maxDate}
      />

      {/* Q9 */}
      <TextArea
        label="9. Peak workload times / critical usage periods"
        value={form.peakTimes}
        onChange={val => onChange('peakTimes', val)}
        error={errors.peakTimes}
        placeholder="e.g. month-end processing"
      />

      {/* Q10 */}
      <TextInput
        label="10. Acceptable downtime window during migration"
        value={form.downtime}
        onChange={val => onChange('downtime', val)}
        error={errors.downtime}
        placeholder="e.g. 2 hours, off-peak only"
      />

      {/* Q11 */}
      <RadioGroup
        label="11. Real-time data synchronization required?"
        options={['Yes', 'No']}
        value={form.syncRequired}
        onChange={val => onChange('syncRequired', val)}
        error={errors.syncRequired}
      />
      <ConditionalInput
        label="Please provide more details"
        value={form.syncRequiredDetails}
        onChange={val => onChange('syncRequiredDetails', val)}
        error={errors.syncRequiredDetails}
        show={form.syncRequired === 'Yes'}
        placeholder="E.g. Which systems require sync?"
      />

      {/* Q12 */}
      <SelectInput
        label="12. Preferred Azure SQL deployment model"
        value={form.deploymentModel}
        onChange={val => onChange('deploymentModel', val)}
        error={errors.deploymentModel}
        options={['SQL Database', 'Managed Instance', 'VM', 'Other']}
      />
      <ConditionalInput
        label="Please provide more details"
        value={form.deploymentModelDetails}
        onChange={val => onChange('deploymentModelDetails', val)}
        error={errors.deploymentModelDetails}
        show={!!form.deploymentModel}
        placeholder="E.g. Reason for your choice"
      />

      {/* Q13 */}
      <RadioGroup
        label="13. Post-migration optimization or managed services?"
        options={['Yes', 'No']}
        value={form.postMigration}
        onChange={val => onChange('postMigration', val)}
        error={errors.postMigration}
      />
      <ConditionalInput
        label="Please provide more details"
        value={form.postMigrationDetails}
        onChange={val => onChange('postMigrationDetails', val)}
        error={errors.postMigrationDetails}
        show={!!form.postMigration}
        placeholder="E.g. Specific services you need"
      />
    </>
  );
}
