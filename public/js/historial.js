// =================== CONFIG ===================
window.API_URL = window.API_URL || "http://localhost:8000";
window.TOKEN = window.TOKEN || localStorage.getItem("token");

console.log("🌐 API URL:", window.API_URL);
console.log("🔐 TOKEN:", window.TOKEN);

// =================== HEADERS ===================
function getHeaders() {
  return {
    "Authorization": `Bearer ${window.TOKEN}`
  };
}

// =================== FETCH API ===================
async function fetchAPI(endpoint, options = {}) {
  try {
    const headers = { ...getHeaders(), ...(options.headers || {}) };

    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${window.API_URL}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body
        ? isFormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined
    });

    const data = await res.json();

    console.log("📡 RESPUESTA API:", endpoint, data);

    if (!res.ok) throw new Error(data.detail || "Error en API");

    return data;
  } catch (error) {
    console.error("❌ Error fetchAPI:", error);
    throw error;
  }
}

// =================== VALIDAR TOKEN ===================
async function validarToken() {
  try {
    await fetchAPI("/usuarios");
    return true;
  } catch {
    return false;
  }
}

// =================== CARGAR USUARIOS ===================
async function cargarUsuarios() {
  console.log("📥 Cargando usuarios...");

  try {
    const usuarios = await fetchAPI("/usuarios");
    const tbody = document.querySelector("#usuarios-table tbody");
    tbody.innerHTML = "";

    if (!usuarios.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="sin-datos">No hay usuarios disponibles</td></tr>`;
      return;
    }

    usuarios.forEach(u => {

      let imagen = u.imagen || "default.png";
      imagen = imagen.replace(/^usuarios\//, "");

      const imagenUrl = `${window.API_URL}/imagenes/usuarios/${imagen}`;

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td class="col-foto">
          <img src="${imagenUrl}"
               onerror="this.src='${window.API_URL}/imagenes/usuarios/default.png'"
               class="foto-usuario">
        </td>
        <td>${u.id}</td>
        <td>${u.nombre || ''}</td>
        <td>${u.apellido || ''}</td>
        <td>${u.email || ''}</td>
        <td>
          <button class="btn-editar" onclick="mostrarEdicion(${u.id}, '${escapeString(u.nombre)}', '${escapeString(u.apellido)}', '${escapeString(u.email)}')">Editar</button>
          <button class="btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
        </td>
      `;

      tbody.appendChild(fila);
    });

  } catch (err) {
    alert("Error al cargar usuarios");
    console.error(err);
  }
}

// =================== MOSTRAR MODAL ===================
function mostrarEdicion(id, nombre, apellido, email) {
  console.log("✏️ Editar usuario:", id);

  document.getElementById("edit-id").value = id;
  document.getElementById("edit-nombre").value = nombre || "";
  document.getElementById("edit-apellido").value = apellido || "";
  document.getElementById("edit-email").value = email || "";

  document.getElementById("modal-editar").style.display = "flex";
}

// =================== CERRAR MODAL ===================
function cerrarModal() {
  document.getElementById("modal-editar").style.display = "none";
}

// =================== GUARDAR EDICION ===================
async function guardarEdicion() {
  const id = document.getElementById("edit-id").value;
  const nombre = document.getElementById("edit-nombre").value;
  const apellido = document.getElementById("edit-apellido").value;
  const email = document.getElementById("edit-email").value;

  console.log("💾 Guardando cambios usuario:", id);

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("apellido", apellido);
  formData.append("email", email);

  try {
    const res = await fetchAPI(`/usuarios/${id}`, {
      method: "PUT",
      body: formData
    });

    console.log("✅ Usuario editado:", res);
    alert("Usuario actualizado correctamente");

    cerrarModal();
    cargarUsuarios();

  } catch (err) {
    console.error("❌ Error editando:", err);
    alert("No se pudo editar el usuario");
  }
}

// =================== ELIMINAR ===================
async function eliminarUsuario(id) {
  if (!confirm("¿Eliminar usuario?")) return;

  console.log("🗑 Eliminando usuario:", id);

  try {
    await fetchAPI(`/usuarios/${id}`, { method: "DELETE" });
    alert("Usuario eliminado");
    cargarUsuarios();
  } catch (err) {
    console.error("❌ Error eliminar:", err);
  }
}

// =================== UTIL ===================
function escapeString(text) {
  if (!text) return "";
  return text.replace(/'/g, "\\'");
}

// =================== INICIAL ===================
document.addEventListener("DOMContentLoaded", async () => {
  const valido = await validarToken();
  if (!valido) {
    alert("Sesión inválida");
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }
  cargarUsuarios();
});

// =================== EXPONER ===================
window.mostrarEdicion = mostrarEdicion;
window.eliminarUsuario = eliminarUsuario;
window.guardarEdicion = guardarEdicion;
window.cerrarModal = cerrarModal;
