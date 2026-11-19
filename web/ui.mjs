export const el = id => document.getElementById(id);
export const fmt = n => new Intl.NumberFormat('en-CA').format(n);
export function setOptions(id, values, selected) {
  el(id).replaceChildren(...values.map(v => new Option(v, v)));
  el(id).value = selected;
}
export function put(id, value) { el(id).textContent = value; }
export function table(id, headings, rows) {
  const head = document.createElement('thead');
  const title = head.insertRow();
  headings.forEach(h => {
    const cell = document.createElement('th');
    cell.scope = 'col'; cell.textContent = h; title.append(cell);
  });
  const body = document.createElement('tbody');
  rows.forEach(row => {
    const tr = body.insertRow();
    row.forEach((v, i) => {
      const td = i === 0 ? document.createElement('th') : document.createElement('td');
      if (i === 0) td.scope = 'row';
      td.textContent = v; tr.append(td);
    });
  });
  el(id).replaceChildren(head, body);
}
export function showLink(id, url) { el(id).href = url; }
export async function start(setup) {
  try {
    const response = await fetch('./data/edition.json');
    if (!response.ok) throw Error('Edition unavailable');
    const edition = await response.json();
    setup(edition);
    put('edition', 'Data retrieved ' + edition.retrieved + ' · Coverage ' + edition.start + ' to ' + edition.end);
    el('explore').hidden = false;
  } catch (err) {
    put('edition', 'The published data could not be loaded. Reload to try again.');
    console.error(err);
  }
}
