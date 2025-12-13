/**
 * Currency utilities for Tunisian Dinar (DT)
 */

export function formatTND(amount: number): string {
  // Format with DT symbol instead of TND
  const formatted = new Intl.NumberFormat('fr-TN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)
  return `${formatted} DT`
}

export function formatTNDCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M DT`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K DT`
  }
  return formatTND(amount)
}

export const CURRENCY_SYMBOL = 'DT'
export const CURRENCY_NAME = 'Tunisian Dinar'

