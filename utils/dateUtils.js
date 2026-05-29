export const formatDateFR = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const toSupabaseDate = (date) => {
  return date.toISOString().split('T')[0];
};
