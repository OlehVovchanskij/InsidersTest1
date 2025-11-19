'use client'

import { Pin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Tab } from './types'

interface PinnedTabsMenuProps {
	pinnedTabs: Tab[]
	onUnpin: (id: string) => void
	onClose: (id: string) => void
}

export function PinnedTabsMenu({
	pinnedTabs,
	onUnpin,
	onClose,
}: PinnedTabsMenuProps) {
	const [open, setOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement | null>(null)
	const router = useRouter()

	return (
		<div
			ref={rootRef}
			className='relative border-l border-gray-200 z-20 bg-white  flex items-center'
		>
			<button
				type='button'
				onClick={() => setOpen(v => !v)}
				className='flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 focus:outline-none'
			>
				<Pin className='w-4 h-4' color='#999' />
			</button>

			{open && (
				<div className='absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50'>
					<div className='p-2 text-sm text-gray-500'>Pinned tabs</div>
					<div className=' overflow-auto'>
						{pinnedTabs.length === 0 && (
							<div className='px-3 py-2 text-xs text-gray-400'>
								No pinned tabs
							</div>
						)}
						{pinnedTabs.map(tab => (
							<div
								key={tab.id}
								className='flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer'
							>
								<div
									className='truncate text-sm text-gray-700'
									onClick={() => {
										setOpen(false)
										router.push(tab.url)
									}}
								>
									<div className='flex items-center gap-2'>
										<Pin className='w-3 h-3 text-gray-400' />
										<span className='truncate'>{tab.label}</span>
									</div>
								</div>

								<div className='flex items-center gap-1'>
									<button
										onClick={e => {
											e.stopPropagation()
											onUnpin(tab.id)
										}}
										className='p-1 rounded hover:bg-gray-100 text-gray-500'
										title='Відкріпити'
									>
										{/* reuse Pin icon as "unpin" action */}
										<Pin className='w-3 h-3' />
									</button>
									<button
										onClick={e => {
											e.stopPropagation()
											onClose(tab.id)
										}}
										className='p-1 rounded hover:bg-gray-100 text-red-500'
										title='Закрити'
									>
										<X className='w-3 h-3' />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
