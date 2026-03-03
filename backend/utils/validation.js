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

export function validateListing(data) {
  const {
    title,
    description,
    price_cents,
    currency,
    category,
    location,
    status,
  } = data;

  if (!title || typeof title !== "string" || title.trim().length < 3)
    return { error: "Title must be at least 3 characters." };

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  )
    return { error: "Description must be at least 10 characters." };

  if (
    price_cents === undefined ||
    !Number.isInteger(price_cents) ||
    price_cents < 0
  )
    return { error: "Price must be a valid positive number (in cents)" };

  if (!currency || typeof currency !== "string")
    return { error: "Currency is required." };

  if (!category || typeof category !== "string")
    return { error: "Category is required." };

  if (!location || typeof location !== "string")
    return { error: "Location is required." };

  if (status && !["active", "sold"].includes(status))
    return { error: "Invalid status value." };

  return { error: null };
}
