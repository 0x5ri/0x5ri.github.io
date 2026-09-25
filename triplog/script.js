const reveals=document.querySelectorAll(".reveal");
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
reveals.forEach(el=>observer.observe(el));

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const f=btn.dataset.filter;
  document.querySelectorAll(".trip[data-type]").forEach(card=>card.classList.toggle("hidden",f!=="all"&&card.dataset.type!==f));
}));

const counters=document.querySelectorAll(".counter");
const co=new IntersectionObserver(entries=>entries.forEach(e=>{
 if(!e.isIntersecting||e.target.dataset.done)return;
 e.target.dataset.done="1"; const target=+e.target.dataset.target; let n=0;
 const timer=setInterval(()=>{n++;e.target.textContent=n;if(n>=target)clearInterval(timer)},180);
}),{threshold:.7}); counters.forEach(c=>co.observe(c));

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}});

document.querySelectorAll(".magnetic").forEach(el=>{
 el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.06}px,${(e.clientY-r.top-r.height/2)*.08}px)`});
 el.addEventListener("pointerleave",()=>el.style.transform="");
});

/* Final live destination label: bottom only, five stops. */
(() => {
  const label = document.getElementById('liveJourneyLabel');
  const progress = document.querySelector('.journey-progress i');
  if (!label) return;

  const name = label.querySelector('.label-name');
  const count = label.querySelector('small');
  const stops = ['CHILIKA','SATAPADA','KONARK','HINDOL','KORAPUT'];
  const cycle = 30000;
  const scene = 6000;
  const start = performance.now();

  function update(now){
    const elapsed = (now - start) % cycle;
    const index = Math.min(stops.length - 1, Math.floor(elapsed / scene));
    if (name) name.textContent = stops[index];
    if (count) count.textContent = `TRIP ${String(index + 1).padStart(2,'0')} / 05`;
    if (progress) progress.style.transform = `scaleX(${elapsed / cycle})`;
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();

(() => { const board=document.querySelector('.map-board'); if(!board)return; const routes=board.querySelectorAll('.map-route'); const pins=board.querySelectorAll('.map-pin'); const activate=n=>{routes.forEach(r=>r.classList.toggle('route-hot',r.dataset.route===n));}; pins.forEach(p=>p.addEventListener('mouseenter',()=>activate(p.dataset.route))); pins.forEach(p=>p.addEventListener('click',()=>activate(p.dataset.route))); board.addEventListener('mouseleave',()=>routes.forEach(r=>r.classList.remove('route-hot'))); })();
// Map V2: destination controls, hover states and animated archive status.
(() => {
  const board=document.querySelector('.map-board-v2');
  if(!board) return;
  const routes=[...board.querySelectorAll('.route')];
  const nodes=[...board.querySelectorAll('.map-node')];
  const buttons=[...board.querySelectorAll('.map-route-list button')];
  const status=board.querySelector('#mapStatus');
  const sub=board.querySelector('#mapStatusSub');
  const labels={all:['ARCHIVE ACTIVE','Select a destination'],hindol:['HINDOL FOREST','SOLO · LOGGED'],konark:['KONARK','SOLO · LOGGED'],satapada:['RAJHANSA ISLAND','WITH FRIENDS · LOGGED'],koraput:['KORAPUT','UPCOMING · TRAIN JOURNEY']};
  function activate(key){
    routes.forEach(r=>r.classList.toggle('active',key==='all'||r.dataset.route===key));
    nodes.forEach(n=>n.classList.toggle('active',key!=='all'&&n.dataset.route===key));
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.route===key));
    const l=labels[key]||labels.all; status.textContent=l[0]; sub.textContent=l[1];
  }
  buttons.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.route)));
  nodes.forEach(n=>{n.addEventListener('mouseenter',()=>activate(n.dataset.route));n.addEventListener('focus',()=>activate(n.dataset.route));n.addEventListener('click',()=>activate(n.dataset.route));});
  activate('all');
})();
