import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ProductFormValues,	productSchema } from '../../../lib/validators';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionFormProduct } from './SectionFormProduct';
import { InputForm } from './InputForm';
import { useEffect } from 'react';
import { VariantsInput } from './VariantsInput';
import { UploaderImages } from './UploaderImages';
import { Editor } from './Editor';
import { useCreateProduct, useProduct, useUpdateProduct } from '../../../hooks';
import { Loader } from '../../shared/Loader';
import { JSONContent } from '@tiptap/react';
import { formatString, generateSlug } from '../../../helpers';

interface Props {
	titleForm: string;
}

export const FormProduct = ({ titleForm }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		control,
	} = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
	});

	const { slug } = useParams<{ slug: string }>();

	const { product, isLoading } = useProduct(slug || '');
	const { mutate: createProduct, isPending } = useCreateProduct();
	const { mutate: updateProduct, isPending: isUpdatePending } =
		useUpdateProduct(product?.id || '');

	const navigate = useNavigate();

	useEffect(() => {
		if (product && !isLoading) {
			setValue('name', product.name);
			setValue('slug', product.slug);
			setValue('brand', product.brand);
			setValue('description', product.description as JSONContent);
			setValue('images', product.images);
			setValue(
				'variants',
				product.variants.map(v => ({
					id: v.id,
					stock: v.stock,
					price: v.price,
					type: v.type,
					target: v.target,
					kg: v.kg,
				}))
			);
		}
	}, [product, isLoading, setValue]);

	const onSubmit = handleSubmit(data => {

		if (slug) {
			updateProduct({
				name: formatString(data.name),
				brand: formatString(data.brand),
				slug: formatString(data.slug),
				variants: data.variants,
				images: data.images,
				description: data.description,
			});
		} else {
			createProduct({
				name: formatString(data.name),
				brand: formatString(data.brand),
				slug: formatString(data.slug),
				variants: data.variants,
				images: data.images,
				description: data.description,
			});
		}
	});

	const watchName = watch('name');

	useEffect(() => {
		if (!watchName) return;

		const generatedSlug = generateSlug(watchName);
		setValue('slug', generatedSlug, { shouldValidate: true });
	}, [watchName, setValue]);

	if (isPending || isUpdatePending || isLoading) return <Loader />;

	return (
		<div className="flex flex-col gap-6 relative px-4 sm:px-6 lg:px-0">
			{/* Header */}
			<div className="flex justify-between items-center flex-wrap gap-3">
				<div className="flex items-center gap-3">
					<button
						className="bg-white p-2 rounded-md shadow-sm border border-slate-200 transition-all group hover:scale-105"
						onClick={() => navigate(-1)}
					>
						<IoIosArrowBack size={18} className="transition-all group-hover:scale-125" />
					</button>
					<h2 className="font-bold tracking-tight text-xl sm:text-2xl capitalize">
						{titleForm}
					</h2>
				</div>

				{/* Botones móviles se mueven aquí */}
				<div className="flex gap-2 mt-2 sm:mt-0 sm:absolute sm:top-0 sm:right-0">
					<button
						className="btn-secondary bg-red-500 px-3 py-1.5 rounded-md text-white hover:bg-yellow-500 text-sm"
						type="button"
						onClick={() => navigate(-1)}
					>
						Cancelar
					</button>
					<button
						className="bg-cyan-600 hover:bg-yellow-500 px-3 py-1.5 rounded-md text-white text-sm"
						type="submit"
						form="form-producto"
					>
						Guardar Producto
					</button>
				</div>
			</div>

			{/* Formulario */}
			<form
				id="form-producto"
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
				onSubmit={onSubmit}
			>
				<SectionFormProduct
					titleSection="Detalles del Producto"
					className="lg:col-span-2 lg:row-span-2"
				>
					<InputForm
						type="text"
						label="Nombre"
						name="name"
						register={register}
						errors={errors}
						required
					/>
				</SectionFormProduct>

				<SectionFormProduct>
					<InputForm
						type="text"
						label="Slug"
						name="slug"
						register={register}
						errors={errors}
					/>

					<InputForm
						type="text"
						label="Marca"
						name="brand"
						register={register}
						errors={errors}
						required
					/>
				</SectionFormProduct>

				<SectionFormProduct
					titleSection="Variantes del Producto"
					className="lg:col-span-2 h-fit"
				>
					<VariantsInput control={control} errors={errors} register={register} />
				</SectionFormProduct>

				<SectionFormProduct titleSection="Imágenes del producto">
					<UploaderImages errors={errors} setValue={setValue} watch={watch} />
				</SectionFormProduct>

				<SectionFormProduct
					titleSection="Descripción del producto"
					className="col-span-full"
				>
					<Editor
						setValue={setValue}
						errors={errors}
						initialContent={product?.description as JSONContent}
					/>
				</SectionFormProduct>
			</form>
		</div>
	);
};