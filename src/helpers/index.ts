import { Row } from 'read-excel-file';
import { Product, VariantProduct, Target, Cliente, ContactItem, Fechas } from '../interfaces';

// Función para formatear el precio a dólares
export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('es-ES', {
		style: 'currency',
		currency: 'MXN',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};

// Función para preparar los productos
export const prepareProducts = (products: Product[]) => {
	return products.map(product => {
		// Agrupar los variantes por target
		const targets = product.variants.reduce(
			(acc: Target[], variant: VariantProduct) => {
				const existingTarget = acc.find(
					item => item.target === variant.target
				);

				if (existingTarget) {
					// Si ya existe el target, comparamos los precios
					existingTarget.price = Math.min(
						existingTarget.price,
						variant.price
					);
				} // Mantenemos el precio mínimo
				else {
					acc.push({
						target: variant.target,
						type: variant.type,
						kg: variant.kg,
						price: variant.price
					});
				}
				
				return acc;
			},
			[]
		);

		// Obtener el precio más bajo de las variantes agrupadas
		const price = Math.min(...targets.map(item => item.price));

		// Devolver el producto formateado
		return {
			...product,
			price,
			targets: targets.map(({ target, type, kg }) => ({ target, type, kg })),
			variants: product.variants,
		};
	});
};

// Función para preparar los clientes
export const prepareClients = (rows: Row[]) => {
	return rows.reduce((acc: Cliente[], cell: Row) => {
		const nombreCliente = formatString(cell[0].toString());
		const telefono = formatNumbers(cell[1].toString());
		const nombreMascota = formatString(cell[2].toString());
		const nombreRecordatorio = formatString(cell[3].toString());
		const tipoRecordatorio = formatString(cell[4].toString());
		const fecha = cell[5].toString();

		// Buscar o crear el cliente
		let cliente = acc.find(c => c.nombre === nombreCliente);
		if (!cliente) {
			cliente = {
				nombre: nombreCliente,
				telefono,
				mascotas: [],
				mensaje: [],
				status: false
			};
			acc.push(cliente);
		}

		// Buscar o crear la mascota
		let mascota = cliente.mascotas.find(m => m.nombre === nombreMascota);
		if (!mascota) {
			mascota = {
				nombre: nombreMascota,
				recordatorios: []
			};
			cliente.mascotas.push(mascota);
		}

		// Buscar o crear el recordatorio
		let recordatorio = mascota.recordatorios.find(r => r.nombre === nombreRecordatorio);
		if (!recordatorio) {
			recordatorio = {
				nombre: nombreRecordatorio,
				tipos: []
			};
			mascota.recordatorios.push(recordatorio);
		}

		// Agregar el tipo de recordatorio si no existe
		const existeTipo = recordatorio.tipos.some(t => t.nombre === tipoRecordatorio && t.fecha === fecha);
		if (!existeTipo) {
			recordatorio.tipos.push({
				nombre: tipoRecordatorio,
				fecha
			});
		}

		return acc;
	}, []);
};

// Función para preparar los clientes
export const prepareClientsTransport = (rows: Row[]) => {
	return rows.reduce((acc: Fechas[], cell: Row) => {
		const fecha = formatString(cell[0].toString());
		const hora = formatString(cell[1].toString());
		const nombreCliente = formatString(cell[2].toString());
		const nombreMascota = formatString(cell[3].toString());
		const razaMascota = formatString(cell[4].toString());
		const asunto = formatString(cell[5].toString());

		// Buscar o crear la fecha
		let fechaItem = acc.find(item => item.fecha === fecha);
		if (!fechaItem) {
			fechaItem = { fecha, clientes: [] };
			acc.push(fechaItem);
		}

		// Buscar cliente por nombre
		let cliente = fechaItem.clientes.find(c => c.nombre === nombreCliente);

		if (!cliente) {
			cliente = {
				hora,
				nombre: nombreCliente,
				status: '',
				mascotas: [],
			};
			fechaItem.clientes.push(cliente);
		}

		// Buscar si ya existe la mascota por nombre
		let mascota = cliente.mascotas.find(m => m.nombre === nombreMascota);

		if (!mascota) {
			cliente.mascotas.push({
				nombre: nombreMascota,
				raza: razaMascota,
				asunto: asunto,
			});
		} else {
			// Acumular el asunto si no está incluido
			if (!mascota.asunto.includes(asunto)) {
				mascota.asunto += `, ${asunto}`;
			}
		}

		return acc;
	}, []);
};

// Función para preparar los contactos
export const prepareContacts = (contacts: ContactItem[]) => {
	const result = contacts.reduce(
		(acc: Cliente[], contact: ContactItem) => {
			if (contact.isMyContact && contact.id.server === 'c.us') {
				acc.push({
					nombre: contact.name,
					telefono: contact.number.slice(-10),
					mascotas: [],
					mensaje: [],
					status: false
				});
			}
			return acc;
		},
		[]
	);
	// Ordenar alfabéticamente por nombre
	result.sort((a, b) => a.nombre.localeCompare(b.nombre));

	return result;
};

// Función para formatear la fecha a formato 3 de enero de 2022
export const formatDateLong = (date: string): string => {
	const dateObject = new Date(date);

	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	});
};

// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
	switch (status) {
		case 'Pending':
			return 'Pendiente';
		case 'Paid':
			return 'Pagado';
		case 'Shipped':
			return 'Enviado';
		case 'Delivered':
			return 'Entregado';
		default:
			return status;
	}
};

// Función para generar el slug de un producto
export const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
};

// Función para extraer el path relativo al bucket de una URL
export const extractFilePath = (url: string) => {
	const parts = url.split(
		'/storage/v1/object/public/product-images/'
	);
	// EJEMPLO PARTS: ['/storage/v1/ object/public/product-images/', '02930920302302030293023-Royal Canin.jpg']

	if (parts.length !== 2) {
		throw new Error(`URL de imagen no válida: ${url}`);
	}

	return parts[1];
};

// Función para formatear texto a formato Oración
export const formatString = (cadena: string) => {
	if (cadena === null || cadena === '') {
		return '';
	}
	let oracion = "";
    oracion = cadena.replace(/[-_]/g, " ");
    let palabras = oracion.toLowerCase().split(" ").map((palabra) => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    return palabras.join(" ");
};

// Función para extraer solo números
export const formatNumbers = (cadena: string) => {
    const numbers = "0123456789";
    let numeros = "";
    for(let i = 0; i < cadena.length; i++) {
        for(let x = 0; x < numbers.length; x++) {
            if(cadena.charAt(i) === numbers.charAt(x)){
                numeros += cadena.charAt(i);
                break;
            }
        }
    }
    return numeros;
};