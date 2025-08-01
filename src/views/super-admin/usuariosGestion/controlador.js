import { initComponentes } from "../../../helpers/initComponentes";
import { renderFilas } from "../../../helpers/renderFilas";
import { configurarModalUsuario, initModalUsuario } from "../../../modals/modalUsuario";
import { abrirModal, initModales, limpiarModales, modales } from "../../../modals/modalsController";
import { actualizarStorageUsuarios, usuarioClick, cargarUsuarios } from "./usuario";

export default async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    initComponentes(usuario);

    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}').usuarios || [];


    if (!usuarios || usuarios.length === 0) {
        const usuariosFormateados = await cargarUsuarios();
        localStorage.setItem('usuarios', JSON.stringify({ usuarios: usuariosFormateados }));
        usuarios = usuariosFormateados;
    }

    renderFilas(usuarios, usuarioClick);

    limpiarModales();
    await initModales(['modalUsuario']);
    const { modalUsuario } = modales;
    await initModalUsuario(modalUsuario)



    // Actualización en segundo plano
    await actualizarStorageUsuarios();
    document.getElementById('dashboard-usuarios').addEventListener('click', async (e) => {
        // Botón Agregar → AGREGAR
        if (e.target.closest('#crearUsuario')) {
            await configurarModalUsuario('crear', modalUsuario);
            abrirModal(modalUsuario);
        }
    });
    const search = document.querySelector('[type="search"]');
    search.addEventListener('input', (e) => {
        let usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}').usuarios || [];
        const valor = e.target.value.toLowerCase();
        const usuariosFiltrados = usuarios.filter(usuario => {
            for (const dato of usuario) {
                if (dato && dato.toString().toLowerCase().includes(valor)) return true;
            }
            return false;
        });
        renderFilas(usuariosFiltrados, usuarioClick);
    });
}