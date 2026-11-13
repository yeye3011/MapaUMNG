/* ===== Textos ES / EN ===== */
const T = {
  es: {
    ph: '| ¿A dónde vamos hoy?', h2: 'Ubícate en la UMNG', cats: { acad: 'Académicos', admin: 'Administrativos', aud: 'Auditorios', cafe: 'Cafeterías', parq: 'Parqueaderos', free: 'Otros' },
    cd: { acad: 'Aulas, laboratorios y bibliotecas.', admin: 'Admisiones y oficinas de dirección general.', aud: 'Auditorios y zonas de conferencias y eventos.', cafe: 'Comida, bebidas y snacks.', parq: 'Estacionamiento para visitantes, estudiantes y administrativos.', free: 'Centro cultural, plazas, canchas y otros espacios del campus.' }, go: 'Comenzar Recorrido', stop: 'Detener Recorrido',
    favs: 'Mis favoritos', empty: 'Aún no tienes favoritos. Toca el corazón en un lugar.', ft: 'Filtros', clear: 'Limpiar filtros',
    f: { parking: 'Con parqueadero', access: 'Accesible para sillas de ruedas', out: 'Zonas libres', lib: 'Biblioteca', events: 'Zonas de eventos' },
    route: 'Recorridos accesibles activados', entry: 'Acceso principal', rate: 'Toca una estrella para calificar',
    aviso: 'En ajustes puedes modificar la interfaz según tus preferencias'
  },
  en: {
    ph: '| Where are we going today?', h2: 'Find your way at UMNG', cats: { acad: 'Academic', admin: 'Administrative', aud: 'Auditoriums', cafe: 'Dining', parq: 'Parking', free: 'Others' },
    cd: { acad: 'Classrooms, labs and libraries.', admin: 'Admissions and general management offices.', aud: 'Auditoriums and conference and event areas.', cafe: 'Food, drinks and snacks.', parq: 'Parking for visitors, students and staff.', free: 'Cultural center, plazas, courts and other campus spots.' }, go: 'Start Tour', stop: 'Stop Tour',
    favs: 'My favorites', empty: "You don't have favorites yet. Tap the heart on a place.", ft: 'Filters', clear: 'Clear filters',
    f: { parking: 'With parking', access: 'Wheelchair accessible', out: 'Open areas', lib: 'Library', events: 'Event areas' },
    route: 'Accessible routes on', entry: 'Main entrance', rate: 'Tap a star to rate',
    aviso: 'In settings you can customize the interface to your preferences'
  }
};
/* Colores de categoría: se escriben como variables CSS (--c-acad, --c-admin...) para que el modo daltonismo cambie la paleta
   al instante, sin volver a dibujar los pines. Los colores reales están en styles.css. */
const COL = ['var(--c-acad)', 'var(--c-admin)', 'var(--c-aud)', 'var(--c-cafe)', 'var(--c-parq)', 'var(--c-free)'], FG = ['#fff', '#fff', '#0C2C47', '#0C2C47', '#fff', '#0C2C47'], BX = ['#D6C9C5', '#D6C9C5', '#0C2C47', '#0C2C47', '#D6C9C5', '#0C2C47'], BI = ['#0C2C47', '#0C2C47', '#D6C9C5', '#D6C9C5', '#0C2C47', '#D6C9C5'], CI = { acad: 0, admin: 1, aud: 2, cafe: 3, parq: 4, free: 5 };
/* LUGARES
   c  = categoría principal (color e ícono del pin cuando no hay una categoría elegida): acad, admin, aud, cafe, parq, free ("Otros").
   cs = todas las categorías a las que pertenece. Si se omite, es solo [c]. Ejemplo: las Aulas A a E salen en Académicos y en Auditorios.
        Para mover un lugar de categoría, cambia c y cs aquí; no hay que tocar nada más.
   x, y = dónde estaba la punta de la flecha en tu imagen (espacio de 1000 x 900). Con ese punto se calcula el anclaje 3D del pin.
   m  = EDIFICIO: números de las mallas 3D que forman ese edificio (la imagen mallas_numeradas_fbx_nuevo.png muestra el número de cada una en el FBX actual; si cambias de FBX hay que revisar estos números).
        Al tocar cualquiera de esas mallas se abre este lugar. Si una malla la comparten dos lugares (Aula A y Cafetería A),
        al tocarla salen los dos juntos; queda seleccionado el que tenga el anclaje más cerca del toque.
   Casona se llama ahora Centro cultural (se sigue encontrando como "casona"). Fase 1 y Fase 2 intercambiaron sitio.
   al = (opcional) otras palabras con las que también se encuentra el lugar en el buscador. Las Aulas A a E antes se llamaban Edificio A a E,
        por eso llevan 'edificio a building a' (y así con cada letra).
   po = (opcional) corrimiento del pin en unidades 3D [hacia el este, hacia el sur]. Sirve para separar pines de edificios vecinos o de dos lugares
        que comparten edificio (Aula A y Cafetería A) cuando se tapan entre sí. No cambia el área que se toca ni el recorrido.
   g  = ZONA SIN EDIFICIO (parqueaderos, canchas, plazas): radio en unidades 3D alrededor del pin. Se abre al tocar el suelo dentro de ese radio.
   f: p=parqueadero a=accesible c=zona libre q=biblioteca e=zona de eventos · h=horario
   Descripciones, horarios (h), calificaciones (r) y banderas (f) son provisionales: ajústalos con los datos reales. */
const P = [
  { c: 'cafe', x: 567, y: 158, es: ['Cafetería D', 'Comida, bebidas y snacks.'], en: ['Café D', 'Food, drinks and snacks.'], i: '2.5k - $50k', f: '', h: [6, 21], r: 5, m: [35] },
  { c: 'cafe', x: 186, y: 524, es: ['Cafetería canchas', 'Comida, bebidas y snacks.'], en: ['Courts Café', 'Food, drinks and snacks.'], i: '2k - $15k', f: '', h: [8, 17], r: 3, m: [8] },
  { c: 'acad', cs: ['acad', 'aud'], x: 425, y: 206, es: ['Aula A', 'Aulas y salas de estudio.'], en: ['Classroom A', 'Classrooms and study rooms.'], al: 'edificio a building a', f: '', h: [6, 22], r: 4, po: [-10, 0], m: [40] },
  { c: 'acad', cs: ['acad', 'aud'], x: 466, y: 192, es: ['Aula B', 'Aulas y salas de estudio.'], en: ['Classroom B', 'Classrooms and study rooms.'], al: 'edificio b building b', f: '', h: [6, 22], r: 4, po: [-14, 4], m: [39] },
  { c: 'acad', cs: ['acad', 'aud'], x: 546, y: 265, es: ['Aula C', 'Aulas y salas de estudio.'], en: ['Classroom C', 'Classrooms and study rooms.'], al: 'edificio c building c', f: '', h: [6, 22], r: 4, m: [21] },
  { c: 'acad', cs: ['acad', 'aud'], x: 604, y: 174, es: ['Aula D', 'Aulas y salas de estudio.'], en: ['Classroom D', 'Classrooms and study rooms.'], al: 'edificio d building d', f: '', h: [6, 22], r: 4, m: [34] },
  { c: 'acad', cs: ['acad', 'aud'], x: 664, y: 150, es: ['Aula E', 'Aulas y salas de estudio.'], en: ['Classroom E', 'Classrooms and study rooms.'], al: 'edificio e building e', f: '', h: [6, 22], r: 4, po: [-14, -2], m: [32] },
  { c: 'acad', x: 538, y: 296, es: ['Biblioteca principal', 'Libros y zonas de estudio.'], en: ['Main Library', 'Books and study areas.'], f: 'q', h: [7, 20], r: 5, m: [20] },
  { c: 'admin', x: 700, y: 299, es: ['Faedis', 'Facultad de Estudios a Distancia.'], en: ['Faedis', 'Distance Education Faculty.'], f: '', h: [7, 21], r: 4, m: [28] },
  { c: 'admin', x: 500, y: 160, es: ['Programas', 'Oficinas de programas académicos.'], en: ['Programs', 'Academic program offices.'], f: '', h: [8, 17], r: 4, po: [4, 0], m: [37] },
  { c: 'acad', x: 741, y: 192, es: ['Fase 2', 'Aulas y laboratorios de la Fase 2.'], en: ['Phase 2', 'Classrooms and labs of Phase 2.'], f: '', h: [6, 22], r: 4, m: [26] },
  { c: 'acad', x: 751, y: 135, es: ['Fase 1', 'Aulas y laboratorios de la Fase 1.'], en: ['Phase 1', 'Classrooms and labs of Phase 1.'], f: '', h: [6, 22], r: 4, m: [31] },
  { c: 'free', x: 762, y: 363, es: ['Cuervo', 'Glorieta del campus.'], en: ['Cuervo', 'Campus roundabout.'], f: '', h: [6, 22], r: 4, g: 32 },
  { c: 'acad', x: 389, y: 220, es: ['Laboratorio Cabal', 'Laboratorio para prácticas y proyectos.'], en: ['Cabal Laboratory', 'Laboratory for practices and projects.'], f: '', h: [7, 18], r: 4, m: [41] },
  { c: 'free', x: 313, y: 164, es: ['Invernaderos', 'Invernaderos para prácticas y proyectos de cultivo.'], en: ['Greenhouses', 'Greenhouses for crop practices and projects.'], f: '', h: [7, 17], r: 4, m: [45, 46, 47, 48, 49] },
  { c: 'admin', x: 516, y: 209, es: ['Financiera', 'Pagos, matrículas y trámites financieros.'], en: ['Finance Office', 'Payments, enrollment fees and financial procedures.'], f: '', h: [8, 17], r: 4, m: [36] },
  { c: 'admin', x: 736, y: 475, es: ['Carnetización', 'Expedición y renovación del carné universitario.'], en: ['ID Card Office', 'Issuing and renewing the university ID card.'], f: '', h: [8, 17], r: 4, m: [6] },
  { c: 'free', x: 79, y: 614, es: ['Centro cultural', 'Centro cultural del campus.'], en: ['Cultural Center', 'Campus cultural center.'], al: 'casona', f: '', h: [8, 17], r: 4, m: [15] },
  { c: 'free', x: 532, y: 160, es: ['Sala descanso docentes', 'Zona de descanso para docentes.'], en: ['Faculty Lounge', 'Rest area for faculty.'], f: '', h: [7, 18], r: 4, po: [10, 0], m: [37] },
  { c: 'free', x: 861, y: 131, es: ['Centro de acopio', 'Centro de acopio del campus.'], en: ['Collection Center', 'Campus collection center.'], f: '', h: [8, 16], r: 3, m: [33] },
  { c: 'free', x: 320, y: 318, es: ['Concha Acústica', 'Escenario al aire libre para conciertos y eventos.'], en: ['Acoustic Shell', 'Open-air stage for concerts and events.'], f: 'e', h: [7, 21], r: 5, po: [-8, 0], m: [0] },
  { c: 'parq', x: 352, y: 249, es: ['Parqueadero Docentes', 'Estacionamiento para docentes.'], en: ['Faculty Parking', 'Parking for faculty.'], f: 'p', h: [5, 23], r: 3, g: 30 },
  { c: 'parq', x: 581, y: 230, es: ['Parqueadero Administrativos', 'Estacionamiento para administrativos.'], en: ['Staff Parking', 'Parking for staff.'], f: 'p', h: [5, 23], r: 3, g: 30 },
  { c: 'parq', x: 860, y: 389, es: ['Parqueadero Cuervo', 'Estacionamiento para visitantes, estudiantes y administrativos.'], en: ['Cuervo Parking', 'Parking for visitors, students and staff.'], f: 'p', h: [5, 23], r: 4, g: 30 },
  { c: 'parq', x: 116, y: 502, es: ['Parqueadero Canchas', 'Estacionamiento cercano a las canchas.'], en: ['Courts Parking', 'Parking near the sports courts.'], f: 'p', h: [5, 23], r: 3, g: 30 },
  { c: 'parq', x: 778, y: 588, es: ['Parqueadero Carnetización', 'Estacionamiento para visitantes, estudiantes y administrativos.'], en: ['ID Card Parking', 'Parking for visitors, students and staff.'], f: 'p', h: [5, 23], r: 3, g: 30 },
  { c: 'free', x: 191, y: 594, es: ['Canchas', 'Canchas para practicar deporte y zona abierta para descansar.'], en: ['Sports Courts', 'Courts for sports and an open area to rest.'], f: 'c', h: [6, 20], r: 4, g: 60 },
  { c: 'free', x: 495, y: 487, es: ['Banderas', 'Plazoleta de las banderas, punto de encuentro del campus.'], en: ['Flag Plaza', 'Flag plaza, a meeting point on campus.'], f: 'c', h: [6, 20], r: 4, g: 40 },
  { c: 'cafe', x: 425, y: 232, es: ['Cafetería A', 'Comida, bebidas y snacks.'], en: ['Café A', 'Food, drinks and snacks.'], i: '2k - $15k', f: '', h: [7, 19], r: 4, po: [14, 0], m: [40] },
  { c: 'free', x: 464, y: 246, es: ['Plaza Mutis', 'Plazoleta para descansar y encontrarse.'], en: ['Mutis Plaza', 'Plaza to rest and meet up.'], f: 'c', h: [6, 20], r: 4, g: 30 },
  { c: 'cafe', x: 694, y: 178, es: ['Cafetería E', 'Comida, bebidas y snacks en el 4.º piso del edificio E.'], en: ['Café E', 'Food, drinks and snacks on the 4th floor of building E.'], al: 'cafeteria del e cuarto piso', i: '2k - $15k', f: '', h: [7, 19], r: 4, po: [14, 2], m: [32] },
  { c: 'cafe', x: 476, y: 178, es: ['Cafetería de espejos', 'Comida, bebidas y snacks.'], en: ['Mirrors Café', 'Food, drinks and snacks.'], al: 'espejos', i: '2k - $15k', f: '', h: [7, 19], r: 4, po: [8, -3], m: [38] },
  { c: 'cafe', x: 593, y: 269, es: ['Cafetería del C', 'Comida, bebidas y snacks.'], en: ['Café C', 'Food, drinks and snacks.'], al: 'cafeteria c', i: '2k - $15k', f: '', h: [7, 19], r: 4, m: [24] },
  { c: 'cafe', x: 195, y: 430, es: ['Restaurante canchas', 'Almuerzos y comidas cerca de las canchas.'], en: ['Courts Restaurant', 'Lunch and meals near the courts.'], i: '8k - $25k', f: '', h: [8, 17], r: 4, m: [12, 13] },
  { c: 'cafe', x: 234, y: 364, es: ['Restaurante Nuevo', 'Almuerzos y comidas del campus.'], en: ['New Restaurant', 'Lunch and meals on campus.'], i: '8k - $25k', f: '', h: [8, 17], r: 4, m: [23] },
  { c: 'cafe', x: 809, y: 230, es: ['Carulla', 'Tienda de víveres, snacks y bebidas.'], en: ['Carulla', 'Grocery store, snacks and drinks.'], i: '2k - $30k', f: '', h: [7, 20], r: 4, m: [30] },
  { c: 'aud', cs: ['aud'], x: 639, y: 275, es: ['Hemiciclo A y B', 'Auditorio al aire libre para clases, charlas y eventos.'], en: ['Amphitheater A and B', 'Open-air auditorium for classes, talks and events.'], al: 'hemiciclo auditorio', f: 'e', h: [6, 22], r: 4, m: [25] },
  { c: 'admin', x: 347, y: 325, es: ['Bienestar universitario', 'Apoyo, salud y actividades para la comunidad universitaria.'], en: ['University Wellbeing', 'Support, health and activities for the university community.'], al: 'bienestar', f: '', h: [8, 17], r: 4, po: [4, 0], m: [19] },
  { c: 'admin', x: 755, y: 513, es: ['Consultorio Jurídico', 'Asesoría jurídica gratuita para la comunidad.'], en: ['Legal Clinic', 'Free legal advice for the community.'], al: 'consultorio juridico', f: '', h: [8, 17], r: 4, m: [5] },
  { c: 'free', x: 514, y: 633, es: ['Entrada principal', 'Acceso principal al campus.'], en: ['Main entrance', 'Main access to the campus.'], f: '', h: [5, 23], r: 4, m: [2] },
  { c: 'free', x: 638, y: 634, es: ['Entrada vehicular administrativos', 'Acceso de vehículos para personal administrativo.'], en: ['Staff vehicle entrance', 'Vehicle access for administrative staff.'], al: 'entrada carros parqueadero', f: '', h: [5, 23], r: 3, m: [1] },
  { c: 'free', x: 817, y: 76, es: ['Observatorio de aves', 'Mirador para observar las aves del campus.'], en: ['Bird Observatory', 'Lookout to watch the birds of the campus.'], al: 'mirador', f: '', h: [6, 18], r: 4, m: [3] }];
P.forEach((p, k) => { p.id = k; p.cs = p.cs || [p.c]; p.fl = { parking: p.f.includes('p'), access: p.f.includes('a'), out: p.f.includes('c'), lib: p.f.includes('q'), events: p.f.includes('e') } });

/* ===== Estado ===== */
const $ = s => document.querySelector(s), stage = $('#stage'), inner = $('#inner');
let lang = 'es', cat = null, sel = null, route = false, qid = null;
let tapId = null;   // lugar abierto con un toque directo sobre el mapa
/* Lugares que comparten edificio con el tocado (Aula A y Cafetería A usan la misma malla 3D). Salen juntos, así ninguno queda escondido
   detrás del otro. Solo vale mientras tapId tenga valor; se rellena en cada toque. */
let tapGrp = [];
/* Puente con el mapa 3D (se completa en init3DMap). Existe desde el inicio para que el resto del código pueda llamarlo sin preocuparse de si el modelo ya cargó. */
const MAPA3D = { ready: false, cb: false, dirty: true, grupo: [], setRoute() { }, placePins() { }, reset() { }, zoom() { }, pickPlace() { return null }, highlight() { }, setCB(v) { this.cb = !!v } };
let PJ = pt => pt;   // lleva un punto 2D del mapa a la pantalla actual (las rampas lo usan; con el 3D listo sigue la cámara)
let PW = q => [500, 450];   // lleva un punto [x, z] del suelo 3D a la pantalla actual (los recorridos lo usan)
const fav = new Set([0]), filters = new Set();
const info = p => p.i ? '$' + p.i : `${String(p.h[0]).padStart(2, '0')}:00 – ${String(p.h[1]).padStart(2, '0')}:00`;
const stars = (r, rate, id) => `<span class="st">${[1, 2, 3, 4, 5].map(i => `<span class="${i <= r ? 'o' : ''}" ${rate ? `data-r="${i}" data-id="${id}"` : ''}>★</span>`).join('')}</span>`;
const heart = (on, id, fixed) => `<svg class="hrt ${on ? 'on' : ''}" ${fixed ? '' : `data-h="${id}"`}><use href="#hp"/></svg>`;

/* ===== Escala del lienzo 1920x1080 ===== */
function fit() { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px,${(innerHeight - 1080 * s) / 2}px) scale(${s})`; stage._s = s }
addEventListener('resize', fit); fit();
/* Ya no hay desplazamiento ni zoom por CSS: la cámara 3D mueve el mapa y cada pin se reubica desde su punto 3D (ver init3DMap) */
function view() { MAPA3D.placePins() }

/* ===== Pines y viñetas ===== */
function pinsHTML() {
  return P.map(p => {
    const k = CI[p.c], col = COL[k], t = p[lang]; return `<div class="pin" id="p${p.id}" style="left:${p.x}px;top:${p.y}px"><i style="background:${col}"></i><b><img src="assets/g${CI[p.c]}.png" alt=""></b>
<div class="tip" style="--k:${col}"><div class="th"><div><svg><use href="#imgI"/></svg></div><div><svg><use href="#imgI"/></svg></div></div>${heart(fav.has(p.id), p.id)}
<h4>${t[0]}</h4><p>${t[1]}</p><div class="pr">${info(p)}</div><span id="ts${p.id}">${stars(p.r)}</span>${ROUTES[p.es[0]] ? `<button class="go${tour && tourId === p.id ? ' on' : ''}">${T[lang][tour && tourId === p.id ? 'stop' : 'go']}</button>` : ''}</div></div>`
  }).join('')
}
function build() {
  $('#pins').innerHTML = pinsHTML();
  document.querySelectorAll('.pin').forEach(el => el.addEventListener('click', e => {
    e.stopPropagation(); const id = +el.id.slice(1);
    if (e.target.closest('.hrt')) { toggleFav(id); return }
    if (e.target.closest('.tip')) return;
    sel = sel === id ? null : id; mark()
  }));
  document.querySelectorAll('.go').forEach(b => b.onclick = e => { e.stopPropagation(); toggleTour() }); view(); paint()
}
function mark() { document.querySelectorAll('.pin').forEach(e => e.classList.toggle('sel', +e.id.slice(1) === sel)); MAPA3D.highlight(sel); updateRoute() }
/* Un lugar se ve si: lo abrió un toque directo en el mapa, es resultado de la búsqueda, o pertenece a la categoría elegida (p.cs)
   y a alguno de los filtros marcados. Un mismo lugar puede estar en varias categorías (Aula A: Académicos y Auditorios). */
function visible(p) {
  if (p.id === tapId || (tapId !== null && tapGrp.includes(p.id))) return true;
  if (qid !== null) return Array.isArray(qid) ? qid.includes(p.id) : p.id === qid;
  if (!cat && !filters.size) return false;
  if (cat && !p.cs.includes(cat)) return false;
  if (filters.size) { for (const f of filters) { if (p.cs.includes(f) || (f === 'parking' && p.cs.includes('parq')) || p.fl[f]) return true } return false }
  return true;
}
/* El pin toma el color y el ícono de la categoría que se está mirando (Aula A es azul en Académicos y amarillo en Auditorios) */
function tint(e, p) {
  const k = CI[(cat && p.cs.includes(cat)) ? cat : p.c], ic = `assets/g${k}.png`, img = e.querySelector('b img');
  e.querySelector('i').style.background = COL[k]; e.querySelector('.tip').style.setProperty('--k', COL[k]);
  if (img.getAttribute('src') !== ic) img.setAttribute('src', ic)
}
function paint() { document.querySelectorAll('.pin').forEach(e => { const p = P[+e.id.slice(1)], v = visible(p); e.classList.toggle('show', v); if (!v && sel === p.id) sel = null; if (v) tint(e, p) }); mark() }

/* ===== Favoritos y calificación ===== */
function toggleFav(id) {
  fav.has(id) ? fav.delete(id) : fav.add(id);
  document.querySelectorAll(`#pins [data-h="${id}"]`).forEach(h => h.classList.toggle('on', fav.has(id))); renderFavs()
}
function renderFavs() {
  const l = [...fav].map(i => P[i]);
  $('#fl').innerHTML = l.length ? l.map(p => `<div class="fc"><div class="im"><svg><use href="#imgI"/></svg></div><div><h5>${p[lang][0]}</h5><p>${p[lang][1]}</p><p>$${p.i || info(p)}</p>${stars(p.r, true, p.id)}<small>${T[lang].rate}</small></div>${heart(true, p.id, true)}</div>`).join('') : `<div id="empty">${T[lang].empty}</div>`
}
$('#fl').addEventListener('click', e => { const s = e.target.closest('[data-r]'); if (!s) return; const p = P[+s.dataset.id]; p.r = +s.dataset.r; renderFavs(); $('#ts' + p.id).innerHTML = stars(p.r) });

/* ===== Idioma ===== */
function apply() {
  const t = T[lang]; document.documentElement.lang = lang; $('#lb').textContent = lang.toUpperCase();
  $('#q').placeholder = t.ph; $('#h2').textContent = t.h2; $('#ft').textContent = t.favs;
  document.querySelectorAll('.cat').forEach(b => { b.querySelector('.n').textContent = t.cats[b.dataset.c]; b.querySelector('.d').textContent = t.cd[b.dataset.c] });
  $('#chip').textContent = t.route;
  $('#fpanel').innerHTML = `<h4>${t.ft}</h4>` + Object.keys(t.f).map(k => `<label><input type="checkbox" value="${k}" ${filters.has(k) ? 'checked' : ''}>${t.f[k]}</label>`).join('') + `<button id="clr">${t.clear}</button>`;
  $('#fpanel').onchange = e => { qid = null; e.target.checked ? filters.add(e.target.value) : filters.delete(e.target.value); $('#flt').classList.toggle('act', filters.size > 0); paint() };
  $('#clr').onclick = () => { qid = null; filters.clear(); $('#flt').classList.remove('act'); apply(); paint() };
  build(); renderFavs()
}
$('#lang').onclick = () => { lang = lang === 'es' ? 'en' : 'es'; apply() };

/* ===== Panel, categorías, filtros ===== */
function side(o) { ['#side', '#mapPos', '#acc', '#search', '#chip'].forEach(s => $(s).classList.toggle('open', o)) }
$('#menu').onclick = () => side(!$('#side').classList.contains('open')); $('#tab').onclick = () => side(false);
document.querySelectorAll('.cat').forEach(b => b.onclick = () => {
  const c = b.dataset.c; qid = null; cat = cat === c ? null : c;
  document.querySelectorAll('.cat').forEach(x => x.classList.toggle('on', x === b && !!cat)); paint()
});
$('#flt').onclick = () => $('#fpanel').classList.toggle('show');
$('#fav').onclick = () => { $('#apanel').classList.remove('show'); $('#favs').classList.toggle('show') };
$('#comp').onclick = () => MAPA3D.reset();   // centrar: la cámara vuelve a la vista inicial
const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
$('#q').addEventListener('input', e => {
  const v = norm(e.target.value.trim());
  if (v.length < 2) { if (!v) { cat = null; if (qid === sel) sel = null; qid = null; document.querySelectorAll('.cat').forEach(x => x.classList.remove('on')) } paint(); return }
  const m = Object.keys(T.es.cats).map(k => [k]).find(([k]) => norm(T.es.cats[k]).includes(v) || norm(T.en.cats[k]).includes(v));
  const pl = P.filter(p => norm(p.es[0]).includes(v) || norm(p.en[0]).includes(v) || norm(p.al || '').includes(v));
  qid = !m && pl.length === 1 ? pl[0].id : null; sel = null;
  cat = m ? m[0] : null; document.querySelectorAll('.cat').forEach(x => x.classList.toggle('on', x.dataset.c === cat)); paint()
});

/* ===== Ruta accesible (movilidad reducida) ===== */
/* El modo "Rutas accesibles" ya no dibuja todos los caminos en el mapa. Solo se activa un aviso (chip) y, al presionar "Comenzar Recorrido"
   en un lugar, el recorrido que se traza es el accesible (ROUTES_ACC, más abajo). */
/* ===== Accesibilidad / Configuración ===== */
const A_OPTS = [
  { g: { es: 'Movilidad reducida', en: 'Reduced mobility' }, items: [
    { k: 'ramps', es: ['Rutas Movilidad reducida', 'Al presionar "Comenzar Recorrido" en un lugar, el mapa te guía por el camino accesible para movilidad reducida, desde el acceso principal.'], en: ['Reduced mobility routes', 'When you press "Start Route" on a place, the map guides you along the accessible path for reduced mobility, from the main entrance.'] },
    /* Dificultad motriz: los botones + y − del zoom solo existen en pantalla mientras esta opción está activa (ver body.motor en styles.css) */
    { k: 'motor', es: ['Botones de zoom', 'Para personas con dificultades motrices: muestra los botones + y − abajo a la izquierda para acercar y alejar el mapa sin usar gestos.'], en: ['Zoom buttons', 'For people with motor difficulties: shows the + and − buttons at the bottom left to zoom the map without gestures.'] }] },
  { g: { es: 'Visión', en: 'Vision' }, items: [
    { k: 'contrast', es: ['Alto contraste', 'Aumenta el contraste del mapa y marca con bordes los elementos.'], en: ['High contrast', 'Boosts map contrast and outlines the interface elements.'] },
    /* Daltonismo: activa la paleta alternativa (body.cb en styles.css) */
    { k: 'cb', es: ['Modo daltonismo', 'Cambia los colores del mapa y de la interfaz por una paleta que se distingue mejor con daltonismo.'], en: ['Color blindness mode', 'Switches the map and interface colors to a palette that is easier to tell apart with color blindness.'] },
    { k: 'big', es: ['Texto grande', 'Agranda los textos de categorías, lugares y paneles.'], en: ['Large text', 'Enlarges text in categories, places and panels.'] },
    { k: 'voice', es: ['Voz y vibración al tocar', 'El celular lee en voz alta el lugar o categoría que toques y vibra al tocar.'], en: ['Voice and vibration on touch', 'Your phone reads aloud the place or category you tap and vibrates on touch.'] }] }
];
let S = {}; try { S = JSON.parse(localStorage.getItem('umng_a11y') || '{}') } catch (e) { }
function say(txt) { if (!S.voice || !window.speechSynthesis) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = lang === 'es' ? 'es-CO' : 'en-US'; u.rate = .95; speechSynthesis.speak(u) }
function buzz(ms = 35) { if (S.voice && navigator.vibrate) navigator.vibrate(ms) }
function setRamps(v) {
  route = v; $('#chip').classList.toggle('show', v); document.body.classList.toggle('accroute', v);
  /* Si ya había un recorrido en pantalla, se vuelve a trazar con el camino que corresponde. Al cargar la página todavía no existe el
     recorrido (se declara más abajo), por eso el try. */
  try { updateRoute() } catch (e) { }
}
function setOpt(k, v, quiet) {
  S[k] = v; try { localStorage.setItem('umng_a11y', JSON.stringify(S)) } catch (e) { }
  /* Cada opción activa pone una clase en <body> y el CSS hace el resto: hc (alto contraste), big (texto grande),
     calm, motor (botones de zoom) y cb (daltonismo). */
  if (k === 'ramps') setRamps(v);
  else document.body.classList.toggle({ contrast: 'hc', big: 'big', calm: 'calm', motor: 'motor', cb: 'cb' }[k] || 'x', v);
  if (k === 'big') { try { if (rcOn && routeOf(tourId)) drawBadges(tourId) } catch (e) { } }   // las viñetas del recorrido también cambian de tamaño
  if (k === 'cb') { MAPA3D.setCB(v); if (rcOn) paintRoute(true) }   // además de la paleta de la interfaz, recolorea el mapa 3D y el recorrido activo
  { const n = Object.values(S).filter(Boolean).length; $('#acc').classList.toggle('on', n > 0); $('#abadge').textContent = n || '' }
  refreshSw();
  if (!quiet && k === 'voice' && v) { buzz(60); say(lang === 'es' ? 'Voz y vibración activadas' : 'Voice and vibration on') }
  if (!quiet && k === 'ramps' && v) say(T[lang].route)
}
const VA = { s: !!window.speechSynthesis, v: !!navigator.vibrate };
function refreshSw() { document.querySelectorAll('.sw').forEach(b => { const on = !!S[b.dataset.k]; b.setAttribute('aria-checked', on) }) }
function voiceNote() {
  if (VA.s && VA.v) return ''; const es = lang === 'es';
  return `<em class="warn">${!VA.s && !VA.v ? (es ? 'No disponible en este dispositivo.' : 'Not available on this device.') : !VA.v ? (es ? 'Este dispositivo no admite vibración; solo funcionará la voz.' : 'This device does not support vibration; only voice will work.') : (es ? 'Este dispositivo no admite voz; solo funcionará la vibración.' : 'This device does not support voice; only vibration will work.')}</em>`
}
function renderA() {
  const es = lang === 'es';
  $('#atitle').textContent = es ? 'Accesibilidad' : 'Accessibility';
  $('#al').innerHTML = A_OPTS.map(g => `<div class="ag">${g.g[lang]}</div>` + g.items.map(o => `<div class="ao"><div class="otx"><b>${o[lang][0]}</b><span>${o[lang][1]}</span>${o.k === 'voice' ? voiceNote() : ''}</div><div class="swc"><button class="sw" role="switch" data-k="${o.k}" aria-checked="${!!S[o.k]}" aria-label="${o[lang][0]}" ${o.k === 'voice' && !VA.s && !VA.v ? 'disabled' : ''}></button></div></div>`).join('')).join('') + `<button id="areset" type="button">${es ? 'Restablecer ajustes' : 'Reset settings'}</button>`;
  refreshSw();
  const L = { '#fav': ['Mis favoritos', 'My favorites'], '#lang': ['Cambiar idioma', 'Change language'], '#acc': ['Accesibilidad', 'Accessibility'], '#comp': ['Centrar mapa', 'Recenter map'], '#ppl': ['Eventos', 'Events'], '#zin': ['Acercar mapa', 'Zoom in'], '#zout': ['Alejar mapa', 'Zoom out'], '#menu': ['Categorías', 'Categories'], '#flt': ['Filtros', 'Filters'], '#q': ['Buscar lugares', 'Search places'] };
  Object.entries(L).forEach(([k, v]) => { const el = $(k); if (!el) return; el.setAttribute('aria-label', v[es ? 0 : 1]); if (el.classList.contains('fb') && el.tagName !== 'BUTTON') { el.tabIndex = 0; el.setAttribute('role', 'button') } })
}
$('#al').addEventListener('click', e => {
  const b = e.target.closest('.sw'); if (b) return setOpt(b.dataset.k, !S[b.dataset.k]);
  if (e.target.closest('#areset')) { A_OPTS.flatMap(g => g.items).forEach(o => { if (S[o.k]) setOpt(o.k, false, true) }); S = {}; try { localStorage.setItem('umng_a11y', '{}') } catch (x) { } if (window.speechSynthesis) speechSynthesis.cancel(); setOpt('ramps', false, true); S = {}; $('#abadge').textContent = ''; $('#acc').classList.remove('on'); refreshSw() }
});
$('#acc').onclick = () => { $('#favs').classList.remove('show'); $('#apanel').classList.toggle('show') };
$('#close-acc').onclick = () => $('#apanel').classList.remove('show');
document.addEventListener('click', e => {
  if (!S.voice) return; buzz();
  const pin = e.target.closest('.pin'); if (pin && !e.target.closest('.tip') && sel !== null) say(`${P[sel][lang][0]}. ${P[sel][lang][1]}`);
  const c = e.target.closest('.cat'); if (c && cat) say(`${T[lang].cats[c.dataset.c]}. ${T[lang].cd[c.dataset.c]}`)
});
{ const _apply = apply; apply = function () { _apply.apply(this, arguments); renderA() } }
delete S.calm; renderA(); Object.keys(S).forEach(k => S[k] && setOpt(k, true, true));
/* Zoom, teclado y lector de pantalla */
$('#zin').onclick = () => zoom(1.2); $('#zout').onclick = () => zoom(1 / 1.2);
function a11yPins() { document.querySelectorAll('.pin').forEach(el => { const p = P[+el.id.slice(1)]; if (!p) return; el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', `${p[lang][0]}. ${p[lang][1]}`) }) }
{ const _b = build; build = function () { _b.apply(this, arguments); a11yPins() } }
a11yPins();
/* ===== Anuncio de bienvenida =====
   Apenas termina de cargar el mapa 3D aparece arriba, centrado, con la estética del resto (tarjeta blanca, borde mostaza, ícono de ajustes).
   Se va solo a los 9 segundos, con la X, o si la persona abre Ajustes, la búsqueda o una categoría. El texto está en T[lang].aviso. */
const aviso = document.createElement('div');
aviso.id = 'aviso'; aviso.setAttribute('role', 'status'); aviso.setAttribute('aria-live', 'polite');
aviso.innerHTML = '<img src="assets/acc.png" alt=""><span id="avisoTx"></span><button id="avisoX" type="button">✕</button>';
stage.appendChild(aviso);
let avisoT = null;
function textoAviso() { $('#avisoTx').textContent = T[lang].aviso; $('#avisoX').setAttribute('aria-label', lang === 'es' ? 'Cerrar anuncio' : 'Close notice') }
function ocultarAviso() { clearTimeout(avisoT); aviso.classList.remove('show') }
function mostrarAviso() { textoAviso(); aviso.classList.add('show'); clearTimeout(avisoT); avisoT = setTimeout(ocultarAviso, 9000) }
$('#avisoX').onclick = ocultarAviso;
$('#acc').addEventListener('click', ocultarAviso); $('#q').addEventListener('focus', ocultarAviso);
document.querySelectorAll('.cat').forEach(b => b.addEventListener('click', ocultarAviso));
{ const _ap = apply; apply = function () { _ap.apply(this, arguments); textoAviso() } }   // si cambia el idioma con el anuncio visible, se traduce

/* Desplazar con el dedo las listas de Mis favoritos (#fl) y Ajustes (#al).
   El escenario (#stage) tiene touch-action: none para que los gestos del mapa no muevan la página, y en varios celulares eso también bloquea el
   desplazamiento normal de estas listas (la información quedaba cortada y no se podía ver el resto). Por eso aquí se mueve scrollTop a mano mientras
   el dedo arrastra. Si el navegador sí desplaza por su cuenta avisa con pointercancel y esto se detiene solo, así nunca se desplaza doble. */
function dedoScroll(el) {
  let id = null, y0 = 0, s0 = 0, arrastro = false;
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'touch' || !e.isPrimary) return; id = e.pointerId; y0 = e.clientY; s0 = el.scrollTop; arrastro = false });
  el.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return;
    const dy = e.clientY - y0; if (!arrastro && Math.abs(dy) < 8) return; arrastro = true;
    el.scrollTop = s0 - dy / (stage._s || 1)   // el dedo se mide en pantalla y el panel está dentro del escenario escalado
  });
  const fin = e => { if (e.pointerId === id) id = null };
  el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin);
  el.addEventListener('click', e => { if (arrastro) { e.stopPropagation(); e.preventDefault(); arrastro = false } }, true);   // soltar después de arrastrar no cuenta como toque
}
dedoScroll($('#fl')); dedoScroll($('#al'));
document.addEventListener('keydown', e => { const t = e.target; if ((e.key === 'Enter' || e.key === ' ') && t.matches && t.matches('.fb,.pin') && t.tagName !== 'BUTTON') { e.preventDefault(); t.click() } if (e.key === 'Escape') ['#apanel', '#favs', '#fpanel'].forEach(s => $(s).classList.remove('show')) });


/* ===== Zoom ===== */
/* El arrastre, el pellizco y la rueda los maneja la cámara 3D (OrbitControls, ver init3DMap). Aquí solo quedan los botones y el teclado. */
function zoom(f) { MAPA3D.zoom(f) }
addEventListener('keydown', e => { if (e.target.id === 'q') return; if (e.key === '+' || e.key === '=') zoom(1.2); if (e.key === '-') zoom(1 / 1.2) });
/* ===== Recorridos: desde la entrada hasta cada lugar (solo por zonas café y blancas) ===== */
/* ===== Recorridos: desde la entrada hasta cada lugar, solo por zonas café (caminos) y blancas (senderos y plazoletas) =====
   Cada recorrido es la ruta MÁS CORTA entre la entrada y el lugar, calculada sobre el mapa de zonas caminables
   (café y blanco; el pasto, el agua y los edificios están excluidos). Los puntos son coordenadas del suelo 3D [x, z],
   así que el recorrido se pega al mapa y acompaña la cámara cuando gira. Si cambias el mapa o agregas un lugar,
   hay que volver a calcular su recorrido. Regla del campus: todo recorrido sube por la primera rotonda (la de Banderas) y sigue por dentro de la universidad; la vía del sur y el tren, aunque salen en el mapa, quedan fuera y no se usan; la llave debe ser igual al nombre en español del lugar (primer texto de p.es). */
const ROUTES = {
  'Cafetería D': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[48.5,-134],[49,-199.5],[52,-205],[57,-210]],
  'Cafetería canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,78.5],[-243.5,99],[-248,127],[-248,132.5],[-249.5,136],[-251,164]],
  'Aula A': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-206.5,55.5],[-206.5,12.5],[-208.5,4.5],[-212,-3.5],[-212,-47.5],[-175.5,-84],[-151,-94.5],[-138,-107.5],[-137,-157.5],[-129,-166.5],[-128,-189.5],[-123,-194.5],[-97.5,-194.5],[-91,-188],[-91,-176.5],[-86.5,-172],[-84,-172]],
  'Aula B': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[-6,-190.5],[-7.5,-189]],
  'Aula C': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-34.5,-75.5],[-3,-75.5],[8.5,-78],[12,-81]],
  'Aula D': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[83.5,-170]],
  'Aula E': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[61.5,-147],[62,-169],[79.5,-186.5],[80.5,-188.5],[81,-212.5],[97,-228.5],[100.5,-230],[140,-229.5],[147,-229],[149.5,-226.5]],
  'Biblioteca principal': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-34.5,-75.5],[-3,-75.5],[3.5,-77.5],[16.5,-77.5]],
  'Faedis': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[252,30.5],[252,4],[237,-11],[237,-44.5],[225,-56.5],[223.5,-56.5]],
  'Programas': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[17,-190.5],[11.5,-196]],
  'Fase 1': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[255,27.5],[259.5,14.5],[260,4.5],[269.5,-7],[269.5,-111.5],[272,-142.5],[272,-205],[270.5,-206.5]],
  'Fase 2': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[255,27.5],[259.5,14.5],[260,4.5],[269,-6],[269,-151],[267,-153]],
  'Cuervo': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[253,29.5],[253,0]],
  'Laboratorio Cabal': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-28,-112.5],[-31.5,-116],[-95.5,-116],[-96.5,-117]],
  'Invernaderos': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-206.5,55.5],[-206.5,12.5],[-208.5,4.5],[-212,-3.5],[-212,-47.5],[-175.5,-84],[-151,-94.5],[-138,-107.5],[-137,-157.5],[-129,-166.5],[-129,-191.5],[-142.5,-203.5]],
  'Financiera': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-17.5,-121],[-11.5,-121],[-6.5,-126]],
  'Carnetización': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[80,131.5],[118,121.5],[169.5,121.5]],
  'Centro cultural': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-267,85.5],[-271.5,90],[-275.5,118],[-276,134.5],[-278,139],[-279,149.5],[-283,153.5],[-294.5,153.5],[-302.5,151.5],[-311.5,151.5],[-319,159],[-319,188],[-324,243],[-330,249],[-348.5,249.5]],
  'Sala descanso docentes': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-193]],
  'Centro de acopio': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[255,27.5],[259.5,14.5],[260,4.5],[269.5,-7],[269.5,-111.5],[274.5,-178],[277,-237.5],[288,-249],[351.5,-248]],
  'Concha Acústica': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-205,57],[-205,-7]],
  'Parqueadero Docentes': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-206.5,55.5],[-206.5,12.5],[-208.5,4.5],[-212,-3.5],[-212,-47.5],[-175.5,-84],[-151.5,-94.5],[-139.5,-106.5],[-139.5,-117.5],[-148,-126]],
  'Parqueadero Administrativos': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18.5,-120],[44,-120],[47,-121.5],[74.5,-149],[82,-149]],
  'Parqueadero Cuervo': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[255,27.5],[255.5,25.5],[272,9],[284,9],[286,10],[327.5,10],[340,22.5]],
  'Parqueadero Canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-267,85.5],[-271.5,90],[-275.5,118],[-276,134.5],[-278,139],[-279,149.5],[-283,153.5],[-294.5,153.5],[-305,151],[-343.5,151],[-351.5,143]],
  'Parqueadero Carnetización': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[80,131.5],[116,122],[146.5,122],[157.5,133],[157.5,195],[173,210.5],[202.5,211.5],[213,221.5],[248,221.5]],
  'Canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-267,85.5],[-271.5,90],[-275.5,118],[-276,134.5],[-278,139],[-279,149.5],[-283,153.5],[-294.5,153.5],[-302.5,151.5],[-311.5,151.5],[-319,159],[-319,188],[-321.5,210],[-321.5,240.5],[-319.5,242.5],[-297,242.5],[-284.5,230],[-278.5,230],[-275.5,227]],
  'Banderas': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,131],[-4.5,126.5]],
  'Cafetería A': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-28,-113],[-34,-119],[-55.5,-119],[-59.5,-123]],
  'Plaza Mutis': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-28,-116.5],[-35,-123.5],[-35,-125.5]],
  'Cafetería E': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18.5,-120],[39.5,-120],[82,-162.5],[112,-162.5],[126,-161.5],[150.5,-161.5],[151.5,-162.5]],
  'Cafetería de espejos': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[-8.5,-191.5],[-14.5,-192],[-17,-194.5]],
  'Cafetería del C': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-34.5,-75.5],[-3,-75.5],[-1.5,-76.5],[16,-79.5],[31.5,-79.5],[59,-77.5],[67.5,-75],[72.5,-71],[76.5,-71]],
  'Restaurante canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-154.5,106.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248,85],[-256,85],[-258,83]],
  'Restaurante Nuevo': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-229,41.5],[-234.5,36],[-234.5,31]],
  'Carulla': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[255,27.5],[259.5,14.5],[260,4.5],[269.5,-7],[269.5,-101.5],[274.5,-106.5]],
  'Hemiciclo A y B': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,125],[-6,119],[-6,26.5],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-34.5,-75.5],[-3,-75.5],[-1.5,-76.5],[16,-79.5],[31.5,-79.5],[62,-77],[68.5,-74.5],[82,-62],[85.5,-61],[100.5,-61],[102,-60],[106.5,-60]],
  'Bienestar universitario': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-200.5,61.5],[-200.5,19.5],[-195.5,14.5]],
  'Consultorio Jurídico': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[80,131.5],[116,122],[146.5,122],[157.5,133],[157.5,195],[169,206.5],[192.5,206.5],[216.5,182.5]],
  'Entrada principal': [[-20,282],[-11,273],[-4.5,273]],
  'Entrada vehicular administrativos': [[-20,282],[-19,281],[-18.5,275],[-14,176.5],[24.5,138],[36.5,138],[65,134.5],[80,131.5],[116,122],[146.5,122],[150.5,126],[150.5,246],[139.5,257]],
  'Observatorio de aves': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[110.5,124],[141.5,114.5],[146.5,113.5],[157,113.5],[167.5,103.5],[193.5,89],[255,27.5],[259.5,14.5],[260,4.5],[269.5,-7],[269.5,-111.5],[274.5,-178],[277,-236.5],[277.5,-238.5],[288,-249],[344,-249],[353,-258],[353,-278],[351.5,-281],[328.5,-304],[328.5,-306.5]]
};
/* Recorridos accesibles (movilidad reducida), mismas llaves que ROUTES. Siguen el trazo verde de la imagen "rutas de accesibilidad":
   tronco por el camino central hasta la rotonda, rama izquierda por el anillo, rama derecha hacia el este y la subida al centro por el
   lago hasta la fila de aulas. El trazo se tomó como GUÍA: el camino accesible se queda dentro de unos 14 unidades alrededor de él y solo
   se sale al final, para llegar al lugar, por zonas café o blancas. Se muestran solo cuando el modo "Rutas accesibles" está activo
   y la persona presiona "Comenzar Recorrido". */
const ROUTES_ACC = {
  'Cafetería D': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[61,-146.5],[62,-169],[79.5,-186.5],[79.5,-203.5]],
  'Cafetería canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-267,85.5],[-271.5,90],[-271,103],[-273,105],[-274,108],[-275.5,118],[-276,134.5],[-277.5,137],[-278,145]],
  'Aula A': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[14,-190.5],[-52,-193.5],[-84.5,-193.5],[-87.5,-190.5],[-87.5,-186]],
  'Aula B': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[-6,-190.5],[-7.5,-189]],
  'Aula C': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-21,-117.5],[10.5,-117.5],[13,-115]],
  'Aula D': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[83.5,-170]],
  'Aula E': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[62,-147.5],[62,-169],[79.5,-186.5],[80.5,-188.5],[80.5,-203.5],[83.5,-206.5],[83,-214],[97,-228.5],[100.5,-230],[126.5,-230],[136,-229]],
  'Biblioteca principal': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-33,-76],[-15,-76],[-14,-77],[-13,-76],[2.5,-76]],
  'Faedis': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-20.5,-118],[76.5,-118],[82,-114],[91,-112.5],[94.5,-109],[111.5,-109],[129.5,-105],[158,-96.5],[180.5,-87.5],[191,-77]],
  'Programas': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[17,-190.5],[11.5,-196]],
  'Fase 1': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[61,-146.5],[61,-152],[62,-153],[62,-169],[79.5,-186.5],[80.5,-188.5],[80.5,-203.5],[83.5,-206.5],[83,-214],[97,-228.5],[100.5,-230],[160.5,-229.5],[180.5,-234],[208,-247],[217,-247.5]],
  'Fase 2': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[47.5,137],[80,131.5],[125,120],[141.5,114.5],[146.5,113.5],[157,113.5],[165.5,105],[169,103],[173,103],[174.5,101.5],[188,100.5],[188.5,97],[251.5,34],[258.5,18],[260,11.5],[260,4.5],[269,-6],[269,-140]],
  'Cuervo': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[47.5,137],[80,131.5],[125,120],[141.5,114.5],[146.5,113.5],[157,113.5],[165.5,105],[169,103],[173,103],[174.5,101.5],[188,100.5],[188.5,97],[251.5,34],[251.5,15.5]],
  'Laboratorio Cabal': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-206.5,55.5],[-206.5,12.5],[-208.5,4.5],[-212,-3.5],[-212,-47.5],[-175.5,-84],[-171,-86],[-157,-86],[-146.5,-96.5],[-142,-98],[-132,-108]],
  'Invernaderos': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-206.5,55.5],[-206.5,12.5],[-208.5,4.5],[-212,-3.5],[-212,-47.5],[-175.5,-84],[-169,-87],[-158,-87],[-138,-107],[-137,-157.5],[-129,-166.5],[-129,-192],[-132.5,-195.5]],
  'Financiera': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-17.5,-121],[-11.5,-121],[-6.5,-126]],
  'Carnetización': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[80,131.5],[118,121.5],[169.5,121.5]],
  'Centro cultural': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-267,85.5],[-271.5,90],[-271,103],[-273,105],[-274,108],[-275.5,118],[-276,134.5],[-278,139],[-279,149.5],[-283,153.5],[-294.5,153.5],[-302.5,151.5],[-311.5,151.5],[-319,159],[-319,188],[-324,243],[-330,249],[-336,249]],
  'Sala descanso docentes': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-193]],
  'Centro de acopio': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[47.5,137],[80,131.5],[125,120],[141.5,114.5],[146.5,113.5],[157,113.5],[165.5,105],[169,103],[173,103],[174.5,101.5],[188,100.5],[188.5,97],[251.5,34],[258.5,18],[260,11.5],[260,4.5],[269.5,-7],[269.5,-111.5],[274,-170],[276,-224.5],[277.5,-238.5],[288,-249],[323.5,-249],[329,-248.5],[332,-247]],
  'Concha Acústica': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-205,57],[-205,-7]],
  'Parqueadero Docentes': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-206.5,55.5],[-206.5,12.5],[-208.5,4.5],[-212,-3.5],[-212,-47.5],[-175.5,-84],[-169,-87],[-158,-87],[-139.5,-105.5],[-139.5,-114]],
  'Parqueadero Administrativos': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18.5,-120],[44,-120],[47,-121.5],[74.5,-149],[82,-149]],
  'Parqueadero Cuervo': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[47.5,137],[80,131.5],[125,120],[141.5,114.5],[146.5,113.5],[157,113.5],[165.5,105],[169,103],[173,103],[174.5,101.5],[188,100.5],[188.5,97],[251.5,34],[255.5,25.5],[272,9],[284,9],[286,10],[318,10],[329.5,21.5]],
  'Parqueadero Canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-272,84],[-274,82.5],[-287,83],[-289.5,80.5],[-304,80.5],[-310,86.5],[-315.5,145.5],[-320.5,150.5],[-336.5,150.5],[-339,148]],
  'Parqueadero Carnetización': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[80,131.5],[116,122],[146.5,122],[159,134.5],[159,136.5],[164,141.5],[164,201.5],[173,210.5],[202,211.5],[206,214.5],[233.5,215.5]],
  'Canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248.5,85.5],[-267,85.5],[-271.5,90],[-271,103],[-273,105],[-274,108],[-275.5,118],[-276,134.5],[-278,139],[-279,149.5],[-283,153.5],[-294.5,153.5],[-302.5,151.5],[-311.5,151.5],[-319,159],[-319,188],[-321.5,210],[-321.5,240.5],[-319.5,242.5],[-297.5,242.5],[-289.5,234.5]],
  'Banderas': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[0,153.5],[0,133.5],[-3.5,130]],
  'Cafetería A': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-28,-113],[-34.5,-119.5],[-42.5,-119.5],[-46.5,-121.5]],
  'Plaza Mutis': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-28,-116.5],[-35,-123.5],[-35,-125.5]],
  'Cafetería E': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18.5,-120],[38.5,-120],[81.5,-163],[138.5,-162]],
  'Cafetería de espejos': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-18,-120.5],[35,-120.5],[42.5,-128],[42.5,-184.5],[36.5,-190.5],[-8.5,-191.5],[-14.5,-192],[-17,-194.5]],
  'Cafetería del C': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-20.5,-118],[73.5,-118],[82.5,-109]],
  'Restaurante canchas': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-154.5,106.5],[-162.5,101.5],[-221.5,42.5],[-234,42.5],[-238.5,47],[-239.5,60],[-243,80],[-248,85],[-256,85],[-258,83]],
  'Restaurante Nuevo': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-139,114],[-159.5,103.5],[-162.5,101.5],[-221.5,42.5],[-229,41.5],[-234.5,36],[-234.5,31]],
  'Carulla': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[47.5,137],[80,131.5],[125,120],[141.5,114.5],[146.5,113.5],[157,113.5],[165.5,105],[169,103],[173,103],[174.5,101.5],[188,100.5],[188.5,97],[251.5,34],[258.5,18],[260,11.5],[260,4.5],[269.5,-7],[269.5,-100],[274.5,-105]],
  'Hemiciclo A y B': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,167.5],[4.5,149],[4.5,127],[-0.5,120.5],[-0.5,118],[-2,116.5],[-2,107.5],[-3.5,106],[-3.5,87.5],[-5.5,79],[-5.5,26],[0.5,19],[0.5,-5],[11,-20],[11,-27],[7,-31],[4,-32],[-16,-32.5],[-18,-33.5],[-25.5,-34],[-35.5,-36.5],[-44,-40.5],[-54,-50.5],[-54,-61.5],[-44,-71.5],[-35.5,-75],[-28,-82.5],[-26.5,-112],[-20.5,-118],[76.5,-118],[82,-114],[91,-112.5],[94.5,-109],[110,-109],[116.5,-102.5],[116.5,-99.5]],
  'Bienestar universitario': [[-20,282],[-20,172],[-53.5,138.5],[-73.5,136],[-98.5,129.5],[-129.5,118],[-157,105],[-200.5,61.5],[-200.5,19.5],[-195.5,14.5]],
  'Consultorio Jurídico': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[36.5,138],[65,134.5],[80,131.5],[116,122],[146.5,122],[159,134.5],[159,136.5],[164,141.5],[164,201.5],[169,206.5],[184.5,206.5],[208.5,182.5]],
  'Entrada principal': [[-20,282],[-11.5,273.5],[-4.5,273.5]],
  'Entrada vehicular administrativos': [[-20,282],[-19,281],[-18.5,275],[-14,176.5],[24.5,138],[36.5,138],[65,134.5],[80,131.5],[116,122],[146.5,122],[150.5,126],[150,243],[140,253]],
  'Observatorio de aves': [[-20,282],[-19,281],[-18,266],[-17,229],[-14,189],[-14,171.5],[19,138.5],[47.5,137],[80,131.5],[125,120],[141.5,114.5],[146.5,113.5],[157,113.5],[165.5,105],[169,103],[173,103],[174.5,101.5],[188,100.5],[188.5,97],[251.5,34],[258.5,18],[260,11.5],[260,4.5],[269.5,-7],[269.5,-111.5],[274,-170],[276,-224.5],[277.5,-238.5],[288,-249],[344,-249],[353,-258],[353,-278],[351.5,-281],[337,-295.5]]
};
const RC_START = [-20, 282];              /* entrada: cruce de la vía principal con el camino central */
const M_PER_UNIT = .8, M_PER_MIN = 80;  /* metros por unidad del mapa 3D (estimado) y velocidad al caminar (metros por minuto) */
let tour = false, tourId = null;
const SVGNS = 'http://www.w3.org/2000/svg';
const rc = document.createElementNS(SVGNS, 'svg');
rc.setAttribute('viewBox', '0 0 1000 900'); rc.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;display:none';
const routeOf = id => (id === null || id === undefined || !P[id]) ? null : (route ? ROUTES_ACC : ROUTES)[P[id].es[0]];   // con el modo accesible activo se usa el recorrido accesible
const rcPaths = [['var(--route-case)', 13], ['var(--route)', 7]].map(([c, w]) => {
  const p = document.createElementNS(SVGNS, 'path');
  p.setAttribute('fill', 'none'); p.style.stroke = c; p.setAttribute('stroke-width', w);
  p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); rc.appendChild(p); return p
});
const rcBadge = document.createElementNS(SVGNS, 'g'); rcBadge.id = 'gps-badge'; rc.appendChild(rcBadge);
inner.insertBefore(rc, $('#pins'));
const CAT_ICON = { cafe: '☕', acad: '🎓', admin: '🏛️', aud: '🎤', parq: '🅿️', free: '🌳' };
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function drawBadges(id) {
  const w = routeOf(id), r = w.map(PW), p = P[id], es = lang === 'es'; let L = 0; const seg = [];
  for (let i = 1; i < r.length; i++) { const d = Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]); seg.push(d); L += d }
  const Lw = w.reduce((a, q, i) => i ? a + Math.hypot(q[0] - w[i - 1][0], q[1] - w[i - 1][1]) : 0, 0);   // largo real en el suelo, no el proyectado (no cambia al girar)
  const m = Math.round(Lw * M_PER_UNIT / 5) * 5, min = Math.max(1, Math.round(m / M_PER_MIN));
  let h = L / 2, k = 0; while (k < seg.length - 1 && h > seg[k]) { h -= seg[k]; k++ }
  const f = seg[k] ? h / seg[k] : 0, mx = r[k][0] + (r[k + 1][0] - r[k][0]) * f, my = r[k][1] + (r[k + 1][1] - r[k][1]) * f;
  const a = r[0], b = r[r.length - 1], org = route ? (es ? 'ORIGEN: Acceso principal' : 'START: Main entrance') : (es ? 'ORIGEN: Entrada' : 'START: Entrance'), RC = route ? '#1F6FB2' : '#BF512C';   // el recorrido accesible va en azul y con ♿
  const kb = +getComputedStyle(document.body).getPropertyValue('--tx') || 1;   // 1 normal; con "Texto grande" crece igual que el resto de los textos
  const wO = Math.round((org.length * 7.6 + 24) * kb);
  const tx = mx < 500 ? mx - 104 * kb : mx + 104 * kb, F = 'font-family="Montserrat, sans-serif"';
  rcBadge.innerHTML = `
    <circle cx="${a[0]}" cy="${a[1]}" r="16" fill="${RC}" stroke="#fff" stroke-width="3"/>
    <text x="${a[0]}" y="${a[1] + 5}" text-anchor="middle" fill="#fff" font-size="14">${route ? '♿' : '🚶'}</text>
    <rect x="${a[0] - wO / 2}" y="${a[1] + 24}" width="${wO}" height="${26 * kb}" rx="6" fill="#0C2C47" opacity="0.9"/>
    <text x="${a[0]}" y="${a[1] + 24 + 18 * kb}" text-anchor="middle" fill="#fff" ${F} font-size="${12 * kb}" font-weight="bold">${org}</text>
    <circle cx="${b[0]}" cy="${b[1]}" r="16" fill="#2E5749" stroke="#fff" stroke-width="3"/>
    <text x="${b[0]}" y="${b[1] + 5}" text-anchor="middle" fill="#fff" font-size="14">${CAT_ICON[p.c] || '📍'}</text>
    <line x1="${mx}" y1="${my}" x2="${tx}" y2="${my}" stroke="${RC}" stroke-width="3"/>
    <rect x="${tx - 72 * kb}" y="${my - 19 * kb}" width="${144 * kb}" height="${38 * kb}" rx="10" fill="${RC}" stroke="#fff" stroke-width="2"/>
    <text x="${tx}" y="${my + 6 * kb}" text-anchor="middle" fill="#fff" ${F} font-size="${15 * kb}" font-weight="700">${route ? '♿ ' : ''}${min} min (${m} m)</text>`
}
/* sonidos generados con Web Audio (no necesitan archivos) */
let actx = null;
function sfx(kind) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    const seq = kind === 'start' ? [[523.25, 0, .25], [659.25, .13, .25], [783.99, .26, .45]] : [[783.99, 0, .28], [1046.5, .17, .8]], t = actx.currentTime;
    seq.forEach(([fr, d, l]) => {
      const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = fr;
      g.gain.setValueAtTime(.0001, t + d); g.gain.exponentialRampToValueAtTime(.22, t + d + .015); g.gain.exponentialRampToValueAtTime(.0001, t + d + l);
      o.connect(g); g.connect(actx.destination); o.start(t + d); o.stop(t + d + l + .05)
    })
  } catch (e) { }
}
/* Mientras hay una ruta activa, la viñeta se compacta y se vuelve translúcida para que se vea todo el camino.
   Al pasar el cursor por encima recupera su aspecto completo. */
{ const st = document.createElement('style'); st.textContent = `
  body.touring .pin.sel .tip .th, body.touring .pin.sel .tip p, body.touring .pin.sel .tip .pr, body.touring .pin.sel .tip span[id^="ts"] { display: none }
  body.touring .pin.sel .tip .hrt { top: 14px }
  body.touring .pin.sel .tip { opacity: .55; transition: opacity .2s }
  body.touring .pin.sel .tip:hover { opacity: 1 }`;
  document.head.appendChild(st) }
let rcOn = false, rcTok = 0;
function routeWanted() { return tour && tourId !== null && sel === tourId && !!routeOf(tourId) && visible(P[tourId]) }
function toggleTour() { if (tour) tour = false; else { tour = true; tourId = sel } updateRoute() }
function updateRoute() {
  if (tour && !routeWanted()) tour = false; const w = routeWanted();
  document.querySelectorAll('.go').forEach(b => { const on = tour && +b.closest('.pin').id.slice(1) === tourId; b.textContent = T[lang][on ? 'stop' : 'go'] + (route && !on ? ' ♿' : ''); b.classList.toggle('on', on) });
  document.body.classList.toggle('touring', w);
  const key = w ? tourId + (route ? ':acc' : ':std') : false;   // si cambia el lugar o el modo (normal / accesible) se vuelve a trazar
  if (key === rcOn) return; rcOn = key; const tok = ++rcTok;
  if (!w) { cancelAnimationFrame(rcRaf); rc.style.display = 'none'; MAPA3D.setRoute(null); return }
  /* Al comenzar se vuelve a la vista inicial para que se vea todo el camino; la línea avanza de la entrada al destino. */
  MAPA3D.reset(); rc.style.display = 'block';
  const Lw = routeOf(tourId).reduce((a, q, i, r) => i ? a + Math.hypot(q[0] - r[i - 1][0], q[1] - r[i - 1][1]) : 0, 0), ms = Math.min(7000, Math.max(3000, Lw * 8));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, t0 = performance.now();
  cancelAnimationFrame(rcRaf); rcProg = 0; paintRoute(true);
  const step = now => {
    if (!(rcOn && rcTok === tok)) return;
    const t = Math.min(1, (now - t0) / ms); rcProg = ease(t); paintRoute(false);
    if (t < 1) rcRaf = requestAnimationFrame(step); else sfx('end')   // sonido de llegada, justo cuando la línea toca el destino
  };
  sfx('start'); rcRaf = requestAnimationFrame(step)
}
/* Dibuja el recorrido según el progreso rcProg (0 a 1). Se llama en cada cuadro de la animación y cada vez que la cámara se mueve,
   así que si el mapa gira mientras la línea avanza, sigue desde donde iba. */
let rcProg = 1, rcRaf = 0;
function paintRoute(badges) {
  const w = routeOf(tourId); if (!w) return;
  MAPA3D.setRoute(w, rcProg);   // la línea es una cinta en el suelo 3D; aquí solo se le dice cuánto mostrar
  if (badges) drawBadges(tourId)
}
{ const _build = build; build = function () { _build.apply(this, arguments); if (rcOn && routeOf(tourId)) drawBadges(tourId) } }
/* Cuando la cámara se mueve, los recorridos y las rampas se vuelven a proyectar sobre el suelo 3D (la llama el ciclo de dibujo de init3DMap) */
function reprojectRoutes() {
  if (rcOn && routeOf(tourId)) paintRoute(true)
}
apply();



//Filtros conceptos cortos
if (typeof T !== 'undefined') {
  if (T.es) {
    T.es.f = {
      acad: 'Aulas',
      lib: 'Bibliotecas',
      aud: 'Auditorios',
      events: 'Eventos',
      admin: 'Oficinas',
      cafe: 'Cafeterías',
      parq: 'Parqueaderos',
      free: 'Otros',
      out: 'Zonas Verdes'
    };
  }
  if (T.en) {
    T.en.f = {
      acad: 'Classrooms',
      lib: 'Libraries',
      aud: 'Auditoriums',
      events: 'Events',
      admin: 'Offices',
      cafe: 'Dining',
      parq: 'Parking',
      free: 'Others',
      out: 'Green Areas'
    };
  }
  if (typeof apply === 'function') apply();
}

//Búsqueda inteligente: conceptos relacionados, sugerencias desplegables, botón "X" y mensaje sin resultados
Object.assign(T.es, { nores: 'No se encuentran resultados relacionados', dir: 'Resultados', rel: 'Relacionados' });
Object.assign(T.en, { nores: 'No related results found', dir: 'Results', rel: 'Related' });

const nrm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const BUILDING = ['acad', 'admin', 'aud', 'cafe']; // lugares que son edificios (aquí se asume que tienen baños)

/* CONCEPTOS RELACIONADOS
   w = palabras que puede escribir la persona (ES y EN, sin tildes)
   t = a qué lugares se relaciona esa palabra
   Para agregar una palabra nueva, solo añádela a la lista w del concepto. */
const REL = [
  { // parqueadero: los parqueaderos y los lugares que tienen parqueadero cerca
    w: ['parqueadero', 'parquear', 'parqueo', 'estacionamiento', 'estacionar', 'carro', 'auto', 'automovil', 'vehiculo', 'moto', 'bicicleta', 'bici', 'parking', 'park', 'car', 'vehicle', 'motorcycle', 'bike'],
    t: p => p.cs.includes('parq') || p.fl.parking
  },
  { // baños: todos los edificios (cambia aquí cuáles lugares tienen baños)
    w: ['bano', 'sanitario', 'wc', 'lavamanos', 'lavabo', 'restroom', 'bathroom', 'toilet', 'washroom'],
    t: p => p.cs.some(c => BUILDING.includes(c))
  },
  { // comida
    w: ['comida', 'comer', 'almuerzo', 'desayuno', 'cafe', 'cafeteria', 'restaurante', 'bebida', 'snack', 'hambre', 'tinto', 'jugo', 'refrigerio', 'food', 'eat', 'lunch', 'coffee', 'drink', 'hungry', 'dining'],
    t: p => p.cs.includes('cafe')
  },
  { // estudiar / clases
    w: ['estudiar', 'estudio', 'clase', 'salon', 'aula', 'laboratorio', 'facultad', 'tarea', 'profesor', 'docente', 'study', 'class', 'classroom', 'lab', 'teacher'],
    t: p => p.cs.includes('acad')
  },
  { // biblioteca / silencio
    w: ['biblioteca', 'libro', 'leer', 'lectura', 'silencio', 'silenciosa', 'investigar', 'library', 'book', 'read', 'reading', 'quiet'],
    t: p => p.fl.lib
  },
  { // trámites / oficinas
    w: ['tramite', 'matricula', 'inscripcion', 'certificado', 'oficina', 'admision', 'registro', 'carnet', 'carne', 'carnetizacion', 'rectoria', 'office', 'enrollment', 'certificate', 'admissions', 'paperwork'],
    t: p => p.cs.includes('admin')
  },
  { // eventos
    w: ['evento', 'conferencia', 'charla', 'grado', 'congreso', 'auditorio', 'event', 'conference', 'talk', 'graduation', 'auditorium'],
    t: p => p.cs.includes('aud') || p.fl.events
  },
  { // accesibilidad
    w: ['accesible', 'accesibilidad', 'silla de ruedas', 'sillas de ruedas', 'rampa', 'movilidad', 'discapacidad', 'ascensor', 'wheelchair', 'ramp', 'accessible', 'elevator', 'disability'],
    t: p => p.fl.access
  },
  { // zonas verdes / descanso / deporte
    w: ['zona verde', 'zonas verdes', 'verde', 'descanso', 'descansar', 'aire libre', 'deporte', 'cancha', 'futbol', 'recreacion', 'green', 'outdoor', 'sports', 'soccer', 'field'],
    t: p => p.fl.out
  },
  { // otros espacios del campus
    w: ['otros', 'otro', 'plaza', 'plazoleta', 'espacio', 'others', 'other', 'space'],
    t: p => p.cs.includes('free')
  },
  { // salud y bienestar
    w: ['salud', 'enfermeria', 'medico', 'psicologia', 'cultura', 'bienestar', 'health', 'nurse', 'doctor', 'wellbeing'],
    t: p => p.es[0] === 'Bienestar Universitario'
  }
];

// Palabras comunes que se ignoran en frases como "dónde está el baño"
const STOP = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'por', 'para', 'que', 'hay', 'como', 'donde', 'esta', 'estan', 'queda', 'quiero', 'busco', 'the', 'is', 'are', 'where', 'an', 'to', 'of', 'in', 'there', 'find', 'my', 'me'];

// ¿Lo que escribió la persona se relaciona con este concepto? (acepta plurales y frases)
const conceptHit = (q, c) => {
  const toks = q.split(/\s+/).filter(t => t.length >= 2 && !STOP.includes(t));
  return c.w.some(w => q === w || (w.includes(' ') && q.includes(w)) ||
    toks.some(t => t === w || (t.length >= 3 && w.startsWith(t)) || (w.length >= 4 && t.startsWith(w))));
};

// Devuelve los lugares encontrados: s=3 nombre, s=2 descripción, s=1 relacionado por concepto
const searchPlaces = raw => {
  const q = nrm(raw);
  if (q.length < 2) return [];
  const rels = REL.filter(c => conceptHit(q, c));
  const out = [];
  P.forEach(p => {
    const name = nrm(p.es[0]) + ' ' + nrm(p.en[0]) + ' ' + nrm(p.al || '');   // p.al: nombres anteriores o sinónimos (Aula A también se encuentra como "edificio a")
    const desc = nrm(p.es[1]) + ' ' + nrm(p.en[1]);
    let s = 0;
    if (name.includes(q)) s = 3;
    else if (desc.includes(q)) s = 2;
    else if (rels.some(c => c.t(p))) s = 1;
    if (s) out.push({ p, s });
  });
  return out.sort((a, b) => b.s - a.s || a.p.id - b.p.id);
};

/* Mensaje sobre el mapa cuando la búsqueda, categoría o filtros no dejan ningún lugar */
const noRes = document.createElement('div');
noRes.id = 'nores-banner';
noRes.style.cssText = 'position:absolute;left:960px;top:40px;transform:translateX(-50%);display:none;z-index:14;background:#0C2C47;color:#fff;padding:12px 24px;border-radius:12px;font:600 15px Montserrat,sans-serif;box-shadow:0 6px 18px rgba(12,44,71,.3);pointer-events:none;white-space:nowrap';
stage.appendChild(noRes);
function updateNoRes() {
  const active = qid !== null || !!cat || filters.size > 0;
  const lista = document.getElementById('search-results-list');
  // Si la lista de la barra ya muestra el mensaje, el aviso del mapa se oculta (solo se ve uno)
  const mensajeEnLista = !!lista && lista.style.display === 'block' && !!lista.querySelector('.nores-row');
  noRes.textContent = T[lang].nores;
  noRes.style.display = (active && !mensajeEnLista && !document.querySelector('#pins .pin.show')) ? 'block' : 'none';
}
const paintOriginal = paint;
window.paint = function() { paintOriginal(); updateNoRes(); };

const searchContainer = document.getElementById('search');
let searchResultsList = document.getElementById('search-results-list');

if (searchContainer) {
  // Crear lista de resultados si no existe
  if (!searchResultsList) {
    searchResultsList = document.createElement('div');
    searchResultsList.id = 'search-results-list';
    searchContainer.appendChild(searchResultsList);
  }

  // Crear botón "X" de limpieza si no existe
  let clearSearchBtn = document.getElementById('clear-search-btn');
  if (!clearSearchBtn) {
    clearSearchBtn = document.createElement('button');
    clearSearchBtn.id = 'clear-search-btn';
    clearSearchBtn.innerHTML = '✕';
    clearSearchBtn.type = 'button';
    clearSearchBtn.style.display = 'none';
    clearSearchBtn.setAttribute('aria-label', lang === 'es' ? 'Borrar búsqueda' : 'Clear search');
    searchContainer.appendChild(clearSearchBtn);
  }

  const qInput = document.getElementById('q');
  if (qInput) {

    const toggleClearBtn = () => {
      clearSearchBtn.style.display = qInput.value.trim().length > 0 ? 'block' : 'none';
    };

    const hideList = () => { searchResultsList.style.display = 'none'; updateNoRes(); };

    // Dibuja la lista desplegable con los resultados y los relacionados
    const renderList = (res) => {
      const t = T[lang];
      const head = txt => `<div style="padding:8px 14px 4px;font:700 10px Montserrat,sans-serif;letter-spacing:.6px;text-transform:uppercase;color:#BF512C;background:#faf7f6">${txt}</div>`;
      const row = r => `
        <div class="search-item" data-id="${r.p.id}">
          <strong>${r.p[lang][0]}</strong>
          <small>${r.p[lang][1]}</small>
        </div>`;
      if (!res.length) {
        searchResultsList.innerHTML = `<div class="search-item nores-row" style="cursor:default"><strong style="color:#BF512C">${t.nores}</strong></div>`;
      } else {
        const direct = res.filter(r => r.s > 1), related = res.filter(r => r.s === 1);
        searchResultsList.innerHTML =
          (direct.length && related.length ? head(t.dir) : '') + direct.map(row).join('') +
          (related.length ? head(t.rel) : '') + related.map(row).join('');
      }
      searchResultsList.style.display = 'block';
      updateNoRes();

      searchResultsList.querySelectorAll('.search-item[data-id]').forEach(item => {
        item.onclick = (evt) => {
          evt.stopPropagation();
          const id = +item.dataset.id;
          qid = id;
          sel = id;
          qInput.value = P[id][lang][0];
          toggleClearBtn();
          hideList();
          paint();
          mark();
        };
      });
    };

    qInput.addEventListener('input', () => {
      toggleClearBtn();
      const q = nrm(qInput.value);

      if (q.length < 2) {
        hideList();
        searchResultsList.innerHTML = '';
        qid = null;
        paint();
        return;
      }

      const res = searchPlaces(qInput.value);
      // El mapa muestra todos los lugares encontrados (o ninguno, y sale el mensaje)
      qid = res.map(r => r.p.id);
      sel = null;
      cat = null;
      document.querySelectorAll('.cat').forEach(x => x.classList.remove('on'));
      renderList(res);
      paint();
    });

    // Al volver a la barra, se muestran de nuevo las sugerencias
    qInput.addEventListener('focus', () => {
      if (nrm(qInput.value).length >= 2) renderList(searchPlaces(qInput.value));
    });
    qInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') hideList(); });

    // Acción al hacer clic en la "X"
    clearSearchBtn.onclick = (e) => {
      e.stopPropagation();
      qInput.value = '';
      qid = null;
      sel = null;
      toggleClearBtn();
      hideList();
      searchResultsList.innerHTML = '';
      paint();
      mark();
    };

    // Ocultar desplegable al hacer clic fuera
    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('#search')) hideList();
    });
  }
}

//Eliminar favoritos directamente al presionar el corazón
if (typeof renderFavs !== 'undefined') {
  window.renderFavs = function() {
    const l = [...fav].map(i => P[i]);
    const fl = $('#fl');
    if (!fl) return;
    
    fl.innerHTML = l.length 
      ? l.map(p => `
        <div class="fc">
          <div class="im"><svg><use href="#imgI"/></svg></div>
          <div>
            <h5>${p[lang][0]}</h5>
            <p>${p[lang][1]}</p>
            <p>$${p.i || info(p)}</p>
            ${stars(p.r, true, p.id)}
            <small>${T[lang].rate}</small>
          </div>
          <svg class="hrt on" data-fav-id="${p.id}" style="cursor:pointer;position:absolute;right:0;top:0;width:22px;height:22px;fill:#BF512C"><use href="#hp"/></svg>
        </div>
      `).join('') 
      : `<div id="empty">${T[lang].empty}</div>`;

    fl.querySelectorAll('.hrt').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = +btn.dataset.favId;
        toggleFav(id);
      };
    });
  };
  renderFavs();
}

//Botones "X" para Filtros y Favoritos
function setupCloseButtons() {
  const fpanel = document.getElementById('fpanel');
  if (fpanel && !document.getElementById('close-flt')) {
    const btnFlt = document.createElement('button');
    btnFlt.className = 'close-btn';
    btnFlt.id = 'close-flt';
    btnFlt.innerHTML = '✕';
    btnFlt.onclick = (e) => {
      e.stopPropagation();
      fpanel.classList.remove('show');
    };
    fpanel.appendChild(btnFlt);
  }

  const btnFavs = document.getElementById('close-favs');
  if (btnFavs) {
    btnFavs.onclick = (e) => {
      e.stopPropagation();
      const favs = document.getElementById('favs');
      if (favs) favs.classList.remove('show');
    };
  }

  const clrBtn = document.getElementById('clr');
  if (clrBtn) {
    const originalClrClick = clrBtn.onclick;
    clrBtn.onclick = function(e) {
      if (typeof originalClrClick === 'function') originalClrClick.call(this, e);
      setTimeout(setupCloseButtons, 50);
    };
  }
}
setupCloseButtons();

//Cerrar panel de filtros al dar clic afuera
addEventListener('pointerdown', (e) => {
  const fpanel = document.getElementById('fpanel');
  if (fpanel && fpanel.classList.contains('show')) {
    if (!e.target.closest('#fpanel') && !e.target.closest('#flt')) {
      fpanel.classList.remove('show');
    }
  }
});

/* ===== Mapa 3D (FBX) =====
   El mapa se mueve en 3D otra vez. Cómo se usa:
   · Celular: 1 dedo gira el mapa, 2 dedos hacen pellizco para acercar o alejar y también lo mueven.
   · Computador: botón izquierdo gira, botón derecho (o Shift + arrastrar) mueve, la rueda acerca y aleja.
   Los pines y las rutas ya no están pegados a la pantalla: cada uno tiene un punto 3D y se vuelve a proyectar en cada cuadro,
   así que se quedan sobre su edificio por mucho que se gire o se acerque el mapa.
   Si prefieres que 1 dedo MUEVA el mapa (y 2 dedos giren y hagan zoom), cambia GESTO_UN_DEDO a 'mover'. */
const GESTO_UN_DEDO = 'rotar';
const VISTA = { pos: [0, 950, 450], objetivo: [0, 0, 90] };   // vista inicial; a ella vuelve el botón de centrar
/* Modo daltonismo: matriz de color 3 x 3 (por filas) que se aplica a cada píxel del mapa 3D.
   Se calculó con la simulación de protanopia, deuteranopia y tritanopia (Machado 2009) para que el pasto, los caminos, el agua y los edificios
   se distingan entre sí: la diferencia de color mínima entre ellos (ΔE2000) pasó de 5 a más de 14 en los tres tipos.
   Para alguien sin daltonismo el mapa se ve en tonos tierra, es lo esperado de este modo. Para quitarlo, deja la matriz en [1,0,0, 0,1,0, 0,0,1]. */
const CB_MATRIZ = [1.46, -0.692, 0.254, 0.675, -0.428, 0.743, -0.643, 0.027, 1.49];
const LIMITE_MAPA = 380;                                       // cuánto se puede alejar del centro al mover el mapa (el terreno mide unos 800)

function init3DMap() {
  const container = document.getElementById('webgl-container');
  if (!container) return;
  /* W x H es el marco del mapa (el espacio de 1000 x 900 donde están medidos los pines y las rutas).
     El lienzo 3D es más grande (CW x CH) y sobresale de ese marco: así, al girar o alejar el mapa, el terreno no se corta
     en seco contra el borde del marco. setViewOffset hace que el centro se vea exactamente igual que antes. */
  const W = 1000, H = 900, OX = 495, OY = 300, CW = 2000, CH = 1300;
  container.style.cssText = `position:absolute;left:${-OX}px;top:${-OY}px;width:${CW}px;height:${CH}px`;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 20, 5000);   // plano cercano 20 (antes 0.1): da precisión de profundidad para que el recorrido, pegado al suelo, no parpadee ni quede tapado por él
  camera.setViewOffset(W, H, -OX, -OY, CW, CH);
  camera.position.set(...VISTA.pos);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', precision: 'highp' });
  /* Nitidez según el tamaño real en pantalla: el escenario se escala (stage._s), así que en un celular no hace falta dibujar
     más píxeles de los que la pantalla puede mostrar. Esto mantiene el mapa fluido en celulares. */
  const calidad = () => { renderer.setPixelRatio(Math.max(0.6, Math.min(window.devicePixelRatio * (stage._s || 1), 1.5))); renderer.setSize(CW, CH); controls.panSpeed = 1 / (stage._s || 1) };
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = false;        // mover el mapa es deslizarlo sobre el suelo, sin que se levante ni se hunda
  controls.minDistance = 150;
  controls.maxDistance = 1700;
  controls.maxPolarAngle = Math.PI * 0.44;    // no deja bajar la cámara por debajo del horizonte
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.9;
  calidad();   // (también fija panSpeed: el dedo y el mapa se mueven la misma distancia aunque el escenario esté reducido)
  controls.target.set(...VISTA.objetivo);
  if (GESTO_UN_DEDO === 'mover') controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };

  /* Luz: lo que recibe un techo o el suelo (las caras que miran hacia arriba) es ambiente + direccional x 0.894 (el coseno del ángulo de la luz,
     porque está en (0, 1000, 500)). Debe sumar 1: así el color del FBX y la textura del suelo se ven tal cual, ni más claros ni más oscuros.
     Antes sumaba 1.31 y todo se veía lavado. Si quieres más relieve (paredes más oscuras), baja el ambiente y sube la direccional manteniendo
     ambiente + direccional x 0.894 = 1. Si solo quieres todo un poco más claro u oscuro, sube o baja los dos por igual. */
  scene.add(new THREE.AmbientLight(0xffffff, 0.74));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.29);
  dirLight.position.set(0, 1000, 500);
  scene.add(dirLight);

  /* Filtro de color del modo daltonismo. Se aplica dentro del propio dibujo 3D (en el shader de cada malla), no como filtro CSS,
     así que no cuesta rendimiento en el celular. MAPA3D.setCB(true) cambia la matriz; con la identidad el mapa queda igual que siempre. */
  const IDENT = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const CB_UNI = { value: new THREE.Matrix3() };
  const aplicaCB = on => CB_UNI.value.set(...(on ? CB_MATRIZ : IDENT));
  function conFiltro(mat) {
    /* La imagen del suelo trae transparencia (en promedio un 16 % y bordes totalmente transparentes): al dibujarla, el fondo de la página
       se mezclaba con el mapa y todo se veía pálido y lavado. Aquí el interior se vuelve 100 % opaco y solo se conservan las esquinas
       redondeadas (transparentes) de la imagen. Si algún día quieres un mapa semitransparente, borra la línea del smoothstep. */
    const opaco = mat.map ? '\n gl_FragColor.a = smoothstep(0.2, 0.5, gl_FragColor.a);' : '';
    mat.onBeforeCompile = sh => {
      sh.uniforms.uCB = CB_UNI;
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform mat3 uCB;')
        .replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.rgb = clamp(uCB * gl_FragColor.rgb, 0.0, 1.0);' + opaco);
    };
    mat.needsUpdate = true;
  }

  const meshes = []; let ground = null;
  const cam0 = new THREE.PerspectiveCamera(45, W / H, 0.1, 20000);                   // cámara de la vista inicial: de aquí salen los anclajes 3D de pines y rutas
  const ray = new THREE.Raycaster(), v3 = new THREE.Vector3();
  const ndc = (x, y) => new THREE.Vector2(x / W * 2 - 1, -(y / H * 2 - 1));
  const owners = new Map();                      // malla -> lugares que la reclaman
  const gcache = new Map();                      // punto del mapa 2D -> punto 3D sobre el suelo (para las rutas)

  /* Del 3D a la pantalla: coordenadas dentro de #inner (1000 x 900) */
  function toInner(p3) { v3.copy(p3).project(camera); return [(v3.x * .5 + .5) * CW - OX, (-v3.y * .5 + .5) * CH - OY, v3.z] }

  /* Tamaño de la ventana de información (.tip). Antes era fijo: al acercar el mapa se quedaba igual y en el celular (donde todo el
     escenario se reduce) se veía diminuta. Ahora:
     - crece con el zoom, pero MUCHO menos que el mapa: el factor es (zoom a la 0.4), así con el mapa 4 veces más grande la ventana
       solo es ~1.7 veces más grande (tope 1.7), y al alejar se reduce un poco (mínimo 0.85);
     - en pantallas chicas se agranda un poco más (hasta 1.8) para compensar que el escenario de 1920 x 1080 se reduce.
     Para ajustar: el 0.4 (más alto = crece más con el zoom), los topes 0.85 y 1.7, y el 0.55 (pantalla donde ya no hace falta compensar). */
  const D0 = Math.hypot(VISTA.pos[1] - VISTA.objetivo[1], VISTA.pos[2] - VISTA.objetivo[2]);   // distancia de la cámara en la vista inicial
  function tamanoVentana() {
    const zoom = D0 / Math.max(60, camera.position.distanceTo(controls.target)), s = stage._s || 1;
    const porZoom = Math.min(1.7, Math.max(.85, Math.pow(zoom, .4))), porPantalla = Math.min(1.8, Math.max(1, Math.pow(.55 / s, .5)));
    document.getElementById('pins').style.setProperty('--tk', (porZoom * porPantalla).toFixed(3))
  }
  function placePins() {
    if (!MAPA3D.ready) return;
    tamanoVentana();
    P.forEach(p => {
      const el = document.getElementById('p' + p.id); if (!el || !p.a3) return;
      const [x, y, z] = toInner(p.pin || p.a3);
      el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px';
      el.style.setProperty('--z', Math.round(y));   // los pines más abajo en pantalla (más cerca) quedan encima
      el.style.visibility = z < 1 ? '' : 'hidden'   // detrás de la cámara no se dibujan
    })
  }

  /* Las rutas (rampas y recorridos) están dibujadas sobre el mapa 2D. Cada punto se lleva al suelo 3D desde la vista inicial
     y se vuelve a proyectar, así que también acompañan al mapa cuando gira. */
  function groundAt(x, y) {
    const k = x + ',' + y; if (gcache.has(k)) return gcache.get(k);
    ray.setFromCamera(ndc(x, y), cam0); const h = ray.intersectObject(ground, false)[0], r = h ? h.point.clone() : null; gcache.set(k, r); return r
  }
  PJ = pt => { if (!MAPA3D.ready) return pt; const g = groundAt(pt[0], pt[1]); if (!g) return pt; const q = toInner(g); return [+q[0].toFixed(1), +q[1].toFixed(1)] };
  /* Los recorridos guardan puntos [x, z] del suelo 3D; aquí se llevan a la pantalla. Van un poco por encima del suelo para que se vean pegados a él. */
  const wv = new THREE.Vector3(); let GY = null;
  /* Altura real de la superficie del suelo (se mide con un rayo hacia abajo, no con la caja del modelo, que puede ser más alta que lo que se ve) */
  function groundTop() {
    if (GY === null) { const rr = new THREE.Raycaster(new THREE.Vector3(0, 3000, 0), new THREE.Vector3(0, -1, 0)), h = rr.intersectObject(ground, false)[0]; GY = h ? h.point.y : new THREE.Box3().setFromObject(ground).max.y }
    return GY
  }
  PW = q => {
    if (!MAPA3D.ready || !ground) return [500, 450];
    const r = toInner(wv.set(q[0], groundTop(), q[1])); return [+r[0].toFixed(1), +r[1].toFixed(1)]
  };

  /* El recorrido es una cinta plana PEGADA AL SUELO dentro de la escena 3D (no un dibujo encima de la pantalla): al girar el mapa queda a nivel
     del suelo y los edificios la tapan cuando están delante, como pasaría en la realidad. Son dos cintas: el borde (--route-case) y la línea (--route). */
  const cinta = [[7, '--route-case', 10, .25], [4, '--route', 11, .5]].map(([ancho, varCss, orden, alto]) => {
    const m = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: false,   // transparent: el suelo del modelo es translúcido y se dibuja en esa pasada; así la cinta se dibuja DESPUÉS y no queda difuminada debajo de él
       polygonOffset: true, polygonOffsetFactor: -4 - orden, polygonOffsetUnits: -4 - orden, toneMapped: false }));
    m.renderOrder = orden; m.frustumCulled = false; m.visible = false; scene.add(m); return { m, ancho, varCss, alto }
  });
  function geoCinta(pts, ancho, y) {
    const n = pts.length, pos = new Float32Array(n * 6), idx = [], h = ancho / 2;
    for (let i = 0; i < n; i++) {
      const d0 = i > 0 ? [pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]] : null, d1 = i < n - 1 ? [pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]] : null;
      const nl = d => { const l = Math.hypot(d[0], d[1]) || 1; return [-d[1] / l, d[0] / l] };
      const n0 = d0 ? nl(d0) : nl(d1), n1 = d1 ? nl(d1) : n0;
      let mx = n0[0] + n1[0], mz = n0[1] + n1[1]; const ml = Math.hypot(mx, mz) || 1; mx /= ml; mz /= ml;
      const k = Math.min(2.2, 1 / Math.max(.45, mx * n0[0] + mz * n0[1]));   // esquina en ángulo (miter), limitada para que no se dispare en curvas cerradas
      pos.set([pts[i][0] + mx * h * k, y, pts[i][1] + mz * h * k, pts[i][0] - mx * h * k, y, pts[i][1] - mz * h * k], i * 6);
      if (i < n - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); return g
  }
  /* pts: lista [x, z] del suelo; prog: 0 a 1, qué parte del recorrido se ve (para la animación). pts = null lo oculta. */
  function setRoute(pts, prog) {
    if (!pts || !ground) { cinta.forEach(c => c.m.visible = false); return }
    let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d }
    let rest = L * Math.max(0, Math.min(1, prog === undefined ? 1 : prog)); const cut = [pts[0]];
    for (let i = 0; i < seg.length && rest > 0; i++) {
      if (rest >= seg[i]) { cut.push(pts[i + 1]); rest -= seg[i] }
      else { const f = rest / seg[i]; cut.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]); rest = 0 }
    }
    const cs = getComputedStyle(document.body), y0 = groundTop();
    cinta.forEach(c => {
      c.m.geometry.dispose();
      if (cut.length < 2) { c.m.visible = false; return }
      c.m.geometry = geoCinta(cut, c.ancho, y0 + c.alto);
      c.m.material.color.set(cs.getPropertyValue(c.varCss).trim() || '#BF512C').convertSRGBToLinear();   // la pantalla usa sRGB: así se ve el color tal cual está en el CSS
      c.m.visible = true
    })
  }

  /* Cuál lugar se tocó. Se lanza un rayo desde el dedo hacia el mapa 3D y se mira qué malla toca primero:
     · un edificio: se abre el lugar dueño de esa malla (si no tiene dueño, no se abre nada, así un edificio sin nombre no abre el de al lado);
     · el suelo: se abre el lugar de zona (parqueadero, cancha, plaza) cuyo radio contiene el punto tocado. */
  function pickPlace(clientX, clientY) {
    MAPA3D.grupo = [];
    if (!MAPA3D.ready) return null;
    const r = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height * 2 - 1)), camera);
    const hit = ray.intersectObjects(meshes, false)[0]; if (!hit) return null;
    if (hit.object !== ground) {
      const c = owners.get(hit.object); if (!c) return null;
      if (c.length === 1) return c[0];
      MAPA3D.grupo = c;   // malla compartida: se devuelven todos los dueños en MAPA3D.grupo para mostrarlos juntos
      let best = null, dm = 1e9;   // el que se marca como seleccionado es el de anclaje más cercano (en el plano del suelo)
      c.forEach(p => { const a = p.ao || p.a3, d = Math.hypot(hit.point.x - a.x, hit.point.z - a.z); if (d < dm) { dm = d; best = p } }); return best
    }
    /* En pantallas pequeñas el radio crece para que el dedo alcance (mínimo 28 px de pantalla) */
    const pxPorUnidad = (H / 2) / (Math.tan(camera.fov * Math.PI / 360) * hit.distance), minimo = 28 / (stage._s || 1) / pxPorUnidad;
    let best = null, dm = 1e9;
    P.forEach(p => { if (!p.g || !p.a3) return; const d = Math.hypot(hit.point.x - p.a3.x, hit.point.z - p.a3.z); if (d < Math.max(p.g, minimo) && d < dm) { dm = d; best = p } });
    return best
  }

  /* Resalta en el mapa el edificio del lugar abierto */
  let lit = [];
  function highlight(id) {
    lit.forEach(m => m.material.emissive.setHex(0)); lit = [];
    const p = id === null || id === undefined ? null : P[id]; if (!p || !p.m) return;
    const c = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--c-' + ((cat && p.cs.includes(cat)) ? cat : p.c)).trim() || '#DA9B2B');
    p.m.forEach(i => { const m = meshes[i]; if (m && m.material.emissive) { m.material.emissive.copy(c).multiplyScalar(.45); lit.push(m) } })
  }

  /* Movimientos suaves de cámara (botón de centrar y botones + y −) */
  let tw = null;
  function ir(pos, tgt, ms) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 1;
    tw = { t0: performance.now(), ms, p0: camera.position.clone(), g0: controls.target.clone(), p1: new THREE.Vector3(...pos), g1: new THREE.Vector3(...tgt) }
  }
  controls.addEventListener('start', () => { tw = null });
  Object.assign(MAPA3D, {
    camera, controls, scene, meshes, pickPlace, placePins, highlight, toInner, setRoute,
    reset() { ir(VISTA.pos, VISTA.objetivo, 600) },
    zoom(f) {
      const off = camera.position.clone().sub(controls.target), len = THREE.MathUtils.clamp(off.length() / f, controls.minDistance, controls.maxDistance);
      ir(off.setLength(len).add(controls.target).toArray(), controls.target.toArray(), 220)
    },
    setCB(on) { MAPA3D.cb = !!on; aplicaCB(MAPA3D.cb) }
  });

  const loader = new THREE.FBXLoader();
  loader.load(
    'assets/mapa3d.fbx',
    (fbx) => {
      /* El FBX nuevo (edificios por categoría: Lam_Aulas, Lam_Admin, Lam_Social, Lam_Otros) trae el terreno 2,5 % más grande que el anterior
         (±410,7 en vez de ±400,7 unidades). Se reduce solo en horizontal (x y z; la altura no cambia) para que todo lo que se calculó sobre el modelo
         anterior siga valiendo igual: la vista inicial, los anclajes de los pines, los recorridos y los metros. Si algún día vuelve a cambiar el
         tamaño del terreno, ajusta este número (tamaño nuevo del suelo ÷ 400,67). */
      const ESCALA_FBX = 1.02508;
      fbx.scale.set(20 / ESCALA_FBX, 20, 20 / ESCALA_FBX);
      const center = new THREE.Box3().setFromObject(fbx).getCenter(new THREE.Vector3());
      fbx.position.x -= center.x;
      fbx.position.z -= center.z;
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      fbx.traverse((child) => {
        if (!child.isMesh) return;
        child.material = Array.isArray(child.material) ? child.material[0].clone() : child.material.clone();   // un material por malla, para poder resaltarla sola
        if (child.material.map) {
          child.material.color.setHex(0xffffff);   // el suelo trae un gris (cccccc) que multiplica la textura y la oscurece: en blanco se ve la imagen original
          const tex = child.material.map;
          tex.encoding = THREE.sRGBEncoding;
          tex.anisotropy = maxAnisotropy;
          tex.needsUpdate = true;
        }
        conFiltro(child.material);
        meshes.push(child);
      });
      scene.add(fbx);
      fbx.updateMatrixWorld(true);
      /* El suelo es la malla de mayor superficie; las demás son edificios */
      ground = meshes.reduce((a, b) => { const s = o => { const z = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()); return z.x * z.z }; return s(b) > s(a) ? b : a });

      /* NÚMEROS DE LAS PIEZAS. Los números del campo m de cada lugar (y de la imagen mallas_numeradas_fbx_nuevo.png) son posiciones de esta lista,
         y cada posición es el NOMBRE de una pieza del FBX. Así, si el diseñador vuelve a exportar el FBX y las piezas cambian de orden o se agrega
         alguna, los lugares siguen apuntando a su edificio. Una pieza nueva que no esté en esta lista no abre nada. Si una pieza cambia de nombre
         en el FBX, sale un aviso en la consola (F12) y hay que actualizar su nombre aquí. */
      const PIEZAS = [
    'pCylinder2',
    'pasted__pasted__pasted__pCube25',
    'pasted__pasted__pasted__pCube24',
    'pCone1',
    'pasted__pasted__pasted__pCube23',
    'pPlane20',
    'pPlane19',
    'pasted__pasted__pasted__pCube22',
    'pasted__pasted__pasted__pCube21',
    'pasted__pasted__pasted__pCube20',
    'pasted__pasted__pasted__pCube19',
    'pasted__pasted__pasted__pCube18',
    'pasted__pasted__pasted__pCube17',
    'pasted__pasted__pasted__pCube16',
    'pasted__pasted__pasted__pCube15',
    'pPlane18',
    'pasted__pasted__pasted__pCube14',
    'pasted__pasted__pasted__pCube13',
    'pasted__pasted__pasted__pCube12',
    'pPlane17',
    'pPlane16',
    'pasted__pasted__pasted__pCube11',
    'pPlane15',
    'pPlane14',
    'pPlane13',
    'pPlane12',
    'pPlane11',
    'pasted__pasted__pasted__pCube10',
    'pPlane10',
    'pasted__pasted__pasted__pCube9',
    'pasted__pasted__pasted__pCube8',
    'pPlane9',
    'pPlane8',
    'pPlane7',
    'pPlane6',
    'pasted__pasted__pasted__pCube7',
    'pPlane5',
    'pPlane4',
    'pasted__pasted__pasted__pCube6',
    'pasted__pasted__pasted__pCube5',
    'pPlane3',
    'pPlane2',
    'pasted__pasted__pasted__pCube4',
    'pasted__pasted__pasted__pCube3',
    'pasted__pasted__pasted__pCube2',
    'pPlane1',
    'pasted__pasted__pasted__pCube1',
    'pasted__pCube1',
    'pasted__pCube2',
    'pCube1'
      ];
      const porNombre = PIEZAS.map(n => meshes.findIndex(o => o.name === n));
      porNombre.forEach((k, n) => { if (k < 0) console.warn('Pieza no encontrada en el FBX (número ' + n + '): ' + PIEZAS[n]) });
      P.forEach(p => { if (p.m) p.m = p.m.map(n => porNombre[n]).filter(k => k >= 0) });

      /* Anclaje 3D de cada lugar: el punto del mapa donde cae la punta de su flecha en la vista inicial */
      cam0.position.set(...VISTA.pos); cam0.lookAt(...VISTA.objetivo); cam0.updateMatrixWorld(true);
      P.forEach(p => {
        ray.setFromCamera(ndc(p.x, p.y), cam0); const h = ray.intersectObjects(meshes, false)[0];
        p.a3 = h ? h.point.clone() : new THREE.Vector3((p.x - W / 2), 0, (p.y - H / 2));
        (p.m || []).forEach(i => { const m = meshes[i]; if (m) { if (!owners.has(m)) owners.set(m, []); owners.get(m).push(p) } });
        /* p.ao: el punto del edificio más cercano al anclaje. Sirve para decidir entre dos lugares que comparten una misma malla */
        p.ao = null; let dm = 1e9;
        (p.m || []).forEach(i => {
          const m = meshes[i]; if (!m) return; const bb = new THREE.Box3().setFromObject(m), cl = THREE.MathUtils.clamp,
            q = new THREE.Vector3(cl(p.a3.x, bb.min.x, bb.max.x), 0, cl(p.a3.z, bb.min.z, bb.max.z)), d = Math.hypot(q.x - p.a3.x, q.z - p.a3.z);
          if (d < dm) { dm = d; p.ao = q }
        })
      });

      /* Posición del pin: arriba y en el centro de su edificio (sobre el techo). Si el edificio tiene varias piezas, es el centro de todas
         ponderado por su tamaño; si dos lugares comparten una pieza, cada uno toma el centro de la parte que le toca.
         Los lugares de zona (parqueaderos, plazas) conservan el punto de su flecha. p.a3 sigue siendo el anclaje que usa el toque. */
      P.forEach(p => {
        p.pin = p.a3; if (!p.m || !p.m.length) return;
        let sx = 0, sz = 0, sw = 0, top = 0;
        p.m.forEach(i => {
          const m = meshes[i]; if (!m) return; const bb = new THREE.Box3().setFromObject(m), o = owners.get(m), dx = bb.max.x - bb.min.x, dz = bb.max.z - bb.min.z;
          let cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2, w = dx * dz;
          if (o.length > 1) {   // pieza compartida: centro de la parte más cercana a este lugar
            let n = 0, ax = 0, az = 0;
            for (let a = 0; a < 12; a++) for (let c = 0; c < 12; c++) {
              const x = bb.min.x + (a + .5) / 12 * dx, z = bb.min.z + (c + .5) / 12 * dz; let best = null, dm = 1e9;
              o.forEach(q => { const d = Math.hypot(x - q.ao.x, z - q.ao.z); if (d < dm) { dm = d; best = q } });
              if (best === p) { n++; ax += x; az += z }
            }
            if (n) { cx = ax / n; cz = az / n; w *= n / 144 }
          }
          sx += cx * w; sz += cz * w; sw += w; top = Math.max(top, bb.max.y)
        });
        if (sw) p.pin = new THREE.Vector3(sx / sw + (p.po ? p.po[0] : 0), top, sz / sw + (p.po ? p.po[1] : 0))   // po: desplazamiento opcional del pin (ver LUGARES)
      });

      controls.update();
      MAPA3D.ready = true; MAPA3D.cb && aplicaCB(true);
      placePins(); highlight(sel);
      mostrarAviso();   // anuncio de bienvenida
      console.log('Mapa 3D listo: ' + meshes.length + ' mallas');
    },
    (xhr) => { if (xhr.total > 0) console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% cargado') },
    (error) => { console.error('Error al cargar mapa3d.fbx:', error) }
  );

  const lastM = new THREE.Matrix4(), tg = new THREE.Vector3();
  function animate(now) {
    requestAnimationFrame(animate);
    if (tw) {
      const k = Math.min(1, (now - tw.t0) / tw.ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      camera.position.lerpVectors(tw.p0, tw.p1, e); controls.target.lerpVectors(tw.g0, tw.g1, e); if (k === 1) tw = null
    }
    controls.update();
    /* El centro del mapa no sale de los límites: si se pasa, se devuelve y la cámara va con él */
    tg.copy(controls.target); tg.x = THREE.MathUtils.clamp(tg.x, -LIMITE_MAPA, LIMITE_MAPA); tg.z = THREE.MathUtils.clamp(tg.z, -LIMITE_MAPA, LIMITE_MAPA);
    if (tg.x !== controls.target.x || tg.z !== controls.target.z) { camera.position.x += tg.x - controls.target.x; camera.position.z += tg.z - controls.target.z; controls.target.copy(tg) }
    camera.updateMatrixWorld();
    /* Solo se reubican pines y rutas cuando la cámara se movió */
    if (MAPA3D.ready && (MAPA3D.dirty || !camera.matrixWorld.equals(lastM))) { lastM.copy(camera.matrixWorld); MAPA3D.dirty = false; placePins(); reprojectRoutes() }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => { calidad(); MAPA3D.dirty = true });
}

document.addEventListener('DOMContentLoaded', init3DMap);

/* ===== Toque sobre un lugar del mapa (celular y computador) =====
   Un toque es un clic o un dedo que casi no se mueve. Si el dedo se arrastra, es que la persona está girando o moviendo el mapa,
   y si aparece un segundo dedo es un pellizco: en ninguno de los dos casos se abre un lugar. */
/* Si la persona usa categorías, filtros o búsqueda, se suelta el lugar abierto por toque. Se escucha en la fase de captura (true)
   para correr antes de los manejadores originales. */
document.addEventListener('click', e => { if (e.target.closest('.cat,#clr')) tapId = null }, true);
document.addEventListener('change', e => { if (e.target.closest('#fpanel')) tapId = null }, true);
document.addEventListener('input', e => { if (e.target.id === 'q') tapId = null }, true);

const TAP_PX = 10;       // cuánto puede moverse el dedo y seguir contando como toque (píxeles de pantalla)
let tapIni = null;
stage.addEventListener('pointerdown', e => {
  if (!e.isPrimary) { tapIni = null; return }   // segundo dedo: pellizco
  tapIni = !e.target.closest('#side,#search,#fpanel,.fb,#lb,#favs,#apanel,.pin,#chip,#aviso') ? { x: e.clientX, y: e.clientY, t: performance.now() } : null
});
stage.addEventListener('pointercancel', () => { tapIni = null });
addEventListener('pointerup', e => {
  if (!tapIni) return; const a = tapIni; tapIni = null;
  if (Math.hypot(e.clientX - a.x, e.clientY - a.y) > TAP_PX || performance.now() - a.t > 900) return;   // fue un arrastre o una pulsación larga
  ['#favs', '#fpanel', '#apanel'].forEach(s => $(s).classList.remove('show'));
  ocultarAviso();   // un toque en el mapa también cierra el anuncio de bienvenida
  const p = MAPA3D.pickPlace(e.clientX, e.clientY);
  if (!p) { if (tapId !== null || sel !== null) { tapId = null; sel = null; tapGrp = []; paint() } return }   // toque en vacío o en un edificio sin nombre: cierra la ventana
  const grupo = MAPA3D.grupo.filter(q => q !== p).map(q => q.id);   // otros lugares del mismo edificio (Aula A + Cafetería A)
  if (tapId === p.id || (tapId !== null && tapGrp.includes(p.id)) || (sel === p.id && visible(p))) { tapId = null; sel = null; tapGrp = [] }   // segundo toque sobre el mismo edificio: lo cierra
  else { tapId = p.id; tapGrp = grupo; sel = p.id; say(grupo.length ? [p, ...grupo.map(i => P[i])].map(q => q[lang][0]).join(', ') : `${p[lang][0]}. ${p[lang][1]}`) }
  paint()
});