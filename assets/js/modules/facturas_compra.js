// Módulo de facturas de compra
// assets/js/modules/facturas_compra.js

const FacturasCompraModule = {
    init: (container) => {
        container.innerHTML = '';
        FacturasCompraModule.renderLayout(container);
    },

    renderLayout: (container) => {
        container.innerHTML = `
            <div class="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto">
                <button id="tab-fac-oc" class="px-4 py-2 text-sm font-semibold text-brand-600 border-b-2 border-brand-600 whitespace-nowrap">Por Facturar (OC)</button>
                <button id="tab-fac-pre" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Pre-Facturas</button>
                <button id="tab-fac-final" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">Facturas Recibidas</button>
            </div>
            <div id="fac-content"></div>
        `;

        const tabOC = container.querySelector('#tab-fac-oc');
        const tabPre = container.querySelector('#tab-fac-pre');
        const tabFinal = container.querySelector('#tab-fac-final');
        const body = container.querySelector('#fac-content');

        const setActiveTab = (btn) => {
            [tabOC, tabPre, tabFinal].forEach(b => {
                b.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600');
                b.classList.add('text-slate-500');
            });
            btn.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');
            btn.classList.remove('text-slate-500');
        };

        tabOC.addEventListener('click', () => {
            setActiveTab(tabOC);
            FacturasCompraModule.renderOCList(body);
        });
        tabPre.addEventListener('click', () => {
            setActiveTab(tabPre);
            FacturasCompraModule.renderPreFacturas(body);
        });
        tabFinal.addEventListener('click', () => {
            setActiveTab(tabFinal);
            FacturasCompraModule.renderFinalList(body);
        });

        // Initial View
        setActiveTab(tabOC);
        FacturasCompraModule.renderOCList(body);
    },

    renderOCList: (container) => {
        const ocs = window.erpDB.getAll('ordenes_compra').filter(oc => oc.estado === 'APROBADA');
        const facturas = window.erpDB.getAll('facturas_compra');
        const processedOCs = new Set(facturas.map(f => f.oc_id));

        const pending = ocs.filter(oc => !processedOCs.has(oc.id));
        //tab de ordenes de compra 
        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Órdenes de Compra por Facturar</h3>
                <p class="text-sm text-slate-500">Seleccione una orden aprobada para iniciar el proceso de facturación.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">OC Folio</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4 text-right">Total OC</th>
                            <th class="px-6 py-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${pending.length === 0 ? `
                            <tr><td colspan="4" class="px-6 py-8 text-center text-slate-400 italic">No hay órdenes aprobadas pendientes de facturar.</td></tr>
                        ` : pending.map(oc => `
                            <tr class="hover:bg-slate-50">
                                <td class="px-6 py-4 font-mono font-medium">${oc.id}</td>
                                <td class="px-6 py-4">${oc.proveedor}</td>
                                <td class="px-6 py-4 text-right font-medium">$${oc.total.toFixed(2)} ${oc.moneda}</td>
                                <td class="px-6 py-4 text-center">
                                    <button class="btn-start-fac px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm" data-id="${oc.id}">
                                        Generar Pre-Factura
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-start-fac').forEach(btn => {
            btn.addEventListener('click', () => {
                const oc = ocs.find(o => o.id === btn.dataset.id);
                FacturasCompraModule.showWizard(oc, container);
            });
        });
    },

    showWizard: (oc, container) => {
        const folio = window.erpDB.generateFolio('FAC');
        //modal para generar la pre-factura
        container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div class="flex items-center gap-4 mb-8">
                    <button id="btn-back-wizard" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-2xl font-bold text-slate-800">Proceso de Facturación <span class="text-brand-600 font-mono">${folio}</span></h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Paso 1</p>
                        <h4 class="font-bold text-slate-700">Pre-Factura</h4>
                        <p class="text-xs text-slate-500">¿Cuánto se debe pagar?</p>
                    </div>
                    <div class="p-4 bg-white rounded-xl border border-slate-100 opacity-50">
                        <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Paso 2</p>
                        <h4 class="font-bold text-slate-700">Datos Bancarios</h4>
                        <p class="text-xs text-slate-500">Información del receptor</p>
                    </div>
                    <div class="p-4 bg-white rounded-xl border border-slate-100 opacity-50">
                        <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Paso 3</p>
                        <h4 class="font-bold text-slate-700">Solicitud Pago</h4>
                        <p class="text-xs text-slate-500">Enviar a Tesorería</p>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="p-4 border border-brand-100 bg-brand-50/30 rounded-xl">
                        <h3 class="font-bold text-brand-900 mb-2">Resumen de la Orden ${oc.id}</h3>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <p><span class="text-slate-500">Proveedor:</span> <span class="font-medium">${oc.proveedor}</span></p>
                            <p class="text-right"><span class="text-slate-500">Total a Facturar:</span> <span class="font-bold text-brand-600">$${oc.total.toFixed(2)} ${oc.moneda}</span></p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h3 class="font-bold text-slate-700">Configuración de Pre-Factura</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Método de Pago SAT</label>
                                <select id="fac-metodo" class="w-full px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold">
                                    <option value="PUE">PUE - Pago en una sola exhibición</option>
                                    <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Banco del Proveedor (Simulado)</label>
                                <select id="fac-banco" class="w-full px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm">
                                    <option value="BBVA">BBVA</option>
                                    <option value="SANTANDER">SANTANDER</option>
                                    <option value="BANORTE">BANORTE</option>
                                    <option value="CITYBANAMEX">CITYBANAMEX</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Cuenta / CLABE</label>
                                <input type="text" id="fac-clabe" value="012180004561237890" class="w-full px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-mono">
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-6">
                        <button id="btn-save-pre" class="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2">
                             Confirmar y Generar Pre-Factura <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-back-wizard').addEventListener('click', () => FacturasCompraModule.renderLayout(container));

        document.getElementById('btn-save-pre').addEventListener('click', () => {
            const newFac = {
                id: folio,
                oc_id: oc.id,
                proveedor: oc.proveedor,
                fecha: new Date().toISOString().split('T')[0],
                total: oc.total,
                moneda: oc.moneda,
                metodo_pago: document.getElementById('fac-metodo').value,
                banco: document.getElementById('fac-banco').value,
                clabe: document.getElementById('fac-clabe').value,
                estado: 'PRE-FACTURA', // se cambia el estado de la factura a pre-factura
                pagado: false,
                facturado: false,
                items: oc.items
            };

            window.erpDB.add('facturas_compra', newFac);

            // notificación de que la pre-factura ha sido generada y enviada a autorización de pagos
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-green-600 transition-all z-[9999]`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-file-invoice"></i> Pre-Factura Generada. Enviando a Autorización de Pagos.</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 3000);

            FacturasCompraModule.renderLayout(container);
        });
    },

    renderPreFacturas: (container) => {
        const facturas = window.erpDB.getAll('facturas_compra').filter(f => f.estado === 'PRE-FACTURA');

        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Pre-Facturas Vigentes</h3>
                <p class="text-sm text-slate-500">Documentos en espera de autorización de pago por tesorería.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Folio FAC</th>
                            <th class="px-6 py-4">De Orden</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4">Banco Destino</th>
                            <th class="px-6 py-4 text-right">Total</th>
                            <th class="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${facturas.length === 0 ? `
                            <tr><td colspan="6" class="px-6 py-8 text-center text-slate-400 italic">No hay pre-facturas registradas.</td></tr>
                        ` : facturas.map(f => `
                            <tr>
                                <td class="px-6 py-4 font-mono font-medium">${f.id}</td>
                                <td class="px-6 py-4 font-mono text-xs">${f.oc_id}</td>
                                <td class="px-6 py-4">${f.proveedor}</td>
                                <td class="px-6 py-4 text-xs"><strong>${f.banco}</strong><br>${f.clabe}</td>
                                <td class="px-6 py-4 text-right font-medium">$${f.total.toFixed(2)} ${f.moneda}</td>
                                <td class="px-6 py-4 text-center">
                                    <button class="btn-print-pre bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200" data-id="${f.id}">
                                        <i class="fa-solid fa-print"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    //tablas de facturas emitidas y pagadas o liquidadas, aqui se simula el timbrado con el uuid y el xml
    renderFinalList: (container) => {
        const facturas = window.erpDB.getAll('facturas_compra').filter(f => f.estado === 'FACTURADA' || f.estado === 'PAGADO');

        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-700">Facturación de Compra</h3>
                <p class="text-sm text-slate-500">Gestión de facturas finales (PUE/PPD) y documentos fiscales timbrados.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Información Fiscal</th>
                            <th class="px-6 py-4">Proveedor</th>
                            <th class="px-6 py-4 text-center">Tipo de Factura</th>
                            <th class="px-6 py-4 text-right">Monto Total Pagado</th>
                            <th class="px-6 py-4 text-center">Estado Flujo</th>
                            <th class="px-6 py-4 text-center">Factura</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${facturas.length === 0 ? `
                            <tr><td colspan="6" class="px-6 py-8 text-center text-slate-400 italic">No hay facturas registradas en este estado.</td></tr>
                        ` : facturas.map(f => `
                            <tr>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="font-mono text-[10px] text-slate-400 leading-none mb-1">FAC: ${f.id}</span>
                                        <span class="font-mono text-xs font-bold text-brand-700">
                                            ${f.uuid_fiscal || '<span class="text-slate-300 italic">No Timbrada</span>'}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="font-medium text-slate-700">${f.proveedor}</span>
                                        <span class="text-[10px] text-slate-400">Ref OC: ${f.oc_id}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    ${f.metodo_pago === 'PUE' ?
                '<span class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">PUE</span>' :
                '<span class="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PPD</span>'}
                                </td>
                                <td class="px-6 py-4 text-right font-bold">$${f.total.toFixed(2)} ${f.moneda}</td>
                                <td class="px-6 py-4 text-center">
                                    ${f.estado === 'PAGADO' ? `
                                        <div class="flex flex-col items-center gap-1">
                                            <span class="text-[9px] font-bold text-green-600 uppercase">Listo para Timbrar</span>
                                            <button class="btn-emit-fac px-3 py-1 bg-brand-600 text-white rounded text-[10px] font-bold shadow-sm hover:bg-brand-700" data-id="${f.id}">
                                                EMITIR CFDI
                                            </button>
                                        </div>
                                    ` : `
                                        <div class="flex flex-col items-center">
                                            <span class="px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded uppercase">TIMBRADA</span>
                                            <span class="text-[9px] text-slate-400 mt-1 italic">${f.fecha_timbrado}</span>
                                        </div>
                                    `}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    ${f.estado === 'FACTURADA' ? `
                                        <button class="btn-print-final bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200" data-id="${f.id}" title="Imprimir Factura">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                        </button>
                                    ` : '<i class="fa-solid fa-hourglass-start text-slate-200" title="Pendiente de Timbrado"></i>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-emit-fac').forEach(btn => {
            btn.addEventListener('click', () => {
                const fac = facturas.find(f => f.id === btn.dataset.id);
                FacturasCompraModule.showEmissionModal(fac, container);
            });
        });

        container.querySelectorAll('.btn-print-final').forEach(btn => {
            btn.addEventListener('click', () => {
                const facId = btn.dataset.id;
                FacturasCompraModule.printInvoice(facId);
            });
        });
    },

    printInvoice: async (id) => {
        const facturas = window.erpDB.getAll('facturas_compra');
        const fac = facturas.find(f => f.id === id);
        if (!fac) return alert("Factura no encontrada");

        const providers = window.erpDB.getAll('providers');
        const provider = providers.find(p => p.nombre === fac.proveedor) || { rfc: 'XAXX010101000', tipo: 'General' };

        try {
            const response = await fetch('views/factura_compra_plantilla.html');
            let html = await response.text();

            // Replacements
            html = html.replace('{{FOLIO_FISCAL}}', fac.uuid_fiscal || 'PRE-FOLIO');
            html = html.replace('{{FECHA}}', fac.fecha);
            html = html.replace('{{PROVEEDOR_NOMBRE}}', fac.proveedor);
            html = html.replace('{{PROVEEDOR_RFC}}', provider.rfc);
            html = html.replace('{{REGIMEN_EMISOR}}', provider.tipo);
            html = html.replace('{{PROVEEDOR_EMAIL}}', provider.email || '');
            html = html.replace('{{PROVEEDOR_TEL}}', provider.telefono || '');

            html = html.replace('{{METODO_PAGO}}', fac.metodo_pago);
            html = html.replace('{{METODO_DESC}}', fac.metodo_pago === 'PUE' ? 'Pago en una sola exhibición' : 'Pago en parcialidades o diferido');
            html = html.replace('{{USO_CFDI}}', fac.uso_cfdi || 'G03');
            html = html.replace('{{MONEDA}}', fac.moneda || 'MXN');

            // Items
            const itemsRows = fac.items.map(item => `
                <tr>
                    <td>${item.sku || 'N/A'}</td>
                    <td>${item.producto || item.nombre}</td>
                    <td style="text-align:center;">${item.cantidad}</td>
                    <td style="text-align:right;">$${(item.precio || item.costo).toFixed(2)}</td>
                    <td style="text-align:right;">$${(item.total || (item.cantidad * (item.precio || item.costo))).toFixed(2)}</td>
                </tr>
            `).join('');
            html = html.replace('{{ITEMS_ROWS}}', itemsRows);

            // Totales
            const subtotal = fac.total / 1.16;
            const iva = fac.total - subtotal;

            html = html.replace('{{SUBTOTAL}}', (fac.subtotal || subtotal).toFixed(2));
            html = html.replace('{{IVA}}', (fac.iva || iva).toFixed(2));
            html = html.replace('{{TOTAL}}', fac.total.toFixed(2));

            // Sello Fake
            const fakeSello = "IIhsdfyu87234jhsd87234...kjasd87234sdf==";
            html = html.replace('{{SELLO_SAT}}', fakeSello);
            html = html.replace('{{CADENA_ORIGINAL}}', `||1.1|${fac.uuid_fiscal}|${fac.fecha_timbrado}|${fakeSello}|00001000000505050505||`);
            html = html.replace('{{CERT_SAT}}', '00001000000505050505');
            html = html.replace('{{FECHA_TIMBRADO}}', fac.fecha_timbrado || new Date().toISOString());

            const printWindow = window.open('', '_blank');
            printWindow.document.write(html);
            printWindow.document.close();

            // Impresion
            printWindow.onload = () => {
                printWindow.print();
            };

        } catch (e) {
            console.error(e);
            alert("Error al cargar la plantilla de impresión.");
        }
    },

    // Modal de emision
    showEmissionModal: (fac, container) => {
        container.innerHTML = `
            <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl text-center">
                <div class="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Emisión de Factura Final</h2>
                <p class="text-slate-500 mb-8">Seleccione los parámetros fiscales para el timbrado de la factura de compra.</p>
                
                <div class="space-y-4 text-left mb-8">
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Método Definido</span>
                            <span class="px-2 py-0.5 bg-brand-500 text-brand-700 text-[10px] font-bold rounded">${fac.metodo_pago}</span>
                        </div>
                        <p class="text-sm text-slate-600">La factura se emitirá como ${fac.metodo_pago === 'PUE' ? 'Pago en una sola exhibición' : 'Pago en Parcialidades o Diferido'}.</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400 uppercase">Uso de CFDI</label>
                        <select id="sel-uso" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                            <option value="G01">G01 - Adquisición de mercancías</option>
                            <option value="G03">G03 - Gastos en general</option>
                            <option value="I01">I01 - Construcciones</option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button class="btn-cancel-em flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">Cancelar</button>
                    <button id="btn-do-emit" class="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700">
                        Timbrar Factura
                    </button>
                </div>
            </div>
        `;

        container.querySelector('.btn-cancel-em').addEventListener('click', () => FacturasCompraModule.renderFinalList(container));

        document.getElementById('btn-do-emit').addEventListener('click', () => {
            const uuidFis = `UUID-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

            window.erpDB.update('facturas_compra', fac.id, {
                estado: 'FACTURADA',
                uso_cfdi: document.getElementById('sel-uso').value,
                uuid_fiscal: uuidFis,
                fecha_timbrado: new Date().toISOString().split('T')[0]
            });

            // alert de exito
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-slate-900 transition-all z-[9999] border-l-4 border-brand-500`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-stamp"></i> Factura Timbrada Exitosamente. UUID: ${uuidFis}</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 4000);

            FacturasCompraModule.renderFinalList(container);
        });
    }
};
