const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---- galería (franja deslizable) + lightbox
const photos = ['13-conchas-doradas','12-french-flor-rosa','16-dorado-perlas','08-tulipanes-encaje','05-perla-concha-lila','14-verde-concha-flor','04-fresas-3d','09-frutas-3d','06-tortugas-mar','18-rosas-rojas','15-morado-oscuro-estrellas','17-plata-cromado','19-otono-calabaza','10-winnie-pooh','11-brasil','20-momia-fantasma'];
const strip = $('#strip');
photos.forEach((p, n) => {
  const b = document.createElement('button');
  b.innerHTML = `<img src="img/${p}.webp" alt="Diseño de uñas de Jeny's Nails" loading="lazy">`;
  b.onclick = () => open(n);
  strip.appendChild(b);
});
const step = () => strip.clientWidth * 0.7;
$('#gprev').onclick = () => strip.scrollBy({ left: -step(), behavior: 'smooth' });
$('#gnext').onclick = () => strip.scrollBy({ left: step(), behavior: 'smooth' });

const lb = $('#lb'), lbImg = $('img', lb);
let cur = 0;
function show(n) { cur = (n + photos.length) % photos.length; lbImg.src = `img/${photos[cur]}.webp`; }
function open(n) { show(n); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$('.lb-x').onclick = close;
$('.lb-p').onclick = e => { e.stopPropagation(); show(cur - 1); };
$('.lb-nx').onclick = e => { e.stopPropagation(); show(cur + 1); };
lb.onclick = e => { if (e.target === lb) close(); };
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(cur - 1);
  if (e.key === 'ArrowRight') show(cur + 1);
});
let sx = 0;
lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

// ---- pestañas de servicios
$$('.tab').forEach(t => t.onclick = () => {
  $$('.tab').forEach(x => x.classList.toggle('on', x === t));
  $$('.panel').forEach(p => p.classList.toggle('on', p.id === t.dataset.tab));
});

// ---- header, menú móvil, aparición al hacer scroll
const header = $('#header'), menu = $('#menu'), burger = $('#burger');
const onScroll = () => header.classList.toggle('solid', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
$$('a', menu).forEach(a => a.onclick = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));

// ---- idioma ES / EN
const EN = {
  n_gal:'Gallery', n_serv:'Services', n_sobre:'About', n_citas:'Booking', n_cont:'Contact',
  h_eye:'Nail studio · Caibarién', h_t:'Nails that tell <em>your story</em>',
  h_s:'Manicure and pedicure with care, detail and commitment. Every design, made for you.',
  reservar:'Book now', ver:'See my work', desc:'Discover',
  g_eye:'Gallery', g_t:'Every set, a <em>unique piece</em>', g_s:'Tap a photo to see it larger',
  s_eye:'My services', s_t:'Manicure with <em>its own signature</em>',
  s_n:'Prices in CUP. Every manicure includes a combined manicure and a simple complimentary design.',
  manicura:'Manicure', pedicura:'Pedicure', extras:'Designs',
  gel:'Gel polish', min:'minimum', cortas:'Short', medias:'Medium', largas:'Long',
  nat:'on natural nails', ext:'on extensions or Dual System',
  relleno:"I don't do fills over another technician's work. It is fully removed, at a cost of $200.",
  p1:'Basic pedicure', gordo:'big toe', p_inc:'All include gel polish and the design of your choice.',
  e1:'French on all nails', e2:'Chrome: mirror, aurora…', e3:'Gradients or Baby Boomer', e4:'Encapsulated',
  e5:'Stones, pearls or charms on all nails', e6:'3D reliefs', e7:'Freehand designs', e7s:'Depending on complexity', desde:'from',
  e_n:'Want the final price? Send me the design in advance.',
  q_pre:'My essence', q:'Resilience and <em>commitment</em>',
  a_eye:'About me', a_t:'Behind every nail, <em>there is a story</em>',
  a_1:"I'm Jeny Cabrera, the nail artist behind Jeny's Nails. My story with nails began at 14, when painting was just a hobby. Over time, that passion grew into my profession, which I now do full time.",
  a_2:'I have spent four years building my path in the nail world, learning, refining my techniques and improving every day.',
  a_3:'I believe in beauty, but also in caring for natural nails, in work done well, and in listening to every client.',
  a_4:"Jeny's Nails reflects that path: a business that evolves with me and is built on resilience, commitment and a lot of love for what I do.",
  f1:'years of craft', f2:'years old when I started', f3:'made for you',
  c_eye:'Booking', c_t:'Your appointment, <em>made easy</em>', noant:'No deposit required.',
  horarios:'Hours', d1:'Tuesday to Friday', d2:'Saturday', d3:'Sunday and Monday', libre:'Closed',
  pol:'Policies', pol1:'Book and cancel more than 24 hours in advance.',
  pol2:'10 minutes of grace. After that, the appointment is cancelled automatically.',
  pol3:"I don't touch up other technicians' work: the whole set is removed for $200 CUP.",
  k_eye:'Visit me', k_t:'See you <em>in Caibarién</em>', dir:'Address', citas_btn:'Book'
};
const ES = {};
$$('[data-i]').forEach(el => { ES[el.dataset.i] ??= el.innerHTML; });
function setLang(l) {
  const d = l === 'en' ? EN : ES;
  document.documentElement.lang = l;
  $$('[data-i]').forEach(el => { const t = d[el.dataset.i]; if (t != null) el.innerHTML = t; });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  try { localStorage.setItem('lang', l); } catch (e) {}
}
$('.lang').onclick = e => e.target.dataset.lang && setLang(e.target.dataset.lang);
try { if (localStorage.getItem('lang') === 'en') setLang('en'); } catch (e) {}
$('#y').textContent = new Date().getFullYear();
