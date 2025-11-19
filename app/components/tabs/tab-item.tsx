'use client'

import { cn } from '@/app/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Tab } from './types'

interface TabItemProps {
	tab: Tab
	isActive: boolean
	onPin: (id: string) => void
	onClose: (id: string) => void
	isDragDisabled?: boolean
}

export function TabItem({
	tab,
	isActive,
	onPin,
	onClose,
	isDragDisabled,
}: TabItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: tab.id,
		data: { tab },
		disabled: isDragDisabled,
	})

	const router = useRouter()

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 50 : 'auto',
		opacity: isDragging ? 0.5 : 1,

		cursor: isDragDisabled ? 'pointer' : 'grab',
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'group relative flex items-center gap-2 px-4 py-2 text-sm font-medium select-none transition-colors border-r border-gray-200 min-w-fit h-10 bg-white hover:bg-gray-50',
				isActive && 'bg-white text-blue-600 border-t-3 border-t-blue-600',
				!isActive && 'text-gray-600',
				tab.pinned && 'bg-gray-50 pl-3 pr-3 justify-center',
				isDragging && 'cursor-grabbing bg-gray-600 text-white'
			)}
			{...attributes}
			{...(!isDragDisabled ? listeners : {})}
			onClick={e => {
				e.preventDefault()
				router.push(tab.url)
			}}
		>
			{tab.pinned && (
				<>
					<Pin className='w-3 h-3 rotate-45 fill-current' />
					<span>{tab.label}</span>
				</>
			)}

			{!tab.pinned && <span className='whitespace-nowrap'>{tab.label}</span>}

			<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2'>
				<button
					onClick={e => {
						e.stopPropagation()
						onPin(tab.id)
					}}
					className='p-0.5 hover:bg-gray-200 rounded'
				>
					<Pin
						className={cn(
							'w-3 h-3',
							tab.pinned && 'fill-current text-blue-600'
						)}
					/>
				</button>
				<button
					onClick={e => {
						e.stopPropagation()
						onClose(tab.id)
					}}
					className='p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-red-500'
				>
					<X className='w-3 h-3' />
				</button>
			</div>
		</div>
	)
}
