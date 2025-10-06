import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
/**
 * Formats a given date to "YYYY-MM-DD"
 * @param date - The date to format
 * @returns The formatted date string
 */
dayjs.extend(customParseFormat);
export const formattDate = (date: Date): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Returns the ordinal suffix of a given number
 * @param n - The number to get the ordinal suffix for
 * @returns The ordinal suffix
 */
const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

/**
 * Formats a given date to "D[st|nd|rd|th] MMMM YYYY"
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formatDetailedDate = (date: Date): string => {
  if (!date) return '';
  const day = dayjs(date).date();
  const suffix = getOrdinalSuffix(day);
  return dayjs(date).format(`D[${suffix}] MMMM YYYY`);
};

export const formattedDate = (date: Date): string => {
  if (!date) return '';
  return dayjs(date).format('DD-MM-YYYY');
  // return dayjs(date).format("YYYY-MM-DD");
};

export const formatYear = (date: Date): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY');
};

/**
 * Formats a date to the given format string
 * @param date - The date to format (can be Date object or string)
 * @param formatString - The desired format (e.g., "MMM D, YYYY")
 * @returns The formatted date string
 */
export const formatCustomDate = (
  date: Date | string | null,
  formatString: string,
): string => {
  if (!date) return '';
  return dayjs(date).format(formatString);
};

export const YearMonthCustomDate = (
  date: Date | string | null,
  formatString: string = 'MMMM D, YYYY',
): string => {
  if (!date) return '';

  const dayjsDate = dayjs(date);

  const format = formatString.replace('MMMM', 'MMM');

  const formatted = dayjsDate.format(format);

  return formatted.replace('AM', 'a.m.').replace('PM', 'p.m.');
};

export const CustomDate = (
  date: Date | string | null,
  // formatString: string = "MMM D, YYYY, h:mm A"
  formatString: string = 'MMM D, YYYY, h:mm A',
): string => {
  if (!date) return '';
  const formatted = dayjs(date).format(formatString);
  return formatted.replace('AM', 'a.m.').replace('PM', 'p.m.');
};

export const formatDateForInput = (date?: Date | string | null) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

export const formatTime = (time: string | null): string => {
  if (!time) return '';
  const formatted = dayjs(time, 'HH:mm:ss').format('h:mm A');
  return formatted.replace('AM', 'a.m.').replace('PM', 'p.m.');
};
