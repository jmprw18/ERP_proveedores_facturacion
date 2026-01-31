// Módulo de solicitud de requisiciones
// assets/js/modules/requisiciones.js

const RequisicionesModule = {
    init: (container) => {
        container.innerHTML = '';
        RequisicionesModule.renderLayout(container);
    },

    // tabs
    renderLayout: (container) => {
        container.innerHTML = `
            <div class="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto">
                <button id="tab-req-list" class="px-4 py-2 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 whitespace-nowrap">Requisiciones Creadas</button>
                <button id="tab-req-pending" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitar Requisición</button>
                <button id="tab-req-approved" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitudes Aprobadas</button>
                <button id="tab-req-rejected" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitudes Rechazadas</button>
            </div>
            <div id="req-content"></div>
        `;

        const tabList = container.querySelector('#tab-req-list');
        const tabPending = container.querySelector('#tab-req-pending');
        const tabApproved = container.querySelector('#tab-req-approved');
        const tabRejected = container.querySelector('#tab-req-rejected');
        const bodyValue = container.querySelector('#req-content');

        const setActiveTab = (btn) => {
            [tabList, tabPending, tabApproved, tabRejected].forEach(b => {
                b.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600');
                b.classList.add('text-slate-500');
            });
            btn.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');
            btn.classList.remove('text-slate-500');
        };

        tabList.addEventListener('click', () => {
            setActiveTab(tabList);
            RequisicionesModule.renderList(bodyValue, 'PENDIENTE');
        });
        tabPending.addEventListener('click', () => {
            setActiveTab(tabPending);
            RequisicionesModule.renderPending(bodyValue);
        });
        tabApproved.addEventListener('click', () => {
            setActiveTab(tabApproved);
            RequisicionesModule.renderList(bodyValue, 'APROBADA');
        });
        tabRejected.addEventListener('click', () => {
            setActiveTab(tabRejected);
            RequisicionesModule.renderList(bodyValue, 'RECHAZADA');
        });

        // Vista inicial
        setActiveTab(tabList);
        RequisicionesModule.renderList(bodyValue, 'PENDIENTE');
    },

    renderList: (container, filter = 'PENDIENTE') => {
        let requisitions = window.erpDB.getAll('requisiciones');

        if (filter !== 'TODAS') {
            requisitions = requisitions.filter(r => r.estado === filter);
        }

        // tab de lista de requisiciones
        container.innerHTML = `
             <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio</th>
                            <th class="px-6 py-4">Estimación</th>
                            <th class="px-6 py-4">Fecha</th>
                            <th class="px-6 py-4">Solicitante</th>
                            <th class="px-6 py-4 text-right">Total</th>
                            <th class="px-6 py-4 text-center">Estado</th>
                            <th class="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${requisitions.length === 0 ? `
                            <tr>
                                <td colspan="7" class="px-6 py-8 text-center text-slate-400 italic">
                                    No hay requisiciones ${filter.toLowerCase()}s.
                                </td>
                            </tr>
                        ` : requisitions.map(req => `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4 font-mono font-medium text-slate-700">${req.id}</td>
                                <td class="px-6 py-4 font-mono text-xs text-slate-500">${req.estimacion_id}</td>
                                <td class="px-6 py-4">${req.fecha}</td>
                                <td class="px-6 py-4">${req.solicitante}</td>
                                <td class="px-6 py-4 text-right font-medium">$${req.total.toFixed(2)} <span class="text-xs text-slate-500">${req.moneda || 'MXN'}</span></td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold 
                                        ${req.estado === 'APROBADA' ? 'bg-green-100 text-green-600' :
                req.estado === 'RECHAZADA' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'}">
                                        ${req.estado}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center gap-2">
                                        ${req.estado === 'PENDIENTE' ? `
                                            <button class="btn-approve-req bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg" data-id="${req.id}" title="Aprobar">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </button>
                                            <button class="btn-reject-req bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg" data-id="${req.id}" title="Rechazar">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        ` : '<span class="text-slate-300">-</span>'}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-approve-req').forEach(btn => {
            btn.addEventListener('click', () => RequisicionesModule.updateStatus(btn.dataset.id, 'APROBADA', container, filter));
        });

        container.querySelectorAll('.btn-reject-req').forEach(btn => {
            btn.addEventListener('click', () => RequisicionesModule.updateStatus(btn.dataset.id, 'RECHAZADA', container, filter));
        });
    },

    updateStatus: (id, newStatus, container, currentFilter) => {
        window.erpDB.update('requisiciones', id, { estado: newStatus });

        // Alerta de exito
        const alertMsg = document.createElement('div');
        alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${newStatus === 'APROBADA' ? 'bg-green-600' : 'bg-red-600'} transition-all z-[9999] animate-bounce`;
        alertMsg.innerHTML = `
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="${newStatus === 'APROBADA' ? 'm4.5 12.75 6 6 9-13.5' : 'M6 18 18 6M6 6l12 12'}" />
                </svg>
                <div class="flex flex-col">
                    <span class="font-bold">¡Éxito!</span>
                    <span class="text-xs">Requisición ${id} ha sido ${newStatus.toLowerCase()}a</span>
                </div>
            </div>`;
        document.body.appendChild(alertMsg);
        setTimeout(() => {
            alertMsg.classList.remove('animate-bounce');
            alertMsg.classList.add('opacity-0');
            setTimeout(() => alertMsg.remove(), 500);
        }, 3000);

        //  Redireccion a la pestaña
        const modal = container.closest('.modal-box') || document.querySelector('.modal-box');
        if (modal) {
            const targetTab = newStatus === 'APROBADA' ? 'tab-req-approved' : 'tab-req-rejected';
            const tabBtn = modal.querySelector(`#${targetTab}`);
            if (tabBtn) {
                tabBtn.click();
                return;
            }
        }

        RequisicionesModule.renderList(container, currentFilter);
    },

    renderPending: (container) => {
        const estimations = window.erpDB.getAll('estimaciones');
        const requisitions = window.erpDB.getAll('requisiciones');
        const processedIds = new Set(requisitions.map(r => r.estimacion_id));

        // Filtrar estimaciones aprobadas que no han sido procesadas
        const pending = estimations.filter(e => e.estado === 'APROBADA' && !processedIds.has(e.id));

        // Vista de lista de requisiciones pendientes
        container.innerHTML = `
             <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Estimación</th>
                            <th class="px-6 py-4">Fecha</th>
                            <th class="px-6 py-4">Solicitante</th>
                            <th class="px-6 py-4 text-right">Total</th>
                            <th class="px-6 py-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                         ${pending.length === 0 ? `
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-slate-400 italic">
                                    No hay estimaciones aprobadas pendientes.
                                </td>
                            </tr>
                        ` : pending.map(est => `
                            <tr>
                                <td class="px-6 py-4 font-mono font-medium text-slate-700">${est.id}</td>
                                <td class="px-6 py-4">${est.fecha}</td>
                                <td class="px-6 py-4">${est.solicitante}</td>
                                <td class="px-6 py-4 text-right font-medium">$${est.total.toFixed(2)} <span class="text-xs text-slate-500">${est.moneda || 'MXN'}</span></td>
                                <td class="px-6 py-4 text-center">
                                    <button class="btn-process-est px-3 py-1 bg-brand-100 text-brand-700 hover:bg-brand-200 rounded text-xs font-semibold" data-id="${est.id}">
                                        Generar REQ
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
             </div>
        `;

        container.querySelectorAll('.btn-process-est').forEach(btn => {
            btn.addEventListener('click', () => {
                const estId = btn.dataset.id;
                const est = estimations.find(e => e.id === estId);
                RequisicionesModule.renderForm(container, est);
            });
        });
    },

    //traer los datos de la estimacion
    renderForm: (container, est) => {
        const folio = window.erpDB.generateFolio('REQ');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const productCatalog = window.erpDB.getAll('products');

        const enrichedItems = est.items.map(item => {
            // Buscar el producto en el catalogo
            const match = productCatalog.find(p => p.nombre.toLowerCase() === item.producto.toLowerCase()) || {};
            return {
                ...item,
                sku: match.sku || '',
                clase: match.clase || '',
                grupo: match.grupo || '',
                tipo_de_producto: match.tipo_de_producto || '',
                unidad: match.unidad_medida || 'Pieza',
                observaciones: item.descripcion || '',
            };
        });

        // vista de formulario de requisicion
        container.innerHTML = `
            <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <button id="btn-back-pending" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                    <h3 class="text-xl font-bold text-slate-800">Nueva Requisición <span class="text-brand-600 font-mono ml-2">${folio}</span></h3>
                    <p class="text-xs text-slate-500">Basada en Estimación: <strong>${est.id}</strong></p>
                </div>
                <div class="ml-auto text-right text-xs text-slate-400">
                    <p>${dateStr}</p>
                </div>
            </div>

            <form id="form-req" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Solicitante (Origen)</label>
                        <input type="text" value="${est.solicitante}" readonly class="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Comprador Asignado</label>
                        <input type="text" name="comprador" required class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-brand-500 focus:outline-none" placeholder="Nombre del comprador...">
                    </div>
                </div>

                <!-- Products Table -->
                <div class="border rounded-xl overflow-hidden border-slate-200">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left whitespace-nowrap">
                            <thead class="bg-slate-100 text-slate-600 font-semibold text-xs uppercase">
                                <tr>
                                    <th class="px-4 py-3">SKU</th>
                                    <th class="px-4 py-3">Nombre</th>
                                    <th class="px-4 py-3">Clase</th>
                                    <th class="px-4 py-3">Grupo</th>
                                    <th class="px-4 py-3">Unidad</th> <!-- Fixed typo 'tiop' -> unidad, added others -->
                                    <th class="px-4 py-3 w-20 text-center">Cant.</th>
                                    <th class="px-4 py-3 text-right">Costo</th>
                                    <th class="px-4 py-3 text-right">Total</th>
                                    <th class="px-4 py-3">Obs.</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 bg-white">
                                ${enrichedItems.map((item, idx) => `
                                    <tr>
                                        <td class="px-4 py-2">
                                            <input type="text" name="sku_${idx}" value="${item.sku}" class="w-20 bg-transparent border-b border-transparent focus:border-brand-500 text-xs font-mono text-slate-700">
                                        </td>
                                        <td class="px-4 py-2">
                                            <input type="text" name="nombre_${idx}" value="${item.producto}" class="w-32 bg-transparent border-b border-transparent focus:border-brand-500 text-xs text-slate-700">
                                        </td>
                                        <td class="px-4 py-2">
                                            <input type="text" name="clase_${idx}" value="${item.clase}" class="w-20 bg-transparent border-b border-transparent focus:border-brand-500 text-xs text-slate-700">
                                        </td>
                                        <td class="px-4 py-2">
                                            <input type="text" name="grupo_${idx}" value="${item.grupo}" class="w-20 bg-transparent border-b border-transparent focus:border-brand-500 text-xs text-slate-700">
                                        </td>
                                        <td class="px-4 py-2">
                                            <input type="text" name="unidad_${idx}" value="${item.unidad}" class="w-16 bg-transparent border-b border-transparent focus:border-brand-500 text-xs text-slate-700">
                                        </td>
                                        <td class="px-4 py-2 text-center text-slate-700 font-medium">${item.cantidad}</td>
                                        <td class="px-4 py-2 text-right text-slate-700">$${item.precio.toFixed(2)}</td>
                                        <td class="px-4 py-2 text-right font-medium text-slate-800">$${item.total.toFixed(2)}</td>
                                        <td class="px-4 py-2">
                                            <input type="text" name="obs_${idx}" value="${item.observaciones}" class="w-32 bg-transparent border-b border-transparent focus:border-brand-500 text-xs text-slate-500 italic">
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex justify-end">
                     <div class="text-right space-y-1 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p class="text-slate-500">Subtotal: <span class="font-medium text-slate-700">$${est.subtotal.toFixed(2)} ${est.moneda || 'MXN'}</span></p>
                         <p class="text-slate-500">IVA (16%): <span class="font-medium text-slate-700">$${est.iva.toFixed(2)} ${est.moneda || 'MXN'}</span></p>
                         <p class="text-lg font-bold text-slate-800 border-t border-slate-200 mt-2 pt-2">Total: $${est.total.toFixed(2)} ${est.moneda || 'MXN'}</p>
                     </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" class="px-6 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 transition-colors text-sm font-bold">
                        <i class="fa-solid fa-paper-plane mr-2"></i>Solicitar Requisición
                    </button>
                </div>
            </form>
        `;

        document.getElementById('btn-back-pending').addEventListener('click', () => RequisicionesModule.renderLayout(container));

        document.getElementById('form-req').addEventListener('submit', (e) => {
            e.preventDefault();
            //crear registro de requisicion
            const formData = new FormData(e.target);
            const finalItems = enrichedItems.map((item, idx) => {
                const row = e.target.querySelector(`input[name="sku_${idx}"]`).closest('tr');
                return {
                    ...item,
                    sku: row.querySelector(`input[name="sku_${idx}"]`).value,
                    nombre: row.querySelector(`input[name="nombre_${idx}"]`).value,
                    clase: row.querySelector(`input[name="clase_${idx}"]`).value,
                    grupo: row.querySelector(`input[name="grupo_${idx}"]`).value,
                    unidad: row.querySelector(`input[name="unidad_${idx}"]`).value,
                    observaciones: row.querySelector(`input[name="obs_${idx}"]`).value
                };
            });

            const newReq = {
                id: folio,
                estimacion_id: est.id,
                fecha: dateStr,
                solicitante: est.solicitante,
                comprador: formData.get('comprador'),
                items: finalItems,
                moneda: est.moneda || 'MXN',
                subtotal: est.subtotal,
                iva: est.iva,
                total: est.total,
                estado: 'PENDIENTE'
            };

            window.erpDB.add('requisiciones', newReq);

            // notificacion de requisicion
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-green-600 transition-all z-[9999]`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-circle-check"></i> Requisición Solicitada Correctamente (Estatus: PENDIENTE)</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 3000);

            RequisicionesModule.renderLayout(container);
        });


    }
};
