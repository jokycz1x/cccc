/**
 * Formátuje datum do lokalizovaného formátu
 * @param dateString - ISO string nebo Date objekt
 * @param locale - lokalizace (výchozí 'cs-CZ')
 * @returns formátovaný řetězec data
 */
export function formatDate(dateString: string | Date, locale: string = 'cs-CZ'): string {
  if (!dateString) return '';

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formátuje částku jako měnu
 * @param amount - částka k formátování
 * @param currency - měna (výchozí 'CZK')
 * @param locale - lokalizace (výchozí 'cs-CZ')
 * @returns formátovaný řetězec měny
 */
export function formatCurrency(amount: number | string, currency: string = 'CZK', locale: string = 'cs-CZ'): string {
  if (amount === null || amount === undefined) return '';

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) return '';

  // Použijeme CZK pro českou lokalizaci, jinak použijeme zadanou měnu
  const currencyToUse = locale === 'cs-CZ' || locale === 'cs' ? 'CZK' : currency;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyToUse,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Zkrátí text na určitou délku a přidá tři tečky
 * @param text - text ke zkrácení
 * @param maxLength - maximální délka (výchozí 100)
 * @returns zkrácený text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
}

/**
 * Převede první písmeno textu na velké
 * @param text - text k úpravě
 * @returns text s velkým prvním písmenem
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generuje náhodný řetězec
 * @param length - délka řetězce (výchozí 10)
 * @returns náhodný řetězec
 */
export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
