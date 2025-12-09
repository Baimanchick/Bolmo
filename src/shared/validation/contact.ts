// src/shared/validation/contact.ts
export type ContactType = 'email' | 'phone' | 'unknown';

export const normalizeContactValue = (rawValue: string): string => {
  return rawValue.trim()
}

export const isEmailContact = (rawValue: string): boolean => {
  const value = normalizeContactValue(rawValue)

  if (!value) return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(value)
}

export const isPhoneContact = (rawValue: string): boolean => {
  const digitsOnly = rawValue.replace(/\D/g, '')
  // Минимум 10 цифр, без жёсткой привязки к стране — под СНГ ок

  return digitsOnly.length >= 10
}

export const detectContactType = (rawValue: string): ContactType => {
  if (isEmailContact(rawValue)) return 'email'
  if (isPhoneContact(rawValue)) return 'phone'

  return 'unknown'
}
