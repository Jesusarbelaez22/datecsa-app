// ─── AUTH GUARD ───
if(!sessionStorage.getItem('dtcAuth')){
  window.location.href='../index.html';
}

// ─── LOADING BAR ───
function showLoading(){
  const b=document.getElementById('loading-bar');
  if(!b) return;
  b.style.width='0';b.style.opacity='1';
  requestAnimationFrame(()=>{ b.style.transition='width 1.2s ease'; b.style.width='85%'; });
}
function hideLoading(){
  const b=document.getElementById('loading-bar');
  if(!b) return;
  b.style.width='100%';
  setTimeout(()=>{ b.style.opacity='0'; setTimeout(()=>{ b.style.width='0'; b.style.transition=''; },400); },200);
}

// ─── THEMES ───
const THEMES = [
  { id:'rojo',    name:'Rojo DATECSA',     accent:'#b40000', accentDark:'#8a0000', bg:'#0d0d0d', sidebar:'#111111', card:'#161616', text:'#e0e0e0', textMuted:'#666666' },
  { id:'azul',    name:'Azul Corporativo', accent:'#0066cc', accentDark:'#004a99', bg:'#0a0d12', sidebar:'#0d1117', card:'#131920', text:'#e0e0e0', textMuted:'#666666' },
  { id:'verde',   name:'Verde Tecnología', accent:'#00a854', accentDark:'#007a3d', bg:'#0a0d0a', sidebar:'#0d110d', card:'#131913', text:'#e0e0e0', textMuted:'#666666' },
  { id:'morado',  name:'Morado Premium',   accent:'#7c3aed', accentDark:'#5b21b6', bg:'#0a080f', sidebar:'#0d0b14', card:'#131118', text:'#e0e0e0', textMuted:'#666666' },
  { id:'naranja', name:'Naranja Energía',  accent:'#ea6c00', accentDark:'#c45a00', bg:'#0d0a07', sidebar:'#120e09', card:'#181309', text:'#e0e0e0', textMuted:'#666666' },
  { id:'claro',   name:'Modo Claro',       accent:'#b40000', accentDark:'#8a0000', bg:'#f5f5f5', sidebar:'#ffffff', card:'#ffffff', text:'#111111', textMuted:'#555555' },
];

function applyTheme(themeId){
  const t = THEMES.find(x=>x.id===themeId) || THEMES[0];
  const r = document.documentElement.style;
  r.setProperty('--color-accent',     t.accent);
  r.setProperty('--color-accent-dark',t.accentDark);
  r.setProperty('--color-bg',         t.bg);
  r.setProperty('--color-sidebar',    t.sidebar);
  r.setProperty('--color-card',       t.card);
  r.setProperty('--color-text',       t.text);
  r.setProperty('--color-text-muted', t.textMuted);
  document.body.classList.remove('tema-claro');
  if(themeId === 'claro') document.body.classList.add('tema-claro');
  localStorage.setItem('dtc_tema', themeId);
}

function loadTheme(){
  const saved = localStorage.getItem('dtc_tema') || 'rojo';
  applyTheme(saved);
}

// ─── LIGHT / DARK TOGGLE ───
function toggleTheme(){
  if(document.body.classList.contains('light-theme')){
    applyDarkTheme();
  } else {
    applyLightTheme();
  }
}

function applyLightTheme(){
  document.body.classList.add('light-theme');
  localStorage.setItem('datecsa-theme', 'light');
  updateThemeToggleUI(true);
  lucide.createIcons();
}

function applyDarkTheme(){
  document.body.classList.remove('light-theme');
  localStorage.setItem('datecsa-theme', 'dark');
  updateThemeToggleUI(false);
  lucide.createIcons();
}

function updateThemeToggleUI(isLight){
  const sun   = document.getElementById('theme-icon-sun');
  const moon  = document.getElementById('theme-icon-moon');
  const label = document.getElementById('theme-toggle-label');
  const btn   = document.getElementById('theme-toggle-btn');
  if(isLight){
    if(sun)   sun.style.display  = 'block';
    if(moon)  moon.style.display = 'none';
    if(label) label.textContent  = 'Oscuro';
    if(btn){  btn.style.borderColor='#D1D5DB'; btn.style.color='#374151'; btn.style.background='#F3F4F6'; }
  } else {
    if(sun)   sun.style.display  = 'none';
    if(moon)  moon.style.display = 'block';
    if(label) label.textContent  = 'Claro';
    if(btn){  btn.style.borderColor='#2a2a2a'; btn.style.color='#888'; btn.style.background='none'; }
  }
}

function initTheme(){
  if(localStorage.getItem('datecsa-theme') === 'light'){
    applyLightTheme();
  } else {
    applyDarkTheme();
  }
}

// ─── NAVIGATION ───
function navigate(page){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const navEl  = document.querySelector(`.nav-item[data-page="${page}"]`);
  const pageEl = document.getElementById('page-'+page);
  if(navEl) navEl.classList.add('active');
  if(pageEl){
    pageEl.classList.add('active');
    const title = navEl ? (navEl.dataset.tooltip || navEl.querySelector('.nav-text').textContent.trim()) : '';
    document.getElementById('topbar-title').textContent = title;
  }
  const renders = {
    'dashboard':      renderDashboard,
    'tickets':        renderTickets,
    'toners':         renderToners,
    'entradas':       renderEntradas,
    'instalados':     renderInstalados,
    'ordenes':        renderOrdenes,
    'notificaciones': renderNotificaciones,
    'configuracion':  renderConfiguracion,
    'cliente':        renderCliente,
    'cierre':         renderCierre,
    'informes':       renderInformes,
    'usuarios':       renderUsuarios,
  };
  if(renders[page]) renders[page]();
}

// ─── SIDEBAR ───
function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('collapsed-sidebar');
  const topbarLogo = document.getElementById('topbar-logo');
  if(topbarLogo){
    topbarLogo.style.display = sidebar.classList.contains('collapsed') ? 'block' : 'none';
  }
}

// ─── TOAST ───
function toast(msg, type='success'){
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(()=>t.remove(), 3500);
}

// ─── MENÚ MÓVIL ───
function toggleMobileMenu(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen  = sidebar.classList.contains('mobile-open');
  if(isOpen){
    closeMobileMenu();
  } else {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', function(e){
  const navItem = e.target.closest('.nav-item');
  if(navItem && window.innerWidth <= 768){
    closeMobileMenu();
  }
});

// ─── MODAL ───
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.body.classList.add('modal-open');
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  const hayAbiertos = document.querySelectorAll('.modal-overlay.open').length > 0;
  if(!hayAbiertos) document.body.classList.remove('modal-open');
}
// DESACTIVADO: No cerrar modal al hacer clic fuera
// document.addEventListener('click', e=>{
//   if(e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
// });

// ─── DATE ───
function today(){ return new Date().toISOString().split('T')[0]; }
function fmtDate(d){ if(!d)return '–'; const p=d.split('-'); return `${p[2]}/${p[1]}/${p[0]}`; }

// ─── CHART ───
let ticketsChart = null;

function renderChart(abiertos, progreso, cerrados){
  const canvas = document.getElementById('tickets-chart');
  if(!canvas) return;
  const total = abiertos + progreso + cerrados;
  if(ticketsChart){ ticketsChart.destroy(); ticketsChart = null; }
  ticketsChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Abiertos', 'En Progreso', 'Cerrados'],
      datasets:[{
        data: total ? [abiertos, progreso, cerrados] : [1],
        backgroundColor: total
          ? ['rgba(0,140,255,0.75)','rgba(200,160,0,0.75)','rgba(0,160,80,0.75)']
          : ['rgba(50,50,50,0.5)'],
        borderColor: total
          ? ['rgba(0,140,255,0.3)','rgba(200,160,0,0.3)','rgba(0,160,80,0.3)']
          : ['rgba(50,50,50,0.3)'],
        borderWidth: 1,
        hoverOffset: 6,
      }]
    },
    options:{
      cutout:'68%',
      plugins:{legend:{display:false},tooltip:{enabled:total>0}},
      animation:{duration:600}
    }
  });
  const legend = document.getElementById('chart-legend');
  if(legend){
    legend.innerHTML = [
      {label:'Abiertos',    val:abiertos, color:'rgba(0,140,255,0.8)'},
      {label:'En Progreso', val:progreso,  color:'rgba(200,160,0,0.8)'},
      {label:'Cerrados',    val:cerrados,  color:'rgba(0,160,80,0.8)'},
    ].map(i=>`
      <div class="chart-legend-item">
        <span class="chart-legend-dot" style="background:${i.color}"></span>
        <span>${i.label}</span>
        <span class="chart-legend-val">${i.val}</span>
      </div>`).join('');
  }
}

// ─── BADGE HELPERS ───
function badgeEstado(e){
  return {Abierto:'badge-open','En Progreso':'badge-progress',Cerrado:'badge-closed',Abierta:'badge-open','En Proceso':'badge-progress',Cerrada:'badge-closed'}[e]||'badge-low';
}
function badgePrio(p){
  return {Alta:'badge-critical',Normal:'badge-progress',Baja:'badge-low'}[p]||'badge-low';
}
function badgeLlegada(l){
  if(!l) return 'badge-low';
  const v=(l||'').toUpperCase().trim();
  if(v==='CORREO')   return 'badge-open';
  if(v==='TELEFONO') return 'badge-progress';
  if(v==='TEAMS')    return 'badge-closed';
  return 'badge-low';
}
function badgeIncidente(inc){
  if(!inc) return 'badge-low';
  const i = inc.toUpperCase();
  if(i.includes('MANCHAS')||i.includes('RAYAS')||i.includes('ATASCO')) return 'badge-progress';
  if(i.includes('CONFIGURACION')||i.includes('INSTALACION')||i.includes('CREACION')||i.includes('CODIGO')||i.includes('RED')) return 'badge-open';
  if(i.includes('LIMPIEZA')||i.includes('MANTENIMIENTO')||i.includes('CAMBIO')) return 'badge-closed';
  if(i.includes('RUIDO')||i.includes('FUSORA')||i.includes('CILINDRO')||i.includes('SENSOR')) return 'badge-critical';
  return 'badge-low';
}

// ─── DASHBOARD ───
async function renderDashboard(){
  showLoading();
  try {
    const [{data:ticketsData},{data:ordenesData},{data:notifData},{data:recentData}] = await Promise.all([
      sb.from('tickets').select('estado'),
      sb.from('ordenes').select('id'),
      sb.from('notificaciones').select('leido'),
      sb.from('tickets').select('*').order('id',{ascending:false}).limit(5),
    ]);
    const tickets   = ticketsData||[];
    const abiertos  = tickets.filter(t=>t.estado==='Abierto').length;
    const progreso  = tickets.filter(t=>t.estado==='En Progreso').length;
    const cerrados  = tickets.filter(t=>t.estado==='Cerrado').length;
    const totalOS   = (ordenesData||[]).length;
    const notifPend = (notifData||[]).filter(n=>!n.leido).length;
    document.getElementById('dash-abiertos').textContent = abiertos;
    document.getElementById('dash-progreso').textContent = progreso;
    document.getElementById('dash-cerrados').textContent = cerrados;
    const osEl = document.getElementById('dash-ordenes');
    if(osEl) osEl.textContent = totalOS;
    const notifEl = document.getElementById('dash-notif');
    if(notifEl) notifEl.textContent = notifPend;
    renderChart(abiertos, progreso, cerrados);
    const cont = document.getElementById('dash-tickets-container');
    const recent = recentData||[];
    if(!recent.length){
      cont.innerHTML = `<div style="text-align:center;padding:32px;color:#444;background:#161616;border:1px solid #222;border-radius:10px">
        <i data-lucide="ticket" style="width:32px;height:32px;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;color:#444"></i>
        <p style="font-size:13px">Sin actividad reciente</p>
      </div>`;
    } else {
      cont.innerHTML = recent.map(t=>{
        const borderColor = t.estado==='Abierto'?'#0066cc':t.estado==='En Progreso'?'#cc8800':'#00a854';
        return `<div style="background:#161616;border:1px solid #1e1e1e;border-radius:10px;padding:14px 18px;margin-bottom:10px;display:flex;align-items:center;gap:16px;border-left:3px solid ${borderColor};transition:all .15s;cursor:pointer;"
          onmouseover="this.style.borderColor='var(--color-accent)';this.style.background='#1a1a1a'"
          onmouseout="this.style.borderColor='${borderColor}';this.style.background='#161616'"
          onclick="navigate('tickets')">
          <div style="flex-shrink:0">
            <span class="badge ${badgeLlegada(t.llegada)}" style="font-size:10px">${t.llegada||'–'}</span>
          </div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
              <span style="font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px">${t.tipo_solicitud||'Sin tipo'}</span>
              <span style="font-size:11px;color:#555">•</span>
              <span style="font-size:12px;color:#777">${t.usuario||'–'}</span>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <span style="font-size:11px;color:#555;display:inline-flex;align-items:center;gap:3px"><i data-lucide="map-pin" style="width:11px;height:11px;margin:0"></i> ${t.ubicacion||'–'}</span>
              ${t.modelo?`<span style="font-size:11px;color:#555;display:inline-flex;align-items:center;gap:3px"><i data-lucide="printer" style="width:11px;height:11px;margin:0"></i> ${t.modelo}</span>`:''}
              <span style="font-size:11px;color:#555;display:inline-flex;align-items:center;gap:3px"><i data-lucide="calendar" style="width:11px;height:11px;margin:0"></i> ${fmtDate(t.fecha_inicial)}${t.hora_inicio?` · <i data-lucide="clock" style="width:11px;height:11px;margin:0"></i> ${t.hora_inicio}`:''}</span>
            </div>
          </div>
          <div style="flex-shrink:0;text-align:right">
            <div style="font-size:11px;color:#666;margin-bottom:4px">Helpdesk</div>
            <div style="font-size:12px;font-weight:600;color:#ccc">${t.helpdesk||'–'}</div>
          </div>
          <div style="flex-shrink:0">
            <span class="badge ${badgeEstado(t.estado)}">${t.estado||'–'}</span>
          </div>
        </div>`;
      }).join('');
    }
  } catch(e){ toast('Error cargando dashboard','error'); }
  lucide.createIcons();
  hideLoading();

  // Saludo dinámico
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
  const usuario = sessionStorage.getItem('dtcUser') || 'Admin';
  const saludoEl = document.getElementById('dash-saludo');
  const fechaEl = document.getElementById('dash-fecha');
  if(saludoEl) saludoEl.innerHTML = `${saludo}, ${usuario} <i data-lucide="hand-metal" style="width:22px;height:22px;vertical-align:middle;margin-left:6px;color:#b40000"></i>`;
  lucide.createIcons();
  if(fechaEl){
    const ahora = new Date();
    fechaEl.textContent = ahora.toLocaleDateString('es-CO', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
  }
}

// ─── TICKETS ───
let ticketFilter = {search:'', estado:'', prioridad:'', responsable:''};

async function renderTickets(){
  showLoading();
  try {
    const {data, error} = await sb.from('tickets').select('*').order('id',{ascending:false});
    if(error) throw error;
    const all = data||[];

    const filtered = all.filter(t=>{
      const s = (ticketFilter.search||'').toLowerCase();
      const match = !s || (t.usuario||'').toLowerCase().includes(s)
                       || (t.tipo_solicitud||'').toLowerCase().includes(s)
                       || (t.ubicacion||'').toLowerCase().includes(s);
      const est  = !ticketFilter.estado     || t.estado===ticketFilter.estado;
      const pri  = !ticketFilter.prioridad  || t.prioridad===ticketFilter.prioridad;
      const resp = !ticketFilter.responsable || t.helpdesk===ticketFilter.responsable;
      return match && est && pri && resp;
    });

    const countEl = document.getElementById('count-tickets');
    if(countEl) countEl.textContent = filtered.length < all.length
      ? `Mostrando ${filtered.length} de ${all.length} registros`
      : `${all.length} registro${all.length!==1?'s':''}`;

    const tbody = document.getElementById('tickets-body');

    if(!filtered.length){
      tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i data-lucide="ticket"></i><p>Sin registros</p></div></td></tr>`;
      lucide.createIcons();
      return;
    }

    tbody.innerHTML = filtered.map(t=>{
      const usuario = t.usuario||'–';
      const partes = usuario.match(/^(.+?)\s+([\w.\-]+@[\w.\-]+)$/);
      const usuarioCorto = partes ? partes[1] : usuario.split('@')[0];
      return `<tr>
        <td><span class="badge ${badgeLlegada(t.llegada)}">${t.llegada||'–'}</span></td>
        <td style="white-space:nowrap;font-size:12px">${fmtDate(t.fecha_inicial)}</td>
        <td style="font-size:12px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${usuarioCorto}</td>
        <td style="font-size:12px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.ubicacion||'–'}</td>
        <td style="font-size:12px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><strong>${t.tipo_solicitud||'–'}</strong></td>
        <td style="font-size:12px;white-space:nowrap">${t.helpdesk||'–'}</td>
        <td><span class="badge ${badgeEstado(t.estado)}">${t.estado||'–'}</span></td>
        <td style="white-space:nowrap">
          <div class="action-btns">
            <button class="btn-view" onclick="verTicket(${t.id})"><i data-lucide="eye"></i> Ver</button>
            <button class="btn-edit" onclick="editTicket(${t.id})"><i data-lucide="pencil"></i> Editar</button>
            <button class="btn-danger" onclick="deleteTicket(${t.id})"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
    lucide.createIcons();
  } catch(e){
    toast('Error cargando casos: '+e.message,'error');
  } finally {
    hideLoading();
  }
}

async function verTicket(id){
  showLoading();
  try {
    const {data} = await sb.from('tickets').select('*').eq('id',id).single();
    if(!data){ toast('Caso no encontrado','error'); return; }
    const campo = (label, valor, destacado=false) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  padding:12px 0;border-bottom:1px solid #1e1e1e;gap:16px">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;flex-shrink:0;min-width:120px">${label}</span>
        <span style="font-size:13.5px;color:${destacado?'#fff':'#ccc'};
                     font-weight:${destacado?'600':'400'};text-align:right;
                     word-break:break-word">${valor||'–'}</span>
      </div>`;
    const html = `
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <span class="badge ${badgeLlegada(data.llegada)}">${data.llegada||'–'}</span>
        <span class="badge ${badgePrio(data.prioridad)}">${data.prioridad||'–'}</span>
        <span class="badge ${badgeEstado(data.estado)}">${data.estado||'–'}</span>
      </div>
      ${campo('Tipo de Solicitud', data.tipo_solicitud, true)}
      ${campo('Usuario / Solicitante', data.usuario)}
      ${campo('Ubicación', data.ubicacion)}
      ${campo('Modelo Impresora', data.modelo)}
      ${campo('N° Serie', data.serial)}
      ${campo('Fecha Inicial', fmtDate(data.fecha_inicial))}
      ${campo('Hora Inicio', data.hora_inicio)}
      ${campo('Fecha Final', fmtDate(data.fecha_final))}
      ${campo('Hora Final', data.hora_fin)}
      ${campo('Helpdesk', data.helpdesk, true)}
      <div style="padding:14px 0">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;display:block;margin-bottom:8px">Observaciones</span>
        <div style="background:#111;border:1px solid #222;border-radius:8px;
                    padding:14px;font-size:13px;color:#ccc;line-height:1.6;
                    white-space:pre-wrap">${data.observaciones||'Sin observaciones'}</div>
      </div>
      ${data.evidencia ? `
      <div style="padding:14px 0">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;display:block;margin-bottom:10px">
          Evidencia fotográfica
        </span>
        <div style="background:#111;border:1px solid #222;border-radius:8px;
                    padding:12px;text-align:center">
          <img src="${data.evidencia}" style="
            max-width:100%;max-height:320px;border-radius:6px;
            object-fit:contain;cursor:pointer;
          "
          onclick="window.open('${data.evidencia}','_blank')"
          title="Clic para ver en tamaño completo"/>
          <div style="font-size:11px;color:#555;margin-top:8px">
            Clic en la imagen para ver en tamaño completo
          </div>
        </div>
      </div>` : ''}
    `;
    document.getElementById('ver-ticket-content').innerHTML = html;
    document.getElementById('ver-ticket-editar-btn').onclick = () => {
      closeModal('modal-ver-ticket');
      editTicket(id);
    };
    lucide.createIcons();
    openModal('modal-ver-ticket');
  } catch(e){
    toast('Error: '+e.message,'error');
  } finally {
    hideLoading();
  }
}

function openNewTicket(){
  document.getElementById('ticket-form').reset();
  document.getElementById('ticket-id').value='';
  document.getElementById('ticket-fechaInicial').value=today();
  const oWrap=document.getElementById('ticket-otro-wrap');
  if(oWrap) oWrap.style.display='none';
  const hWrap=document.getElementById('ticket-helpdesk-otro-wrap');
  if(hWrap) hWrap.style.display='none';
  const ahora=new Date();
  ahora.setMinutes(ahora.getMinutes()-15);
  const hh=String(ahora.getHours()).padStart(2,'0');
  const mm=String(ahora.getMinutes()).padStart(2,'0');
  const horaField=document.getElementById('ticket-hora-inicio');
  if(horaField) horaField.value=`${hh}:${mm}`;
  const horaFinField=document.getElementById('ticket-hora-fin');
  if(horaFinField) horaFinField.value='';
  document.querySelector('#modal-ticket .modal-title').textContent='Nuevo Ticket / Caso';
  limpiarEvidencia();
  openModal('modal-ticket');
}

async function editTicket(id){
  const { data, error } = await sb.from('tickets').select('*').eq('id',id).single();
  if(error||!data){ toast('Error cargando ticket','error'); return; }
  document.getElementById('ticket-id').value=data.id;
  document.getElementById('ticket-fechaInicial').value=data.fecha_inicial||'';
  const stdTipos=['','CONFIGURACION E INSTALACION','CAMBIO DE TONER','CREACION DE USUARIO','CODIGO DE IMPRESION',
    'MANCHAS EN IMPRESION','RAYAS EN IMPRESION','ATASCO','RUIDO','INSTALACION POR RED','ATASCO CONTINUO',
    'LIMPIEZA Y MANTENIMIENTO','PROBLEMAS DE RED','CAMBIO DE CILINDRO','CAMBIO UNIDAD FUSORA','SENSOR SUELTO'];
  const tSel=document.getElementById('ticket-tipoSolicitud');
  const tWrap=document.getElementById('ticket-otro-wrap');
  const tOtroInp=document.getElementById('ticket-tipo-otro');
  if(stdTipos.includes(data.tipo_solicitud||'')){
    tSel.value=data.tipo_solicitud||''; if(tWrap) tWrap.style.display='none';
  } else {
    tSel.value='OTRO'; if(tWrap) tWrap.style.display='block'; if(tOtroInp) tOtroInp.value=data.tipo_solicitud||'';
  }
  document.getElementById('ticket-llegada').value=data.llegada||'';
  document.getElementById('ticket-usuario').value=data.usuario||'';
  document.getElementById('ticket-modelo').value=data.modelo||'';
  document.getElementById('ticket-serial').value=data.serial||'';
  document.getElementById('ticket-ubicacion').value=data.ubicacion||'';
  document.getElementById('ticket-fechaFinal').value=data.fecha_final||'';
  document.getElementById('ticket-hora-inicio').value=data.hora_inicio||'';
  document.getElementById('ticket-hora-fin').value=data.hora_fin||'';
  document.getElementById('ticket-observaciones').value=data.observaciones||'';
  const rSel=document.getElementById('ticket-responsable');
  const rWrap=document.getElementById('ticket-helpdesk-otro-wrap');
  const rOtroInp=document.getElementById('ticket-helpdesk-otro');
  const conocidosR=['JESÚS ARBELAEZ','JHON CAMACHO'];
  if(rSel){
    if(conocidosR.includes(data.helpdesk||'')){
      rSel.value=data.helpdesk||'JESÚS ARBELAEZ'; if(rWrap) rWrap.style.display='none';
    } else {
      rSel.value='OTRO'; if(rWrap) rWrap.style.display='block'; if(rOtroInp) rOtroInp.value=data.helpdesk||'';
    }
  }
  document.getElementById('ticket-prioridad').value=data.prioridad||'Normal';
  document.getElementById('ticket-estado').value=data.estado||'Abierto';
  document.querySelector('#modal-ticket .modal-title').textContent='Editar Ticket / Caso';
  cargarEvidenciaEnDropzone(data.evidencia || null);
  openModal('modal-ticket');
}

async function saveTicket(){
  const id=parseInt(document.getElementById('ticket-id').value)||null;
  const fecha_inicial=document.getElementById('ticket-fechaInicial').value;
  if(!fecha_inicial){ toast('La FECHA INICIAL es requerida','error'); return; }
  const tipoSel=document.getElementById('ticket-tipoSolicitud').value;
  const tipoOtro=document.getElementById('ticket-tipo-otro')?.value.trim();
  const tipo_solicitud=(tipoSel==='OTRO'&&tipoOtro)?tipoOtro:tipoSel;
  const respSel=document.getElementById('ticket-responsable')?.value||'';
  const respOtro=document.getElementById('ticket-helpdesk-otro')?.value.trim()||'';
  const helpdesk=(respSel==='OTRO'&&respOtro)?respOtro:respSel;
  const obj={
    llegada:         document.getElementById('ticket-llegada').value,
    modelo:          document.getElementById('ticket-modelo')?.value.trim()||'',
    serial:          document.getElementById('ticket-serial')?.value.trim()||'',
    fecha_inicial,
    hora_inicio:     document.getElementById('ticket-hora-inicio')?.value||'',
    usuario:         document.getElementById('ticket-usuario').value.trim(),
    ubicacion:       document.getElementById('ticket-ubicacion').value.trim(),
    tipo_solicitud,
    fecha_final:     document.getElementById('ticket-fechaFinal').value||null,
    hora_fin:        document.getElementById('ticket-hora-fin')?.value||'',
    observaciones:   document.getElementById('ticket-observaciones').value.trim(),
    evidencia:       _evidenciaBase64 || null,
    helpdesk,
    prioridad:       document.getElementById('ticket-prioridad').value,
    estado:          document.getElementById('ticket-estado').value,
  };
  showLoading();
  try {
    if(id){ await sb.from('tickets').update(obj).eq('id',id); }
    else   { await sb.from('tickets').insert(obj); }
    closeModal('modal-ticket');
    await renderTickets();
    toast(id?'Ticket actualizado':'Ticket creado');
  } catch(e){ toast('Error guardando ticket','error'); }
  hideLoading();
}

function deleteTicket(id){
  showConfirm({
    titulo:'¿Eliminar caso?',
    mensaje:'Este caso y solicitud será eliminado permanentemente.',
    icono:'<i data-lucide="ticket"></i>', tipo:'danger',
    textoSi:'Sí, eliminar', textoNo:'Cancelar',
    callback: async(ok)=>{
      if(!ok) return;
      showLoading();
      try {
        await sb.from('tickets').delete().eq('id',id);
        await renderTickets();
        toast('Caso eliminado','error');
      } catch(e){ toast('Error eliminando ticket','error'); }
      hideLoading();
    }
  });
}

// ─── CSV ───
function downloadCSV(rows, name){
  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'}));
  a.download = `${name}_${today()}.csv`;
  a.click();
}

// ─── TONERS DISPONIBLES ───
const REFERENCIAS_FIJAS = ['TK-3182', 'TK-3162', 'TK-3432', 'TK-3462'];
function normRef(r){ return (r||'').toUpperCase().replace(/[\s\-]/g,''); }

async function renderToners(){
  showLoading();
  try {
    const REFS = ['TK-3182','TK-3162','TK-3432','TK-3462'];
    function normRef(r){ return (r||'').toUpperCase().replace(/[\s\-\_]/g,''); }

    const [{data:ent, error:errEnt},{data:inst, error:errInst}] = await Promise.all([
      sb.from('entradas_toner').select('referencia').limit(10000),
      sb.from('toners_instalados').select('referencia').limit(10000)
    ]);

    if(errEnt)  console.error('[Toners] Error entradas:', errEnt);
    if(errInst) console.error('[Toners] Error instalados:', errInst);

    console.log('[Toners] entradas:', (ent||[]).length, 'instalados:', (inst||[]).length);
    if(ent  && ent.length  > 0) console.log('[Toners] Muestra entrada:',    JSON.stringify(ent[0]));
    if(inst && inst.length > 0) console.log('[Toners] Muestra instalado:', JSON.stringify(inst[0]));

    const entradas   = ent  || [];
    const instalados = inst || [];

    // Cada fila de entradas_toner = 1 toner recibido (no existe columna cantidad)
    // Cada fila de toners_instalados = 1 toner instalado
    const filas = REFS.map(ref => {
      const llegada   = entradas .filter(e => normRef(e.referencia) === normRef(ref)).length;
      const instCount = instalados.filter(i => normRef(i.referencia) === normRef(ref)).length;
      const disp = Math.max(0, llegada - instCount);
      console.log(`[Toners] ${ref}: llegada=${llegada} inst=${instCount} disp=${disp}`);
      return { ref, llegada, instCount, disp };
    });

    const totalLlegada = filas.reduce((s,f) => s + f.llegada,   0);
    const totalInst    = filas.reduce((s,f) => s + f.instCount, 0);
    const totalDisp    = filas.reduce((s,f) => s + f.disp,      0);

    const cont = document.getElementById('toners-body') ||
                 document.getElementById('toners-table-body') ||
                 document.getElementById('page-toners');
    if(!cont) return;

    cont.innerHTML = `

      <!-- TÍTULO SECCIÓN -->
      <div style="margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
          <div style="width:3px;height:24px;background:var(--color-accent);
                      border-radius:2px"></div>
          <i data-lucide="printer" style="width:20px;height:20px;
             color:var(--color-accent)"></i>
          <h2 style="font-size:16px;font-weight:600;color:#fff;margin:0">
            Registro de Toner
          </h2>
          <span style="font-size:11px;background:rgba(180,0,0,0.12);
                       color:#ff9999;border:1px solid rgba(180,0,0,0.25);
                       padding:2px 10px;border-radius:20px;font-weight:500">
            Inventario activo
          </span>
        </div>
        <p style="font-size:11px;color:#555;margin:0 0 0 15px">
          Resumen de inventario actual — calculado automáticamente
        </p>
      </div>

      <!-- MINI CARDS RESUMEN -->
      <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">

        <!-- Total Llegada -->
        <div style="flex:1;min-width:120px;background:#161616;
                    border:1px solid #222;border-left:3px solid #3B82F6;
                    border-radius:10px;padding:12px 16px;transition:all .2s">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="width:28px;height:28px;border-radius:6px;
                        background:rgba(59,130,246,0.12);
                        display:flex;align-items:center;justify-content:center">
              <i data-lucide="package" style="width:14px;height:14px;color:#3B82F6"></i>
            </div>
            <span style="font-size:10px;color:#666;text-transform:uppercase;
                         letter-spacing:.5px">Total Llegada</span>
          </div>
          <div style="font-size:22px;font-weight:700;color:#3B82F6;line-height:1">
            ${totalLlegada}
          </div>
          <div style="font-size:10px;color:#444;margin-top:2px">unidades recibidas</div>
        </div>

        <!-- Total Instalados -->
        <div style="flex:1;min-width:120px;background:#161616;
                    border:1px solid #222;border-left:3px solid #F59E0B;
                    border-radius:10px;padding:12px 16px;transition:all .2s">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="width:28px;height:28px;border-radius:6px;
                        background:rgba(245,158,11,0.12);
                        display:flex;align-items:center;justify-content:center">
              <i data-lucide="check-circle" style="width:14px;height:14px;color:#F59E0B"></i>
            </div>
            <span style="font-size:10px;color:#666;text-transform:uppercase;
                         letter-spacing:.5px">Total Instalados</span>
          </div>
          <div style="font-size:22px;font-weight:700;color:#F59E0B;line-height:1">
            ${totalInst}
          </div>
          <div style="font-size:10px;color:#444;margin-top:2px">unidades instaladas</div>
        </div>

        <!-- Disponibles -->
        <div style="flex:1;min-width:120px;background:#161616;
                    border:1px solid #222;
                    border-left:3px solid ${totalDisp <= 10 ? '#EF4444' : '#10B981'};
                    border-radius:10px;padding:12px 16px;transition:all .2s">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="width:28px;height:28px;border-radius:6px;
                        background:${totalDisp <= 10 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)'};
                        display:flex;align-items:center;justify-content:center">
              <i data-lucide="archive" style="width:14px;height:14px;
                 color:${totalDisp <= 10 ? '#EF4444' : '#10B981'}"></i>
            </div>
            <span style="font-size:10px;color:#666;text-transform:uppercase;
                         letter-spacing:.5px">Disponibles</span>
          </div>
          <div style="font-size:22px;font-weight:700;
                      color:${totalDisp <= 10 ? '#EF4444' : '#10B981'};line-height:1">
            ${totalDisp}
          </div>
          <div style="font-size:10px;color:#444;margin-top:2px">
            ${totalDisp <= 10 ? '⚠ Stock bajo' : 'unidades disponibles'}
          </div>
        </div>

      </div>

      <!-- TABLA PRINCIPAL -->
      <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);
                  border-radius:16px;overflow:hidden;
                  box-shadow:0 8px 32px rgba(0,0,0,0.4)">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#111111">
              <th style="padding:10px 16px;text-align:left;font-size:10px;font-weight:600;
                         color:#666;letter-spacing:1px;text-transform:uppercase;
                         border-bottom:1px solid rgba(255,255,255,0.06)">TONER</th>
              <th style="padding:10px 16px;text-align:center;font-size:10px;font-weight:600;
                         color:#3B82F6;letter-spacing:1px;text-transform:uppercase;
                         border-bottom:1px solid rgba(255,255,255,0.06)">LLEGADA</th>
              <th style="padding:10px 16px;text-align:center;font-size:10px;font-weight:600;
                         color:#F59E0B;letter-spacing:1px;text-transform:uppercase;
                         border-bottom:1px solid rgba(255,255,255,0.06)">INSTALADOS</th>
              <th style="padding:10px 16px;text-align:center;font-size:10px;font-weight:600;
                         color:#10B981;letter-spacing:1px;text-transform:uppercase;
                         border-bottom:1px solid rgba(255,255,255,0.06)">DISPONIBLES</th>
            </tr>
          </thead>
          <tbody>
            ${filas.map(f => {
              const colorDisp = f.disp === 0 ? '#EF4444'
                              : f.disp <= 3  ? '#EF4444'
                              : f.disp <= 8  ? '#F59E0B'
                              : '#10B981';
              const bgDisp = f.disp <= 3
                ? 'rgba(239,68,68,0.1)'
                : f.disp <= 8
                  ? 'rgba(245,158,11,0.1)'
                  : 'rgba(16,185,129,0.1)';
              const stockBajo = f.disp <= 3 ? `
                <span style="font-size:9px;background:rgba(239,68,68,0.15);
                             color:#EF4444;border:1px solid rgba(239,68,68,0.3);
                             border-radius:4px;padding:1px 5px;margin-left:8px;font-weight:600">
                  <i data-lucide="alert-triangle" style="width:10px;height:10px;
                     vertical-align:middle"></i> Stock Bajo
                </span>` : '';
              return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);transition:background .15s"
                    onmouseover="this.style.background='rgba(255,255,255,0.04)'"
                    onmouseout="this.style.background='transparent'">
                  <td style="padding:10px 16px">
                    <div style="display:flex;align-items:center;gap:10px">
                      <span style="display:inline-block;background:#222;color:#fff;
                                   font-weight:700;font-size:12px;padding:3px 10px;
                                   border-radius:6px;letter-spacing:.5px">${f.ref}</span>
                      ${stockBajo}
                    </div>
                  </td>
                  <td style="padding:10px 16px;text-align:center">
                    <span style="display:inline-block;background:rgba(59,130,246,0.1);
                                 color:#3B82F6;font-weight:700;font-size:13px;
                                 padding:3px 10px;border-radius:8px;min-width:40px">
                      ${f.llegada}
                    </span>
                  </td>
                  <td style="padding:10px 16px;text-align:center">
                    <span style="display:inline-block;background:rgba(245,158,11,0.1);
                                 color:#F59E0B;font-weight:700;font-size:13px;
                                 padding:3px 10px;border-radius:8px;min-width:40px">
                      ${f.instCount}
                    </span>
                  </td>
                  <td style="padding:10px 16px;text-align:center">
                    <span style="display:inline-block;background:${bgDisp};
                                 color:${colorDisp};font-weight:700;font-size:13px;
                                 padding:3px 10px;border-radius:8px;min-width:40px">
                      ${f.disp}
                    </span>
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background:rgba(255,255,255,0.06)">
              <td style="padding:10px 16px">
                <span style="font-size:12px;font-weight:700;color:var(--color-accent);
                             text-transform:uppercase;letter-spacing:.5px">
                  <i data-lucide="sigma" style="width:14px;height:14px;
                     vertical-align:middle;margin-right:4px"></i>
                  TOTAL
                </span>
              </td>
              <td style="padding:10px 16px;text-align:center">
                <span style="font-size:15px;font-weight:700;color:#fff">${totalLlegada}</span>
              </td>
              <td style="padding:10px 16px;text-align:center">
                <span style="font-size:15px;font-weight:700;color:#fff">${totalInst}</span>
              </td>
              <td style="padding:10px 16px;text-align:center">
                <span style="font-size:15px;font-weight:700;
                             color:${totalDisp <= 10 ? '#EF4444' : '#10B981'}">
                  ${totalDisp}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>`;

    lucide.createIcons();
  } catch(e){ toast('Error toners: '+e.message,'error'); }
  finally { hideLoading(); }
}

// ─── ENTRADAS TONER ───
async function renderEntradas(){
  showLoading();
  try {
    const { data } = await sb.from('entradas_toner').select('*').order('id', {ascending:false});
    const all = data||[];
    const countEl=document.getElementById('count-entradas');
    if(countEl) countEl.textContent=`${all.length} registro${all.length!==1?'s':''}`;
    const tbody=document.getElementById('entradas-body');
    tbody.innerHTML=all.length?all.map(e=>`<tr>
      <td style="white-space:nowrap;font-size:12px">${fmtDate(e.fecha)}</td>
      <td style="font-size:12px">${e.modelo||'–'}</td>
      <td><strong style="font-size:12px">${e.referencia||'–'}</strong></td>
      <td style="font-size:12px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.ubicacion||'–'}</td>
      <td style="font-size:12px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.area||'–'}</td>
      <td style="font-size:12px;white-space:nowrap">${e.recibe||'–'}</td>
      <td style="white-space:nowrap">
        <div class="action-btns">
          <button class="btn-view" onclick="verEntrada(${e.id})"><i data-lucide="eye"></i> Ver</button>
          <button class="btn-edit" onclick="editEntrada(${e.id})"><i data-lucide="pencil"></i> Editar</button>
          <button class="btn-danger" onclick="deleteEntrada(${e.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>`).join(''):
    `<tr><td colspan="7"><div class="empty-state"><i data-lucide="package"></i><p>Sin entradas registradas</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando entradas','error'); }
  hideLoading();
}

async function verEntrada(id){
  showLoading();
  try {
    const {data} = await sb.from('entradas_toner').select('*').eq('id',id).single();
    if(!data){ toast('Registro no encontrado','error'); return; }
    const campo = (label, valor, destacado=false) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  padding:12px 0;border-bottom:1px solid #1e1e1e;gap:16px">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;flex-shrink:0;min-width:120px">${label}</span>
        <span style="font-size:13.5px;color:${destacado?'#fff':'#ccc'};
                     font-weight:${destacado?'600':'400'};text-align:right;
                     word-break:break-word">${valor||'–'}</span>
      </div>`;
    const html = `
      ${campo('Modelo', data.modelo, true)}
      ${campo('Serie', data.serie)}
      ${campo('Referencia', data.referencia, true)}
      ${campo('Remisión', data.remision)}
      ${campo('Ubicación', data.ubicacion)}
      ${campo('Área', data.area)}
      ${campo('Recibe', data.recibe, true)}
      ${campo('O.S', data.os)}
      ${campo('Fecha', fmtDate(data.fecha))}
      ${campo('Solicitud', data.solicitud)}
      <div style="padding:14px 0">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;display:block;margin-bottom:8px">Observación</span>
        <div style="background:#111;border:1px solid #222;border-radius:8px;
                    padding:14px;font-size:13px;color:#ccc;line-height:1.6;
                    white-space:pre-wrap">${data.observacion||'Sin observación'}</div>
      </div>`;
    document.getElementById('ver-entrada-content').innerHTML = html;
    document.getElementById('ver-entrada-editar-btn').onclick = () => {
      closeModal('modal-ver-entrada'); editEntrada(id);
    };
    lucide.createIcons();
    openModal('modal-ver-entrada');
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

function openNewEntrada(){
  document.getElementById('entrada-form').reset();
  document.getElementById('entrada-id').value='';
  document.getElementById('entrada-fecha').value=today();
  document.querySelector('#modal-entrada .modal-title').textContent='Registrar Llegada de Toner';
  openModal('modal-entrada');
}

async function editEntrada(id){
  const { data, error } = await sb.from('entradas_toner').select('*').eq('id',id).single();
  if(error||!data){ toast('Error cargando entrada','error'); return; }
  document.getElementById('entrada-id').value=data.id;
  document.getElementById('entrada-modelo').value=data.modelo||'';
  document.getElementById('entrada-serie').value=data.serie||'';
  document.getElementById('entrada-remision').value=data.remision||'';
  document.getElementById('entrada-ubicacion').value=data.ubicacion||'';
  document.getElementById('entrada-area').value=data.area||'';
  document.getElementById('entrada-os').value=data.os||'';
  document.getElementById('entrada-fecha').value=data.fecha||'';
  document.getElementById('entrada-observacion').value=data.observacion||'';
  const refConocidas=['TK-3462','TK-3432','TK-3162','TK-3182'];
  const selRef=document.getElementById('entrada-referencia');
  const refOtroWrap=document.getElementById('entrada-referencia-otro-wrap');
  const refOtroInp=document.getElementById('entrada-referencia-otro');
  if(refConocidas.includes(data.referencia||'')){
    selRef.value=data.referencia; if(refOtroWrap) refOtroWrap.style.display='none';
  } else {
    selRef.value='OTRO'; if(refOtroWrap) refOtroWrap.style.display='block'; if(refOtroInp) refOtroInp.value=data.referencia||'';
  }
  const recibeConocidos=['JESÚS ARBELAEZ','JHON CAMACHO'];
  const selRecibe=document.getElementById('entrada-recibe');
  const recibeOtroWrap=document.getElementById('entrada-recibe-otro-wrap');
  const recibeOtroInp=document.getElementById('entrada-recibe-otro');
  if(recibeConocidos.includes(data.recibe||'')){
    selRecibe.value=data.recibe; if(recibeOtroWrap) recibeOtroWrap.style.display='none';
  } else {
    selRecibe.value='OTRO'; if(recibeOtroWrap) recibeOtroWrap.style.display='block'; if(recibeOtroInp) recibeOtroInp.value=data.recibe||'';
  }
  document.getElementById('entrada-solicitud').value=data.solicitud||'';
  document.querySelector('#modal-entrada .modal-title').textContent='Editar Entrada de Toner';
  openModal('modal-entrada');
}

async function saveEntrada(){
  const id=parseInt(document.getElementById('entrada-id').value)||null;
  const modelo=document.getElementById('entrada-modelo').value.trim();
  const refSelect   = document.getElementById('entrada-referencia')?.value || '';
  const refOtro     = document.getElementById('entrada-referencia-otro')?.value.trim() || '';
  const referencia  = (refSelect === 'OTRO' && refOtro) ? refOtro : refSelect;
  const recibeSelect= document.getElementById('entrada-recibe')?.value || '';
  const recibeOtro  = document.getElementById('entrada-recibe-otro')?.value.trim() || '';
  const recibe      = (recibeSelect === 'OTRO' && recibeOtro) ? recibeOtro : recibeSelect;
  const solicitud   = document.getElementById('entrada-solicitud')?.value || '';
  if(!modelo||!referencia){ toast('Complete los campos requeridos: MODELO y REFERENCIA','error'); return; }
  const obj={
    modelo,
    serie:       document.getElementById('entrada-serie').value.trim(),
    referencia,
    remision:    document.getElementById('entrada-remision').value.trim(),
    ubicacion:   document.getElementById('entrada-ubicacion').value.trim(),
    area:        document.getElementById('entrada-area').value.trim(),
    recibe,
    os:          document.getElementById('entrada-os').value.trim(),
    fecha:       document.getElementById('entrada-fecha').value||null,
    solicitud,
    observacion: document.getElementById('entrada-observacion').value.trim(),
  };
  showLoading();
  try {
    if(id){ await sb.from('entradas_toner').update(obj).eq('id',id); }
    else   { await sb.from('entradas_toner').insert(obj); }
    closeModal('modal-entrada');
    await renderEntradas();
    toast(id?'Entrada actualizada':'Entrada registrada');
  } catch(e){ toast('Error guardando entrada','error'); }
  hideLoading();
}

function deleteEntrada(id){
  showConfirm({
    titulo:'¿Eliminar entrada?',
    mensaje:'Este registro de llegada de toner será eliminado.',
    icono:'<i data-lucide="package"></i>', tipo:'danger',
    textoSi:'Sí, eliminar', textoNo:'Cancelar',
    callback: async(ok)=>{
      if(!ok) return;
      showLoading();
      try {
        await sb.from('entradas_toner').delete().eq('id',id);
        await renderEntradas();
        toast('Entrada eliminada','error');
      } catch(e){ toast('Error eliminando entrada','error'); }
      hideLoading();
    }
  });
}

// ─── TONERS INSTALADOS ───
async function renderInstalados(){
  showLoading();
  try {
    const { data } = await sb.from('toners_instalados').select('*').order('id', {ascending:false});
    const all = data||[];
    const countEl=document.getElementById('count-instalados');
    if(countEl) countEl.textContent=`${all.length} registro${all.length!==1?'s':''}`;
    const tbody=document.getElementById('instalados-body');
    tbody.innerHTML=all.length?all.map(i=>`<tr>
      <td style="white-space:nowrap;font-size:12px">${fmtDate(i.fecha)}</td>
      <td style="font-size:12px">${i.equipo||'–'}</td>
      <td style="font-size:12px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.sede||'–'}</td>
      <td><strong style="font-size:12px">${i.referencia||'–'}</strong></td>
      <td style="font-size:12px;white-space:nowrap">${i.tecnico||'–'}</td>
      <td style="white-space:nowrap">
        <div class="action-btns">
          <button class="btn-view" onclick="verInstalado(${i.id})"><i data-lucide="eye"></i> Ver</button>
          <button class="btn-edit" onclick="editInstalado(${i.id})"><i data-lucide="pencil"></i> Editar</button>
          <button class="btn-danger" onclick="deleteInstalado(${i.id})"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>`).join(''):
    `<tr><td colspan="6"><div class="empty-state"><i data-lucide="printer"></i><p>Sin instalaciones registradas</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando instalados','error'); }
  hideLoading();
}

async function verInstalado(id){
  showLoading();
  try {
    const {data} = await sb.from('toners_instalados').select('*').eq('id',id).single();
    if(!data){ toast('Registro no encontrado','error'); return; }
    const campo = (label, valor, destacado=false) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  padding:12px 0;border-bottom:1px solid #1e1e1e;gap:16px">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;flex-shrink:0;min-width:120px">${label}</span>
        <span style="font-size:13.5px;color:${destacado?'#fff':'#ccc'};
                     font-weight:${destacado?'600':'400'};text-align:right;
                     word-break:break-word">${valor||'–'}</span>
      </div>`;
    const html = `
      ${campo('Modelo', data.equipo, true)}
      ${campo('Serie', data.serial)}
      ${campo('Área', data.sede)}
      ${campo('Toner', data.referencia, true)}
      ${campo('Contador', data.contador)}
      ${campo('Fecha', fmtDate(data.fecha))}
      ${campo('Responsable', data.tecnico, true)}
      <div style="padding:14px 0">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;display:block;margin-bottom:8px">Observación</span>
        <div style="background:#111;border:1px solid #222;border-radius:8px;
                    padding:14px;font-size:13px;color:#ccc;line-height:1.6;
                    white-space:pre-wrap">${data.observacion||'Sin observación'}</div>
      </div>`;
    document.getElementById('ver-instalado-content').innerHTML = html;
    document.getElementById('ver-instalado-editar-btn').onclick = () => {
      closeModal('modal-ver-instalado'); editInstalado(id);
    };
    lucide.createIcons();
    openModal('modal-ver-instalado');
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

function openNewInstalado(){
  const form = document.getElementById('instalado-form');
  if(form) form.reset();
  const idField = document.getElementById('instalado-id');
  if(idField) idField.value='';
  const fechaField = document.getElementById('instalado-fecha');
  if(fechaField) fechaField.value=today();
  const respField = document.getElementById('instalado-responsable');
  if(respField) respField.value='JESÚS ARBELAEZ';
  const titulo = document.querySelector('#modal-instalado .modal-title');
  if(titulo) titulo.textContent='Registrar Toner Instalado';
  openModal('modal-instalado');
}

async function editInstalado(id){
  const { data, error } = await sb.from('toners_instalados').select('*').eq('id',id).single();
  if(error||!data){ toast('Error cargando instalado','error'); return; }
  document.getElementById('instalado-id').value=data.id;
  document.getElementById('instalado-equipo').value=data.equipo||'';
  document.getElementById('instalado-serial').value=data.serial||'';
  document.getElementById('instalado-area').value=data.sede||'';
  document.getElementById('instalado-contador').value=data.contador||'';
  document.getElementById('instalado-fecha').value=data.fecha||'';
  document.getElementById('instalado-observacion').value=data.observacion||'';
  const tonerConocidos=['TK-3462','TK-3432','TK-3162','TK-3182'];
  const selToner=document.getElementById('instalado-toner');
  const tonerOtroWrap=document.getElementById('instalado-toner-otro-wrap');
  const tonerOtroInp=document.getElementById('instalado-toner-otro');
  if(tonerConocidos.includes(data.referencia||'')){
    selToner.value=data.referencia; if(tonerOtroWrap) tonerOtroWrap.style.display='none';
  } else {
    selToner.value='OTRO'; if(tonerOtroWrap) tonerOtroWrap.style.display='block'; if(tonerOtroInp) tonerOtroInp.value=data.referencia||'';
  }
  const respConocidos=['JESÚS ARBELAEZ','JHON CAMACHO'];
  const selResp=document.getElementById('instalado-responsable');
  const respOtroWrap=document.getElementById('instalado-responsable-otro-wrap');
  const respOtroInp=document.getElementById('instalado-responsable-otro');
  if(respConocidos.includes(data.tecnico||'')){
    selResp.value=data.tecnico; if(respOtroWrap) respOtroWrap.style.display='none';
  } else {
    selResp.value='OTRO'; if(respOtroWrap) respOtroWrap.style.display='block'; if(respOtroInp) respOtroInp.value=data.tecnico||'';
  }
  document.querySelector('#modal-instalado .modal-title').textContent='Editar Toner Instalado';
  openModal('modal-instalado');
}

async function saveInstalado(){
  const id=parseInt(document.getElementById('instalado-id')?.value)||null;
  const equipo=document.getElementById('instalado-equipo')?.value.trim()||'';
  const tonerSelect  = document.getElementById('instalado-toner')?.value || '';
  const tonerOtro    = document.getElementById('instalado-toner-otro')?.value.trim() || '';
  const toner        = (tonerSelect === 'OTRO' && tonerOtro) ? tonerOtro : tonerSelect;
  const respSelect   = document.getElementById('instalado-responsable')?.value || '';
  const respOtro     = document.getElementById('instalado-responsable-otro')?.value.trim() || '';
  const responsable  = (respSelect === 'OTRO' && respOtro) ? respOtro : respSelect;
  if(!equipo){ toast('El campo MODELO es requerido','error'); return; }
  if(!toner){  toast('El campo TONER es requerido','error'); return; }
  const obj={
    equipo,
    serial:      document.getElementById('instalado-serial')?.value.trim()||'',
    sede:        document.getElementById('instalado-area')?.value.trim()||'',
    referencia:  toner,
    contador:    document.getElementById('instalado-contador')?.value.trim()||'',
    fecha:       document.getElementById('instalado-fecha')?.value||null,
    tecnico:     responsable,
    observacion: document.getElementById('instalado-observacion')?.value.trim()||'',
  };
  showLoading();
  try {
    if(id){ await sb.from('toners_instalados').update(obj).eq('id',id); }
    else   { await sb.from('toners_instalados').insert(obj); }
    closeModal('modal-instalado');
    await renderInstalados();
    const pgToners = document.getElementById('page-toners');
    if(pgToners&&pgToners.classList.contains('active')) await renderToners();
    toast(id?'Instalación actualizada':'✓ Instalación registrada. Toner descontado de disponibles.');
  } catch(e){ toast('Error guardando instalación','error'); }
  hideLoading();
}

function deleteInstalado(id){
  showConfirm({
    titulo:'¿Eliminar instalación?',
    mensaje:'Este registro de toner instalado será eliminado.',
    icono:'<i data-lucide="printer"></i>', tipo:'danger',
    textoSi:'Sí, eliminar', textoNo:'Cancelar',
    callback: async(ok)=>{
      if(!ok) return;
      showLoading();
      try {
        await sb.from('toners_instalados').delete().eq('id',id);
        await renderInstalados();
        toast('Instalación eliminada','error');
      } catch(e){ toast('Error eliminando instalación','error'); }
      hideLoading();
    }
  });
}

// ─── ORDENES ───
async function renderOrdenes(){
  showLoading();
  try {
    const { data } = await sb.from('ordenes').select('*').order('id', {ascending:false});
    const all = data||[];
    const countEl=document.getElementById('count-ordenes');
    if(countEl) countEl.textContent=`${all.length} registro${all.length!==1?'s':''}`;
    const cont = document.getElementById('ordenes-table-container');
    if(!all.length){
      cont.innerHTML = `<div class="empty-state"><i data-lucide="clipboard-list"></i><p>Sin órdenes de servicio</p></div>`;
      lucide.createIcons();
      return;
    }
    cont.innerHTML = `
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <thead><tr>
          <th style="width:90px">FECHA</th>
          <th style="width:110px">MODELO</th>
          <th style="width:110px">SERIE</th>
          <th style="width:100px">SEDE</th>
          <th style="width:130px">UBICACIÓN</th>
          <th style="width:130px">INCIDENTE</th>
          <th style="width:95px">O.S</th>
          <th style="width:110px">RESPONSABLE</th>
          <th style="width:110px">ACCIONES</th>
        </tr></thead>
        <tbody>
          ${all.map(o => `<tr>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${fmtDate(o.fecha_solicitud)}
            </td>
            <td style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${o.modelo||'–'}
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${o.serial||'–'}
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${o.sede||'–'}
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${o.ubicacion||'–'}
            </td>
            <td style="font-size:12px">
              <span class="badge ${badgeIncidente(o.incidente)} badge-incidente">
                ${o.incidente||'–'}
              </span>
            </td>
            <td style="font-size:12px">
              ${o.os
                ? `<span style="color:#ffcc44;font-weight:700;white-space:nowrap">${o.os}</span>`
                : `<span style="color:#888;font-style:italic">Pendiente</span>`
              }
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${o.responsable||'–'}
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-view" onclick="verOrden(${o.id})"><i data-lucide="eye"></i> Ver</button>
                <button class="btn-edit" onclick="editOrden(${o.id})"><i data-lucide="pencil"></i> Editar</button>
                <button class="btn-danger" onclick="deleteOrden(${o.id})"><i data-lucide="trash-2"></i></button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando órdenes','error'); }
  hideLoading();
}

let currentOrdenId = null;

async function verOrden(id){
  currentOrdenId = id;
  showLoading();
  try {
    const {data} = await sb.from('ordenes').select('*').eq('id',id).single();
    if(!data){ toast('Orden no encontrada','error'); return; }
    const campo = (label, valor, destacado=false) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  padding:12px 0;border-bottom:1px solid #1e1e1e;gap:16px">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;flex-shrink:0;min-width:120px">${label}</span>
        <span style="font-size:13.5px;color:${destacado?'#fff':'#ccc'};
                     font-weight:${destacado?'600':'400'};text-align:right;
                     word-break:break-word">${valor||'–'}</span>
      </div>`;
    const pendienteHTML = !data.os ? `
      <div style="background:rgba(200,140,0,0.1);border:1px solid rgba(200,140,0,0.3);
                  border-radius:8px;padding:10px 14px;margin-bottom:16px;
                  font-size:12.5px;color:#ffaa00;font-style:italic">
        Esta orden está pendiente de confirmación de O.S.
        Usa "Copiar para correo" para enviar la solicitud.
      </div>` : '';
    const html = `
      ${pendienteHTML}
      <div style="margin-bottom:16px">
        <span class="badge ${badgeIncidente(data.incidente)} badge-incidente" style="max-width:none;display:inline-block">${data.incidente||'–'}</span>
      </div>
      ${campo('Modelo', data.modelo, true)}
      ${campo('Serial', data.serial)}
      ${campo('Ubicación', data.ubicacion)}
      ${campo('Sede', data.sede, true)}
      ${campo('O.S', data.os, true)}
      ${campo('Fecha Solicitud', fmtDate(data.fecha_solicitud))}
      ${campo('Fecha Servicio', fmtDate(data.fecha_servicio))}
      ${campo('Responsable', data.responsable, true)}
      <div style="padding:14px 0">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;display:block;margin-bottom:8px">Trabajo Realizado</span>
        <div style="background:#111;border:1px solid #222;border-radius:8px;
                    padding:14px;font-size:13px;color:#ccc;line-height:1.6;
                    white-space:pre-wrap">${data.trabajo||'Sin información'}</div>
      </div>`;
    document.getElementById('ver-orden-content').innerHTML = html;
    document.getElementById('ver-orden-editar-btn').onclick = () => {
      closeModal('modal-ver-orden'); editOrden(id);
    };
    lucide.createIcons();
    openModal('modal-ver-orden');
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

const DIRECCIONES_SEDE = {
  'PAMPALINDA':            'Calle 5 # 62-00',
  'USC CENTRO':            'Carrera 8 # 8-17, Barrio Santa Rosa',
  'CENTRO':                'Carrera 8 # 8-17, Barrio Santa Rosa',
  'USC PALMIRA':           'Carrera 29 # 38-47, Barrio Alfonso López',
  'PALMIRA':               'Carrera 29 # 38-47, Barrio Alfonso López',
  'CLÍNICA VETERINARIA':   'Cl. 18 #35-53, Cristóbal Colón, Cali',
  'CLINICA VETERINARIA':   'Cl. 18 #35-53, Cristóbal Colón, Cali',
  'RESTAURANTE SAN CARLO': 'Cra. 4 #4-63, Barrio El Peñón, Cali',
};
function getDireccionSede(sede){
  if(!sede) return '';
  return DIRECCIONES_SEDE[sede.trim().toUpperCase()] || '';
}

function copiarParaCorreo(id){
  sb.from('ordenes').select('modelo,serial,ubicacion,incidente,sede').eq('id',id).single()
    .then(({data, error})=>{
      if(error||!data){ toast('Error al obtener datos','error'); return; }
      const modelo=data.modelo||'', serial=data.serial||'',
            ubicacion=data.ubicacion||'', incidente=data.incidente||'',
            sede=data.sede||'', direccion=getDireccionSede(sede);
      const sedeLinea = direccion ? `\n\nSede: ${sede} — ${direccion}` : '';
      const sedePar   = direccion
        ? `<p style="font-family:Arial,sans-serif;font-size:12px;color:#444;margin-top:8px"><strong>Sede:</strong> ${sede} — ${direccion}</p>`
        : '';
      const html=`<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px"><tr style="background:#f2f2f2;font-weight:bold"><td>MODELO</td><td>SERIAL</td><td>UBICACIÓN</td><td>INCIDENTE</td></tr><tr><td>${modelo}</td><td>${serial}</td><td>${ubicacion}</td><td>${incidente}</td></tr></table>${sedePar}`;
      const textoPlano=`MODELO\tSERIAL\tUBICACIÓN\tINCIDENTE\n${modelo}\t${serial}\t${ubicacion}\t${incidente}${sedeLinea}`;
      try {
        const clipData=new ClipboardItem({
          'text/html':  new Blob([html],        {type:'text/html'}),
          'text/plain': new Blob([textoPlano],  {type:'text/plain'}),
        });
        navigator.clipboard.write([clipData]).then(()=>{
          toast('✓ Copiado en formato tabla, pega en el correo');
        }).catch(err=>{
          console.error('Error clipboard avanzado:',err);
          navigator.clipboard.writeText(textoPlano).then(()=>toast('✓ Copiado (texto), pega en Excel o correo'));
        });
      } catch(e){
        navigator.clipboard.writeText(textoPlano)
          .then(()=>toast('✓ Copiado (texto), pega en Excel o correo'))
          .catch(()=>toast('No se pudo copiar automáticamente','error'));
      }
    });
}

function openNewOrden(){
  document.getElementById('orden-form').reset();
  document.getElementById('orden-id').value='';
  document.getElementById('orden-fechaSolicitud').value=today();
  const oWrap=document.getElementById('orden-otro-wrap');
  if(oWrap) oWrap.style.display='none';
  const hWrapO=document.getElementById('orden-helpdesk-otro-wrap');
  if(hWrapO) hWrapO.style.display='none';
  document.querySelector('#modal-orden .modal-title').textContent='Nueva Orden de Servicio';
  openModal('modal-orden');
}

async function editOrden(id){
  const { data, error } = await sb.from('ordenes').select('*').eq('id',id).single();
  if(error||!data){ toast('Error cargando orden','error'); return; }
  document.getElementById('orden-id').value=data.id;
  document.getElementById('orden-modelo').value=data.modelo||'';
  document.getElementById('orden-serial').value=data.serial||'';
  document.getElementById('orden-ubicacion').value=data.ubicacion||'';
  const stdIncs=['','CONFIGURACION E INSTALACION','CAMBIO DE TONER','CREACION DE USUARIO','CODIGO DE IMPRESION',
    'MANCHAS EN IMPRESION','RAYAS EN IMPRESION','ATASCO','RUIDO','INSTALACION POR RED','ATASCO CONTINUO',
    'LIMPIEZA Y MANTENIMIENTO','PROBLEMAS DE RED','CAMBIO DE CILINDRO','CAMBIO UNIDAD FUSORA','SENSOR SUELTO'];
  const iSel=document.getElementById('orden-incidente');
  const iWrap=document.getElementById('orden-otro-wrap');
  const iOtroInp=document.getElementById('orden-incidente-otro');
  if(stdIncs.includes(data.incidente||'')){
    if(iSel) iSel.value=data.incidente||''; if(iWrap) iWrap.style.display='none';
  } else {
    if(iSel) iSel.value='OTRO'; if(iWrap) iWrap.style.display='block'; if(iOtroInp) iOtroInp.value=data.incidente||'';
  }
  document.getElementById('orden-fechaSolicitud').value=data.fecha_solicitud||'';
  document.getElementById('orden-os').value=data.os||'';
  document.getElementById('orden-fechaServicio').value=data.fecha_servicio||'';
  document.getElementById('orden-trabajo').value=data.trabajo||'';
  document.getElementById('orden-sede').value=data.sede||'';
  const orSel=document.getElementById('orden-responsable');
  const orWrap=document.getElementById('orden-helpdesk-otro-wrap');
  const orOtroInp=document.getElementById('orden-helpdesk-otro');
  const conocidosO=['JESÚS ARBELAEZ','JHON CAMACHO'];
  if(orSel){
    if(conocidosO.includes(data.responsable||'')){
      orSel.value=data.responsable||'JESÚS ARBELAEZ'; if(orWrap) orWrap.style.display='none';
    } else {
      orSel.value='OTRO'; if(orWrap) orWrap.style.display='block'; if(orOtroInp) orOtroInp.value=data.responsable||'';
    }
  }
  document.querySelector('#modal-orden .modal-title').textContent='Editar Orden de Servicio';
  openModal('modal-orden');
}

async function saveOrden(){
  const id=parseInt(document.getElementById('orden-id')?.value)||null;
  const incSelect=document.getElementById('orden-incidente')?.value||'';
  const incOtro=document.getElementById('orden-incidente-otro')?.value.trim()||'';
  const incidente=(incSelect==='OTRO'&&incOtro)?incOtro:incSelect;
  const respSelect=document.getElementById('orden-responsable')?.value||'';
  const respOtro=document.getElementById('orden-helpdesk-otro')?.value.trim()||'';
  const responsable=(respSelect==='OTRO'&&respOtro)?respOtro:respSelect;
  const modelo=document.getElementById('orden-modelo')?.value.trim()||'';
  const serial=document.getElementById('orden-serial')?.value.trim()||'';
  const ubicacion=document.getElementById('orden-ubicacion')?.value.trim()||'';
  const sede=document.getElementById('orden-sede')?.value||'';
  if(!modelo){    toast('El campo MODELO es requerido','error');    return; }
  if(!serial){    toast('El campo SERIAL es requerido','error');    return; }
  if(!ubicacion){ toast('El campo UBICACIÓN es requerido','error'); return; }
  if(!incidente){ toast('El campo INCIDENTE es requerido','error'); return; }
  if(!sede){      toast('El campo SEDE es requerido','error');      return; }
  const obj={
    modelo, serial, ubicacion, incidente, sede,
    fecha_solicitud: document.getElementById('orden-fechaSolicitud')?.value||null,
    os:              document.getElementById('orden-os')?.value.trim()||'',
    fecha_servicio:  document.getElementById('orden-fechaServicio')?.value||null,
    trabajo:         document.getElementById('orden-trabajo')?.value.trim()||'',
    responsable,
  };
  showLoading();
  try {
    if(id){
      const {error}=await sb.from('ordenes').update(obj).eq('id',id);
      if(error) throw error;
      toast('Orden actualizada');
    } else {
      const {error}=await sb.from('ordenes').insert(obj);
      if(error) throw error;
      toast('Orden creada');
    }
    closeModal('modal-orden');
    await renderOrdenes();
  } catch(e){
    toast('Error: '+e.message,'error');
    console.error('[saveOrden] Error completo:',e);
  } finally {
    hideLoading();
  }
}

function deleteOrden(id){
  showConfirm({
    titulo:'¿Eliminar orden de servicio?',
    mensaje:'Esta orden será eliminada permanentemente.',
    icono:'<i data-lucide="clipboard-list"></i>', tipo:'danger',
    textoSi:'Sí, eliminar', textoNo:'Cancelar',
    callback: async(ok)=>{
      if(!ok) return;
      showLoading();
      try {
        await sb.from('ordenes').delete().eq('id',id);
        await renderOrdenes();
        toast('Orden eliminada','error');
      } catch(e){ toast('Error eliminando orden','error'); }
      hideLoading();
    }
  });
}

// ─── NOTIFICACIONES ───
async function renderNotificaciones(){
  showLoading();
  try {
    const {data, error} = await sb.from('notificaciones').select('*').order('id',{ascending:false});
    if(error) throw error;
    const all = data || [];
    document.getElementById('notif-count').textContent = `${all.length} registros`;

    const cont = document.getElementById('notif-container');

    if(!all.length){
      cont.innerHTML = `<div class="empty-state"><i data-lucide="bell"></i><p>Sin notificaciones KFS</p></div>`;
      lucide.createIcons();
      return;
    }

    cont.innerHTML = `
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <thead><tr>
          <th style="width:90px">FECHA</th>
          <th style="width:110px">SERIE</th>
          <th style="width:130px">MODELO</th>
          <th style="width:110px">SEDE</th>
          <th style="width:150px">ÁREA</th>
          <th style="width:100px">O.S DE APROB.</th>
          <th style="width:110px">ACCIÓN</th>
        </tr></thead>
        <tbody>
          ${all.map(n => `<tr>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${fmtDate(n.fecha)}
            </td>
            <td style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${n.impresora||'–'}
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${n.modelo||'–'}
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${n.ubicacion||'–'}
            </td>
            <td style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${n.area||'–'}
            </td>
            <td style="font-size:12px">
              ${n.os
                ? `<span style="color:#ffcc44;font-weight:700;white-space:nowrap">${n.os}</span>`
                : `<span style="color:#888;font-style:italic">Pendiente</span>`
              }
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-view" onclick="verNotif(${n.id})"><i data-lucide="eye"></i> Ver</button>
                <button class="btn-edit" onclick="editNotif(${n.id})"><i data-lucide="pencil"></i> Editar</button>
                <button class="btn-danger" onclick="deleteNotif(${n.id})"><i data-lucide="trash-2"></i></button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    lucide.createIcons();
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

async function verNotif(id){
  showLoading();
  try {
    const {data} = await sb.from('notificaciones').select('*').eq('id',id).single();
    if(!data){ toast('Notificación no encontrada','error'); return; }

    const campo = (label, valor, destacado=false) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  padding:12px 0;border-bottom:1px solid #1e1e1e;gap:16px">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;flex-shrink:0;min-width:120px">${label}</span>
        <span style="font-size:13.5px;color:${destacado?'#fff':'#ccc'};
                     font-weight:${destacado?'600':'400'};text-align:right;
                     word-break:break-word">${valor||'–'}</span>
      </div>`;

    const osHTML = data.os
      ? `<span style="color:#ffcc44;font-weight:700">${data.os}</span>`
      : `<span style="color:#888;font-style:italic">Pendiente</span>`;

    const html = `
      ${campo('Fecha', fmtDate(data.fecha), true)}
      ${campo('Impresora / Serie', data.impresora, true)}
      ${campo('Modelo', data.modelo)}
      ${campo('Sede', data.ubicacion)}
      ${campo('Área', data.area)}
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  padding:12px 0;border-bottom:1px solid #1e1e1e;gap:16px">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;flex-shrink:0;min-width:120px">O.S DE APROB.</span>
        <span style="font-size:13.5px;text-align:right">${osHTML}</span>
      </div>
      <div style="padding:14px 0">
        <span style="font-size:11px;color:#666;text-transform:uppercase;
                     letter-spacing:.5px;display:block;margin-bottom:8px">Observaciones</span>
        <div style="background:#111;border:1px solid #222;border-radius:8px;
                    padding:14px;font-size:13px;color:#ccc;line-height:1.6;
                    white-space:pre-wrap">${data.observacion || 'Sin observaciones'}</div>
      </div>`;

    document.getElementById('ver-notif-content').innerHTML = html;
    document.getElementById('ver-notif-editar-btn').onclick = () => {
      closeModal('modal-ver-notif');
      editNotif(id);
    };
    lucide.createIcons();
    openModal('modal-ver-notif');
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

function openNewNotif(){
  document.getElementById('notif-form').reset();
  document.getElementById('notif-id').value='';
  document.getElementById('notif-fecha').value=today();
  document.querySelector('#modal-notif .modal-title').textContent='Nueva Notificación KFS';
  openModal('modal-notif');
}

async function editNotif(id){
  const {data} = await sb.from('notificaciones').select('*').eq('id',id).single();
  if(!data) return;
  const idF = document.getElementById('notif-id');
  if(idF) idF.value = data.id;
  const fd = document.getElementById('notif-fecha'); if(fd) fd.value = data.fecha||'';
  const fi = document.getElementById('notif-impresora'); if(fi) fi.value = data.impresora||'';
  const fm = document.getElementById('notif-modelo'); if(fm) fm.value = data.modelo||'';
  const fu = document.getElementById('notif-ubicacion'); if(fu) fu.value = data.ubicacion||'';
  const fa = document.getElementById('notif-area'); if(fa) fa.value = data.area||'';
  const fo = document.getElementById('notif-os'); if(fo) fo.value = data.os||'';
  const fc = document.getElementById('notif-cuerpo'); if(fc) fc.value = data.observacion||'';
  document.getElementById('modal-notif-title').textContent = 'Editar Notificación KFS';
  openModal('modal-notif');
}

async function addNotif(){
  const idVal = parseInt(document.getElementById('notif-id')?.value)||null;
  const fecha = document.getElementById('notif-fecha')?.value || null;
  const impresora = document.getElementById('notif-impresora')?.value.trim() || '';
  const modelo = document.getElementById('notif-modelo')?.value.trim() || '';
  const ubicacion = document.getElementById('notif-ubicacion')?.value || '';
  const area = document.getElementById('notif-area')?.value.trim() || '';
  const os = document.getElementById('notif-os')?.value.trim() || '';
  const observacion = document.getElementById('notif-cuerpo')?.value.trim() || '';

  if(!impresora){ toast('IMPRESORA/SERIE es requerida','error'); return; }
  if(!fecha){ toast('La FECHA es requerida','error'); return; }

  const obj = { fecha, impresora, modelo, ubicacion, area, os, observacion, leido: false };

  showLoading();
  try {
    if(idVal){
      const {error} = await sb.from('notificaciones').update(obj).eq('id',idVal);
      if(error) throw error;
      toast('Notificación actualizada');
    } else {
      const {error} = await sb.from('notificaciones').insert(obj);
      if(error) throw error;
      toast('Notificación creada');
    }
    closeModal('modal-notif');
    const idF = document.getElementById('notif-id');
    if(idF) idF.value = '';
    await renderNotificaciones();
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

function deleteNotif(id){
  showConfirm({
    titulo:'¿Eliminar notificación?',
    mensaje:'Esta notificación KFS será eliminada.',
    icono:'<i data-lucide="bell"></i>', tipo:'danger',
    textoSi:'Sí, eliminar', textoNo:'Cancelar',
    callback: async(ok)=>{
      if(!ok) return;
      showLoading();
      try {
        await sb.from('notificaciones').delete().eq('id',id);
        await renderNotificaciones();
        toast('Notificación eliminada','error');
      } catch(e){ toast('Error eliminando notificación','error'); }
      hideLoading();
    }
  });
}

// ─── CONFIGURACIÓN ───
function getClienteConfig(){
  const defaults={
    cliente:'Universidad Santiago de Cali',
    contrato:'Soporte de Impresión',
    impresoras:130,
    scanners:5,
    resp1:'JESÚS ARBELAEZ',
    resp2:'JHON CAMACHO',
    correo:'soporteimpresion@usc.edu.co',
    extension:'6725',
  };
  try{ return {...defaults, ...JSON.parse(localStorage.getItem('dtc_config'))}; }
  catch(e){ return defaults; }
}

function saveClienteConfig(){
  const cfg={
    cliente:    document.getElementById('cfg-cliente').value.trim(),
    contrato:   document.getElementById('cfg-contrato').value.trim(),
    impresoras: parseInt(document.getElementById('cfg-impresoras').value)||0,
    scanners:   parseInt(document.getElementById('cfg-scanners').value)||0,
    resp1:      document.getElementById('cfg-resp1').value.trim(),
    resp2:      document.getElementById('cfg-resp2').value.trim(),
    correo:     document.getElementById('cfg-correo').value.trim(),
    extension:  document.getElementById('cfg-extension').value.trim(),
  };
  localStorage.setItem('dtc_config', JSON.stringify(cfg));
  toast('Configuración del cliente guardada');
}

function changePassword(){
  const actual   = document.getElementById('cfg-pass-actual').value;
  const nueva    = document.getElementById('cfg-pass-new').value;
  const confirma = document.getElementById('cfg-pass-confirm').value;
  const passActual = localStorage.getItem('dtc_pass') || 'DATECSA2026';
  if(actual!==passActual){ toast('La contraseña actual es incorrecta','error'); return; }
  if(!nueva){ toast('La nueva contraseña no puede estar vacía','error'); return; }
  if(nueva!==confirma){ toast('Las contraseñas no coinciden','error'); return; }
  localStorage.setItem('dtc_pass', nueva);
  document.getElementById('cfg-pass-actual').value='';
  document.getElementById('cfg-pass-new').value='';
  document.getElementById('cfg-pass-confirm').value='';
  toast('Contraseña actualizada correctamente');
}

function exportBackup(){ toast('Backup no disponible en modo Supabase','error'); }
function importBackup(){ toast('Importación no disponible en modo Supabase','error'); }
function limpiarTodosDatos(){ toast('Operación no disponible en modo Supabase. Contacte al administrador.','error'); }

async function renderConfiguracion(){
  const currentTheme = localStorage.getItem('dtc_tema')||'rojo';
  const grid=document.getElementById('theme-grid');
  if(grid){
    grid.innerHTML=THEMES.map(t=>{
      const isClaro = t.id === 'claro';
      const circle = isClaro
        ? `<div style="width:48px;height:48px;border-radius:50%;background:#ffffff;border:2px solid #e0e0e0;display:flex;align-items:center;justify-content:center">
             ${currentTheme===t.id?'<span class="theme-check" style="color:#b40000">✓</span>':'<div style="width:16px;height:16px;border-radius:50%;background:#b40000"></div>'}
           </div>`
        : `<div class="theme-circle" style="background:${t.accent}">
             ${currentTheme===t.id?'<span class="theme-check">✓</span>':''}
           </div>`;
      return `
      <div class="theme-card${currentTheme===t.id?' active':''}" onclick="applyTheme('${t.id}');renderConfiguracion()">
        ${circle}
        <span class="theme-name">${t.name}</span>
      </div>`;
    }).join('');
  }
  const cfg=getClienteConfig();
  [['cfg-cliente',cfg.cliente],['cfg-contrato',cfg.contrato],['cfg-impresoras',cfg.impresoras],
   ['cfg-scanners',cfg.scanners],['cfg-resp1',cfg.resp1],['cfg-resp2',cfg.resp2],
   ['cfg-correo',cfg.correo],['cfg-extension',cfg.extension]
  ].forEach(([id,val])=>{ const el=document.getElementById(id); if(el) el.value=val; });

  const statsEl=document.getElementById('cfg-stats');
  if(statsEl){
    statsEl.innerHTML='<div style="color:#555;font-size:12px;padding:10px 0">Cargando estadísticas...</div>';
    try {
      const tables=[
        {label:'Tickets / Casos',    table:'tickets',           icon:'ticket'},
        {label:'Toners Instalados',  table:'toners_instalados', icon:'printer'},
        {label:'Entradas de Toner',  table:'entradas_toner',    icon:'package'},
        {label:'Órdenes de Servicio',table:'ordenes',           icon:'clipboard-list'},
        {label:'Notificaciones KFS', table:'notificaciones',    icon:'bell'},
      ];
      const counts=await Promise.all(tables.map(s=>sb.from(s.table).select('*',{count:'exact',head:true})));
      statsEl.innerHTML=tables.map((s,i)=>`
        <div class="config-stat-card">
          <i data-lucide="${s.icon}"></i>
          <div class="config-stat-num">${counts[i].count||0}</div>
          <div class="config-stat-label">${s.label}</div>
        </div>`).join('');
    } catch(e){
      statsEl.innerHTML='<div style="color:#555;font-size:12px;padding:10px 0">Error cargando estadísticas</div>';
    }
  }
  lucide.createIcons();
}

// ─── CLIENTE ───
function renderCliente(){
  const cfg=getClienteConfig();
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  set('cli-hero-nombre',  cfg.cliente);
  set('cli-hero-contrato','Contrato de '+cfg.contrato+' – DATECSA');
  set('cli-hero-imp',     cfg.impresoras);
  set('cli-hero-scan',    cfg.scanners);
  set('cli-nombre',       cfg.cliente);
  set('cli-tipo',         cfg.contrato);
  set('cli-resp1',        cfg.resp1);
  set('cli-resp2',        cfg.resp2);
  set('cli-total',        (parseInt(cfg.impresoras)||0)+(parseInt(cfg.scanners)||0));
  const correoEl=document.getElementById('cliente-correo');
  if(correoEl){
    const correo=cfg.correo||'soporteimpresion@usc.edu.co';
    correoEl.href='mailto:'+correo;
    correoEl.textContent=correo;
  }
  const extEl=document.getElementById('cliente-extension');
  if(extEl) extEl.innerHTML='<i data-lucide="phone"></i> '+(cfg.extension||'6725');
  lucide.createIcons();
}

// ─── CIERRE ───
function renderCierre(){ lucide.createIcons(); }

// ─── INFORMES ───
function renderInformes(){ lucide.createIcons(); }

async function exportInforme(modulo, formato){
  const config={
    tickets:{
      table:'tickets',
      nombre:'Casos_y_Solicitudes',
      campoFecha:'fecha_inicial',
      fromId:'inf-tickets-from',
      toId:'inf-tickets-to',
      headers:['FECHA INICIAL','TIPO SOLICITUD','LLEGADA','USUARIO','MODELO','SERIE','HORA INICIO','HORA FIN','UBICACIÓN','FECHA FINAL','OBSERVACIONES','HELPDESK','PRIORIDAD','ESTADO'],
      campos:['fecha_inicial','tipo_solicitud','llegada','usuario','modelo','serial','hora_inicio','hora_fin','ubicacion','fecha_final','observaciones','helpdesk','prioridad','estado']
    },
    entradas:{
      table:'entradas_toner',
      nombre:'Registro_Llegada_Toner',
      campoFecha:'fecha',
      fromId:'inf-llegada-from',
      toId:'inf-llegada-to',
      headers:['FECHA','MODELO','SERIE','REFERENCIA','REMISIÓN','UBICACIÓN','ÁREA','RECIBE','OS','SOLICITUD','OBSERVACIÓN'],
      campos:['fecha','modelo','serie','referencia','remision','ubicacion','area','recibe','os','solicitud','observacion']
    },
    instalados:{
      table:'toners_instalados',
      nombre:'Toner_Instalados',
      campoFecha:'fecha',
      fromId:'inf-instalados-from',
      toId:'inf-instalados-to',
      headers:['MODELO','SERIE','ÁREA','TONER','CONTADOR','FECHA','RESPONSABLE','OBSERVACIÓN'],
      campos:['equipo','serial','sede','referencia','contador','fecha','tecnico','observacion']
    },
    ordenes:{
      table:'ordenes',
      nombre:'Ordenes_de_Servicio',
      campoFecha:'fecha_solicitud',
      fromId:'inf-ordenes-from',
      toId:'inf-ordenes-to',
      headers:['MODELO','SERIAL','UBICACIÓN','INCIDENTE','FECHA SOLICITUD','O.S','FECHA SERVICIO','TRABAJO REALIZADO','SEDE','RESPONSABLE'],
      campos:['modelo','serial','ubicacion','incidente','fecha_solicitud','os','fecha_servicio','trabajo','sede','responsable']
    },
    notif:{
      table:'notificaciones',
      nombre:'Notificaciones_KFS',
      campoFecha:'fecha',
      fromId:'inf-notif-from',
      toId:'inf-notif-to',
      headers:['FECHA','IMPRESORA/SERIE','MODELO','UBICACIÓN','O.S DE APROB.','OBSERVACIONES'],
      campos:['fecha','impresora','modelo','ubicacion','os','observacion']
    }
  };

  if(modulo==='toners'){
    showLoading();
    try {
      const [{ data: entradas }, { data: instalados }] = await Promise.all([
        sb.from('entradas_toner').select('referencia'),
        sb.from('toners_instalados').select('referencia'),
      ]);
      const ent=entradas||[]; const ins=instalados||[];
      const rows=REFERENCIAS_FIJAS.map(ref=>{
        const ll=ent.filter(e=>normRef(e.referencia)===normRef(ref)).length;
        const is=ins.filter(i=>normRef(i.referencia)===normRef(ref)).length;
        return [ref, ll, is, Math.max(0,ll-is)];
      });
      const totals=rows.reduce((a,r)=>['TOTAL',a[1]+r[1],a[2]+r[2],a[3]+r[3]],['TOTAL',0,0,0]);
      const headers=['TONER','LLEGADA','INSTALADOS','DISPONIBLES'];
      if(formato==='csv'){ downloadCSV([headers,...rows,totals],'Toner_Disponibles'); }
      else { exportPDF('Toner Disponibles',headers,[...rows,totals]); }
      toast('Informe de Toner Disponibles exportado');
    } catch(e){ toast('Error exportando toners','error'); }
    hideLoading();
    return;
  }

  const cfg=config[modulo];
  if(!cfg) return;
  const from=document.getElementById(cfg.fromId)?.value||'';
  const to  =document.getElementById(cfg.toId)?.value||'';
  showLoading();
  try {
    let query=sb.from(cfg.table).select('*').order(cfg.campoFecha,{ascending:true});
    if(from) query=query.gte(cfg.campoFecha,from);
    if(to)   query=query.lte(cfg.campoFecha,to);
    const { data } = await query;
    const rows=(data||[]).map(r=>cfg.campos.map(c=>r[c]||''));
    if(!rows.length){ toast('No hay datos en ese rango de fechas','error'); hideLoading(); return; }
    if(formato==='csv'){
      downloadCSV([cfg.headers,...rows],cfg.nombre);
      toast(`${rows.length} registros exportados a Excel`);
    } else {
      exportPDF(cfg.nombre.replace(/_/g,' '),cfg.headers,rows);
      toast(`${rows.length} registros exportados a PDF`);
    }
  } catch(e){ toast('Error exportando informe','error'); }
  hideLoading();
}

function exportPDF(titulo, headers, rows){
  const fechaHoy=new Date().toLocaleDateString('es-CO');
  const headerHTML=headers.map(h=>`<th>${h}</th>`).join('');
  const rowsHTML=rows.map(r=>`<tr>${r.map(c=>`<td>${c||'–'}</td>`).join('')}</tr>`).join('');
  const html=`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/><title>${titulo}</title>
<style>
  body{font-family:Arial,sans-serif;font-size:11px;color:#111;margin:20px;}
  h2{color:#b40000;font-size:16px;margin-bottom:4px;}
  .sub{color:#666;font-size:11px;margin-bottom:16px;}
  table{width:100%;border-collapse:collapse;font-size:10px;}
  th{background:#b40000;color:#fff;padding:6px 8px;text-align:left;font-size:10px;}
  td{padding:5px 8px;border-bottom:1px solid #eee;}
  tr:nth-child(even) td{background:#f9f9f9;}
  .footer{margin-top:16px;color:#aaa;font-size:10px;text-align:right;}
  @media print{body{margin:10px;}}
</style></head><body>
<h2>DATECSA – ${titulo}</h2>
<div class="sub">Generado: ${fechaHoy} | Sistema de Gestión de Servicios</div>
<table><thead><tr>${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>
<div class="footer">DATECSA – Más que Tecnología | Universidad Santiago de Cali</div>
<script>window.onload=()=>{window.print();}<\/script>
</body></html>`;
  const w=window.open('','_blank');
  w.document.write(html);
  w.document.close();
}

async function exportarTodoCSV(){
  await Promise.all(['tickets','entradas','instalados','ordenes','notif','toners'].map(m=>exportInforme(m,'csv')));
  toast('Todos los informes exportados');
}

// ─── EVIDENCIA FOTO ───
let _evidenciaBase64 = null;

function handleEvidenciaChange(input){
  const file = input.files[0];
  if(!file) return;
  procesarEvidencia(file);
}

function handleEvidenciaDrop(event){
  event.preventDefault();
  document.getElementById('evidencia-dropzone').style.borderColor = '#2a2a2a';
  const file = event.dataTransfer.files[0];
  if(!file || !file.type.startsWith('image/')) return;
  procesarEvidencia(file);
}

function procesarEvidencia(file){
  if(file.size > 2 * 1024 * 1024){
    toast('La imagen no debe superar 2MB', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e){
    _evidenciaBase64 = e.target.result;
    const preview     = document.getElementById('evidencia-preview');
    const previewWrap = document.getElementById('evidencia-preview-wrap');
    const placeholder = document.getElementById('evidencia-placeholder');
    if(preview)     preview.src = _evidenciaBase64;
    if(previewWrap) previewWrap.style.display = 'block';
    if(placeholder) placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function limpiarEvidencia(){
  _evidenciaBase64 = null;
  const input       = document.getElementById('ticket-evidencia-input');
  const preview     = document.getElementById('evidencia-preview');
  const previewWrap = document.getElementById('evidencia-preview-wrap');
  const placeholder = document.getElementById('evidencia-placeholder');
  if(input)       input.value = '';
  if(preview)     preview.src = '';
  if(previewWrap) previewWrap.style.display = 'none';
  if(placeholder) placeholder.style.display = 'block';
}

function cargarEvidenciaEnDropzone(base64){
  if(!base64){ limpiarEvidencia(); return; }
  _evidenciaBase64 = base64;
  const preview     = document.getElementById('evidencia-preview');
  const previewWrap = document.getElementById('evidencia-preview-wrap');
  const placeholder = document.getElementById('evidencia-placeholder');
  if(preview)     preview.src = base64;
  if(previewWrap) previewWrap.style.display = 'block';
  if(placeholder) placeholder.style.display = 'none';
}

// ─── AUTOCOMPLETADO DE EQUIPOS (delegación global) ───
let _acTimeout;

document.addEventListener('input', function(e){
  const id = e.target.id;
  if(id === 'ticket-serial'){
    clearTimeout(_acTimeout);
    _acTimeout = setTimeout(()=>autocompletarPorSerie(e.target.value, {
      modelo:    'ticket-modelo',
      ubicacion: 'ticket-ubicacion',
    }), 500);
  }
  if(id === 'instalado-serial'){
    clearTimeout(_acTimeout);
    _acTimeout = setTimeout(()=>autocompletarPorSerie(e.target.value, {
      modelo:    'instalado-equipo',
      ubicacion: 'instalado-area',
    }), 500);
  }
  if(id === 'orden-serial'){
    clearTimeout(_acTimeout);
    _acTimeout = setTimeout(()=>autocompletarPorSerie(e.target.value, {
      modelo:    'orden-modelo',
      ubicacion: 'orden-ubicacion',
      sede:      'orden-sede',
    }), 500);
  }
  if(id === 'entrada-serie'){
    clearTimeout(_acTimeout);
    _acTimeout = setTimeout(()=>autocompletarPorSerie(e.target.value, {
      modelo:    'entrada-modelo',
      ubicacion: 'entrada-area',
      sede:      'entrada-ubicacion',
    }), 500);
  }
  if(id === 'notif-impresora'){
    clearTimeout(_acTimeout);
    _acTimeout = setTimeout(()=>autocompletarNotif(e.target.value), 600);
  }
});

document.addEventListener('change', function(e){
  const id = e.target.id;
  if(id === 'entrada-referencia'){
    const wrap = document.getElementById('entrada-referencia-otro-wrap');
    if(wrap) wrap.style.display = e.target.value === 'OTRO' ? 'block' : 'none';
  }
  if(id === 'entrada-recibe'){
    const wrap = document.getElementById('entrada-recibe-otro-wrap');
    if(wrap) wrap.style.display = e.target.value === 'OTRO' ? 'block' : 'none';
  }
  if(id === 'instalado-toner'){
    const wrap = document.getElementById('instalado-toner-otro-wrap');
    if(wrap) wrap.style.display = e.target.value === 'OTRO' ? 'block' : 'none';
  }
  if(id === 'instalado-responsable'){
    const wrap = document.getElementById('instalado-responsable-otro-wrap');
    if(wrap) wrap.style.display = e.target.value === 'OTRO' ? 'block' : 'none';
  }
});

async function autocompletarNotif(serie){
  if(!serie || serie.trim().length < 3) return;
  const serieClean = serie.trim().toUpperCase();
  try {
    const {data: allData} = await sb.from('inventario_equipos').select('*');
    if(!allData || !allData.length) return;

    const match = allData.find(eq => {
      const serieBD = (eq.serie||'').trim().toUpperCase().replace(/\s+/g,'');
      const serieBuscada = serieClean.replace(/\s+/g,'');
      return serieBD.includes(serieBuscada) || serieBuscada.includes(serieBD);
    });

    if(match){
      const fm = document.getElementById('notif-modelo');
      if(fm && !fm.value) fm.value = match.modelo || '';

      const fu = document.getElementById('notif-ubicacion');
      if(fu && !fu.value){
        const sedeMap = {
          'PAMPALINDA':           'PAMPALINDA',
          'CENTRO':               'USC CENTRO',
          'USC CENTRO':           'USC CENTRO',
          'PALMIRA':              'USC PALMIRA',
          'USC PALMIRA':          'USC PALMIRA',
          'CLINICA VETERINARIA':  'CLÍNICA VETERINARIA',
          'CLÍNICA VETERINARIA':  'CLÍNICA VETERINARIA',
          'RESTAURANTE SAN CARLO':'RESTAURANTE SAN CARLO',
          'RESTAURANTE':          'RESTAURANTE SAN CARLO',
        };
        const sedeKey = (match.sede||'').toUpperCase().trim();
        fu.value = sedeMap[sedeKey] || match.sede || '';
      }

      const fa = document.getElementById('notif-area');
      if(fa && !fa.value) fa.value = match.ubicacion || '';

      toast(`✓ ${match.modelo} — ${match.sede} — ${match.ubicacion}`, 'success');
    }
  } catch(err){
    console.error('[AC Notif]', err);
  }
}

async function autocompletarPorSerie(serie, campos){
  if(!serie || serie.trim().length < 3) return;

  const serieClean = serie.trim().toUpperCase();
  console.log('[AC] Buscando serie limpia:', JSON.stringify(serieClean));

  try {
    const { data: allData, error } = await sb
      .from('inventario_equipos')
      .select('*');

    console.log('[AC] Total registros en tabla:', allData?.length, 'error:', error);

    if(error){ console.error('[AC] Error Supabase:', error); return; }

    if(!allData || allData.length === 0){
      console.log('[AC] Tabla vacía o sin acceso');
      return;
    }

    console.log('[AC] Muestra de serie en BD:', JSON.stringify(allData[0]?.serie));

    const match = allData.find(eq => {
      const serieBD      = (eq.serie || '').trim().toUpperCase().replace(/\s+/g,'');
      const serieBuscada = serieClean.replace(/\s+/g,'');
      return serieBD.includes(serieBuscada) || serieBuscada.includes(serieBD);
    });

    console.log('[AC] Match encontrado:', match);

    if(match){
      if(campos.modelo){
        const f = document.getElementById(campos.modelo);
        if(f) f.value = match.modelo || '';
      }
      if(campos.ubicacion){
        const f = document.getElementById(campos.ubicacion);
        if(f) f.value = match.ubicacion || '';
      }
      if(campos.sede){
        const f = document.getElementById(campos.sede);
        if(f) f.value = match.sede || '';
      }
      toast(`✓ ${match.modelo} - ${match.ubicacion}`, 'success');
    } else {
      console.log('[AC] Sin coincidencia para:', serieClean);
    }
  } catch(err){
    console.error('[AC] Excepción:', err);
  }
}

// ─── CONFIRM MODAL ───
let _confirmCallback = null;

function showConfirm({ titulo, mensaje, icono='<i data-lucide="trash-2"></i>', tipo='danger', textoSi='Sí, eliminar', textoNo='No, cancelar', callback }){
  document.getElementById('confirm-title').textContent = titulo  || '¿Confirmar acción?';
  document.getElementById('confirm-msg').innerHTML      = mensaje || '¿Deseas continuar?';
  const iconEl = document.getElementById('confirm-icon');
  if(icono && icono.toString().trim().startsWith('<')){
    iconEl.innerHTML = icono;
    iconEl.style.background = 'none';
    iconEl.style.width = 'auto';
    iconEl.style.height = 'auto';
  } else {
    iconEl.innerHTML = icono;
  }
  iconEl.className = `confirm-icon ${tipo}`;
  document.getElementById('confirm-btn-yes').textContent = textoSi;
  document.getElementById('confirm-btn-yes').className   = `confirm-btn-yes ${tipo}`;
  document.getElementById('confirm-btn-no').textContent  = textoNo;
  _confirmCallback = callback;
  document.getElementById('modal-confirm').classList.add('open');
  lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirm-btn-yes').addEventListener('click', () => {
    document.getElementById('modal-confirm').classList.remove('open');
    if(_confirmCallback) _confirmCallback(true);
    _confirmCallback = null;
  });
  document.getElementById('confirm-btn-no').addEventListener('click', () => {
    document.getElementById('modal-confirm').classList.remove('open');
    if(_confirmCallback) _confirmCallback(false);
    _confirmCallback = null;
  });
});

// ─── LOGOUT ───
function logout(){
  showConfirm({
    titulo:'¿Cerrar sesión?',
    mensaje:'Se cerrará tu sesión actual en el sistema DATECSA.',
    icono:'<i data-lucide="user"></i>', tipo:'warning',
    textoSi:'Sí, salir',
    textoNo:'No, quedarme',
    callback:(ok)=>{
      if(!ok) return;
      sessionStorage.clear();
      window.location.replace('../index.html');
    }
  });
}

// ─── USUARIOS ───
let _usuariosPage = 1;
const _usuariosPerPage = 50;
let _usuariosBusqueda = '';

async function renderUsuarios(){
  showLoading();
  try {
    const desde = (_usuariosPage - 1) * _usuariosPerPage;
    const hasta = desde + _usuariosPerPage - 1;

    let query = sb.from('usuarios').select('*', {count:'exact'});

    if(_usuariosBusqueda){
      query = query.or(
        `nombre.ilike.%${_usuariosBusqueda}%,usuario.ilike.%${_usuariosBusqueda}%,codigo.ilike.%${_usuariosBusqueda}%`
      );
    }

    const {data, error, count} = await query
      .order('nombre', {ascending:true})
      .range(desde, hasta);

    if(error) throw error;
    const all = data || [];
    const total = count || 0;

    document.getElementById('usuarios-count').textContent =
      `${total} usuarios${_usuariosBusqueda ? ' encontrados' : ' en total'}`;

    const container = document.getElementById('usuarios-table-container');

    if(!all.length){
      container.innerHTML = `<div class="empty-state">
        <i data-lucide="users"></i>
        <p>No se encontraron usuarios</p>
      </div>`;
      lucide.createIcons();
      return;
    }

    const totalPages = Math.ceil(total / _usuariosPerPage);
    const paginacion = totalPages > 1 ? `
      <div style="display:flex;justify-content:center;align-items:center;
                  gap:10px;padding:14px;border-top:1px solid #1e1e1e">
        <button class="btn-secondary"
                onclick="_usuariosPage=${_usuariosPage-1};renderUsuarios()"
                ${_usuariosPage<=1?'disabled style="opacity:.4"':''}>
          ← Anterior
        </button>
        <span style="font-size:12px;color:#666">
          Página ${_usuariosPage} de ${totalPages}
        </span>
        <button class="btn-secondary"
                onclick="_usuariosPage=${_usuariosPage+1};renderUsuarios()"
                ${_usuariosPage>=totalPages?'disabled style="opacity:.4"':''}>
          Siguiente →
        </button>
      </div>` : '';

    container.innerHTML = `
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <thead><tr>
          <th style="width:40%">NOMBRE DE USUARIO</th>
          <th style="width:25%">USUARIO</th>
          <th style="width:15%">CÓDIGO</th>
          <th style="width:20%">ACCIONES</th>
        </tr></thead>
        <tbody>
          ${all.map(u => `<tr>
            <td style="font-size:13px">${u.nombre||'–'}</td>
            <td style="font-size:12px;color:#888">${u.usuario||'–'}</td>
            <td>
              <span style="font-size:14px;font-weight:700;
                           color:#fff;letter-spacing:1px">
                ${u.codigo||'–'}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-edit" onclick="editUsuario(${u.id})">
                  <i data-lucide="pencil"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteUsuario(${u.id})">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${paginacion}`;

    lucide.createIcons();
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

async function buscarUsuarios(texto){
  _usuariosBusqueda = texto.trim();
  _usuariosPage = 1;

  if(_usuariosBusqueda.length >= 2){
    const {data} = await sb.from('usuarios').select('*')
      .or(`nombre.ilike.%${_usuariosBusqueda}%,usuario.ilike.%${_usuariosBusqueda}%,codigo.ilike.%${_usuariosBusqueda}%`)
      .order('nombre')
      .limit(5);

    const dest = document.getElementById('usuarios-resultado-destacado');
    if(data && data.length){
      dest.style.display = 'block';
      dest.innerHTML = `
        <div style="font-size:11px;color:#666;margin-bottom:10px;
                    text-transform:uppercase;letter-spacing:.5px">
          Coincidencias rápidas
        </div>
        ${data.map(u => `
          <div style="display:flex;align-items:center;justify-content:space-between;
                      padding:8px 0;border-bottom:1px solid #1e1e1e">
            <div>
              <div style="font-size:13px;font-weight:500;color:#fff">${u.nombre}</div>
              <div style="font-size:11px;color:#666">${u.usuario}</div>
            </div>
            <div style="font-size:18px;font-weight:700;color:#fff;
                        background:rgba(180,0,0,0.15);border:1px solid rgba(180,0,0,0.3);
                        padding:4px 12px;border-radius:6px;letter-spacing:2px">
              ${u.codigo}
            </div>
          </div>`).join('')}`;
    } else {
      dest.style.display = 'block';
      dest.innerHTML = `<div style="color:#666;font-size:13px;text-align:center">
        Sin resultados para "${_usuariosBusqueda}"</div>`;
    }
  } else {
    document.getElementById('usuarios-resultado-destacado').style.display = 'none';
  }

  await renderUsuarios();
}

function limpiarBusquedaUsuarios(){
  document.getElementById('usuarios-search').value = '';
  document.getElementById('usuarios-resultado-destacado').style.display = 'none';
  _usuariosBusqueda = '';
  _usuariosPage = 1;
  renderUsuarios();
}

function openNewUsuario(){
  document.getElementById('usuario-id').value = '';
  document.getElementById('usuario-nombre').value = '';
  document.getElementById('usuario-usuario').value = '';
  document.getElementById('usuario-codigo').value = '';
  const uField = document.getElementById('usuario-usuario');
  if(uField) uField.dataset.editado = '';
  document.getElementById('usuario-modal-title').textContent = 'Agregar Usuario';
  openModal('modal-usuario');
}

async function editUsuario(id){
  const {data} = await sb.from('usuarios').select('*').eq('id',id).single();
  if(!data) return;
  document.getElementById('usuario-id').value = data.id;
  document.getElementById('usuario-nombre').value = data.nombre || '';
  document.getElementById('usuario-usuario').value = data.usuario || '';
  document.getElementById('usuario-codigo').value = data.codigo || '';
  document.getElementById('usuario-modal-title').textContent = 'Editar Usuario';
  openModal('modal-usuario');
}

async function saveUsuario(){
  const id = parseInt(document.getElementById('usuario-id').value) || null;
  const nombre = document.getElementById('usuario-nombre').value.trim();
  const usuario = document.getElementById('usuario-usuario').value.trim();
  const codigo = document.getElementById('usuario-codigo').value.trim();

  if(!nombre){ toast('El nombre es requerido','error'); return; }
  if(!codigo){ toast('El código es requerido','error'); return; }

  const obj = { nombre, usuario, codigo };
  showLoading();
  try {
    if(id){
      const {error} = await sb.from('usuarios').update(obj).eq('id',id);
      if(error) throw error;
      toast('Usuario actualizado');
    } else {
      const {error} = await sb.from('usuarios').insert(obj);
      if(error) throw error;
      toast('Usuario agregado');
    }
    closeModal('modal-usuario');
    await renderUsuarios();
  } catch(e){ toast('Error: '+e.message,'error'); }
  finally { hideLoading(); }
}

async function deleteUsuario(id){
  const {data} = await sb.from('usuarios').select('nombre').eq('id',id).single();
  const nombreUsuario = data?.nombre || 'este usuario';

  showConfirm({
    titulo: '¿Eliminar usuario?',
    mensaje: `Se eliminará permanentemente a <strong style="color:#fff">${nombreUsuario}</strong>. Esta acción no se puede deshacer.`,
    icono: `<div style="
      width:64px;height:64px;border-radius:50%;
      background:linear-gradient(135deg,#7f1d1d,#991b1b);
      display:flex;align-items:center;justify-content:center;
      margin:0 auto 4px;
      box-shadow:0 4px 16px rgba(180,0,0,0.4)">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
           viewBox="0 0 24 24" fill="white">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2
                 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4
                 c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>`,
    tipo: 'danger',
    textoSi: 'Sí, eliminar',
    textoNo: 'Cancelar',
    callback: async(ok) => {
      if(!ok) return;
      showLoading();
      await sb.from('usuarios').delete().eq('id',id);
      hideLoading();
      await renderUsuarios();
      toast('Usuario eliminado','error');
    }
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initTheme();
  lucide.createIcons();

  const sidebar = document.getElementById('sidebar');

  let isDragging=false, dragStartY=0, dragScrollTop=0, didDrag=false;
  sidebar.addEventListener('mousedown', (e)=>{
    isDragging=true; didDrag=false;
    dragStartY=e.clientY; dragScrollTop=sidebar.scrollTop;
    sidebar.style.cursor='grabbing'; e.preventDefault();
  });
  document.addEventListener('mousemove', (e)=>{
    if(!isDragging) return;
    const delta=e.clientY-dragStartY;
    if(Math.abs(delta)>3) didDrag=true;
    sidebar.scrollTop=dragScrollTop-delta;
  });
  document.addEventListener('mouseup', (e)=>{
    if(!isDragging) return;
    isDragging=false; sidebar.style.cursor='';
    if(didDrag) e.stopPropagation();
  });

  let touchStartY=0, touchScrollStart=0, touchMoved=false;
  sidebar.addEventListener('touchstart', (e)=>{
    touchStartY=e.touches[0].clientY; touchScrollStart=sidebar.scrollTop; touchMoved=false;
  },{passive:true});
  sidebar.addEventListener('touchmove', (e)=>{
    const delta=touchStartY-e.touches[0].clientY;
    if(Math.abs(delta)>5) touchMoved=true;
    sidebar.scrollTop=touchScrollStart+delta;
  },{passive:true});
  sidebar.addEventListener('touchend', (e)=>{
    if(touchMoved) e.preventDefault();
  },{passive:false});

  sidebar.addEventListener('wheel', (e)=>{
    e.stopPropagation(); sidebar.scrollTop+=e.deltaY;
  },{passive:true});

  document.getElementById('topbar-user').textContent=sessionStorage.getItem('dtcUser')||'Admin';
  navigate('dashboard');
});
