(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const role = sessionStorage.getItem('mipv_role') || 'usuario';
  const name = sessionStorage.getItem('mipv_name') || 'Usuario';
  const path = location.pathname.replace(/\\/g,'/');
  const parts = path.split('/').filter(Boolean);
  const rootIndex = parts.length <= 2 && !['usuario','entrenador','administrador'].includes(parts[parts.length-2]);
  const folder = ['usuario','entrenador','administrador'].find(x => parts.includes(x));
  const roleKey = role === 'admin' ? 'administrador' : (role === 'Usuarios' ? 'usuario' : role);
  const base = folder ? '../' : '';
  const current = parts[parts.length-1] || 'index.html';
  const names = {usuario:'USUARIO',entrenador:'ENTRENADOR',administrador:'ADMINISTRADOR'};
  const nav = {
    usuario:[['index.html','⌂','Inicio'],['pagos.html','$','Realizar pagos'],['inscribirse.html','＋','Inscripciones'],['movimientos.html','▤','Mis movimientos'],['actividades.html','⚽','Actividades'],['calendario.html','▦','Calendario']],
    entrenador:[['index.html','⌂','Panel principal'],['inscriptos.html','♟','Usuarios inscriptos'],['calendario.html','▦','Calendario'],['pagos.html','$','Consultar pagos'],['asistencia.html','✓','Tomar asistencia'],['actividades.html','⚽','Actividades']],
    administrador:[['index.html','⌂','Panel principal'],['usuarios.html','♟','Usuarios'],['entrenadores.html','⚑','Entrenadores'],['actividades.html','⚽','Actividades'],['inscripciones.html','＋','Inscripciones'],['pagos.html','$','Pagos'],['estadisticas.html','▥','Estadísticas']]
  };
  if (folder) {
    if (!sessionStorage.getItem('mipv_role')) { location.href=base+'index.html'; return; }
    if (roleKey !== folder) { location.href=base+roleKey+'/index.html'; return; }
    const items=nav[folder];
    const navLinks=items.map(([href,ico,label])=>`<a class="side-link ${current===href?'active':''}" href="${href}"><span class="side-icon">${ico}</span><span class="side-text">${label}</span></a>`).join('');
    const topLinks=items.slice(0,4).map(([href,,label])=>`<a class="${current===href?'active':''}" href="${href}">${label}</a>`).join('');
    const shell=document.createElement('div');
    shell.innerHTML=`<header class="app-topbar"><button class="menu-toggle" id="menuToggle" aria-label="Abrir o cerrar menú">☰</button><a class="brand" href="index.html"><img src="${base}imagen/logo.jpeg" alt="Logo del club"><span><strong>MiPagoVirtual</strong><small>CLUB DEPORTIVO • GESTIÓN ONLINE</small></span></a><div class="top-links">${topLinks}</div><div class="top-search"><span>⌕</span><input id="globalSearch" type="search" placeholder="Buscar en el sistema..."></div><button class="icon-btn" id="themeToggle" title="Cambiar tema">☼</button><div class="profile-chip"><span class="role-dot"></span><span>${names[folder]}</span> · ${escapeHTML(name)}</div><button class="icon-btn" id="logoutBtn" title="Cerrar sesión">⇥</button></header><aside class="sidebar" id="sidebar"><div class="side-caption">Navegación principal</div><div class="role-label">● ROL: ${names[folder]}</div>${navLinks}<div class="side-separator"></div><div class="side-caption">Cuenta</div><a class="side-link" href="#" id="themeSide"><span class="side-icon">◐</span><span class="side-text">Modo claro / oscuro</span></a><a class="side-link" href="${base}index.html" id="sideLogout"><span class="side-icon">⇥</span><span class="side-text">Cerrar sesión</span></a></aside><div class="mobile-overlay" id="mobileOverlay"></div>`;
    document.body.prepend(shell);
    const main=$('main'); if(main){main.classList.add('app-main');main.id='appMain';}
    const sidebar=$('#sidebar'), overlay=$('#mobileOverlay');
    $('#menuToggle').addEventListener('click',()=>{if(innerWidth<=760){sidebar.classList.toggle('mobile-open');overlay.classList.toggle('show');}else document.body.classList.toggle('sidebar-collapsed');});
    overlay.addEventListener('click',()=>{sidebar.classList.remove('mobile-open');overlay.classList.remove('show');});
    const toggleTheme=()=>{document.body.classList.toggle('light');localStorage.setItem('mipv_theme',document.body.classList.contains('light')?'light':'dark');};
    if(localStorage.getItem('mipv_theme')==='light')document.body.classList.add('light');
    $('#themeToggle').addEventListener('click',toggleTheme);$('#themeSide').addEventListener('click',e=>{e.preventDefault();toggleTheme();});
    const logout=()=>{sessionStorage.removeItem('mipv_role');sessionStorage.removeItem('mipv_name');location.href=base+'index.html';};
    $('#logoutBtn').addEventListener('click',logout);$('#sideLogout').addEventListener('click',e=>{e.preventDefault();logout();});
    const search=$('#globalSearch');if(search)search.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=search.value.toLowerCase();const m=[...document.querySelectorAll('main h1,main h2,main h3,main a,main label,main td')].find(el=>el.textContent.toLowerCase().includes(q));if(m)m.scrollIntoView({behavior:'smooth',block:'center'});else alert('No se encontraron coincidencias en esta página.');}});
  } else if (current !== 'index.html' && current !== 'login.html' && current !== 'registro.html' && !sessionStorage.getItem('mipv_role')) { location.href='index.html'; }

  function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  const read=k=>JSON.parse(localStorage.getItem('mipv_'+k)||'[]');
  const write=(k,v)=>localStorage.setItem('mipv_'+k,JSON.stringify(v));
  const fmt=v=>Number(v||0).toLocaleString('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:2});
  const ins=read('inscripciones'), users=read('usuarios'), payments=read('pagos'), activities=read('actividades'), attendance=read('asistencias');
  // Legacy demo forms now save local records so the three panels can share them in this browser.
  document.querySelectorAll('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault(); const rolePage=folder||'usuario';
    if(form.querySelector('#categoria')){const item={nombre:$('#nombre',form)?.value.trim()||name,dni:$('#dni',form)?.value.trim()||'',actividad:$('#categoria',form)?.value||'',contacto:$('#contacto',form)?.value.trim()||'',fecha:new Date().toLocaleDateString('es-AR'),estado:'Pendiente'};const list=read('inscripciones');list.push(item);write('inscripciones',list);const us=read('usuarios');if(!us.some(x=>x.dni===item.dni))us.push({nombre:item.nombre,dni:item.dni,contacto:item.contacto,actividad:item.actividad,fecha:item.fecha});write('usuarios',us);alert('Inscripción guardada en esta demostración.');form.reset();}
    else if(form.querySelector('#concepto')){const item={nombre:name,concepto:$('#concepto',form).value,importe:$('#importe',form).value,medio:$('#metodo',form).value,fecha:new Date().toLocaleDateString('es-AR'),estado:'Pendiente'};const list=read('pagos');list.push(item);write('pagos',list);alert('Solicitud de pago registrada como pendiente. No se realizó ningún cobro real.');form.reset();}
    else alert('Formulario de demostración guardado.');
  }));
  const render=(id,html)=>{const el=document.getElementById(id);if(el)el.innerHTML=html;};
  // Trainer: registered users
  const tbodyIns=$('#tablaInscriptos');if(tbodyIns){const draw=()=>{const q=($('#buscarInscriptos')?.value||'').toLowerCase(), f=$('#filtroActividad')?.value||'';const rows=read('inscripciones').filter(x=>(!f||x.actividad===f)&&(!q||(`${x.nombre} ${x.dni}`).toLowerCase().includes(q)));render('tablaInscriptos',rows.length?rows.map(x=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.dni)}</td><td>${escapeHTML(x.actividad)}</td><td>${escapeHTML(x.contacto)}</td><td>${escapeHTML(x.fecha)}</td><td><span class="status">${escapeHTML(x.estado||'Pendiente')}</span></td></tr>`).join(''):'<tr><td colspan="6">No hay inscripciones que coincidan con la búsqueda.</td></tr>');};$('#buscarInscriptos')?.addEventListener('input',draw);$('#filtroActividad')?.addEventListener('change',draw);draw();}
  // Trainer: payment view
  if($('#tablaPagos')){const draw=()=>{const q=($('#buscarPago')?.value||'').toLowerCase(),f=$('#filtroPago')?.value||'';const rows=read('pagos').filter(x=>(!f||x.estado===f)&&(!q||x.nombre.toLowerCase().includes(q)));render('tablaPagos',rows.length?rows.map(x=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.concepto)}</td><td>${fmt(x.importe)}</td><td>${escapeHTML(x.fecha)}</td><td><span class="status">${escapeHTML(x.estado)}</span></td></tr>`).join(''):'<tr><td colspan="5">No hay pagos que coincidan con la búsqueda.</td></tr>');};$('#buscarPago')?.addEventListener('input',draw);$('#filtroPago')?.addEventListener('change',draw);draw();}
  // Attendance marking and persistence
  if($('#tablaAsistencia')){const date=$('#fechaAsistencia');if(date&&!date.value)date.value=new Date().toISOString().slice(0,10);let roster=[];const drawRoster=()=>{const act=$('#actividadAsistencia').value;roster=read('inscripciones').filter(x=>x.actividad===act||x.actividad.toLowerCase()===act.toLowerCase());render('tablaAsistencia',roster.length?roster.map((x,i)=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.actividad)}</td><td><select data-att="${i}"><option value="Presente">Presente</option><option value="Ausente">Ausente</option></select></td></tr>`).join(''):'<tr><td colspan="3">No hay jugadores inscriptos en esta actividad.</td></tr>');};$('#actividadAsistencia').addEventListener('change',drawRoster);drawRoster();$('#guardarAsistencia').addEventListener('click',()=>{const rows=[...document.querySelectorAll('[data-att]')];if(!rows.length){$('#mensajeAsistencia').textContent='No hay jugadores para registrar.';return;}const records=read('asistencias');rows.forEach(sel=>{const p=roster[Number(sel.dataset.att)];records.push({fecha:date.value,nombre:p.nombre,actividad:p.actividad,estado:sel.value});});write('asistencias',records);$('#mensajeAsistencia').textContent='Asistencia guardada en esta demostración.';drawHistory();});const drawHistory=()=>{const rows=read('asistencias').slice(-30).reverse();render('historialAsistencia',rows.length?rows.map(x=>`<tr><td>${escapeHTML(x.fecha)}</td><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.actividad)}</td><td><span class="status">${escapeHTML(x.estado)}</span></td></tr>`).join(''):'<tr><td colspan="4">Todavía no hay asistencias guardadas.</td></tr>');};drawHistory();}
  // Admin: data tables and actions
  if($('#tablaUsuarios')){const rows=read('usuarios');render('tablaUsuarios',rows.length?rows.map(x=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.dni)}</td><td>${escapeHTML(x.contacto||x.email||'—')}</td><td>${escapeHTML(x.actividad||'—')}</td><td>${escapeHTML(x.fecha||'—')}</td></tr>`).join(''):'<tr><td colspan="5">Todavía no hay usuarios registrados.</td></tr>');}
  if($('#tablaInscripcionesAdmin')){const draw=()=>{const rows=read('inscripciones');render('tablaInscripcionesAdmin',rows.length?rows.map((x,i)=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.dni)}</td><td>${escapeHTML(x.actividad)}</td><td>${escapeHTML(x.contacto)}</td><td>${escapeHTML(x.fecha)}</td><td><span class="status">${escapeHTML(x.estado||'Pendiente')}</span></td><td><button class="btn" data-ins="${i}" data-state="Aprobada">Aprobar</button> <button class="btn secondary" data-ins="${i}" data-state="Rechazada">Rechazar</button></td></tr>`).join(''):'<tr><td colspan="7">Todavía no hay solicitudes.</td></tr>');document.querySelectorAll('[data-ins]').forEach(b=>b.addEventListener('click',()=>{const a=read('inscripciones');a[Number(b.dataset.ins)].estado=b.dataset.state;write('inscripciones',a);draw();}));};draw();}
  const defaultActivities=[{nombre:'Fútbol Infantil',categoria:'Infantil',dias:'Lunes y miércoles',horario:'17:00 a 18:30',lugar:'Cancha principal'},{nombre:'Fútbol Juvenil',categoria:'Juvenil',dias:'Martes y jueves',horario:'18:30 a 20:00',lugar:'Cancha principal'}];
  if($('#tablaActividadesAdmin')){if(!localStorage.getItem('mipv_actividades'))write('actividades',defaultActivities);const draw=()=>{const rows=read('actividades');render('tablaActividadesAdmin',rows.map((x,i)=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.categoria)}</td><td>${escapeHTML(x.dias)}</td><td>${escapeHTML(x.horario)}</td><td>${escapeHTML(x.lugar)}</td><td><button class="btn secondary" data-del-activity="${i}">Eliminar</button></td></tr>`).join('')||'<tr><td colspan="6">No hay actividades cargadas.</td></tr>');document.querySelectorAll('[data-del-activity]').forEach(b=>b.addEventListener('click',()=>{if(confirm('¿Eliminar esta actividad?')){const a=read('actividades');a.splice(Number(b.dataset.delActivity),1);write('actividades',a);draw();}}));};draw();$('#formActividad').addEventListener('submit',e=>{e.preventDefault();const a=read('actividades');a.push({nombre:$('#nombreActividad').value.trim(),categoria:$('#categoriaActividad').value.trim(),dias:$('#diasActividad').value.trim(),horario:$('#horarioActividad').value.trim(),lugar:$('#lugarActividad').value.trim()});write('actividades',a);e.target.reset();draw();alert('Actividad agregada en esta demostración.');});}
  if($('#tablaPagosAdmin')){const draw=()=>{const rows=read('pagos');render('tablaPagosAdmin',rows.length?rows.map((x,i)=>`<tr><td>${escapeHTML(x.nombre)}</td><td>${escapeHTML(x.concepto)}</td><td>${fmt(x.importe)}</td><td>${escapeHTML(x.medio)}</td><td>${escapeHTML(x.fecha)}</td><td><span class="status">${escapeHTML(x.estado)}</span></td><td><select data-payment="${i}"><option ${x.estado==='Pendiente'?'selected':''}>Pendiente</option><option ${x.estado==='Pagado'?'selected':''}>Pagado</option><option ${x.estado==='Rechazado'?'selected':''}>Rechazado</option></select></td></tr>`).join(''):'<tr><td colspan="7">Todavía no hay pagos registrados.</td></tr>');document.querySelectorAll('[data-payment]').forEach(s=>s.addEventListener('change',()=>{const p=read('pagos');p[Number(s.dataset.payment)].estado=s.value;write('pagos',p);}));};draw();}
  const count=(key)=>read(key).length;
  [['adminUsuarios','usuarios'],['adminInscripciones','inscripciones'],['adminPagos','pagos'],['statUsuarios','usuarios'],['statInscripciones','inscripciones'],['statPagos','pagos'],['statAsistencias','asistencias'],['countInscriptos','inscripciones'],['countAsistencias','asistencias']].forEach(([id,k])=>{const e=$('#'+id);if(e)e.textContent=count(k);});
  const pending=read('pagos').filter(x=>x.estado==='Pendiente').length;if($('#countPendientes'))$('#countPendientes').textContent=pending;
  if($('#tablaEstadisticasPagos')){const p=read('pagos');render('tablaEstadisticasPagos',['Pendiente','Pagado','Rechazado'].map(s=>`<tr><td>${s}</td><td>${p.filter(x=>x.estado===s).length}</td></tr>`).join(''));}
  if($('#tablaEstadisticasInscripciones')){const p=read('inscripciones');render('tablaEstadisticasInscripciones',['Pendiente','Aprobada','Rechazada'].map(s=>`<tr><td>${s}</td><td>${p.filter(x=>(x.estado||'Pendiente')===s).length}</td></tr>`).join(''));}
})();




import { SUPABASE_URL, SUPABASE_ANON_KEY } from './api/supabase.js';

// Inicializa el cliente de Supabase (asegúrate de incluir el script CDN de Supabase en tu HTML)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verificarConexion() {
    try {
        // Intenta traer los datos de una tabla existente en tu Supabase
        const { data, error } = await supabase.from('usuarios').select('*');

        if (error) {
            console.error('❌ Error al conectar con Supabase:', error.message);
        } else {
            console.log('✅ ¡Conexión exitosa con Supabase! Datos obtenidos:', data);
        }
    } catch (err) {
        console.error('❌ Error inesperado:', err);
    }
}

// Ejecutar la prueba al cargar
verificarConexion();