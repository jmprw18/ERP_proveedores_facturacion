// Modulo de aplicacion de pagos
// assets/js/modules/aplicacion_pagos.js

const AplicacionPagosModule = {
    init: (container) => {
        container.innerHTML = '';
        AplicacionPagosModule.renderLayout(container);
    },

    renderLayout: (container) => {
        container.innerHTML = `
            <div class="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto">
                <button id="tab-app-pending" class="px-4 py-2 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 whitespace-nowrap">Aplicar Pagos</button>
                <button id="tab-app-complements" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Complementos Recibidos</button>
            </div>
            <div id="app-content"></div>
        `;

        const tabPending = container.querySelector('#tab-app-pending');
        const tabComplements = container.querySelector('#tab-app-complements');
        const body = container.querySelector('#app-content');

        const setActiveTab = (btn) => {
            [tabPending, tabComplements].forEach(b => {
                b.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600');
                b.classList.add('text-slate-500');
            });
            btn.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');
            btn.classList.remove('text-slate-500');
        };

        tabPending.addEventListener('click', () => {
            setActiveTab(tabPending);
            AplicacionPagosModule.renderPending(body);
        });
        tabComplements.addEventListener('click', () => {
            setActiveTab(tabComplements);
            AplicacionPagosModule.renderComplementsList(body);
        });

        // Carga inicial
        setActiveTab(tabPending);
        AplicacionPagosModule.renderPending(body);
    },

    renderPending: (container) => {
        const authorized = window.erpDB.getAll('facturas_compra').filter(f => f.estado === 'AUTORIZADO');

        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Contabilidad: Aplicación de Pagos</h3>
                <p class="text-sm text-slate-500">Registre los comprobantes de transferencia y obtenga los complementos de pago.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Factura Ref</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4 text-right">Monto Pagado</th>
                            <th class="px-6 py-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${authorized.length === 0 ? `
                            <tr><td colspan="4" class="px-6 py-8 text-center text-slate-400 italic">No hay pagos autorizados por aplicar.</td></tr>
                        ` : authorized.map(f => `
                            <tr>
                                <td class="px-6 py-4 font-mono">${f.id}</td>
                                <td class="px-6 py-4">${f.proveedor}</td>
                                <td class="px-6 py-4 text-right font-bold text-brand-600">$${f.total.toFixed(2)}</td>
                                <td class="px-6 py-4 text-center">
                                    <button class="btn-app-process px-3 py-1 bg-brand-600 text-white rounded font-bold text-xs shadow-sm hover:bg-brand-700" data-id="${f.id}">
                                        Finalizar Pago
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-app-process').forEach(btn => {
            btn.addEventListener('click', () => {
                const fac = authorized.find(f => f.id === btn.dataset.id);
                AplicacionPagosModule.showAppModal(fac, container);
            });
        });
    },

    showAppModal: (fac, container) => {
        // se crea el modal para finalizar la aplicación de pago
        // mostrar al usuario el tipo de pago  PPD y PUE, mostrarv una leyenda de que si es PPD se generara un complemento de pago
        container.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Finalizar Aplicación de Pago</h2>
                        <p class="text-xs text-slate-400">Referencia: ${fac.id}</p>
                    </div>
                    <button class="btn-cancel-app text-slate-300 hover:text-slate-500"><i class="fa-solid fa-xmark text-xl"></i></button>
                </div>

                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Liquidado</p>
                            <p class="text-lg font-bold text-brand-600">$${fac.total.toFixed(2)} ${fac.moneda}</p>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-xl">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Proveedor</p>
                            <p class="text-sm font-bold text-slate-700">${fac.proveedor}</p>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-xs font-bold text-slate-500 uppercase">Detalles de la Transacción</label>
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Referencia Bancaria" value="TR-${Math.floor(Math.random() * 900000 + 100000)}" class="w-full px-4 py-2 bg-white text-black border border-slate-200 rounded-lg text-sm font-mono">
                            <input type="date" value="${new Date().toISOString().split('T')[0]}" class="w-full px-4 py-2 bg-white text-black border border-slate-200 rounded-lg text-sm">
                        </div>
                    </div>

                    <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                        <i class="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                        <p class="text-xs text-blue-700 leading-relaxed">
                            ${fac.metodo_pago === 'PPD' ?
                'Al procesar la aplicación, el sistema registrará el pago fiscalmente y **simulará la recepción del Complemento de Pago (REP)** expedido por el proveedor.' :
                'Esta factura es **PUE**. Al procesar la aplicación, el pago se marcará como liquidado. No se requiere Complemento de Pago.'}
                        </p>
                    </div>

                    <button id="btn-final-apply" class="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                        <i class="fa-solid fa-file-shield text-lg"></i> 
                        ${fac.metodo_pago === 'PPD' ? 'Procesar Pago y Obtener Complemento' : 'Procesar y Liquidar Pago'}
                    </button>
                </div>
            </div>
        `;

        container.querySelector('.btn-cancel-app').addEventListener('click', () => AplicacionPagosModule.renderLayout(container));

        document.getElementById('btn-final-apply').addEventListener('click', () => {
            const uuidComplemento = `uuid-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now().toString().substr(-4)}`;

            // se actualiza el estado de la factura a PAGADO
            window.erpDB.update('facturas_compra', fac.id, {
                estado: 'PAGADO',
                uuid_pago: fac.metodo_pago === 'PPD' ? uuidComplemento : null,
                fecha_pago_efectiva: new Date().toISOString().split('T')[0]
            });

            if (fac.metodo_pago === 'PPD') {
                // se agrega la simulación del complemento de pago
                window.erpDB.add('pagos_aplicacion', {
                    id: window.erpDB.generateFolio('APP'),
                    factura_id: fac.id,
                    uuid_pago: uuidComplemento,
                    fecha_recepcion: new Date().toISOString().split('T')[0],
                    total: fac.total,
                    proveedor: fac.proveedor
                });
            }

            // se muestra una notificación de que el pago ha sido liquidado y se puede recibir una factura
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-slate-800 transition-all z-[9999] animate-pulse`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-certificate"></i> ${fac.metodo_pago === 'PPD' ? 'Complemento de Pago Recibido (CFDI).' : 'Pago Liquidado (PUE).'} El ciclo de pago ha terminado.</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 4000);

            AplicacionPagosModule.renderLayout(container);
        });
    },

    renderComplementsList: (container) => {
        const complements = window.erpDB.getAll('pagos_aplicacion');
        // se muestra una lista de los complementos de pago recibidos
        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Buzón de Complementos de Pago</h3>
                <p class="text-sm text-slate-500">Documentos fiscales CFDI (REP) recibidos de proveedores.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">UUID Pago</th>
                            <th class="px-6 py-4">Factura Ref</th>
                            <th class="px-6 py-4">Fecha Rec.</th>
                            <th class="px-6 py-4 text-right">Monto</th>
                            <th class="px-6 py-4 text-center">Complemento</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${complements.length === 0 ? `
                            <tr><td colspan="5" class="px-6 py-8 text-center text-slate-400 italic">No se han recibido complementos aún.</td></tr>
                        ` : complements.map(c => `
                            <tr>
                                <td class="px-6 py-4 font-mono text-xs text-brand-700">${c.uuid_pago}</td>
                                <td class="px-6 py-4 font-mono">${c.factura_id}</td>
                                <td class="px-6 py-4">${c.fecha_recepcion}</td>
                                <td class="px-6 py-4 text-right font-bold">$${c.total.toFixed(2)}</td>
                                <td class="px-6 py-4 text-center">
                                    <button class="btn-print-comp bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200" data-id="${c.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-print-comp').forEach(btn => {
            btn.addEventListener('click', () => {
                AplicacionPagosModule.printComplement(btn.dataset.id);
            });
        });
    },

    printComplement: async (id) => {
        const complements = window.erpDB.getAll('pagos_aplicacion');
        const comp = complements.find(c => c.id === id);
        if (!comp) return alert("Complemento no encontrado");

        // Buscar datos extra del proveedor y factura original para llenar la plantilla
        const facturas = window.erpDB.getAll('facturas_compra');
        const fac = facturas.find(f => f.id === comp.factura_id) || {};
        const providers = window.erpDB.getAll('providers');
        const provider = providers.find(p => p.nombre === comp.proveedor) || {};

        try {
            const response = await fetch('views/complemento_pago_plantilla.html');
            if (!response.ok) throw new Error('No se pudo cargar la plantilla');

            let template = await response.text();

            const replacements = {
                '{{UUID_PAGO}}': comp.uuid_pago,
                '{{FECHA_EMISION}}': comp.fecha_recepcion,
                '{{PROVEEDOR_NOMBRE}}': comp.proveedor,
                '{{PROVEEDOR_RFC}}': provider.rfc || 'XEXX010101000',
                '{{FECHA_PAGO}}': comp.fecha_recepcion,
                '{{MONEDA}}': 'MXN', // Default simulación
                '{{TOTAL}}': comp.total.toFixed(2),
                '{{UUID_FACTURA}}': fac.uuid_fiscal || fac.id || 'UUID-PENDIENTE', // Deberia tener el UUID de la factura timbrada
                '{{SELLO_DIGITAL}}': '||1.1|' + comp.uuid_pago + '|' + new Date().toISOString() + '|SelloDigitalSimuladoDelSatQueEsMuyLargoYSeguro||'
            };

            Object.keys(replacements).forEach(key => {
                template = template.replaceAll(key, replacements[key]);
            });

            // Print
            const printWindow = window.open('', '_blank');
            printWindow.document.write(template);
            printWindow.document.close();
            printWindow.onload = () => printWindow.print();

        } catch (e) {
            console.error("Error printing complement:", e);
            alert("Error al generar la impresión del complemento.");
        }
    }
};
