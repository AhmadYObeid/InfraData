export function formatEmailBody(form, submitter) {
  // timestamp
  const now = new Date().toLocaleString();

  // turn camelCase keys into human labels
  const rows = Object.entries(form).map(([key, val]) => {
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase());
    return `${label}: ${val || 'N/A'}`;
  });

  // build the final plain‐text body
  return [
    'SQL Server Migration Assessment Submission',
    `Submitted by: ${submitter}`,
    `Date: ${now}`,
    '--------------------------------------------------',
    ...rows,
    '',
    'Regards,',
    'Infra Data Automation Bot'
  ].join('\n');
}
