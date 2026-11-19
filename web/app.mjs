import { plotAttendance } from './charts.mjs';
import { el, fmt, put, setOptions, showLink, start, table } from './ui.mjs';
import { change, display } from './model.mjs';
start(data => {
  const sites = Object.keys(data.sites).sort((a,b) => a.localeCompare(b,'en-CA'));
  setOptions('first', sites, 'Fort Langley National Historic Site');
  setOptions('second', sites, 'Halifax Citadel National Historic Site');
  setOptions('year', [...data.years].reverse(), data.end);
  function render() {
    const a = el('first').value, b = el('second').value, year = el('year').value;
    const va = data.sites[a][year], vb = data.sites[b][year], diff = change(va, vb);
    put('label1', a); put('label2', b);
    put('value1', display(va)); put('value2', display(vb));
    put('finding', diff === null ? 'A comparison requires a published number for each place.' :
      diff === 0 ? 'Both selections have the same recorded attendance.' :
      (diff > 0 ? b : a) + ' recorded ' + fmt(Math.abs(diff)) + ' more visits in ' + year + '.');
    table('history', ['Fiscal year', a, b], [...data.years].reverse().map(y =>
      [y, display(data.sites[a][y]), display(data.sites[b][y])]));
    showLink('source', data.sources[year]);
    put('bar-title', 'Visits in '+year);
    plotAttendance(data, [a,b], year);
  }
  el('explore').addEventListener('change', render);
  new ResizeObserver(render).observe(el('trend').parentElement);
  render();
});
