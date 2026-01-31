# Sistema ERP simulando un flujo de Proveedores y Facturación

Este proyecto es una prueba técnica de un módulo funcional de un ERP, enfocado en la simulación de un proceso empresarial real.
El flujo comienza con la gestión de proveedores, seguido de la creación de estimaciones, requisiciones, órdenes de compra, facturación y tesorería.

# Tecnologías Utilizadas
Core: HTML5, Javascript.
Framework: Tailwind CSS (con CDN).
Base de Datos: 'LocalStorage' (Simulación de base de datos NoSQL mediante clase 'ERPDatabase').
Generación de Documentos PDF: 'html2pdf.js' para renderizar Órdenes de Compra y Facturas.
Iconografía: Heroicons (SVG).

Para realizar una simulación de un sistema de una empresa se simularon los siguientes datos:
Razon social: Muebles Sol S.A de C.V.
Direccion: Av. Principal #123, Col. Centro, C.P. 12345, Monterrey, Nuevo León, México
Telefono: 8112345678
RFC: MSL900101XYZ


¿Qué decisiones tomaste y por qué?

1. Agregra un módulo de estimaciones para poder deducir si hay presupuesto para el producto o servicio que se va a adquirir y saber quien lo solicita.
2. Agregar un módulo de requisiciones para poder solicitar el producto o servicio que se va a adquirir. agregra el sku del producto o servicio y quien va a realizar la requisición.
3. Módulo de Orden de Compra donde se selecciona el proveedor, se establece una fecha límite de compra, un porcentaje de tolerancia de variación de precio.
4. Módulo de Facturas de compra, donde se solicita una pre-factura al proveedor, establecer el tipo de pago PPD y PUE, como sucede en México, y un apartado de Facturas recibidas donde se muestran las facturas que se han recibido, timbrado con el SAT, fecha y número de folio fiscal.
5. Módulo de autorización de pagos, aquí la tesorería autoriza los pagos a los proveedores y se genera el complemento de pago si es necesario. Una simulación de un recibo de ticket de pago entregado al proveedor, en donde se simula el caso donde se comprueba que se realizó el pago de alguna forma.
6. Módulo de Aplicación de Pagos, aquí se aplica el pago a la factura de compra y se genera el complemento de pago si es un pago PPD, caso contrario se recibe la factura de forma directa.
7. Catalogo de proveedores, aquí se pueden agregar proveedores.

¿Qué dejé fuera y por qué?

- Se simuló un caso ideal de flujo de proveedores al realizar las pre-facturas, no se consideraron casos donde el proveedor no entregue la pre-factura o la entregue con errores debido a que es una simulación y no se implementó un sistema de validación de datos.
- Tampoco cuando el comprador realiza la compra, se expede un comprobante de compra y este se entrega al proveedor por un canal, el proveedor lo recibe y lo timbra con el SAT, se genera el complemento de pago si es necesario ya que no se cuenta con un sistema de timbrado de facturas.
- No se consideraron casos donde el proveedor no entregue la factura en tiempo y forma, o que la factura tenga errores y se tenga que corregir porque no se está realizando una compra real a una entidad proveedora.

¿Qué hubieras hecho diferente si hubieras tenido más tiempo?
- Implementar un módulo de inventario para poder gestionar los productos y servicios que se van a adquirir o que en este caso se solicitan periodicamente.
- Realizar ordenes de compra directas sin pasar por el módulo de requisiciones, esto para casos donde se requiera necesitar de productos o servicios que se solicitan periodicamente y que el proveedor ya se tiene registrado en el sistema o es de confianza, también si se necesita de urgencia.
- Agregar un módulo de consignación, donde se pueden tener productos en consignación y se paga al proveedor solo la cantidad que se ha utilizado, esto principalemente para productos de consumo periódico, que solo pueden adquirirse en grandes volúmenes, a su vez un módulo adicional de devoluciones para productos en consignación.
- Agregar un módulo de remisiones de compra, donde se pueden registrar las remisiones de compra que se reciben de los proveedores, esto para tener un control de los productos que se reciben y que se van a utilizar.
- Implementar roles de usuario, para poder tener un control de los usuarios que tienen acceso al sistema y que tipo de acciones pueden realizar, gestionar permisos, etc.




