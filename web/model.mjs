export function change(first, second) {
  return typeof first === 'number' && typeof second === 'number' ? second - first : null;
}
export function display(value) {
  if (typeof value === 'number') return value.toLocaleString('en-CA');
  return ({ UR: 'Unable to report', TC: 'Temporarily closed', Blank: 'Blank in source' })[value] ?? 'Unavailable';
}
