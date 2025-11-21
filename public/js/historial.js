// =================== CONFIG ===================
window.API_URL = "https://iot-backend-production-4413.up.railway.app";

// Si TOKEN existe en localStorage, lo usamos
window.TOKEN = localStorage.getItem("token") || null;

// HEADERS_AUTH dinámico según token
window.HEADERS_AUTH = {
  "Authorization": `Bearer ${window.TOKEN}`,
  "Content-Type": "application/json"
};

// =================== FILTRAR HISTORIAL ===================
function filtrarHistorial() {
  const textoFiltro = document.getElementById('usuarioFiltro')?.value.toLowerCase() || '';
  const fechaFiltro = document.getElementById('fechaFiltro')?.value || '';
  const filas = document.querySelectorAll('#historial-table tbody tr');

  filas.forEach(fila => {
    const accion = fila.cells[1].innerText.toLowerCase();
    const metodo = fila.cells[2].innerText.toLowerCase();
    const endpoint = fila.cells[3].innerText.toLowerCase();
    const ip = fila.cells[4].innerText.toLowerCase();
    const userAgent = fila.cells[5].innerText.toLowerCase();
    const fechaFila = fila.cells[6].innerText.split("T")[0];

    const coincideTexto =
      textoFiltro === "" ||
      accion.includes(textoFiltro) ||
      metodo.includes(textoFiltro) ||
      endpoint.includes(textoFiltro) ||
      ip.includes(textoFiltro) ||
      userAgent.includes(textoFiltro);

    const coincideFecha = fechaFiltro === "" || fechaFiltro === fechaFila;

    fila.style.display = (coincideTexto && coincideFecha) ? "" : "none";
  });
}

// =================== FETCH API ===================
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${window.API_URL}${endpoint}`, {
      headers: { ...window.HEADERS_AUTH, ...(options.headers || {}) },
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
}

// =================== CARGAR USUARIOS ===================
async function cargarUsuarios() {
  try {
    const usuarios = await fetchAPI("/usuarios");
    const tbody = document.querySelector("#usuarios-table tbody");
    tbody.innerHTML = "";

    if (!usuarios.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay usuarios disponibles</td></tr>`;
      return;
    }

    usuarios.forEach(u => {
      const fila = document.createElement("tr");
      fila.dataset.usuarioId = u.id;
      fila.innerHTML = `
        <td>${u.id}</td>
        <td>${u.nombre || ''}</td>
        <td>${u.apellido || ''}</td>
        <td>${u.email || ''}</td>
        <td>
          <button class="btn-editar" onclick="mostrarEdicion(${u.id}, '${u.nombre?.replace(/'/g,"\\'")}', '${u.apellido?.replace(/'/g,"\\'")}', '${u.email?.replace(/'/g,"\\'")}')">Editar</button>
          <button class="btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

  } catch (err) {
    console.error("Error cargando usuarios:", err);
  }
}

// =================== MOSTRAR EDICION ===================
function mostrarEdicion(id, nombre, apellido, email) {
  const alertContainer = document.getElementById("alert-edicion");
  alertContainer.innerHTML = `
    <strong>Editar Usuario ID ${id}</strong><br><br>
    <label for="alert-nombre">Nombre:</label>
    <input type="text" id="alert-nombre" value="${nombre || ''}"><br>
    <label for="alert-apellido">Apellido:</label>
    <input type="text" id="alert-apellido" value="${apellido || ''}"><br>
    <label for="alert-email">Email:</label>
    <input type="text" id="alert-email" value="${email || ''}"><br><br>
    <button id="guardar-btn" class="btn-editar">Guardar</button>
    <button id="cancelar-btn" class="btn-eliminar">Cancelar</button>
  `;
  alertContainer.style.display = "block";

  document.getElementById("guardar-btn").onclick = () => guardarEdicion(id);
  document.getElementById("cancelar-btn").onclick = () => {
    alertContainer.style.display = "none";
    alertContainer.innerHTML = "";
  };
}

// =================== GUARDAR EDICION ===================
async function guardarEdicion(id) {
  const payload = {};
  const nombre = document.getElementById("alert-nombre").value.trim();
  const apellido = document.getElementById("alert-apellido").value.trim();
  const email = document.getElementById("alert-email").value.trim();

  if (nombre) payload.nombre = nombre;
  if (apellido) payload.apellido = apellido;
  if (email) payload.email = email;

  if (Object.keys(payload).length === 0) {
    alert("No hay cambios para guardar.");
    return;
  }

  try {
    await fetchAPI(`/usuarios/${id}`, {
      method: "PUT",
      body: payload
    });

    await cargarUsuarios();
    alert("Usuario actualizado correctamente");
    document.getElementById("alert-edicion").style.display = "none";
    document.getElementById("alert-edicion").innerHTML = "";
  } catch (err) {
    console.error("Error guardando edición:", err);
    alert("No se pudo actualizar el usuario");
  }
}

// =================== ELIMINAR USUARIO ===================
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

  try {
    await fetchAPI(`/usuarios/${id}`, { method: "DELETE" });
    alert("Usuario eliminado correctamente");
    cargarUsuarios();
  } catch (err) {
    console.error("Error eliminando usuario:", err);
    alert("No se pudo eliminar el usuario");
  }
}

// =================== CARGAR HISTORIAL ===================
async function cargarHistorial() {
  try {
    const datos = await fetchAPI("/historial");
    const tbody = document.querySelector("#historial-table tbody");
    tbody.innerHTML = "";

    datos.forEach(h => {
      const fila = document.createElement("tr");
      fila.dataset.historialId = h.id;
      fila.innerHTML = `
        <td>${h.id}</td>
        <td>${h.accion}</td>
        <td>${h.metodo}</td>
        <td>${h.endpoint}</td>
        <td>${h.ip}</td>
        <td>${h.user_agent}</td>
        <td>${h.fecha}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error cargando historial:", error);
  }
}

// =================== CERRAR SESION ===================
function cerrarSesion(event) {
  event.preventDefault();
  window.TOKEN = null;
  localStorage.removeItem("token");
  window.location.href = "/";
}

// =================== EXPONER FUNCIONES AL GLOBAL ===================
window.eliminarUsuario = eliminarUsuario;
window.mostrarEdicion = mostrarEdicion;
window.filtrarHistorial = filtrarHistorial;
window.cerrarSesion = cerrarSesion;

// =================== AUTO CARGA ===================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.TOKEN) {
    // No hay token, redirige al login
    window.location.href = "/";
    return;
  }
  cargarUsuarios();
  cargarHistorial();
});
