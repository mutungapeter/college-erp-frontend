export const formatCurrency = (value: number | string) => {
  const numericValue = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(numericValue);
};
