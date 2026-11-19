const NS = 'http://www.w3.org/2000/svg';
function shape(tag, attributes, text) {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
const format = value => value.toLocaleString('en-CA');
const compact = new Intl.NumberFormat('en-CA', {notation: 'compact', maximumFractionDigits: 1});

export function plotAttendance(data, places, selected) {
  const root = document.getElementById('trend');
  const width = Math.max(290, Math.min(860, root.clientWidth || 680));
  const left = 47, right = width - 14, top = 15, bottom = 204;
  const x = index => left + (right - left) * index / (data.years.length - 1);
  const values = places.flatMap(name => Object.values(data.sites[name])).filter(Number.isFinite);
  const ceiling = Math.max(1, ...values);
  const y = value => bottom - value / ceiling * (bottom - top);
  const svg = shape('svg', {viewBox: '0 0 '+width+' 243', role:'img',
    'aria-label':'Annual visits at '+places.join(' and ')+'. Exact counts and unavailable years appear in the table.'});
  for (let i = 0; i <= 4; i++) {
    const v = ceiling * i / 4;
    svg.append(shape('line',{x1:left,x2:right,y1:y(v),y2:y(v),stroke:'#d1d8d0'}),
      shape('text',{x:left-6,y:y(v)+4,'text-anchor':'end'},compact.format(v)));
  }
  const selectedX = x(data.years.indexOf(selected));
  svg.append(shape('line',{x1:selectedX,x2:selectedX,y1:top,y2:bottom,stroke:'#787967','stroke-dasharray':'3 3'}));
  const ticks = [0, Math.floor((data.years.length-1)/2), data.years.length-1];
  ticks.forEach((i,j) => svg.append(shape('text',{x:x(i),y:226,'text-anchor':['start','middle','end'][j]},data.years[i])));
  const colors = ['#00665f','#a84417'];
  const legend = document.getElementById('legend');
  legend.replaceChildren();
  const bars = document.getElementById('year-bars');
  bars.replaceChildren();
  const yearMax = Math.max(1,...places.map(p => data.sites[p][selected]).filter(Number.isFinite));
  places.forEach((place,k) => {
    const span = document.createElement('span');
    span.className = 'series series-'+k; span.textContent = place; legend.append(span);
    let path = '', start = true;
    const markers = [];
    data.years.forEach((year,i) => {
      const v = data.sites[place][year];
      if (!Number.isFinite(v)) {start = true; return;}
      path += (start?'M':'L')+x(i)+' '+y(v)+' '; start = false;
      const dot = shape('circle',{cx:x(i),cy:y(v),r:year===selected?4.5:2.3,fill:colors[k]});
      dot.append(shape('title',{},place+' · '+year+' · '+format(v)+' visits'));
      markers.push(dot);
    });
    svg.append(shape('path',{d:path,fill:'none',stroke:colors[k],'stroke-width':2.3,'stroke-dasharray':k?'6 3':'none'}), ...markers);
    const v = data.sites[place][selected];
    const bar = document.createElement('div'); bar.className='year-bar';
    const desc = document.createElement('div'); desc.textContent=place+' · '+document.getElementById('value'+(k+1)).textContent;
    const track = document.createElement('div'); track.className='track';
    if (Number.isFinite(v)) {
      const fill=document.createElement('div'); fill.style.width=(100*v/yearMax)+'%'; fill.style.background=colors[k]; track.append(fill);
    }
    bar.append(desc,track); bars.append(bar);
  });
  root.replaceChildren(svg);
}
