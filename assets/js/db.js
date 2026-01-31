// assets/js/db.js
// Base de datos para el sistema de facturación, esta base de datos crea tablas y registros en la memoria del navegador.

//Clase de la base de datos
class ERPDatabase {
    //tablas en la base de datos
    constructor() {
        this.prefix = 'erp_sim_';
        this.collections = {
            products: 'products',
            providers: 'providers',
            estimaciones: 'estimaciones',
            requisiciones: 'requisiciones',
            ordenes_compra: 'ordenes_compra',
            facturas_compra: 'facturas_compra',
            pagos_autorizacion: 'pagos_autorizacion',
            pagos_aplicacion: 'pagos_aplicacion'
        };
        this.init();
    }

    //inicializamos la base de datos
    init() {
        console.log('Initializing ERP Database...');
        if (!localStorage.getItem(this.prefix + this.collections.products)) {
            this.seedProducts();
        }
        if (!localStorage.getItem(this.prefix + this.collections.providers)) {
            this.seedProviders();
        }
        if (!localStorage.getItem(this.prefix + this.collections.estimaciones)) {
            this.save(this.collections.estimaciones, []);
        }
        if (!localStorage.getItem(this.prefix + this.collections.requisiciones)) {
            this.save(this.collections.requisiciones, []);
        }
        if (!localStorage.getItem(this.prefix + this.collections.ordenes_compra)) {
            this.save(this.collections.ordenes_compra, []);
        }
        if (!localStorage.getItem(this.prefix + this.collections.facturas_compra)) {
            this.save(this.collections.facturas_compra, []);
        }
        if (!localStorage.getItem(this.prefix + this.collections.pagos_autorizacion)) {
            this.save(this.collections.pagos_autorizacion, []);
        }
        if (!localStorage.getItem(this.prefix + this.collections.pagos_aplicacion)) {
            this.save(this.collections.pagos_aplicacion, []);
        }
    }

    // --- Operaciones Core ---

    getAll(collection) {
        const data = localStorage.getItem(this.prefix + collection);
        return data ? JSON.parse(data) : [];
    }

    save(collection, data) {
        localStorage.setItem(this.prefix + collection, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('db-update', { detail: { collection } }));
    }

    add(collection, item) {
        const items = this.getAll(collection);
        items.push(item);
        this.save(collection, items);
    }

    update(collection, id, updates) {
        let items = this.getAll(collection);
        items = items.map(item => item.id === id ? { ...item, ...updates } : item);
        this.save(collection, items);
    }

    generateFolio(prefix) {
        // Generar folios para los registros de cada modulo
        const collectionMap = {
            'ES': 'estimaciones',
            'REQ': 'requisiciones',
            'OC': 'ordenes_compra',
            'FAC': 'facturas_compra',
            'PA': 'pagos_autorizacion',
            'APP': 'pagos_aplicacion'
        };
        const collectionName = collectionMap[prefix];
        if (!collectionName) return `${prefix}-${Date.now()}`;

        const items = this.getAll(collectionName);
        const nextNum = items.length + 1;
        return `${prefix}-${String(nextNum).padStart(3, '0')}`;
    }

    seedProducts() {
        const products = [
            {
                id: 'PROD-001',
                sku: 'LAP-DELL-XPS',
                nombre: 'Laptop Dell XPS 15',
                clase: 'Electrónica',
                grupo: 'Cómputo',
                tipo_de_producto: 'Bien',
                unidad_medida: 'Pieza',
                costo: 25000.00,
                subtotal: 29000.00,
                observaciones: 'Equipo de alto rendimiento para desarrollo.'
            },
            {
                id: 'PROD-002',
                sku: 'MON-LG-4K',
                nombre: 'Monitor LG 27" 4K',
                clase: 'Electrónica',
                grupo: 'Periféricos',
                tipo_de_producto: 'Bien',
                unidad_medida: 'Pieza',
                costo: 8000.00,
                subtotal: 9500.00,
                observaciones: 'Monitor de alta resolución.'
            },
            {
                id: 'SERV-001',
                sku: 'LIC-OFFICE',
                nombre: 'Licencia Office 365 Anual',
                clase: 'Software',
                grupo: 'Licencias',
                tipo_de_producto: 'Servicio',
                unidad_medida: 'Unidad',
                costo: 1500.00,
                subtotal: 1500.00,
                observaciones: 'Renovación anual.'
            }
        ];
        console.log('Seeding Products...', products);
        this.save(this.collections.products, products);
    }

    //datos de proveedores default para evitar tabla vacia
    seedProviders() {
        const providers = [
            {
                clave: 'PROV-001',
                rfc: 'TEC900101XYZ',
                curp: 'N/A',
                nombre: 'Tecnología Avanzada SA de CV',
                tipo: 'Persona Moral',
                id_fiscal: 'TAX-MX-9001',
                limite_credito: 100000.00,
                tasa: 0.16,
                dias_pago: 30,
                dias_credito: 30,
                comprador: 'Juan Pérez',
                calle: 'Av. Reforma',
                no_exterior: '123',
                no_interior: '4B',
                colonia: 'Juárez',
                municipio: 'Cuauhtémoc',
                estado: 'CDMX',
                cp: '06600',
                email: 'contacto@techavanzada.com',
                telefono: '5551234567',
                observaciones: 'Proveedor certificado ISO 9001.'
            },
            {
                clave: 'PROV-002',
                rfc: 'PAP800505ABC',
                curp: 'N/A',
                nombre: 'Papelería Corporativa del Centro',
                tipo: 'Persona Moral',
                id_fiscal: 'TAX-MX-8005',
                limite_credito: 5000.00,
                tasa: 0.16,
                dias_pago: 15,
                dias_credito: 7,
                comprador: 'Maria Gomez',
                calle: 'Calle Madero',
                no_exterior: '45',
                no_interior: '',
                colonia: 'Centro',
                municipio: 'Monterrey',
                estado: 'Nuevo León',
                cp: '64000',
                email: 'ventas@papeleriacorporativa.com',
                telefono: '8181234567',
                observaciones: 'Suministros de oficina.'
            }
        ];
        console.log('Seeding Providers...', providers);
        this.save(this.collections.providers, providers);
    }

    getProductsCount() {
        return this.getAll(this.collections.products).length;
    }

    getProvidersCount() {
        return this.getAll(this.collections.providers).length;
    }
}

window.erpDB = new ERPDatabase();
