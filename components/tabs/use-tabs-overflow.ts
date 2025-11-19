import { RefObject, useEffect, useState } from 'react'
import { Tab } from './types'

export function useTabsOverflow(
	containerRef: RefObject<HTMLDivElement | null>,
	tabs: Tab[]
) {
	const [visibleCount, setVisibleCount] = useState(tabs.length)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const dropdownTriggerWidth = 52
		const tabPaddingX = 16
		const pinnedWidth = 40
		const gap = 0

		const calculate = () => {
			if (!container) return

			const containerWidth = container.getBoundingClientRect().width
			const availableWidth = containerWidth - dropdownTriggerWidth - 40

			const ghost = document.createElement('div')
			try {
				ghost.style.position = 'absolute'
				ghost.style.visibility = 'hidden'
				ghost.style.height = 'auto'
				ghost.style.whiteSpace = 'nowrap'
				ghost.style.display = 'inline-block'
				ghost.style.boxSizing = 'border-box'
				ghost.style.fontSize = '0.875rem'
				ghost.style.fontWeight = '500'

				ghost.style.paddingLeft = `${tabPaddingX}px`
				ghost.style.paddingRight = `${tabPaddingX}px`

				ghost.className = 'font-sans text-sm font-medium'
				document.body.appendChild(ghost)

				let currentWidth = 0
				let count = 0

				for (const tab of tabs) {
					let itemWidth = 0

					if (tab.pinned) {
						itemWidth = pinnedWidth + gap
					} else {
						const text = tab.label ?? (tab as any).label ?? ''
						ghost.textContent = text

						const w = ghost.getBoundingClientRect().width
						itemWidth = Math.ceil(w) + gap
					}

					if (currentWidth + itemWidth <= availableWidth) {
						currentWidth += itemWidth + 50
						count++
					} else {
						break
					}
				}

				if (count >= tabs.length) {
					setVisibleCount(tabs.length)
				} else {
					setVisibleCount(Math.max(1, count))
				}
			} finally {
				if (ghost.parentElement) ghost.parentElement.removeChild(ghost)
			}
		}

		const ro = new ResizeObserver(() => {
			window.requestAnimationFrame(calculate)
		})
		ro.observe(container)

		const onWin = () => window.requestAnimationFrame(calculate)
		window.addEventListener('resize', onWin)

		calculate()

		return () => {
			ro.disconnect()
			window.removeEventListener('resize', onWin)
		}
	}, [tabs])

	return visibleCount
}
