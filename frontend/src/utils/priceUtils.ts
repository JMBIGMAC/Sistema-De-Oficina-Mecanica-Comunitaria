/**
 * Utility functions for price formatting and handling
 */

/**
 * Converts a price value (number or string) to a number
 * Handles backend DecimalField serialization which returns strings
 */
export const parsePrice = (value: number | string): number => {
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(String(value));
};

/**
 * Formats a price value to currency string (R$)
 */
export const formatCurrency = (value: number | string): string => {
  const numericValue = parsePrice(value);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

/**
 * Formats a price value to fixed decimal places (2 decimals)
 */
export const formatPrice = (value: number | string, decimals: number = 2): string => {
  const numericValue = parsePrice(value);
  return numericValue.toFixed(decimals);
};
