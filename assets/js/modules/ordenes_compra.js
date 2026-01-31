// Módulo de órdenes de compra
// assets/js/modules/ordenes_compra.js

const OrdenesCompraModule = {
    init: (container) => {
        container.innerHTML = '';
        OrdenesCompraModule.renderLayout(container);
    },

    renderLayout: (container) => {
        container.innerHTML = `
            <div class="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto">
                <button id="tab-oc-list" class="px-4 py-2 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 whitespace-nowrap">Órdenes de Compra</button>
                <button id="tab-oc-pending" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitar Orden de Compra</button>
                <button id="tab-oc-approved" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitudes Aprobadas</button>
                <button id="tab-oc-rejected" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitudes Rechazadas</button>
            </div>
            <div id="oc-content"></div>
        `;

        const tabList = container.querySelector('#tab-oc-list');
        const tabPending = container.querySelector('#tab-oc-pending');
        const tabApproved = container.querySelector('#tab-oc-approved');
        const tabRejected = container.querySelector('#tab-oc-rejected');
        const body = container.querySelector('#oc-content');

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
            OrdenesCompraModule.renderList(body, 'PENDIENTE');
        });
        tabPending.addEventListener('click', () => {
            setActiveTab(tabPending);
            OrdenesCompraModule.renderPending(body);
        });
        tabApproved.addEventListener('click', () => {
            setActiveTab(tabApproved);
            OrdenesCompraModule.renderList(body, 'APROBADA');
        });
        tabRejected.addEventListener('click', () => {
            setActiveTab(tabRejected);
            OrdenesCompraModule.renderList(body, 'RECHAZADA');
        });

        // Vista inicial del modall
        setActiveTab(tabList);
        OrdenesCompraModule.renderList(body, 'PENDIENTE');
    },

    renderList: (container, filter = 'TODAS') => {
        let ocs = window.erpDB.getAll('ordenes_compra');

        if (filter !== 'TODAS') {
            ocs = ocs.filter(oc => oc.estado === filter);
        }

        // Vista de la lista de ordenes de compra
        container.innerHTML = `
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio OC#</th>
                            <th class="px-6 py-4">Fecha</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4">Entrega</th>
                            <th class="px-6 py-4 text-right">Total</th>
                            <th class="px-6 py-4 text-center">Estado</th>
                            <th class="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${ocs.length === 0 ? `
                            <tr>
                                <td colspan="7" class="px-6 py-8 text-center text-slate-400 italic">
                                    No hay órdenes de compra registradas.
                                </td>
                            </tr>
                        ` : ocs.map(oc => `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4 font-mono font-medium text-slate-700">${oc.id}</td>
                                <td class="px-6 py-4 text-slate-500">${oc.fecha}</td>
                                <td class="px-6 py-4">${oc.proveedor}</td>
                                <td class="px-6 py-4">${oc.fecha_entrega}</td>
                                <td class="px-6 py-4 text-right font-medium">$${oc.total.toFixed(2)} <span class="text-xs text-slate-500">${oc.moneda || 'MXN'}</span></td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold 
                                        ${oc.estado === 'APROBADA' ? 'bg-green-100 text-green-600' :
                oc.estado === 'RECHAZADA' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'}">
                                        ${oc.estado}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center gap-2">
                                        ${oc.estado === 'PENDIENTE' ? `
                                            <button class="btn-approve-oc bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg" data-id="${oc.id}" title="Aprobar">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </button>
                                            <button class="btn-reject-oc bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg" data-id="${oc.id}" title="Rechazar">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        ` : ''}
                                        <button class="btn-print-oc bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center" data-id="${oc.id}" title="Imprimir">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-print-oc').forEach(btn => {
            btn.addEventListener('click', () => OrdenesCompraModule.printOC(btn.dataset.id));
        });

        container.querySelectorAll('.btn-approve-oc').forEach(btn => {
            btn.addEventListener('click', () => OrdenesCompraModule.updateStatus(btn.dataset.id, 'APROBADA', container, filter));
        });

        container.querySelectorAll('.btn-reject-oc').forEach(btn => {
            btn.addEventListener('click', () => OrdenesCompraModule.updateStatus(btn.dataset.id, 'RECHAZADA', container, filter));
        });
    },

    updateStatus: (ocId, newStatus, container, currentFilter) => {
        window.erpDB.update('ordenes_compra', ocId, { estado: newStatus });

        // Mensajes de estatus 'aprobada' o 'rechazada'
        const alert = document.createElement('div');
        alert.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${newStatus === 'APROBADA' ? 'bg-green-600' : 'bg-red-600'} transition-all z-[9999] animate-bounce`;
        alert.innerHTML = `
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="${newStatus === 'APROBADA' ? 'm4.5 12.75 6 6 9-13.5' : 'M6 18 18 6M6 6l12 12'}" />
                </svg>
                <div class="flex flex-col">
                    <span class="font-bold">¡Éxito!</span>
                    <span class="text-xs">Orden de Compra ${ocId} ha sido ${newStatus.toLowerCase()}a</span>
                </div>
            </div>`;
        document.body.appendChild(alert);
        setTimeout(() => {
            alert.classList.remove('animate-bounce');
            alert.classList.add('opacity-0');
            setTimeout(() => alert.remove(), 500);
        }, 3000);

        // Auto-redirect to the specific tab
        const modal = container.closest('.modal-box') || document.querySelector('.modal-box');
        if (modal) {
            const targetTabId = newStatus === 'APROBADA' ? 'tab-oc-approved' : 'tab-oc-rejected';
            const tabBtn = modal.querySelector(`#${targetTabId}`);
            if (tabBtn) {
                tabBtn.click();
                return;
            }
        }

        OrdenesCompraModule.renderList(container, currentFilter);
    },

    renderPending: (container) => {
        const requisitions = window.erpDB.getAll('requisiciones');
        const ocs = window.erpDB.getAll('ordenes_compra');
        const processedIds = new Set(ocs.map(o => o.requisicion_id));

        // filtro de requisiciones aprobadas que no esten en una oc
        const pending = requisitions.filter(r => r.estado === 'APROBADA' && !processedIds.has(r.id));

        container.innerHTML = `
             <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Requisición</th>
                            <th class="px-6 py-4">Fecha</th>
                            <th class="px-6 py-4">Comprador</th>
                            <th class="px-6 py-4 text-right">Total</th>
                            <th class="px-6 py-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                         ${pending.length === 0 ? `
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-slate-400 italic">
                                    No hay requisiciones aprobadas pendientes.
                                </td>
                            </tr>
                        ` : pending.map(req => `
                            <tr>
                                <td class="px-6 py-4 font-mono font-medium text-slate-700">${req.id}</td>
                                <td class="px-6 py-4">${req.fecha}</td>
                                <td class="px-6 py-4">${req.comprador}</td>
                                <td class="px-6 py-4 text-right font-medium">$${req.total.toFixed(2)} <span class="text-xs text-slate-500">${req.moneda || 'MXN'}</span></td>
                                <td class="px-6 py-4 text-center">
                                    <button class="btn-process-req px-3 py-1 bg-brand-100 text-brand-700 hover:bg-brand-200 rounded text-xs font-semibold" data-id="${req.id}">
                                        Generar OC
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
             </div>
        `;

        container.querySelectorAll('.btn-process-req').forEach(btn => {
            btn.addEventListener('click', () => {
                const reqId = btn.dataset.id;
                const req = requisitions.find(r => r.id === reqId);
                OrdenesCompraModule.renderForm(container, req);
            });
        });
    },

    renderForm: (container, req) => {
        const folio = window.erpDB.generateFolio('OC');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const providers = window.erpDB.getAll('providers');

        // Vista del formulario de nueva orden de compra
        container.innerHTML = `
            <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <button id="btn-back-pending-oc" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                    <h3 class="text-xl font-bold text-slate-800">Nueva Orden de Compra <span class="text-brand-600 font-mono ml-2">${folio}</span></h3>
                    <p class="text-xs text-slate-500">Basada en Requisición: <strong>${req.id}</strong></p>
                </div>
                <div class="ml-auto text-right text-xs text-slate-400">
                    <p>${dateStr}</p>
                </div>
            </div>

            <form id="form-oc" class="space-y-6">
                <!-- Header Fields -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Proveedor</label>
                        <select name="proveedor" required class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-brand-500 focus:outline-none">
                            <option value="">Seleccione un proveedor...</option>
                            ${providers.map(p => `<option value="${p.nombre}">${p.nombre} (${p.rfc})</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Comprador</label>
                        <input type="text" name="comprador" value="${req.comprador}" required class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Estatus</label>
                        <input type="text" value="PENDIENTE" readonly class="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Moneda</label>
                        <select id="oc-moneda" name="moneda" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800">
                            <option value="MXN" ${req.moneda === 'MXN' ? 'selected' : ''}>Pesos (MXN)</option>
                            <option value="USD" ${req.moneda === 'USD' ? 'selected' : ''}>Dólares (USD)</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Tipo de Cambio</label>
                        <input type="number" id="oc-tc" name="tipo_cambio" step="0.0001" value="1.0000" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Fecha de Entrega</label>
                        <input type="date" name="fecha_entrega" required class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Tolerancia Cant. Adic. (%)</label>
                        <input type="number" name="tolerancia" value="0" min="0" max="100" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800">
                    </div>
                </div>

                <!-- Products Table -->
                <div class="border rounded-xl overflow-hidden border-slate-200">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left whitespace-nowrap">
                            <thead class="bg-slate-200 text-black font-bold text-xs uppercase">
                                <tr>
                                    <th class="px-4 py-3">SKU</th>
                                    <th class="px-4 py-3">Nombre</th>
                                    <th class="px-4 py-3">Clase</th>
                                    <th class="px-4 py-3">Grupo</th>
                                    <th class="px-4 py-3">Unidad</th>
                                    <th class="px-4 py-3 w-16 text-center">Cant.</th>
                                    <th class="px-4 py-3 text-right">Precio</th>
                                    <th class="px-4 py-3 text-right">Total</th>
                                    <th class="px-4 py-3">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody id="oc-items-body" class="divide-y divide-slate-100 bg-white text-black">
                                ${req.items.map((item, idx) => `
                                    <tr data-price="${item.precio}" data-qty="${item.cantidad}">
                                        <td class="px-4 py-2 font-mono text-[10px]">${item.sku || '-'}</td>
                                        <td class="px-4 py-2 text-[10px]">${item.nombre || item.producto || '-'}</td>
                                        <td class="px-4 py-2 text-[10px]">${item.clase || '-'}</td>
                                        <td class="px-4 py-2 text-[10px]">${item.grupo || '-'}</td>
                                        <td class="px-4 py-2 text-[10px]">${item.unidad || '-'}</td>
                                        <td class="px-4 py-2 text-center text-slate-700 font-medium">${item.cantidad}</td>
                                        <td class="px-4 py-2 text-right text-slate-700 font-mono item-row-price">$${item.precio.toFixed(2)}</td>
                                        <td class="px-4 py-2 text-right font-bold text-slate-900 font-mono item-row-total">$${item.total.toFixed(2)}</td>
                                        <td class="px-4 py-2">
                                            <input type="text" name="obs_${idx}" value="${item.observaciones}" class="w-full bg-transparent border-b border-transparent focus:border-brand-500 text-[10px] text-slate-500 italic">
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex justify-end">
                      <div id="oc-totals-area" class="text-right space-y-1 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p class="text-slate-500">Subtotal: <span id="oc-subtotal-val" class="font-medium text-slate-700">$${req.subtotal.toFixed(2)} ${req.moneda || 'MXN'}</span></p>
                          <p class="text-slate-500">IVA (16%): <span id="oc-iva-val" class="font-medium text-slate-700">$${req.iva.toFixed(2)} ${req.moneda || 'MXN'}</span></p>
                          <p class="text-lg font-bold text-slate-800 border-t border-slate-200 mt-2 pt-2">Total: <span id="oc-total-val">$${req.total.toFixed(2)} ${req.moneda || 'MXN'}</span></p>
                      </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" id="btn-cancel-oc" class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">Cancelar</button>
                    <button type="submit" class="px-6 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 transition-colors text-sm font-bold">
                        <i class="fa-solid fa-file-invoice-dollar mr-2"></i>Generar Orden de Compra
                    </button>
                </div>
            </form>
        `;

        const goBack = () => OrdenesCompraModule.renderLayout(container);
        document.getElementById('btn-back-pending-oc').addEventListener('click', goBack);
        document.getElementById('btn-cancel-oc').addEventListener('click', goBack);

        const comboMoneda = document.getElementById('oc-moneda');
        const inputTC = document.getElementById('oc-tc');

        const updateTotals = () => {
            const moneda = comboMoneda.value;
            const tc = parseFloat(inputTC.value) || 1;

            let subtotal = 0;
            const rows = document.querySelectorAll('#oc-items-body tr');
            rows.forEach(row => {
                const basePrice = parseFloat(row.dataset.price);
                const qty = parseFloat(row.dataset.qty);
                // conversion de moneda
                const currentPrice = basePrice * tc;
                const currentTotal = currentPrice * qty;

                row.querySelector('.item-row-price').textContent = `$${currentPrice.toFixed(2)}`;
                row.querySelector('.item-row-total').textContent = `$${currentTotal.toFixed(2)}`;
                subtotal += currentTotal;
            });

            const iva = subtotal * 0.16;
            const total = subtotal + iva;

            document.getElementById('oc-subtotal-val').textContent = `$${subtotal.toFixed(2)} ${moneda}`;
            document.getElementById('oc-iva-val').textContent = `$${iva.toFixed(2)} ${moneda}`;
            document.getElementById('oc-total-val').textContent = `$${total.toFixed(2)} ${moneda}`;
        };

        comboMoneda.addEventListener('change', updateTotals);
        inputTC.addEventListener('input', updateTotals);

        // Inicializacion de totales
        updateTotals();

        document.getElementById('form-oc').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const moneda = formData.get('moneda');
            const tc = parseFloat(formData.get('tipo_cambio')) || 1;

            let finalSubtotal = 0;
            const finalItems = req.items.map((item, idx) => {
                const itemPrice = item.precio * tc;
                const itemTotal = itemPrice * item.cantidad;
                finalSubtotal += itemTotal;

                return {
                    ...item,
                    precio: itemPrice,
                    total: itemTotal,
                    observaciones: formData.get(`obs_${idx}`)
                };
            });

            const finalIva = finalSubtotal * 0.16;
            const finalTotal = finalSubtotal + finalIva;

            const newOC = {
                id: folio,
                requisicion_id: req.id,
                fecha: dateStr,
                proveedor: formData.get('proveedor'),
                comprador: formData.get('comprador'),
                moneda: moneda,
                tipo_cambio: tc,
                fecha_entrega: formData.get('fecha_entrega'),
                tolerancia: formData.get('tolerancia'),
                items: finalItems,
                subtotal: finalSubtotal,
                iva: finalIva,
                total: finalTotal,
                estado: 'PENDIENTE'
            };

            window.erpDB.add('ordenes_compra', newOC);
            alert("Orden de Compra Generada Correctamente");
            OrdenesCompraModule.renderLayout(container);
        });
    },

    printOC: async (ocId) => {
        if (typeof html2pdf === 'undefined') {
            alert('Cargando librería de PDF... Por favor intente de nuevo en un segundo.');
            const script = document.createElement('script');
            script.src = "https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
            document.head.appendChild(script);
            return;
        }

        const ocs = window.erpDB.getAll('ordenes_compra');
        const oc = ocs.find(o => o.id === ocId);
        if (!oc) return;

        try {
            // Plantilla
            const response = await fetch('views/orden_compra_plantilla.html');
            if (!response.ok) throw new Error('No se pudo cargar la plantilla');
            let template = await response.text();

            // Proveedor
            const providers = window.erpDB.getAll('providers');
            const pData = providers.find(p => p.nombre === oc.proveedor) || {};

            // Preparacion de items
            const itemsHtml = oc.items.map(item => `
                <tr>
                    <td style="font-family: monospace; font-weight: bold;">${item.sku || '-'}</td>
                    <td>
                        <div style="font-weight: bold;">${item.nombre || item.producto || '-'}</div>
                        <div style="font-size: 10px; color: #000; font-style: italic;">${item.observaciones || ''}</div>
                    </td>
                    <td style="text-align: center;">${item.cantidad}</td>
                    <td style="text-align: right;">$${item.precio.toFixed(2)}</td>
                    <td style="text-align: right; font-weight: bold;">$${item.total.toFixed(2)}</td>
                </tr>
            `).join('');

            // Sustitucion de valores
            const replacements = {
                '{{FOLIO}}': oc.id,
                '{{PROVEEDOR_NOMBRE}}': oc.proveedor,
                '{{PROVEEDOR_RFC}}': pData.rfc || 'N/A',
                '{{PROVEEDOR_EMAIL}}': pData.email || 'N/A',
                '{{PROVEEDOR_TEL}}': pData.telefono || 'N/A',
                '{{FECHA_EMISION}}': oc.fecha,
                '{{FECHA_ENTREGA}}': oc.fecha_entrega,
                '{{COMPRADOR}}': oc.comprador,
                '{{MONEDA}}': oc.moneda,
                '{{TC}}': oc.tipo_cambio ? oc.tipo_cambio.toFixed(4) : '1.0000',
                '{{REQ_ID}}': oc.requisicion_id,
                '{{SUBTOTAL}}': oc.subtotal.toFixed(2),
                '{{IVA}}': oc.iva.toFixed(2),
                '{{TOTAL}}': oc.total.toFixed(2),
                '{{ITEMS_ROWS}}': itemsHtml,
                '{{TIMESTAMP}}': new Date().toLocaleString()
            };

            // Sustitucion de valores
            Object.keys(replacements).forEach(key => {
                template = template.replaceAll(key, replacements[key]);
            });

            // Creacion de contenedor temporal
            const container = document.createElement('div');
            container.innerHTML = template;
            document.body.appendChild(container);

            const options = {
                margin: [20, 20, 20, 20],
                filename: `Orden_Compra_${oc.id}.pdf`,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
                jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' }
            };

            // Generacion de PDF
            html2pdf().from(container).set(options).save().then(() => {
                document.body.removeChild(container);
            });

        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error al generar el PDF: ' + error.message);
        }
    }
};
