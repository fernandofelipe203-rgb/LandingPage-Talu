// Header com vidro ao rolar
const topo = document.getElementById('topo');
addEventListener('scroll', () => topo.classList.toggle('rolou', scrollY > 40));

// Aparecer suavemente ao rolar
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Brilhos e pétalas flutuando no fundo
const c = document.getElementById('brilhos'), x = c.getContext('2d');
let W, H, ps = [];
function ajusta() { W = c.width = innerWidth; H = c.height = innerHeight; }
ajusta(); addEventListener('resize', ajusta);
const cores = ['255,255,255', '246,160,190', '212,170,100'];
function nova(inicio) {
  return { x: Math.random() * W, y: inicio ? Math.random() * H : H + 20,
    r: Math.random() * 3 + 1, v: Math.random() * .6 + .2, d: Math.random() * 2 * Math.PI,
    cor: cores[Math.floor(Math.random() * cores.length)], t: Math.random() * 6 };
}
for (let i = 0; i < (innerWidth < 700 ? 25 : 55); i++) ps.push(nova(true));
(function anima() {
  x.clearRect(0, 0, W, H);
  ps.forEach((p, i) => {
    p.y -= p.v; p.t += .03; p.x += Math.sin(p.t) * .5;
    const a = .35 + Math.sin(p.t * 2) * .3;
    x.beginPath(); x.fillStyle = `rgba(${p.cor},${Math.max(a, .08)})`;
    x.shadowBlur = 12; x.shadowColor = `rgba(${p.cor},.9)`;
    x.arc(p.x, p.y, p.r, 0, 7); x.fill();
    if (p.y < -20) ps[i] = nova(false);
  });
  requestAnimationFrame(anima);
})();

// Menu do celular
const btn = document.getElementById('menuBtn');
btn.addEventListener('click', () => {
  const a = topo.classList.toggle('aberto');
  btn.setAttribute('aria-expanded', a);
});
document.querySelectorAll('nav a').forEach(l => l.addEventListener('click', () => {
  topo.classList.remove('aberto'); btn.setAttribute('aria-expanded', false);
}));

// Fotos padronizadas: mesmo tamanho, sem cortar, fundo suave com a própria foto
document.querySelectorAll('.galeria-trabalhos img, .moldura img').forEach(img => {
  const w = document.createElement('div');
  w.className = 'foto';
  w.style.setProperty('--bg', `url("${img.getAttribute('src')}")`);
  img.replaceWith(w);
  w.appendChild(img);
});

// Visualizador de fotos (clique para ampliar, setas e arrastar)
(function () {
  const fotos = [...document.querySelectorAll('.moldura img, .galeria-trabalhos img')];
  if (!fotos.length) return;
  const zap = 'https://wa.me/5511978256021?text=' + encodeURIComponent('Olá! Vi o site do Studio Taluama e gostaria de agendar um horário.');
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<button class="lb-x" aria-label="Fechar">✕</button><button class="lb-p" aria-label="Anterior">‹</button><img alt=""><button class="lb-n" aria-label="Próxima">›</button><div class="lb-b"><span class="lb-c"></span><a href="' + zap + '" target="_blank">💅 Quero um trabalho assim</a></div>';
  document.body.appendChild(lb);
  const im = lb.querySelector('img'), ct = lb.querySelector('.lb-c');
  let i = 0, x0 = null;
  const mostra = n => { i = (n + fotos.length) % fotos.length; im.src = fotos[i].src; ct.textContent = (i + 1) + ' / ' + fotos.length; };
  const abre = n => { mostra(n); lb.classList.add('on'); document.body.style.overflow = 'hidden'; };
  const fecha = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
  fotos.forEach((f, n) => { f.parentElement.style.cursor = 'zoom-in'; f.parentElement.addEventListener('click', () => abre(n)); });
  lb.querySelector('.lb-x').onclick = fecha;
  lb.querySelector('.lb-p').onclick = e => { e.stopPropagation(); mostra(i - 1); };
  lb.querySelector('.lb-n').onclick = e => { e.stopPropagation(); mostra(i + 1); };
  lb.addEventListener('click', e => { if (e.target === lb) fecha(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') fecha();
    if (e.key === 'ArrowLeft') mostra(i - 1);
    if (e.key === 'ArrowRight') mostra(i + 1);
  });
  lb.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 50) mostra(i + (d < 0 ? 1 : -1));
    x0 = null;
  });
})();
