// Modulo para estimaciones
// assets/js/modules/estimaciones.js

const EstimacionesModule = {
    init: (container) => {
        container.innerHTML = '';
        EstimacionesModule.renderLayout(container);
    },

    renderLayout: (container) => {
        container.innerHTML = `
            <div class="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto">
                <button id="tab-est-list" class="px-4 py-2 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 whitespace-nowrap">Estimaciones</button>
                <button id="tab-est-approved" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitudes Aprobadas</button>
                <button id="tab-est-rejected" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Solicitudes Rechazadas</button>
            </div>
            <div id="est-content"></div>
        `;

        const tabList = container.querySelector('#tab-est-list');
        const tabApproved = container.querySelector('#tab-est-approved');
        const tabRejected = container.querySelector('#tab-est-rejected');
        const bodyValue = container.querySelector('#est-content');

        const setActiveTab = (btn) => {
            [tabList, tabApproved, tabRejected].forEach(b => {
                b.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600');
                b.classList.add('text-slate-500');
            });
            btn.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');
            btn.classList.remove('text-slate-500');
        };

        tabList.addEventListener('click', () => {
            setActiveTab(tabList);
            EstimacionesModule.renderList(bodyValue, 'PENDIENTE');
        });
        tabApproved.addEventListener('click', () => {
            setActiveTab(tabApproved);
            EstimacionesModule.renderList(bodyValue, 'APROBADA');
        });
        tabRejected.addEventListener('click', () => {
            setActiveTab(tabRejected);
            EstimacionesModule.renderList(bodyValue, 'RECHAZADA');
        });

        // Vista inicial
        setActiveTab(tabList);
        EstimacionesModule.renderList(bodyValue, 'PENDIENTE');
    },

    renderList: (container, filter = 'PENDIENTE') => {
        let estimations = window.erpDB.getAll('estimaciones');

        if (filter !== 'TODAS') {
            estimations = estimations.filter(e => e.estado === filter);
        }
        // Vista de la lista de estimaciones
        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-lg font-bold text-slate-700">Estimaciones ${filter === 'PENDIENTE' ? 'Pendientes' : filter === 'APROBADA' ? 'Aprobadas' : 'Rechazadas'}</h3>
                    <p class="text-sm text-slate-500">Gestione las estimaciones presupuestales de la empresa.</p>
                </div>
                ${filter === 'PENDIENTE' ? `
                    <button id="btn-new-est" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <i class="fa-solid fa-plus mr-2"></i>Nueva Estimación
                    </button>
                ` : ''}
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio</th>
                            <th class="px-6 py-4">Fecha</th>
                            <th class="px-6 py-4">Sucursal</th>
                            <th class="px-6 py-4 text-right">Total</th>
                            <th class="px-6 py-4 text-center">Estado</th>
                            <th class="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${estimations.length === 0 ? `
                            <tr>
                                <td colspan="6" class="px-6 py-8 text-center text-slate-400 italic">
                                    No hay estimaciones ${filter.toLowerCase()}s.
                                </td>
                            </tr>
                        ` : estimations.map(est => `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4 font-mono font-medium text-slate-700">${est.id}</td>
                                <td class="px-6 py-4">${est.fecha} <span class="text-xs text-slate-400 ml-1">${est.hora}</span></td>
                                <td class="px-6 py-4">${est.sucursal}</td>
                                <td class="px-6 py-4 text-right font-medium">$${est.total.toFixed(2)} <span class="text-xs text-slate-500">${est.moneda || 'MXN'}</span></td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold 
                                        ${est.estado === 'APROBADA' ? 'bg-green-100 text-green-600' :
                est.estado === 'RECHAZADA' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'}">
                                        ${est.estado}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center gap-2">
                                        ${est.estado === 'PENDIENTE' ? `
                                            <button class="btn-approve-est bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg" data-id="${est.id}" title="Aprobar">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </button>
                                            <button class="btn-reject-est bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg" data-id="${est.id}" title="Rechazar">
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

        if (filter === 'PENDIENTE' && document.getElementById('btn-new-est')) {
            document.getElementById('btn-new-est').addEventListener('click', () => {
                EstimacionesModule.renderForm(container);
            });
        }

        container.querySelectorAll('.btn-approve-est').forEach(btn => {
            btn.addEventListener('click', () => EstimacionesModule.updateStatus(btn.dataset.id, 'APROBADA', container, filter));
        });

        container.querySelectorAll('.btn-reject-est').forEach(btn => {
            btn.addEventListener('click', () => EstimacionesModule.updateStatus(btn.dataset.id, 'RECHAZADA', container, filter));
        });
    },

    updateStatus: (id, newStatus, container, currentFilter) => {
        window.erpDB.update('estimaciones', id, { estado: newStatus });

        // Mensajes de estatus 'aprobada' o 'rechazada'
        const alertMsg = document.createElement('div');
        alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${newStatus === 'APROBADA' ? 'bg-green-600' : 'bg-red-600'} transition-all z-[9999] animate-bounce`;
        alertMsg.innerHTML = `
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="${newStatus === 'APROBADA' ? 'm4.5 12.75 6 6 9-13.5' : 'M6 18 18 6M6 6l12 12'}" />
                </svg>
                <div class="flex flex-col">
                    <span class="font-bold">¡Éxito!</span>
                    <span class="text-xs">Estimación ${id} ha sido ${newStatus.toLowerCase()}a</span>
                </div>
            </div>`;
        document.body.appendChild(alertMsg);
        setTimeout(() => {
            alertMsg.classList.remove('animate-bounce');
            alertMsg.classList.add('opacity-0');
            setTimeout(() => alertMsg.remove(), 500);
        }, 3000);

        // Redirigir al tab correspondiente
        const modalId = container.closest('.modal-box') || document.querySelector('.modal-box');
        if (modalId) {
            const targetTab = newStatus === 'APROBADA' ? 'tab-est-approved' : 'tab-est-rejected';
            const tabBtn = modalId.querySelector(`#${targetTab}`);
            if (tabBtn) {
                tabBtn.click();
                return;
            }
        }

        EstimacionesModule.renderList(container, currentFilter);
    },

    renderForm: (container) => {
        const folio = window.erpDB.generateFolio('ES');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

        // Vista del formulario de nueva estimacion
        container.innerHTML = `
            <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <button id="btn-back-list" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                    <h3 class="text-xl font-bold text-slate-800">Nueva Estimación <span class="text-brand-600 font-mono ml-2">${folio}</span></h3>
                </div>
                <div class="ml-auto text-right text-xs text-slate-400">
                    <p>${dateStr}</p>
                    <p>${timeStr}</p>
                </div>
            </div>

            <form id="form-estimacion" class="space-y-6">
                <!-- Header Fields -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Sucursal</label>
                        <input type="text" name="sucursal" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500" placeholder="" required>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Tipo Prov.</label>
                        <select name="tipo_proveedor" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                            <option value="Nacional">Nacional</option>
                            <option value="Extranjero">Extranjero</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Moneda</label>
                        <select name="moneda" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                            <option value="MXN">Pesos (MXN)</option>
                            <option value="USD">Dólares (USD)</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-semibold text-slate-500 uppercase">Vigencia (Días)</label>
                        <input type="number" name="vigencia" value="15" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                    </div>
                </div>
                
                <div class="space-y-1">
                    <label class="text-xs font-semibold text-slate-500 uppercase">Solicitante</label>
                    <input type="text" name="solicitante" value="Usuario Actual" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500">
                </div>

                <!-- Items Table -->
                <div class="border rounded-xl overflow-hidden border-slate-200">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left min-w-[600px]">
                            <thead class="bg-slate-100 text-slate-600 font-semibold text-xs uppercase">
                                <tr>
                                    <th class="px-4 py-3 w-12">#</th>
                                    <th class="px-4 py-3">Producto / Servicio</th>
                                    <th class="px-4 py-3">Descripción</th>
                                    <th class="px-4 py-3 w-24 text-center">Cant.</th>
                                    <th class="px-4 py-3 w-32 text-right">Precio</th>
                                    <th class="px-4 py-3 w-32 text-right">Importe</th>
                                    <th class="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody id="items-body" class="bg-white divide-y divide-slate-100">
                                <!-- Initial Row -->
                            </tbody>
                            <tfoot class="bg-slate-50">
                                <tr>
                                    <td colspan="7" class="px-4 py-2">
                                        <button type="button" id="btn-add-row" class="text-brand-600 hover:text-brand-800 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                            <i class="fa-solid fa-plus-circle"></i> Agregar Partida
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Totals -->
                <div class="flex justify-end">
                    <div class="w-64 space-y-2 text-right text-sm">
                        <div class="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span id="lbl-subtotal" class="font-medium text-slate-700">$0.00</span>
                        </div>
                        <div class="flex justify-between text-slate-500">
                            <span>IVA (16%):</span>
                            <span id="lbl-iva" class="font-medium text-slate-700">$0.00</span>
                        </div>
                        <div class="flex justify-between text-lg font-bold text-slate-800 border-t border-slate-200 pt-2">
                            <span>Total:</span>
                            <span id="lbl-total">$0.00</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" id="btn-cancel" class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">Cancelar</button>
                    <button type="submit" class="px-6 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 transition-colors text-sm font-bold">Guardar Estimación</button>
                </div>
            </form>
        `;

        // Logic
        const tbody = document.getElementById('items-body');
        const rows = [];

        const addRow = () => {
            const index = rows.length;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-2 text-center text-slate-400 font-mono">${index + 1}</td>
                <td class="px-4 py-2">
                     <input type="text" class="item-name w-full p-1 bg-transparent border-b border-transparent focus:border-brand-500 focus:outline-none text-slate-800" placeholder="Nombre del producto...">
                </td>
                <td class="px-4 py-2">
                    <input type="text" class="item-desc w-full p-1 bg-transparent border-b border-transparent focus:border-brand-500 focus:outline-none text-slate-800" placeholder="Descripción...">
                </td>
                <td class="px-4 py-2">
                    <input type="number" min="1" value="1" class="item-qty w-full text-center p-1 bg-transparent border-b border-transparent focus:border-brand-500 focus:outline-none text-slate-800">
                </td>
                <td class="px-4 py-2">
                    <input type="number" min="0" step="0.01" class="item-price w-full text-right p-1 bg-transparent border-b border-transparent focus:border-brand-500 focus:outline-none text-slate-800" placeholder="0.00">
                </td>
                <td class="px-4 py-2 text-right font-mono text-slate-600 item-total">$0.00</td>
                <td class="px-4 py-2 text-center">
                    ${index > 0 ? `<button type="button" class="text-red-400 hover:text-red-600 btn-remove-row"><i class="fa-solid fa-trash"></i></button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
            rows.push(tr);

            const nameInput = tr.querySelector('.item-name');
            const priceInput = tr.querySelector('.item-price');
            const qtyInput = tr.querySelector('.item-qty');
            const removeBtn = tr.querySelector('.btn-remove-row');

            [qtyInput, priceInput].forEach(inp => inp.addEventListener('input', () => calculateRow(tr)));

            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    tr.remove();
                    rows.splice(index, 1);
                    updateTotals();
                });
            }
        };

        const calculateRow = (tr) => {
            const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
            const price = parseFloat(tr.querySelector('.item-price').value) || 0;
            const total = qty * price;
            tr.querySelector('.item-total').textContent = `$${total.toFixed(2)}`;
            updateTotals();
        };

        const updateTotals = () => {
            let subtotal = 0;
            rows.forEach(tr => {
                if (tr.isConnected) {
                    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
                    const price = parseFloat(tr.querySelector('.item-price').value) || 0;
                    subtotal += qty * price;
                }
            });

            const iva = subtotal * 0.16;
            const total = subtotal + iva;
            const currency = document.querySelector('select[name="moneda"]').value;

            document.getElementById('lbl-subtotal').textContent = `$${subtotal.toFixed(2)} ${currency}`;
            document.getElementById('lbl-iva').textContent = `$${iva.toFixed(2)} ${currency}`;
            document.getElementById('lbl-total').textContent = `$${total.toFixed(2)} ${currency}`;
        };

        document.querySelector('select[name="moneda"]').addEventListener('change', updateTotals);

        addRow();

        document.getElementById('btn-add-row').addEventListener('click', addRow);
        document.getElementById('btn-back-list').addEventListener('click', () => EstimacionesModule.renderLayout(container));
        document.getElementById('btn-cancel').addEventListener('click', () => EstimacionesModule.renderLayout(container));

        document.getElementById('form-estimacion').addEventListener('submit', (e) => {
            e.preventDefault();
            // Tabla de productos y estimaciones
            const formData = new FormData(e.target);
            const items = [];
            let subtotal = 0;

            rows.forEach(tr => {
                if (tr.isConnected) {
                    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
                    const price = parseFloat(tr.querySelector('.item-price').value) || 0;
                    const desc = tr.querySelector('.item-desc').value;
                    const name = tr.querySelector('.item-name').value;

                    if (qty > 0 && name) {
                        items.push({
                            producto: name,
                            descripcion: desc,
                            cantidad: qty,
                            precio: price,
                            total: qty * price
                        });
                        subtotal += qty * price;
                    }
                }
            });

            if (items.length === 0) {
                alert("Debe agregar al menos un producto.");
                return;
            }

            const iva = subtotal * 0.16;
            const total = subtotal + iva;

            const newEstimacion = {
                id: folio,
                fecha: dateStr,
                hora: timeStr,
                sucursal: formData.get('sucursal'),
                tipo_proveedor: formData.get('tipo_proveedor'),
                moneda: formData.get('moneda'),
                vigencia: formData.get('vigencia'),
                solicitante: formData.get('solicitante'),
                items: items,
                subtotal: subtotal,
                iva: iva,
                total: total,
                estado: 'PENDIENTE'
            };

            window.erpDB.add('estimaciones', newEstimacion);

            // mensaje de éxito
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-green-600 transition-all z-[9999]`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-circle-check"></i> Estimación Guardada Correctamente</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 3000);

            EstimacionesModule.renderLayout(container);
        });
    }
};
