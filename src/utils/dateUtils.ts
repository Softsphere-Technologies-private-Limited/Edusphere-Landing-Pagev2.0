/**
 * IST (Indian Standard Time - Asia/Kolkata, UTC+5:30) Date and Time Utilities
 */

/**
 * Formats a Date object, Firestore timestamp, timestamp string or number to an IST string.
 * Example output: "10 Aug 2026, 09:41:16 PM IST"
 */
export function formatISTTimestamp(dateInput?: any): string {
  if (!dateInput) return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

  let date: Date;

  if (typeof dateInput === 'object' && dateInput !== null && 'seconds' in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    date = new Date();
  }

  const formattedStr = date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return `${formattedStr} IST`;
}

/**
 * Formats time only in IST format.
 * Example output: "09:41 PM IST"
 */
export function formatISTTime(dateInput?: any): string {
  if (!dateInput) return 'Just now';

  let date: Date;
  if (typeof dateInput === 'object' && dateInput !== null && 'seconds' in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return 'Just now';

  const formattedStr = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${formattedStr} IST`;
}

/**
 * Returns current ISO date timestamp string in IST timezone ISO format.
 */
export function getISTIsoString(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().replace('Z', '+05:30');
}
