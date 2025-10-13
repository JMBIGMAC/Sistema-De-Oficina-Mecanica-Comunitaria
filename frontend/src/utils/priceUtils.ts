/**
 * Utility functions for price formatting and handling
 */

/**
 * Converts a price value (number or string) to a number
 * Handles backend DecimalField serialization which returns strings
 * Returns 0 for invalid values to prevent NaN errors
 */
export const parsePrice = (value: number | string): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  const result = parseFloat(String(value));
  return isNaN(result) ? 0 : result;
};

/**
 * Formats a price value to currency string (R$)
 * Returns "R$ 0,00" for invalid values
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
 * Returns "0.00" for invalid values
 */
export const formatPrice = (value: number | string, decimals: number = 2): string => {
  const numericValue = parsePrice(value);
  return numericValue.toFixed(decimals);
};
