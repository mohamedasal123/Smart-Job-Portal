/**
 * Evaluates password strength and returns criteria met, label, score, and color.
 */
export function evaluatePasswordStrength(password) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  if (password.length === 0) {
    return { criteria, score, label: '', color: '', level: 0 };
  } else if (score <= 2) {
    return { criteria, score, label: 'Weak', color: 'bg-error', level: 1 };
  } else if (score <= 3) {
    return { criteria, score, label: 'Medium', color: 'bg-[#F59E0B]', level: 2 };
  } else if (score <= 4) {
    return { criteria, score, label: 'Strong', color: 'bg-secondary', level: 3 };
  }

  return { criteria, score, label: 'Very Strong', color: 'bg-[#22C55E]', level: 4 };
}

/**
 * Validates an email address format.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
