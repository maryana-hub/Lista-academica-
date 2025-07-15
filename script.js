let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let materias = JSON.parse(localStorage.getItem("materias")) || {};

function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  localStorage.setItem("materias", JSON.stringify(materias));
}

function agregarMateria() {
  const nombre = document.getElementById("nuevaMateria").value.trim();
  const creditos = parseInt(document.getElementById("creditosMateria").value);
  if (!nombre || !creditos) return;
  materias[nombre] = creditos;
  guardar();
  renderMaterias();
}

function eliminarMateria(nombre) {
  if (confirm(`¿Eliminar la materia "${nombre}"?`)) {
    delete materias[nombre];
    guardar();
    renderMaterias();
  }
}

function renderMaterias() {
  const lista = document.getElementById("listaMaterias");
  const select = document.getElementById("materia");
  lista.innerHTML = "";
  select.innerHTML = '<option value="">Selecciona una materia</option>';

  for (let mat in materias) {
    const li = document.createElement("li");
    li.textContent = `${mat} - ${materias[mat]} créditos`;
    li.innerHTML += ` <button onclick="eliminarMateria('${mat}')">🗑</button>`;
    lista.appendChild(li);

    const opt = document.createElement("option");
    opt.value = mat;
    opt.textContent = mat;
    select.appendChild(opt);
  }

  renderizar();
}

function agregarTarea() {
  const nombre = document.getElementById("nombreTarea").value.trim();
  const materia = document.getElementById("materia").value;
  const fecha = document.getElementById("fechaLimite").value;
  const nota = parseFloat(document.getElementById("nota").value) || null;
  if (!nombre || !materia) return;

  tareas.push({ nombre, materia, fecha, nota, realizada: false });
  guardar();
  renderizar();

  document.getElementById("nombreTarea").value = "";
  document.getElementById("fechaLimite").value = "";
  document.getElementById("nota").value = "";
}

function marcarRealizada(index) {
  tareas[index].realizada = !tareas[index].realizada;
  guardar();
  renderizar();
}

function filtrarTareas() {
  renderizar();
}

function renderizar() {
  const listaPendientes = document.getElementById("listaPendientes");
  const listaRealizadas = document.getElementById("listaRealizadas");
  const listaPromedios = document.getElementById("listaPromedios");
  const promedioGeneral = document.getElementById("promedioGeneral");

  listaPendientes.innerHTML = "";
  listaRealizadas.innerHTML = "";
  listaPromedios.innerHTML = "";
  promedioGeneral.textContent = "-";

  const buscar = document.getElementById("buscar").value.toLowerCase();
  const fechaFiltro = document.getElementById("filtrarFecha").value;

  const materiasNotas = {};

  tareas.forEach((tarea, index) => {
    if (buscar && !tarea.nombre.toLowerCase().includes(buscar)) return;
    if (fechaFiltro && tarea.fecha !== fechaFiltro) return;

    const li = document.createElement("li");
    li.textContent = `${tarea.nombre} - ${tarea.fecha || 'sin fecha'} - Nota: ${tarea.nota ?? '-'}`;
    const span = document.createElement("span");
    span.className = "materia";
    span.style.backgroundColor = getColorPastel(tarea.materia);
    span.textContent = tarea.materia;
    li.appendChild(span);
    li.onclick = () => marcarRealizada(index);
    li.className = tarea.realizada ? "realizada" : "";

    if (tarea.realizada) listaRealizadas.appendChild(li);
    else listaPendientes.appendChild(li);

    if (tarea.nota != null) {
      if (!materiasNotas[tarea.materia]) materiasNotas[tarea.materia] = [];
      materiasNotas[tarea.materia].push(tarea.nota);
    }
  });

  let totalPonderado = 0;
  let totalCreditos = 0;

  for (let mat in materiasNotas) {
    const notas = materiasNotas[mat];
    const promedio = (notas.reduce((a, b) => a + b, 0) / notas.length);
    const creditos = materias[mat] || 1;

    totalPonderado += promedio * creditos;
    totalCreditos += creditos;

    const li = document.createElement("li");
    li.textContent = `${mat}: ${promedio.toFixed(1)} (${creditos} créditos)`;
    listaPromedios.appendChild(li);
  }

  if (totalCreditos > 0) {
    promedioGeneral.textContent = (totalPonderado / totalCreditos).toFixed(2);
  }
}

function getColorPastel(nombre) {
  const colores = ["#ffd6e0", "#d0f4de", "#cdb4db", "#a0c4ff", "#ffdac1", "#e2f0cb"];
  let sum = 0;
  for (let i = 0; i < nombre.length; i++) sum += nombre.charCodeAt(i);
  return colores[sum % colores.length];
}

renderMaterias();
