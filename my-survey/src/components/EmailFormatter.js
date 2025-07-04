export function formatEmailBody(form) {
  // Define the question mapping with actual question text
  const questionMap = {
    infrastructure: '1. Describe your current infrastructure',
    infrastructureOtherText: 'Please specify other cloud',
    sqlVersions: '2. SQL Server versions you\'re running',
    instances: '3. Total number of SQL Server instances to migrate',
    instancesCustom: 'Custom instances',
    dbSizeValue: '4. Approximate total database size',
    dbSizeUnit: 'Database size unit',
    dbSizeCustom: 'Custom database size',
    appTypes: '5. Types of applications using these databases',
    reasons: '6. Primary reasons for migrating to Azure',
    compliance: '7. Compliance/security requirements (HIPAA, GDPR, etc.)',
    complianceDetails: 'Compliance details',
    goLive: '8. Target go-live date',
    peakTimes: '9. Peak workload times / critical usage periods',
    downtime: '10. Acceptable downtime window during migration',
    syncRequired: '11. Real-time data synchronization required?',
    syncRequiredDetails: 'Sync details',
    deploymentModel: '12. Preferred Azure SQL deployment model',
    deploymentModelDetails: 'Deployment model details',
    postMigration: '13. Post-migration optimization or managed services?',
    postMigrationDetails: 'Post-migration details'
  };

  // Group related fields together
  const groupedSections = [
    {
      title: 'Infrastructure',
      fields: ['infrastructure', 'infrastructureOtherText']
    },
    {
      title: 'SQL Versions', 
      fields: ['sqlVersions']
    },
    {
      title: 'Instances',
      fields: ['instances', 'instancesCustom']
    },
    {
      title: 'Database Size',
      fields: ['dbSizeValue', 'dbSizeUnit', 'dbSizeCustom']
    },
    {
      title: 'Applications',
      fields: ['appTypes']
    },
    {
      title: 'Migration Reasons',
      fields: ['reasons']
    },
    {
      title: 'Compliance',
      fields: ['compliance', 'complianceDetails']
    },
    {
      title: 'Timeline',
      fields: ['goLive']
    },
    {
      title: 'Performance',
      fields: ['peakTimes']
    },
    {
      title: 'Downtime',
      fields: ['downtime']
    },
    {
      title: 'Synchronization',
      fields: ['syncRequired', 'syncRequiredDetails']
    },
    {
      title: 'Deployment',
      fields: ['deploymentModel', 'deploymentModelDetails']
    },
    {
      title: 'Post-Migration',
      fields: ['postMigration', 'postMigrationDetails']
    }
  ];

  // Build sections
  const sections = groupedSections.map(section => {
    const sectionLines = section.fields
      .map(field => {
        const value = form[field];
        // Skip fields that are empty, null, or undefined
        if (value === undefined || value === null || value === '') {
          return null;
        }
        const question = questionMap[field] || field;
        return `${question}: ${value}`;
      })
      .filter(line => line !== null); // Remove null entries
    
    return sectionLines.join('\n');
  }).filter(section => section.trim().length > 0);

  // Build the final email body
  return [
    'Windows & SQL Server Migration Assessment Details',
    '==================================================',
    '',
    ...sections,
    '',
    '==================================================',
    'Best regards,',
    'Infrastructure Data Migration Team'
  ].join('\n\n');
}
