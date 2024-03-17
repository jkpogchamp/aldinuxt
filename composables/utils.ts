interface Utils {
    formatToCurrency: (price: number) => string

}
export function useUtils (): Utils {
  function formatToCurrency (price: number): string {
    return price.toLocaleString('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 1, maximumFractionDigits: 3 })
  }
  return {
    formatToCurrency
  }
}
