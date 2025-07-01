export function formatEmailBody(form) {
  return Object.entries(form)
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      return `${label}: ${value || 'N/A'}`;
    })
    .join('\n');
}
