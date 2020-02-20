/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useCallback, useState } from 'react'
import { TimeDomain } from '../interfaces'

const NO_OP = () => null

export interface IOverlayProps {
	height: number
	width: number
	x: number
	xScale: any
	highlightColor: string
	onDrag?: (bounds: TimeDomain) => void
	onClick?: (x: number, y: number, ctrl: boolean) => void
	timeScrub?: TimeDomain
}

export const Overlay: React.FC<IOverlayProps> = memo(function Overlay({
	height,
	width,
	x,
	xScale,
	highlightColor,
	timeScrub: timeScrubProps,
	onDrag = NO_OP,
	onClick = NO_OP,
}) {
	const [dragStart, setDragStart] = useState<number | null>(null)
	const [dragEnd, setDragEnd] = useState<number | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const timeScrub = isDragging ? [dragStart, dragEnd] : timeScrubProps

	// TODO: re-enable this when we can support time scrubbing in tandem with category selection
	/*const dragEndTime = +Date.now()
		const timeDiff = dragEndTime - this.state.dragStartTime
		const distDiff = this.dragEnd - this.dragStart
		return timeDiff > CLICK_TIME_CUTOFF || distDiff > CLICK_DISTANCE_CUTOFF*/
	const isDragAction = false

	const cutDrag = useCallback(
		(evt: React.MouseEvent): void => {
			if (isDragAction) {
				const bounds = [
					xScale.invert(dragStart),
					xScale.invert(dragEnd),
				] as TimeDomain
				onDrag(bounds)
			} else {
				onClick(evt.clientX, evt.clientY, evt.ctrlKey || evt.metaKey)
			}
			setDragStart(null)
			setDragEnd(null)
			setIsDragging(false)
		},
		[xScale, dragStart, dragEnd, isDragAction, onClick, onDrag],
	)

	const onMouseDown = useCallback(
		(evt: React.MouseEvent): void => {
			if (isDragging) {
				cutDrag(evt)
			} else {
				setDragEnd(evt.clientX)
				setDragStart(evt.clientX)
				setIsDragging(true)
			}
		},
		[isDragging, cutDrag, setDragEnd, setDragStart, setIsDragging],
	)

	const onMouseUp = useCallback(
		(evt: React.MouseEvent): void => {
			if (isDragging) {
				cutDrag(evt)
			}
		},
		[isDragging, cutDrag],
	)

	const onMouseMove = useCallback(
		(evt: React.MouseEvent): void => {
			if (isDragging) {
				setDragEnd(evt.clientX)
			}
		},
		[isDragging, setDragEnd],
	)

	const onMouseLeave = useCallback(
		(evt: React.MouseEvent): void => {
			if (isDragging) {
				cutDrag(evt)
			}
		},
		[isDragging, cutDrag],
	)

	const scrub =
		timeScrub == null || timeScrub.length != 2 ? null : (
			<rect
				className="selection"
				height={height}
				width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
				x={xScale(timeScrub[0])}
				stroke={highlightColor}
				strokeWidth={1}
			/>
		)
	return (
		<g className="overlay">
			<rect
				className="board"
				x={x}
				height={height}
				width={width}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseLeave}
			/>
			{scrub}
		</g>
	)
})
