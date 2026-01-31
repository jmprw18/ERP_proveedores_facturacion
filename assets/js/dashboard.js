// assets/js/dashboard.js

// Heroicons
const icons = {
    calculator: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /><path d="M7.5 10.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-.008zM7.5 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-.008zM10.5 10.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM10.5 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM13.5 10.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM13.5 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM15.75 10.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM15.75 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" /></svg>',
    document: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clip-rule="evenodd" /><path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" /></svg>',
    cart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" /></svg>',
    truck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" /><path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" /><path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" /></svg>',
    box: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" /><path fill-rule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" /></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>',
    money: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.849c.547.274 1.125.412 1.75.412.296 0 .57-.024.814-.067.433-.075.87.18 1.06.591.218.473.04.993-.362 1.25-.436.277-1.391.663-3.262.663z" /><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" /></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>',
    swatch: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>'
};

//modulos del dashboard
const flowNodes = [
    {
        id: 'estimaciones',
        label: 'Estimaciones',
        icon: icons.calculator,
        level: 1,
        column: 0,
        connections: ['requisiciones']
    },
    {
        id: 'requisiciones',
        label: 'Requisiciones',
        icon: icons.document,
        level: 2,
        column: 0,
        connections: ['ordenes_compra']
    },
    {
        id: 'ordenes_compra',
        label: 'Órdenes de Compra',
        icon: icons.cart,
        level: 3,
        column: 0,
        connections: ['facturas']
    },
    {
        id: 'facturas',
        label: 'Facturas de Compra',
        icon: icons.document,
        level: 4,
        column: 0,
        connections: ['autorizacion']
    },
    {
        id: 'autorizacion',
        label: 'Autorización de Pagos',
        icon: icons.check,
        level: 5,
        column: 0,
        connections: ['aplicacion']
    },
    {
        id: 'aplicacion',
        label: 'Aplicación de Pagos',
        icon: icons.money,
        level: 6,
        column: 0,
        connections: []
    }
];

const catalogs = [
    { id: 'proveedores', label: 'Proveedores', icon: icons.users }
];

document.addEventListener('DOMContentLoaded', () => {
    try {
        renderCatalogs();
        renderFlow();
        setupModal();
    } catch (e) {
        console.error("Dashboard initialization error:", e);
    }
});

function renderCatalogs() {
    const container = document.getElementById('catalogs-container');
    if (!container) return;

    catalogs.forEach(cat => {
        let count = 0;
        if (window.erpDB) {
            if (cat.id === 'proveedores') count = window.erpDB.getProvidersCount();
            if (cat.id === 'productos') count = window.erpDB.getProductsCount();
        }

        const el = document.createElement('div');
        el.className = 'group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-500/30 transition-all cursor-pointer min-w-[200px]';
        el.innerHTML = `
            <div class="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 group-hover:text-brand-400 transition-colors">
                ${cat.icon}
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-slate-400">Catálogo</span>
                <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-200 group-hover:text-white text-sm">${cat.label}</span>
                    <span class="text-[10px] font-mono text-slate-500 bg-black/20 px-1.5 py-0.5 rounded-full">${count}</span>
                </div>
            </div>
        `;
        el.addEventListener('click', () => openModal(cat));
        container.appendChild(el);
    });
}

function renderFlow() {
    const container = document.getElementById('flow-container');
    if (!container) return;

    container.innerHTML = '';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none -z-10');
    container.appendChild(svg);

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
        // Layout para dispositivos móviles
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'center';
        container.style.gap = '2rem';
    } else {
        // Layout para computadoras
        container.style.display = 'grid';
        container.style.justifyContent = 'center';
        container.style.gridTemplateColumns = 'repeat(5, 160px)';
        container.style.gap = '2.5rem 2rem';
    }

    flowNodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.id = `node-${node.id}`;

        let extraClasses = '';
        if (!isMobile) {
            const colStart = node.column + 3;
            nodeEl.style.gridRow = node.level;
            nodeEl.style.gridColumn = colStart;
            nodeEl.style.justifySelf = 'center';
        } else {
            // Ordenamiento y estructuración para móviles
            extraClasses = 'w-full max-w-[200px]';
            nodeEl.style.order = node.level * 10;
        }

        nodeEl.className = `
            relative flex flex-col items-center gap-3 p-4 
            glass-panel rounded-xl border border-white/10 shadow-lg 
            cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-brand-500/50 hover:shadow-brand-500/20
            w-full max-w-[180px]
            z-10
            ${extraClasses}
        `;

        nodeEl.innerHTML = `
            <div class="w-12 h-12 rounded-full bg-brand-900/50 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xl shadow-inner">
                ${node.icon}
            </div>
            <span class="text-sm font-semibold text-center leading-tight text-white/90">${node.label}</span>
        `;

        nodeEl.addEventListener('click', () => openModal(node));
        container.appendChild(nodeEl);
    });

    const redraw = () => {
        while (svg.lastChild) { svg.removeChild(svg.lastChild); }
        addArrowMarker(svg);
        drawConnections(svg, flowNodes);
    };

    setTimeout(redraw, 100);
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth < 1024;
        if (newIsMobile !== isMobile) {
            renderFlow();
        } else {
            redraw();
        }
    });
}

function addArrowMarker(svg) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
        </marker>
    `;
    svg.appendChild(defs);
}

function drawConnections(svg, nodes) {
    const container = document.getElementById('flow-container');
    const containerRect = container.getBoundingClientRect();
    const isMobile = window.innerWidth < 1024;

    nodes.forEach(node => {
        const sourceEl = document.getElementById(`node-${node.id}`);
        if (!sourceEl) return;

        const sourceRect = sourceEl.getBoundingClientRect();

        node.connections.forEach(targetId => {
            const targetEl = document.getElementById(`node-${targetId}`);
            if (!targetEl) return;

            const targetRect = targetEl.getBoundingClientRect();

            // Coordinates relative to SVG container
            const startX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
            const startY = sourceRect.bottom - containerRect.top;

            const targetCenterX = targetRect.left + targetRect.width / 2 - containerRect.left;
            const targetTopY = targetRect.top - containerRect.top;

            let endX = targetCenterX;
            let endY = targetTopY;
            let d = '';

            if (isMobile) {
                // Lógica de dibujo para móviles
                if (targetRect.top >= sourceRect.bottom) {
                    // Vertical estándar
                    d = `M ${startX} ${startY} L ${endX} ${endY}`;
                } else {
                    // El diseño puede estar ajustado y no son estrictamente verticales
                    if (targetRect.bottom <= sourceRect.top) {
                        const revStartX = startX;
                        const revStartY = sourceRect.top - containerRect.top;
                        const revEndY = targetRect.bottom - containerRect.top;
                        d = `M ${revStartX} ${revStartY} L ${endX} ${revEndY}`;
                    } else {
                        d = `M ${startX} ${startY} L ${endX} ${endY}`;
                    }
                }
            } else {
                // Lógica de dibujo para computadoras
                const targetNode = nodes.find(n => n.id === targetId);

                // Lógica para Devoluciones -> Consignaciones (Derecha -> Izquierda)
                if (targetNode.level === node.level) {
                    // Conexión horizontal
                    const isTargetRight = targetNode.column > node.column;

                    const srcX = isTargetRight ? (sourceRect.right - containerRect.left) : (sourceRect.left - containerRect.left);
                    const srcY = sourceRect.top + sourceRect.height / 2 - containerRect.top;

                    const trgX = isTargetRight ? (targetRect.left - containerRect.left) : (targetRect.right - containerRect.left);
                    const trgY = targetRect.top + targetRect.height / 2 - containerRect.top;

                    d = `M ${srcX} ${srcY} L ${trgX} ${trgY}`;
                } else {
                    if (targetNode.column === node.column) {
                        d = `M ${startX} ${startY} L ${endX} ${endY}`;
                    } else {
                        const midY = (startY + endY) / 2;
                        d = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                    }
                }
            }

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute('d', d);
            path.setAttribute('stroke', '#475569');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', 'url(#arrow)');
            path.classList.add('animate-draw');

            svg.appendChild(path);
        });
    });
}


function setupModal() {
    const modal = document.getElementById('module-modal');
    if (!modal) return;

    const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('close-modal-btn')];

    closeModalBtns.forEach(btn => btn?.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function openModal(data) {
    const modal = document.getElementById('module-modal');
    const modalContent = document.getElementById('modal-content');
    const bodyContainer = document.getElementById('modal-content-body');
    const footer = document.getElementById('modal-footer');

    document.getElementById('modal-title').textContent = data.label;
    document.getElementById('modal-icon').innerHTML = data.icon;

    // Enrutamiento de módulos
    if (data.id === 'proveedores' && typeof ProveedoresModule !== 'undefined') {
        ProveedoresModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else if (data.id === 'estimaciones' && typeof EstimacionesModule !== 'undefined') {
        EstimacionesModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else if (data.id === 'requisiciones' && typeof RequisicionesModule !== 'undefined') {
        RequisicionesModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else if (data.id === 'ordenes_compra' && typeof OrdenesCompraModule !== 'undefined') {
        OrdenesCompraModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else if (data.id === 'facturas' && typeof FacturasCompraModule !== 'undefined') {
        FacturasCompraModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else if (data.id === 'autorizacion' && typeof AutorizacionPagosModule !== 'undefined') {
        AutorizacionPagosModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else if (data.id === 'aplicacion' && typeof AplicacionPagosModule !== 'undefined') {
        AplicacionPagosModule.init(bodyContainer);
        footer.classList.add('hidden');
    } else {
        // Placeholder por defecto
        bodyContainer.innerHTML = `
            <div class="space-y-4 py-8 text-center text-slate-500">
                <i class="fa-solid fa-person-digging text-4xl mb-3 opacity-30 text-slate-400"></i>
                <p>Configuración del módulo <strong>${data.label}</strong> en construcción...</p>
            </div>
        `;
        footer.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    });
}

function closeModal() {
    const modal = document.getElementById('module-modal');
    const modalContent = document.getElementById('modal-content');

    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}
