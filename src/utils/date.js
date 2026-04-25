function normalizeDateOnly(input) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function isPastDate(date) {
  const selected = normalizeDateOnly(date);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return selected && selected < today;
}

module.exports = {
  normalizeDateOnly,
  isPastDate,
};
