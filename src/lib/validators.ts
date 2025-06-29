import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const userRegisterSchema = z.object({
	email: z.string().email('El correo electrónico no es válido'),
	password: z
		.string()
		.min(6, 'La contraseña debe tener al menos 6 caracteres'),
	fullName: z.string().min(1, 'El nombre completo es requerido'),
	phone: z.string().min(10, 'El numero de teléfono debe ser de 10 digitos'),
});

export const addressSchema = z.object({
	addressLine1: z
		.string()
		.min(1, 'La dirección es requerida')
		.max(100, 'La dirección no debe exceder los 100 carácteres'),
	addressLine2: z
		.string()
		.max(100, 'La dirección no debe exceder los 100 carácteres')
		.optional(),
	city: z
		.string()
		.min(1, 'La ciudad es requerida')
		.max(50, 'La ciudad no debe exceder los 50 carácteres'),
	state: z
		.string()
		.min(1, 'El estado es requerido')
		.max(50, 'El estado no debe exceder los 50 carácteres'),
	postalCode: z
		.string()
		.max(5, 'El código postal no debe exceder los 5 carácteres'),
});

export type UserRegisterFormValues = z.infer<typeof userRegisterSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;

const isContentEmpty = (value: JSONContent): boolean => {
	if (
		!value ||
		!Array.isArray(value.content) ||
		value.content.length == 0
	) {
		return true;
	}

	return !value.content.some(
		node =>
			node.type === 'paragraph' &&
			node.content &&
			Array.isArray(node.content) &&
			node.content.some(
				textNode =>
					textNode.type === 'text' &&
					textNode.text &&
					textNode.text.trim() !== ''
			)
	);
};

export const productSchema = z.object({
	name: z.string().min(1, 'El nombre del producto es obligatorio'),
	brand: z.string().min(1, 'La marca del producto es obligatoria'),
	slug: z
		.string().min(1, 'El slug del producto es obligatorio')
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
	description: z.custom<JSONContent>(
		value => !isContentEmpty(value),
		{ message: 'La descripción no puede estar vacía' }
	),
	variants: z
		.array(
			z.object({
				id: z.string().optional(),
				stock: z.number(),
				price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
				target: z.string().min(1, 'El objetivo es requerido'),
				type: z.string().min(1, 'El tipo es requerido'),
				kg: z.number().min(0.01, 'El peso es requerido'),
			})
		)
		.min(1, 'Debe haber al menos una variante'),
	images: z.array(z.any()).min(1, 'Debe haber al menos una imagen'),
});

export type ProductFormValues = z.infer<typeof productSchema>;