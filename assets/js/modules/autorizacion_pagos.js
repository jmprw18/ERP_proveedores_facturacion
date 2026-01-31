//Modulo de Autorizacion de pagos
// assets/js/modules/autorizacion_pagos.js

const AutorizacionPagosModule = {
    init: (container) => {
        container.innerHTML = '';
        AutorizacionPagosModule.renderLayout(container);
    },

    renderLayout: (container) => {
        container.innerHTML = `
            <div class="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto">
                <button id="tab-auth-pending" class="px-4 py-2 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 whitespace-nowrap">Por Autorizar</button>
                <button id="tab-auth-confirmed" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Pagos Autorizados</button>
                <button id="tab-auth-rejected" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Pagos Rechazados</button>
            </div>
            <div id="auth-content"></div>
        `;

        const tabPending = container.querySelector('#tab-auth-pending');
        const tabConfirmed = container.querySelector('#tab-auth-confirmed');
        const tabRejected = container.querySelector('#tab-auth-rejected');
        const body = container.querySelector('#auth-content');

        const setActiveTab = (btn) => {
            [tabPending, tabConfirmed, tabRejected].forEach(b => {
                b.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600');
                b.classList.add('text-slate-500');
            });
            btn.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');
            btn.classList.remove('text-slate-500');
        };

        tabPending.addEventListener('click', () => {
            setActiveTab(tabPending);
            AutorizacionPagosModule.renderPending(body);
        });
        tabConfirmed.addEventListener('click', () => {
            setActiveTab(tabConfirmed);
            AutorizacionPagosModule.renderConfirmed(body);
        });
        tabRejected.addEventListener('click', () => {
            setActiveTab(tabRejected);
            AutorizacionPagosModule.renderRejected(body);
        });

        // tab inicial
        setActiveTab(tabPending);
        AutorizacionPagosModule.renderPending(body);
    },

    renderPending: (container) => {
        const preFacturas = window.erpDB.getAll('facturas_compra').filter(f => f.estado === 'PRE-FACTURA');

        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Autorización de Pagos</h3>
                <p class="text-sm text-slate-500">Revise y apruebe las solicitudes de pago para los proveedores.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio Factura</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4">Datos Bancarios</th>
                            <th class="px-6 py-4 text-right">Monto</th>
                            <th class="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${preFacturas.length === 0 ? `
                            <tr><td colspan="5" class="px-6 py-8 text-center text-slate-400 italic">No hay pagos pendientes de autorizar.</td></tr>
                        ` : preFacturas.map(f => `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4 font-mono font-medium">${f.id}</td>
                                <td class="px-6 py-4 text-xs font-bold text-slate-800">${f.proveedor}</td>
                                <td class="px-6 py-4 text-xs">${f.banco}<br><span class="text-slate-400 font-mono">${f.clabe}</span></td>
                                <td class="px-6 py-4 text-right font-bold text-brand-600">$${f.total.toFixed(2)} ${f.moneda}</td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex justify-center gap-2">
                                        <button class="btn-auth-approve bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-sm" data-id="${f.id}" title="Autorizar Pago">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </button>
                                        <button class="btn-auth-cancel bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200" data-id="${f.id}" title="Rechazar">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
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

        container.querySelectorAll('.btn-auth-approve').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm(`¿Autorizar transferencia por $${preFacturas.find(p => p.id === btn.dataset.id).total.toFixed(2)} ${preFacturas.find(p => p.id === btn.dataset.id).moneda}?`)) {
                    AutorizacionPagosModule.processApproval(btn.dataset.id, container);
                }
            });
        });

        container.querySelectorAll('.btn-auth-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                const reason = prompt("Ingrese el motivo del rechazo del pago:");
                if (reason) {
                    window.erpDB.update('facturas_compra', btn.dataset.id, {
                        estado: 'PRE-FACTURA-RECHAZADA',
                        motivo_rechazo: reason
                    });

                    // Notificación
                    const alertMsg = document.createElement('div');
                    alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-red-600 transition-all z-[9999]`;
                    alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-ban"></i> Pago Rechazado.</div>`;
                    document.body.appendChild(alertMsg);
                    setTimeout(() => alertMsg.remove(), 3000);

                    AutorizacionPagosModule.renderLayout(container);
                }
            });
        });
    },

    renderRejected: (container) => {
        const rejected = window.erpDB.getAll('facturas_compra').filter(f => f.estado === 'PRE-FACTURA-RECHAZADA');
        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Pagos Rechazados</h3>
                <p class="text-sm text-slate-500">Solicitudes de pago devueltas por Tesorería.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio Factura</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4 text-right">Monto</th>
                            <th class="px-6 py-4">Motivo Rechazo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${rejected.length === 0 ? `
                            <tr><td colspan="4" class="px-6 py-8 text-center text-slate-400 italic">No hay pagos rechazados.</td></tr>
                        ` : rejected.map(c => `
                            <tr>
                                <td class="px-6 py-4 font-mono">${c.id}</td>
                                <td class="px-6 py-4 font-medium">${c.proveedor}</td>
                                <td class="px-6 py-4 text-right font-bold text-red-600">$${c.total.toFixed(2)} ${c.moneda}</td>
                                <td class="px-6 py-4 text-xs italic text-slate-500">"${c.motivo_rechazo || 'Sin motivo'}"</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    processApproval: (id, container) => {
        // Se simula la entrega del ticket de comprobante del pago al proveedor
        container.innerHTML = `
            <div class="max-w-xl mx-auto p-8 bg-white rounded-2xl border border-slate-100 shadow-xl text-center">
                <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa-solid fa-receipt text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Pago Autorizado: ${id}</h3>
                <p class="text-slate-500 mb-8">Tesorería ha liberado el recurso. <br>Para continuar, confirme la entrega del ticket de comprobante a la entidad proveedora.</p>
                
                <div class="p-6 bg-slate-50 rounded-xl border border-slate-100 text-left mb-8">
                    <p class="text-sm font-bold text-slate-700 mb-2">Validación Administrativa</p>
                    <div class="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                        <input type="checkbox" id="chk-ticket" class="w-5 h-5 accent-brand-600 cursor-pointer">
                        <label for="chk-ticket" class="text-sm text-slate-600 cursor-pointer">Confirmo que he entregado el ticket/comprobante de transacción al proveedor.</label>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="btn-cancel-auth" class="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Posponer</button>
                    <button id="btn-confirm-ticket" class="flex-1 px-4 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Confirmar Entrega
                    </button>
                </div>
            </div>
        `;

        const chk = document.getElementById('chk-ticket');
        const btn = document.getElementById('btn-confirm-ticket');
        chk.addEventListener('change', () => btn.disabled = !chk.checked);

        document.getElementById('btn-cancel-auth').addEventListener('click', () => AutorizacionPagosModule.renderLayout(container));

        btn.addEventListener('click', () => {
            // Se actualiza el estado a AUTORIZADO
            window.erpDB.update('facturas_compra', id, { estado: 'AUTORIZADO', ticket_confirmado: true });

            // Se crea el registro en pagos_autorizacion para el historial
            window.erpDB.add('pagos_autorizacion', {
                folio: window.erpDB.generateFolio('PA'),
                factura_id: id,
                fecha: new Date().toISOString().split('T')[0],
                timestamp: new Date().toLocaleTimeString()
            });

            // Notificación
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-green-600 transition-all z-[9999]`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-circle-check"></i> Pago Autorizado y Ticket entregado al proveedor.</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 3000);

            AutorizacionPagosModule.renderLayout(container);
        });
    },

    renderConfirmed: (container) => {
        const confirmed = window.erpDB.getAll('facturas_compra').filter(f => f.estado === 'AUTORIZADO');
        // tabla de pagos autorizados
        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Pagos Autorizados</h3>
                <p class="text-sm text-slate-500">Histórico de transferencias autorizadas listas para aplicación fiscal.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio Factura</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4 text-right">Monto</th>
                            <th class="px-6 py-4 text-center">Ticket</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${confirmed.length === 0 ? `
                            <tr><td colspan="4" class="px-6 py-8 text-center text-slate-400 italic">No hay historial de pagos autorizados.</td></tr>
                        ` : confirmed.map(c => `
                            <tr>
                                <td class="px-6 py-4 font-mono">${c.id}</td>
                                <td class="px-6 py-4 font-medium">${c.proveedor}</td>
                                <td class="px-6 py-4 text-right font-bold text-green-600">$${c.total.toFixed(2)} ${c.moneda}</td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Entregado</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
};
