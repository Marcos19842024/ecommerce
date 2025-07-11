import { IoAddCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { TableProduct } from '../../components/dashboard';

export const DashboardProductsPage = () => {
	return (
		<div
			className='h-full flex flex-col gap-2'>
			<Link
				to='/dashboard/productos/new'
				className='bg-cyan-600 hover:bg-yellow-500 text-white flex items-center self-end py-[6px] px-2 rounded-md gap-1'>
				<IoAddCircleOutline className='inline-block' />Nuevo Producto
			</Link>
            <TableProduct />
		</div>
	);
};