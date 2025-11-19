'use client'

import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

import { TabDropdown } from './tab-dropdown'
import { TabItem } from './tab-item'
import { Tab } from './types'

import { usePersistedTabs } from '../../hooks/use-persisted-tabs'
import { PinnedTabsMenu } from './pinned-menu'
import { useTabsOverflow } from './use-tabs-overflow'

interface TabsProps {
	initialTabs: Tab[]
}

export default function Tabs({ initialTabs }: TabsProps) {
	const { tabs, moveTab, togglePin, closeTab, isLoaded } =
		usePersistedTabs(initialTabs)
	const containerRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (active.id !== over?.id && over) {
			moveTab(active.id as string, over.id as string)
		}
	}
	const activeTabId = tabs.find(t => t.url === pathname)?.id

	const notPinnedTabIds = tabs.filter(t => !t.pinned || activeTabId === t.id)

	const visibleCount = useTabsOverflow(containerRef, notPinnedTabIds)
	const visibleTabs = notPinnedTabIds.slice(0, visibleCount)
	const overflowTabs = notPinnedTabIds.slice(visibleCount)

	const draggableTabIds = visibleTabs.filter(t => !t.pinned).map(t => t.id)
	if (!isLoaded)
		return (
			<div className='h-10 w-full bg-gray-100 animate-pulse rounded-t-lg' />
		)

	return (
		<div className='w-full bg-gray-100 p-2  '>
			<div className='flex items-center bg-white shadow-sm rounded-t-lg border-b border-gray-200 relative'>
				<div className='flex-1 min-w-0 flex items-center '>
					<div ref={containerRef} className='w-full flex items-center '>
						<PinnedTabsMenu
							pinnedTabs={tabs.filter(t => t.pinned && activeTabId !== t.id)}
							onUnpin={togglePin}
							onClose={closeTab}
						/>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
							modifiers={[restrictToHorizontalAxis]}
						>
							<SortableContext
								items={draggableTabIds}
								strategy={horizontalListSortingStrategy}
							>
								{visibleTabs.map(tab => (
									<TabItem
										key={tab.id}
										tab={tab}
										isActive={activeTabId === tab.id}
										onPin={togglePin}
										onClose={closeTab}
										isDragDisabled={tab.pinned}
									/>
								))}
							</SortableContext>
						</DndContext>
					</div>
				</div>

				{/* Показуємо кнопку, якщо є приховані таби */}
				{overflowTabs.length > 0 && (
					<TabDropdown
						tabs={overflowTabs}
						activeTabId={activeTabId}
						onPin={togglePin}
					/>
				)}
			</div>
		</div>
	)
}
