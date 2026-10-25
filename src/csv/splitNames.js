// Splits "A, B and C" (also "A, and B") into ["A", "B", "C"].
const SEPARATOR = /\s*,\s*|\s+and\s+/;

function splitNames(value) {
  return (value ?? '')
    .split(SEPARATOR)
    .map((name) => name.replace(/^and\s+/, '').trim())
    .filter((name) => name.length > 0);
}

module.exports = { splitNames };
