export function clientValidate(l) {
  const t = l.title;
  const d = l.description;
  const c = l.category;
  const loc = l.location;
  const cur = l.currency;
  const p = l.price_cents;

  if (!t || !d || !c || !loc || p == null) {
    return "All fields are required (and price must be a number).";
  }

  if (t.length < 3 || t.length > 120) return "Title must be 3-120 characters.";
  if (d.length < 10 || d.length > 5000)
    return "Description must be 10-5000 characters.";
  if (c.length < 2 || c.length > 40) return "Category must be 2-40 characters.";
  if (loc.length < 2 || loc.length > 80)
    return "Location must be 2-80 characters.";
  if (!Number.isInteger(p) || p < 0)
    return "Price must be a non-negative number.";
  if (cur.length !== 3) return "Currency must be a 3-letter code (e.g., CAD).";

  return "";
}
