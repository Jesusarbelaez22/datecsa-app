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
  localStorage.setItem('dtc_tema', themeId);
}

function loadTheme(){
  applyTheme(localStorage.getItem('dtc_tema') || 'rojo');
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

// ─── MODAL ───
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.addEventListener('click', e=>{
  if(e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});

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
    const { data: tickets } = await sb.from('tickets').select('estado,tipo_solicitud,usuario,ubicacion,fecha_inicial').order('id', {ascending:false});
    const all = tickets||[];
    const abiertos = all.filter(t=>t.estado==='Abierto').length;
    const progreso  = all.filter(t=>t.estado==='En Progreso').length;
    const cerrados  = all.filter(t=>t.estado==='Cerrado').length;
    document.getElementById('dash-abiertos').textContent = abiertos;
    document.getElementById('dash-progreso').textContent = progreso;
    document.getElementById('dash-cerrados').textContent = cerrados;
    renderChart(abiertos, progreso, cerrados);
    const tbody = document.getElementById('dash-tickets-body');
    const recent = all.slice(0,5);
    tbody.innerHTML = recent.length ? recent.map(t=>`
      <tr>
        <td>${fmtDate(t.fecha_inicial)}</td>
        <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.tipo_solicitud||'–'}</td>
        <td>${t.usuario||'–'}</td>
        <td>${t.ubicacion||'–'}</td>
        <td><span class="badge ${badgeEstado(t.estado)}">${t.estado||'–'}</span></td>
      </tr>`).join('') : `<tr><td colspan="5" class="empty-state"><p>Sin tickets</p></td></tr>`;
  } catch(e){ toast('Error cargando dashboard','error'); }
  hideLoading();
}

// ─── TICKETS ───
let ticketFilter = {search:'', estado:'', prioridad:'', responsable:''};

async function renderTickets(){
  showLoading();
  try {
    const { data } = await sb.from('tickets').select('*').order('id', {ascending:false});
    let all = data||[];
    let filtered = all.filter(t=>{
      const s = ticketFilter.search.toLowerCase();
      const match = !s ||
        (t.usuario||'').toLowerCase().includes(s) ||
        (t.ubicacion||'').toLowerCase().includes(s) ||
        (t.tipo_solicitud||'').toLowerCase().includes(s) ||
        (t.observaciones||'').toLowerCase().includes(s);
      const est  = !ticketFilter.estado     || t.estado===ticketFilter.estado;
      const pri  = !ticketFilter.prioridad  || t.prioridad===ticketFilter.prioridad;
      const resp = !ticketFilter.responsable|| t.helpdesk===ticketFilter.responsable;
      return match && est && pri && resp;
    });
    const countEl = document.getElementById('count-tickets');
    if(countEl) countEl.textContent = filtered.length < all.length
      ? `Mostrando ${filtered.length} de ${all.length} registros`
      : `${all.length} registro${all.length!==1?'s':''}`;
    const tbody = document.getElementById('tickets-body');
    tbody.innerHTML = filtered.length ? filtered.map(t=>`
      <tr>
        <td><span class="badge ${badgeLlegada(t.llegada)}">${t.llegada||'–'}</span></td>
        <td>${t.modelo||'–'}</td>
        <td>${t.serial||'–'}</td>
        <td>${fmtDate(t.fecha_inicial)}</td>
        <td>${t.hora_inicio||'–'}</td>
        <td>${t.usuario||'–'}</td>
        <td>${t.ubicacion||'–'}</td>
        <td style="color:#fff;font-weight:700">${t.tipo_solicitud||'–'}</td>
        <td>${fmtDate(t.fecha_final)}</td>
        <td>${t.hora_fin||'–'}</td>
        <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(t.observaciones||'').replace(/"/g,'&quot;')}">${t.observaciones||'–'}</td>
        <td style="color:#fff">${t.helpdesk||'–'}</td>
        <td><span class="badge ${badgePrio(t.prioridad)}">${t.prioridad||'–'}</span></td>
        <td><span class="badge ${badgeEstado(t.estado)}">${t.estado||'–'}</span></td>
        <td><div class="action-btns"><button class="btn-edit" onclick="editTicket(${t.id})">✏ Editar</button><button class="btn-danger" onclick="deleteTicket(${t.id})">✕ Eliminar</button></div></td>
      </tr>`).join('') :
      `<tr><td colspan="15"><div class="empty-state"><div class="icon"><i data-lucide="ticket"></i></div><p>No hay tickets que coincidan</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando tickets','error'); }
  hideLoading();
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
  const hh=String(ahora.getHours()).padStart(2,'0');
  const mm=String(ahora.getMinutes()).padStart(2,'0');
  const horaField=document.getElementById('ticket-hora-inicio');
  if(horaField) horaField.value=`${hh}:${mm}`;
  const horaFinField=document.getElementById('ticket-hora-fin');
  if(horaFinField) horaFinField.value='';
  document.querySelector('#modal-ticket .modal-title').textContent='Nuevo Ticket / Caso';
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
    icono:'🎫', tipo:'danger',
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
    const [{ data: entradas }, { data: instalados }] = await Promise.all([
      sb.from('entradas_toner').select('referencia'),
      sb.from('toners_instalados').select('referencia'),
    ]);
    const ent = entradas||[];
    const ins = instalados||[];
    let tLlegada=0, tInst=0, tDisp=0;
    const rows = REFERENCIAS_FIJAS.map(ref => {
      const llegada    = ent.filter(e=>normRef(e.referencia)===normRef(ref)).length;
      const instalados2= ins.filter(i=>normRef(i.referencia)===normRef(ref)).length;
      const disp       = Math.max(0, llegada - instalados2);
      tLlegada+=llegada; tInst+=instalados2; tDisp+=disp;
      const dc = disp>0?'#44dd88':'#ff5555';
      return `<tr>
        <td style="color:#fff;font-weight:700">${ref}</td>
        <td style="color:#88aaff;text-align:center">${llegada}</td>
        <td style="color:#ffcc44;text-align:center">${instalados2}</td>
        <td style="color:${dc};text-align:center;font-weight:700">${disp}</td>
      </tr>`;
    }).join('');
    const container = document.getElementById('toners-summary');
    container.innerHTML = `<div class="toner-summary-wrap"><table>
      <thead><tr><th>TONER</th><th>LLEGADA</th><th>INSTALADOS</th><th>DISPONIBLES</th></tr></thead>
      <tbody>${rows}
        <tr class="summary-total">
          <td>TOTAL</td><td>${tLlegada}</td><td>${tInst}</td><td>${tDisp}</td>
        </tr>
      </tbody>
    </table></div>`;
  } catch(e){ toast('Error cargando toners','error'); }
  hideLoading();
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
      <td>${e.modelo||'–'}</td>
      <td>${e.serie||'–'}</td>
      <td><strong>${e.referencia||'–'}</strong></td>
      <td>${e.remision||'–'}</td>
      <td>${e.ubicacion||'–'}</td>
      <td>${e.area||'–'}</td>
      <td>${e.recibe||'–'}</td>
      <td>${e.os||'–'}</td>
      <td>${fmtDate(e.fecha)}</td>
      <td>${e.solicitud||'–'}</td>
      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(e.observacion||'').replace(/"/g,'&quot;')}">${e.observacion||'–'}</td>
      <td><div class="action-btns"><button class="btn-edit" onclick="editEntrada(${e.id})">✏ Editar</button><button class="btn-danger" onclick="deleteEntrada(${e.id})">✕ Eliminar</button></div></td>
    </tr>`).join(''):
    `<tr><td colspan="12"><div class="empty-state"><div class="icon"><i data-lucide="package"></i></div><p>Sin entradas registradas</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando entradas','error'); }
  hideLoading();
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
  document.getElementById('entrada-referencia').value=data.referencia||'';
  document.getElementById('entrada-remision').value=data.remision||'';
  document.getElementById('entrada-ubicacion').value=data.ubicacion||'';
  document.getElementById('entrada-area').value=data.area||'';
  document.getElementById('entrada-recibe').value=data.recibe||'';
  document.getElementById('entrada-os').value=data.os||'';
  document.getElementById('entrada-fecha').value=data.fecha||'';
  document.getElementById('entrada-solicitud').value=data.solicitud||'';
  document.getElementById('entrada-observacion').value=data.observacion||'';
  document.querySelector('#modal-entrada .modal-title').textContent='Editar Entrada de Toner';
  openModal('modal-entrada');
}

async function saveEntrada(){
  const id=parseInt(document.getElementById('entrada-id').value)||null;
  const modelo=document.getElementById('entrada-modelo').value.trim();
  const referencia=document.getElementById('entrada-referencia').value.trim();
  if(!modelo||!referencia){ toast('Complete los campos requeridos: MODELO y REFERENCIA','error'); return; }
  const obj={
    modelo,
    serie:       document.getElementById('entrada-serie').value.trim(),
    referencia,
    remision:    document.getElementById('entrada-remision').value.trim(),
    ubicacion:   document.getElementById('entrada-ubicacion').value.trim(),
    area:        document.getElementById('entrada-area').value.trim(),
    recibe:      document.getElementById('entrada-recibe').value.trim(),
    os:          document.getElementById('entrada-os').value.trim(),
    fecha:       document.getElementById('entrada-fecha').value||null,
    solicitud:   document.getElementById('entrada-solicitud').value.trim(),
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
    icono:'📦', tipo:'danger',
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
      <td>${i.equipo||'–'}</td>
      <td>${i.serial||'–'}</td>
      <td>${i.sede||'–'}</td>
      <td><strong>${i.referencia||'–'}</strong></td>
      <td>${i.contador||'–'}</td>
      <td>${fmtDate(i.fecha)}</td>
      <td>${i.tecnico||'–'}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(i.observacion||'').replace(/"/g,'&quot;')}">${i.observacion||'–'}</td>
      <td><div class="action-btns"><button class="btn-edit" onclick="editInstalado(${i.id})">✏ Editar</button><button class="btn-danger" onclick="deleteInstalado(${i.id})">✕ Eliminar</button></div></td>
    </tr>`).join(''):
    `<tr><td colspan="9"><div class="empty-state"><div class="icon"><i data-lucide="printer"></i></div><p>Sin instalaciones registradas</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando instalados','error'); }
  hideLoading();
}

function openNewInstalado(){
  const form = document.getElementById('instalado-form');
  if(form) form.reset();
  const idField = document.getElementById('instalado-id');
  if(idField) idField.value='';
  const fechaField = document.getElementById('instalado-fecha');
  if(fechaField) fechaField.value=today();
  const tecField = document.getElementById('instalado-tecnico');
  if(tecField) tecField.value='JESÚS ARBELAEZ';
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
  document.getElementById('instalado-referencia').value=data.referencia||'';
  document.getElementById('instalado-contador').value=data.contador||'';
  document.getElementById('instalado-fecha').value=data.fecha||'';
  document.getElementById('instalado-tecnico').value=data.tecnico||'';
  document.getElementById('instalado-observacion').value=data.observacion||'';
  document.querySelector('#modal-instalado .modal-title').textContent='Editar Toner Instalado';
  openModal('modal-instalado');
}

async function saveInstalado(){
  const id=parseInt(document.getElementById('instalado-id')?.value)||null;
  const equipo=document.getElementById('instalado-equipo')?.value.trim()||'';
  const referencia=document.getElementById('instalado-referencia')?.value.trim()||'';
  if(!equipo){ toast('El campo MODELO es requerido','error'); return; }
  if(!referencia){ toast('El campo TONER es requerido','error'); return; }
  const obj={
    equipo,
    serial:      document.getElementById('instalado-serial')?.value.trim()||'',
    sede:        document.getElementById('instalado-area')?.value.trim()||'',
    referencia,
    contador:    document.getElementById('instalado-contador')?.value.trim()||'',
    fecha:       document.getElementById('instalado-fecha')?.value||null,
    tecnico:     document.getElementById('instalado-tecnico')?.value.trim()||'',
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
    icono:'🖨', tipo:'danger',
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
    const tbody=document.getElementById('ordenes-body');
    tbody.innerHTML=all.length?all.map(o=>`<tr>
      <td>${o.modelo||'–'}</td>
      <td>${o.serial||'–'}</td>
      <td>${o.ubicacion||'–'}</td>
      <td><span class="badge ${badgeIncidente(o.incidente)}">${o.incidente||'–'}</span></td>
      <td>${fmtDate(o.fecha_solicitud)}</td>
      <td style="color:#ffcc44;font-weight:700">${o.os||'–'}</td>
      <td>${fmtDate(o.fecha_servicio)}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(o.trabajo||'').replace(/"/g,'&quot;')}">${o.trabajo||'–'}</td>
      <td>${o.sede||'–'}</td>
      <td style="color:#fff;font-weight:700">${o.responsable||'–'}</td>
      <td><div class="action-btns"><button class="btn-edit" onclick="editOrden(${o.id})">✏ Editar</button><button class="btn-danger" onclick="deleteOrden(${o.id})">✕ Eliminar</button></div></td>
    </tr>`).join(''):
    `<tr><td colspan="11"><div class="empty-state"><div class="icon"><i data-lucide="clipboard-list"></i></div><p>Sin órdenes de servicio</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando órdenes','error'); }
  hideLoading();
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
  const id=parseInt(document.getElementById('orden-id').value)||null;
  const modelo=document.getElementById('orden-modelo').value.trim();
  const serial=document.getElementById('orden-serial').value.trim();
  const os=document.getElementById('orden-os').value.trim();
  if(!modelo||!serial||!os){ toast('Complete los campos requeridos: MODELO, SERIAL y O.S','error'); return; }
  const incSel=document.getElementById('orden-incidente').value;
  const incOtro=document.getElementById('orden-incidente-otro')?.value.trim();
  const incidente=(incSel==='OTRO'&&incOtro)?incOtro:incSel;
  const respSel=document.getElementById('orden-responsable')?.value||'';
  const respOtro=document.getElementById('orden-helpdesk-otro')?.value.trim()||'';
  const responsable=(respSel==='OTRO'&&respOtro)?respOtro:respSel;
  const obj={
    modelo, serial,
    ubicacion:       document.getElementById('orden-ubicacion').value.trim(),
    incidente,
    fecha_solicitud: document.getElementById('orden-fechaSolicitud').value||null,
    os,
    fecha_servicio:  document.getElementById('orden-fechaServicio').value||null,
    trabajo:         document.getElementById('orden-trabajo').value.trim(),
    sede:            document.getElementById('orden-sede').value,
    responsable,
  };
  showLoading();
  try {
    if(id){ await sb.from('ordenes').update(obj).eq('id',id); }
    else   { await sb.from('ordenes').insert(obj); }
    closeModal('modal-orden');
    await renderOrdenes();
    toast(id?'Orden actualizada':'Orden creada');
  } catch(e){ toast('Error guardando orden','error'); }
  hideLoading();
}

function deleteOrden(id){
  showConfirm({
    titulo:'¿Eliminar orden de servicio?',
    mensaje:'Esta orden será eliminada permanentemente.',
    icono:'📋', tipo:'danger',
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
    const { data } = await sb.from('notificaciones').select('*').order('id', {ascending:false});
    const all = data||[];
    const unread = all.filter(n=>!n.leido).length;
    const countEl=document.getElementById('notif-count');
    if(countEl) countEl.textContent=unread>0?`${unread} sin leer`:'';
    const countRec=document.getElementById('count-notif');
    if(countRec) countRec.textContent=`${all.length} registro${all.length!==1?'s':''}`;
    const tbody=document.getElementById('notif-body');
    tbody.innerHTML=all.length?all.map(n=>`<tr style="${n.leido?'opacity:0.5':''}">
      <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${n.leido?'#444':'#b40000'}"></span></td>
      <td>${fmtDate(n.fecha)}</td>
      <td style="color:#fff">${n.impresora||'–'}</td>
      <td style="color:#ffcc44;font-weight:700">${n.os||'–'}</td>
      <td style="color:#888;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(n.observacion||'').replace(/"/g,'&quot;')}">${n.observacion||'–'}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="editNotif(${n.id})">✏ Editar</button>
        ${!n.leido?`<button class="btn-secondary" style="font-size:11px;padding:5px 10px;width:80px;height:30px" onclick="markRead(${n.id})">Leída</button>`:''}
        <button class="btn-danger" onclick="deleteNotif(${n.id})">✕ Eliminar</button>
      </div></td>
    </tr>`).join(''):
    `<tr><td colspan="6"><div class="empty-state"><div class="icon"><i data-lucide="bell"></i></div><p>Sin notificaciones</p></div></td></tr>`;
    lucide.createIcons();
  } catch(e){ toast('Error cargando notificaciones','error'); }
  hideLoading();
}

function openNewNotif(){
  document.getElementById('notif-form').reset();
  document.getElementById('notif-id').value='';
  document.getElementById('notif-fecha').value=today();
  document.querySelector('#modal-notif .modal-title').textContent='Nueva Notificación KFS';
  openModal('modal-notif');
}

async function editNotif(id){
  const { data, error } = await sb.from('notificaciones').select('*').eq('id',id).single();
  if(error||!data){ toast('Error cargando notificación','error'); return; }
  document.getElementById('notif-id').value=data.id;
  document.getElementById('notif-fecha').value=data.fecha||'';
  document.getElementById('notif-impresora').value=data.impresora||'';
  document.getElementById('notif-os').value=data.os||'';
  document.getElementById('notif-observacion').value=data.observacion||'';
  document.querySelector('#modal-notif .modal-title').textContent='Editar Notificación KFS';
  openModal('modal-notif');
}

async function saveNotif(){
  const id=parseInt(document.getElementById('notif-id').value)||null;
  const fecha=document.getElementById('notif-fecha').value;
  const impresora=document.getElementById('notif-impresora').value.trim();
  const os=document.getElementById('notif-os').value.trim();
  if(!fecha||!impresora||!os){ toast('Complete los campos requeridos: FECHA, IMPRESORA y O.S','error'); return; }
  const obj={
    fecha, impresora, os,
    observacion: document.getElementById('notif-observacion').value.trim(),
    leido: false,
  };
  showLoading();
  try {
    if(id){ await sb.from('notificaciones').update({...obj, leido:undefined}).eq('id',id); }
    else   { await sb.from('notificaciones').insert(obj); }
    closeModal('modal-notif');
    await renderNotificaciones();
    toast(id?'Notificación actualizada':'Notificación creada');
  } catch(e){ toast('Error guardando notificación','error'); }
  hideLoading();
}

async function markRead(id){
  try {
    await sb.from('notificaciones').update({leido:true}).eq('id',id);
    await renderNotificaciones();
  } catch(e){ toast('Error actualizando notificación','error'); }
}

async function markAllRead(){
  showLoading();
  try {
    await sb.from('notificaciones').update({leido:true}).eq('leido',false);
    await renderNotificaciones();
    toast('Todas marcadas como leídas');
  } catch(e){ toast('Error actualizando notificaciones','error'); }
  hideLoading();
}

function deleteNotif(id){
  showConfirm({
    titulo:'¿Eliminar notificación?',
    mensaje:'Esta notificación KFS será eliminada.',
    icono:'🔔', tipo:'danger',
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
    grid.innerHTML=THEMES.map(t=>`
      <div class="theme-card${currentTheme===t.id?' active':''}" onclick="applyTheme('${t.id}');renderConfiguracion()">
        <div class="theme-circle" style="background:${t.accent}">
          ${currentTheme===t.id?'<span class="theme-check">✓</span>':''}
        </div>
        <span class="theme-name">${t.name}</span>
      </div>`).join('');
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
  set('cliente-correo',   cfg.correo);
  set('cliente-extension',cfg.extension);
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
      headers:['FECHA NOTIF. KFS','IMPRESORA/SERIE','O.S DE APROB.','OBSERVACIONES'],
      campos:['fecha','impresora','os','observacion']
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

// ─── CONFIRM MODAL ───
let _confirmCallback = null;

function showConfirm({ titulo, mensaje, icono='🗑', tipo='danger', textoSi='Sí, eliminar', textoNo='No, cancelar', callback }){
  document.getElementById('confirm-title').textContent   = titulo   || '¿Confirmar acción?';
  document.getElementById('confirm-msg').textContent     = mensaje  || '¿Deseas continuar?';
  document.getElementById('confirm-icon').textContent    = icono;
  document.getElementById('confirm-icon').className      = `confirm-icon ${tipo}`;
  document.getElementById('confirm-btn-yes').textContent = textoSi;
  document.getElementById('confirm-btn-yes').className   = `confirm-btn-yes ${tipo}`;
  document.getElementById('confirm-btn-no').textContent  = textoNo;
  _confirmCallback = callback;
  document.getElementById('modal-confirm').classList.add('open');
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
    icono:'👤', tipo:'warning',
    textoSi:'Sí, salir',
    textoNo:'No, quedarme',
    callback:(ok)=>{
      if(!ok) return;
      sessionStorage.clear();
      window.location.replace('../index.html');
    }
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
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
