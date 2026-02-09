export function validateLength(name, value, min, max) {
  if (value.length < min || value.length > max) {
    return `${name} must be ${min}-${max} characters`;
  }
  return null;
}

export function validatePositiveInteger(name, value) {
  if (!Number.isInteger(value) || value <= 0)
    return `${name} must be a positive integer`;

  return null;
}

export function validateNonNegativeInteger(name, value) {
  if (!Number.isInteger(value) || value < 0)
    return `${name} must be a non-negative integer`;

  return null;
}
