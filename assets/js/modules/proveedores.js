// Módulo de proveedores
// assets/js/modules/proveedores.js

const ProveedoresModule = {
    init: (container) => {
        ProveedoresModule.renderList(container);
    },

    renderList: (container) => {
        const providers = window.erpDB.getAll('providers');

        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-lg font-bold text-slate-700">Directorio de Proveedores</h3>
                    <p class="text-sm text-slate-500">Gestión de empresas y entidades proveedoras registradas.</p>
                </div>
                <button id="btn-add-provider" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nuevo Proveedor
                </button>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                        <tr>
                            <th class="px-6 py-4">Empresa / Razón Social</th>
                            <th class="px-6 py-4">RFC / ID Fiscal</th>
                            <th class="px-6 py-4">Contacto Principal</th>
                            <th class="px-6 py-4 text-center">Crédito</th>
                            <th class="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        ${providers.length === 0 ? `
                            <tr><td colspan="5" class="px-6 py-8 text-center text-slate-400 italic">No hay proveedores registrados.</td></tr>
                        ` : providers.map(p => `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-800">${p.nombre}</div>
                                    <div class="text-[10px] text-slate-400 font-mono">${p.clave || 'S/C'}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="font-mono font-medium">${p.rfc}</div>
                                    <div class="text-[10px] text-slate-400">${p.tipo}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-xs font-bold">${p.email || '-'}</div>
                                    <div class="text-[10px] text-slate-400">Tel: ${p.telefono || '-'}</div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-100">
                                        ${p.dias_credito} Días
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <button class="text-slate-400 hover:text-brand-600 transition-colors" title="Ver Detalles">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('btn-add-provider').addEventListener('click', () => {
            ProveedoresModule.renderForm(container);
        });
    },

    // Vista del formulario de nuevo proveedor
    renderForm: (container) => {
        container.innerHTML = `
            <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <button id="btn-back-list" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                    <h3 class="text-xl font-bold text-slate-800">Registrar Nuevo Proveedor</h3>
                    <p class="text-xs text-slate-500">Ingrese los datos fiscales y de contacto de la nueva entidad.</p>
                </div>
            </div>

            <form id="form-provider" class="space-y-6 max-w-3xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Datos Identificación -->
                    <div class="space-y-4">
                        <h4 class="text-sm font-bold text-brand-600 uppercase border-b border-brand-100 pb-2">Identificación</h4>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Razón Social <span class="text-red-500">*</span></label>
                            <input type="text" name="nombre" required class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="Ej. Materiales del Norte SA de CV">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">RFC <span class="text-red-500">*</span></label>
                                <input type="text" name="rfc" required class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black font-mono uppercase" placeholder="XAXX010101000">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Tipo Persona</label>
                                <select name="tipo" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black">
                                    <option value="Persona Moral">Persona Moral</option>
                                    <option value="Persona Física">Persona Física</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Datos Contacto -->
                    <div class="space-y-4">
                        <h4 class="text-sm font-bold text-brand-600 uppercase border-b border-brand-100 pb-2">Contacto</h4>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Email Comercial</label>
                            <input type="email" name="email" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black" placeholder="contacto@empresa.com">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
                            <input type="tel" name="telefono" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black" placeholder="(000) 000-0000">
                        </div>
                         <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Código Postal</label>
                            <input type="text" name="cp" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black" placeholder="00000">
                        </div>
                    </div>

                    <!-- Datos Comerciales -->
                    <div class="space-y-4 md:col-span-2">
                        <h4 class="text-sm font-bold text-brand-600 uppercase border-b border-brand-100 pb-2">Condiciones Comerciales</h4>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Días Crédito</label>
                                <input type="number" name="dias_credito" value="30" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Límite Crédito</label>
                                <input type="number" name="limite_credito" value="0.00" step="0.01" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-black">
                            </div>
                             <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Clave Interna</label>
                                <input type="text" name="clave" value="PROV-${Math.floor(Math.random() * 1000)}" readonly class="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-mono text-slate-700 cursor-not-allowed">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-6 gap-3">
                    <button type="button" id="btn-cancel-create" class="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
                    <button type="submit" class="px-8 py-2 bg-brand-600 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-colors">Guardar Proveedor</button>
                </div>
            </form>
        `;

        document.getElementById('btn-back-list').addEventListener('click', () => ProveedoresModule.renderList(container));
        document.getElementById('btn-cancel-create').addEventListener('click', () => ProveedoresModule.renderList(container));

        document.getElementById('form-provider').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const newProvider = {
                id: formData.get('clave'),
                clave: formData.get('clave'),
                nombre: formData.get('nombre'),
                rfc: formData.get('rfc'),
                tipo: formData.get('tipo'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                dias_credito: parseInt(formData.get('dias_credito')) || 0,
                limite_credito: parseFloat(formData.get('limite_credito')) || 0,
                cp: formData.get('cp')
            };

            window.erpDB.add('providers', newProvider);

            // Alerta de exito
            const alertMsg = document.createElement('div');
            alertMsg.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-green-600 transition-all z-[9999]`;
            alertMsg.innerHTML = `<div class="flex items-center gap-2 font-bold"><i class="fa-solid fa-check-circle"></i> Proveedor Registrado: ${newProvider.nombre}</div>`;
            document.body.appendChild(alertMsg);
            setTimeout(() => alertMsg.remove(), 3000);

            ProveedoresModule.renderList(container);
        });
    }
};
