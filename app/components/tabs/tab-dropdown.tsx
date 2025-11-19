'use client'

import { cn } from '@/app/lib/utils'
import { ChevronDown, Pin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Tab } from './types'

interface TabDropdownProps {
	tabs: Tab[]
	activeTabId?: string
	onPin: (id: string) => void
}

export function TabDropdown({ tabs, activeTabId, onPin }: TabDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	if (tabs.length === 0) return null

	const hasActiveHidden = tabs.some(t => t.id === activeTabId)

	return (
		<div
			className='relative border-l border-gray-200 z-20 bg-white  flex items-center'
			ref={dropdownRef}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'px-3 py-2 h-full flex items-center hover:bg-gray-50 transition-colors',
					(isOpen || hasActiveHidden) && 'text-blue-600 bg-gray-50'
				)}
			>
				{hasActiveHidden && (
					<span className='text-xs font-bold px-1.5 py-0.5 bg-blue-100 rounded flex items-center justify-center min-w-[1.5rem]'>
						{tabs.length}
					</span>
				)}
				<ChevronDown
					color='#999'
					size={24}
					className={cn(isOpen && 'rotate-180')}
				/>
			</button>

			{isOpen && (
				<div className='absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50'>
					{tabs.map(tab => (
						<div
							key={tab.id}
							onClick={() => {
								router.push(tab.url)
								setIsOpen(false)
							}}
							className={cn(
								'flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-50',
								activeTabId === tab.id
									? 'text-blue-600 bg-blue-50'
									: 'text-gray-700'
							)}
						>
							{tab.pinned && <Pin className='w-3 h-3 mr-2 fill-current' />}
							<span className='flex-1 truncate'>{tab.label}</span>
							<button
								onClick={e => {
									e.stopPropagation()
									onPin(tab.id)
								}}
								className='ml-2 p-1 hover:bg-gray-200 rounded'
							>
								<Pin
									className={cn(
										'w-3 h-3',
										tab.pinned && 'fill-current text-blue-600'
									)}
								/>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
