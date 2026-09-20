/* eslint-disable @typescript-eslint/no-namespace */
export namespace Validation {
  export function isNotEmpty(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  export function isValidUserId(id: string): boolean {
    return /^\d+$/.test(id.trim());
  }

  export function isValidYear(yearStr: string): boolean {
    if (!/^(1\d{3}|20\d{2})$/.test(yearStr.trim())) {
      return false;
    }
    const year = parseInt(yearStr, 10);
    return year <= new Date().getFullYear();
  }

  export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}
