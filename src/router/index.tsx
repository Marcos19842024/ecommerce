import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { ClientLayout } from '../layouts/ClientLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import {
	HomePage,
	ProductsPage,
	AboutPage,
	ProductPage,
	LoginPage,
	RegisterPage,
	OrdersUserPage,
	CheckoutPage,
	ThankyouPage,
	OrderUserPage,
	DashboardProductsPage,
	DashboardNewProductPage,
	DashboardProductSlugPage,
	DashboardOrdersPage,
	DashboardOrderPage,
	DashboardTransportPage,
	DashboardRemindersPage,
	TermsPage,
	PrivacyNoticePage,
	FeedBackPage,
	DashboardExpenseReportPage,
	DashboardReadBillPage,
} from '../pages';
import { DashboardProfilePage } from '../pages/dashboard/DashboardProfilePage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: 'products',
				element: <ProductsPage />,
			},
			{
				path: 'products/:slug',
				element: <ProductPage />,
			},
			{
				path: 'nosotros',
				element: <AboutPage />,
			},
			{
				path: 'aviso_de_privacidad',
				element: <PrivacyNoticePage />,
			},
			{
				path: 'terminos_y_condiciones',
				element: <TermsPage />,
			},
			{
				path: 'login',
				element: <LoginPage />,
			},
			{
				path: 'registro',
				element: <RegisterPage />,
			},
			{
				path: 'feedback',
				element: <FeedBackPage />,
			},
			{
				path: 'account',
				element: <ClientLayout />,
				children: [
					{
						path: '',
						element: <Navigate to='/account/pedidos' />,
					},
					{
						path: 'pedidos',
						element: <OrdersUserPage />,
					},
					{
						path: 'pedidos/:id',
						element: <OrderUserPage />,
					},
				],
			},
		],
	},
	{
		path: '/checkout',
		element: <CheckoutPage />,
	},
	{
		path: '/checkout/:id/thank-you',
		element: <ThankyouPage />,
	},
	{
		path: '/dashboard',
		element: <DashboardLayout />,
		children: [
			{
				index: true,
				element: <Navigate to='/dashboard/productos' />,
			},
			{
				path: 'productos',
				element: <DashboardProductsPage />,
			},
			{
				path: 'productos/new',
				element: <DashboardNewProductPage />,
			},
			{
				path: 'productos/editar/:slug',
				element: <DashboardProductSlugPage />,
			},
			{
				path: 'ordenes',
				element: <DashboardOrdersPage />,
			},
			{
				path: 'ordenes/:id',
				element: <DashboardOrderPage />,
			},
			{
				path: 'mensajes',
				element: <DashboardRemindersPage />,
			},
			{
				path: 'transportes',
				element: <DashboardTransportPage />,
			},
			{
				path: 'reporte',
				element: <DashboardExpenseReportPage />,
			},
			{
				path: 'facturas',
				element: <DashboardReadBillPage />,
			},
			{
				path: 'usuarios',
				element: <DashboardProfilePage />,
			},
		],
	},
]);