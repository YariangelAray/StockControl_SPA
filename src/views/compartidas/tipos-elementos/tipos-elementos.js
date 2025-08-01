import { abrirModal, modales } from "../../../modals/modalsController"
import { configurarModalTipo } from "../../../modals/modalTipoElemento"
import { get } from "../../../utils/api"
import { llenarCamposFormulario } from "../../../utils/llenarCamposFormulario"

export const formatearTipo = (tipo) => {
    return [
        tipo.id,
        tipo.id,
        tipo.nombre,
        tipo.marca,
        tipo.modelo,
        tipo.detalles,
        tipo.cantidadElementos,
    ]
}

export const tipoClick = async (id) => {
    const { data } = await get('tipos-elementos/' + id)
    localStorage.setItem('tipo_temp', JSON.stringify(data));
    const form = modales.modalTipoElemento.querySelector('form');

    configurarModalTipo('editar', modales.modalTipoElemento);
    llenarCamposFormulario(data, form);
    abrirModal(modales.modalTipoElemento);
}

export const cargarTipos = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const inventario = JSON.parse(localStorage.getItem('inventario'));

    const respuesta = usuario.rol_id === 1 ? await get('tipos-elementos/') : await get('tipos-elementos/inventario/' + inventario.id);
    const tipos = [];

    if (respuesta.success) {
        for (const tipo of respuesta.data) {
            tipos.push(formatearTipo(tipo));
        }
    }
    return tipos;
}

export const actualizarStorageTipos = async () => {
    const nuevosTipos = await cargarTipos();
    localStorage.setItem('tipos', JSON.stringify({ tipos: nuevosTipos }));
}