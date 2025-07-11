import {
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import { ProductFormValues } from '../../../lib/validators';
import { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface ImagePreview {
	file?: File;
	previewUrl: string;
}

interface Props {
	setValue: UseFormSetValue<ProductFormValues>;
	watch: UseFormWatch<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
}

export const UploaderImages = ({
	setValue,
	errors,
	watch,
}: Props) => {
	const [images, setImages] = useState<ImagePreview[]>([]);

	// Verificar si hay errores con las imágenes
	const formImages = watch('images');

	// Cargar imágenes existentes si las hay en el formulario
	useEffect(() => {
		if (formImages && formImages.length > 0 && images.length == 0) {
			const existingImages = formImages.map(url => ({
				previewUrl: url,
			}));
			setImages(existingImages);

			// Actualizar el valor del formulario
			setValue('images', formImages);
		}
	}, [formImages, images.length, setValue]);

	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files).map(file => ({
				file,
				previewUrl: URL.createObjectURL(file),
			}));

			const updatedImages = [...images, ...newImages];

			setImages(updatedImages);

			setValue(
				'images',
				updatedImages.map(img => img.file || img.previewUrl)
			);
		}
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);

		setValue(
			'images',
			updatedImages.map(img => img.file || img.previewUrl)
		);
	};

	return (
		<>
			<input
				type='file'
				id='inputfile'
				accept='image/*'
				multiple
				onChange={handleImageChange}
				hidden
			/>
			<label
				htmlFor="inputfile"
				className='bg-cyan-600 w-full text-white flex items-center justify-center self-end py-[6px] px-2 rounded-md text-sm gap-1 font-semibold hover:bg-yellow-500'>
				<span><i className="fa fa-cloud-upload fa-2x px-2"></i></span>
				<p>Click To Upload File</p>
            </label>

			<div className='grid grid-cols-4 lg:grid-cols-2 gap-4'>
				{images.map((image, index) => (
					<div key={index}>
						<div className='border border-gray-200 w-full h-20 rounded-md p-1 relative lg:h-28'>
							<img
								src={image.previewUrl}
								alt={`Preview ${index}`}
								className='rounded-md w-full h-full object-contain'
							/>
							<button
								type='button'
								onClick={() => handleRemoveImage(index)}
								className='flex justify-end absolute -top-3 -right-4 hover:scale-110 transition-all z-10'
							>
								<IoIosCloseCircleOutline
									size={22}
									className='text-red-500'
								/>
							</button>
						</div>
					</div>
				))}
			</div>

			{formImages?.length === 0 && errors.images && (
				<p className='text-red-500 text-xs mt-1'>
					{errors.images.message}
				</p>
			)}
		</>
	);
};