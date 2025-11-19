import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Tabs from '@/components/tabs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Tabs App',
	description: 'Next.js Tabs System',
}

const INITIAL_TABS = [
	{ id: 'dashboard', label: 'Dashboard', url: '/', pinned: true },
	{ id: 'banking', label: 'Banking', url: '/banking', pinned: false },
	{ id: 'accounting', label: 'Accounting', url: '/accounting', pinned: false },
	{ id: 'sales', label: 'Sales', url: '/sales', pinned: false },
	{ id: 'statistics', label: 'Statistics', url: '/statistics', pinned: false },
	{ id: 'post', label: 'Post Office', url: '/post', pinned: false },
	{ id: 'admin', label: 'Administration', url: '/admin', pinned: false },
	{ id: 'help', label: 'Help', url: '/help', pinned: false },
]

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<div className='flex flex-col min-h-screen bg-gray-100 overflow-hidden'>
					<div className='sticky top-0 z-50 '>
						<Tabs initialTabs={INITIAL_TABS} />
					</div>

					<main className='flex-1 p-6'>
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-6rem)] p-6'>
							{children}
						</div>
					</main>
				</div>
			</body>
		</html>
	)
}
