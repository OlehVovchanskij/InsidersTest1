import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { Tab } from '../components/tabs/types'

export function usePersistedTabs(initialTabs: Tab[]) {
	const [tabs, setTabs] = useState<Tab[]>(initialTabs)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		const saved = localStorage.getItem('tabs-state')
		if (saved) {
			try {
				setTabs(JSON.parse(saved))
			} catch (e) {}
		}
		setIsLoaded(true)
	}, [])

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('tabs-state', JSON.stringify(tabs))
		}
	}, [tabs, isLoaded])

	const moveTab = useCallback((activeId: string, overId: string) => {
		setTabs(items => {
			const oldIndex = items.findIndex(item => item.id === activeId)
			const newIndex = items.findIndex(item => item.id === overId)
			return arrayMove(items, oldIndex, newIndex)
		})
	}, [])

	const togglePin = useCallback((id: string) => {
		setTabs(prev => {
			const newTabs = prev.map(tab =>
				tab.id === id ? { ...tab, pinned: !tab.pinned } : tab
			)
			return newTabs.sort((a, b) => {
				if (a.pinned === b.pinned) return 0
				return a.pinned ? -1 : 1
			})
		})
	}, [])

	const closeTab = useCallback((id: string) => {
		setTabs(prev => prev.filter(t => t.id !== id))
	}, [])

	return {
		tabs,
		moveTab,
		togglePin,
		closeTab,
		isLoaded,
	}
}
