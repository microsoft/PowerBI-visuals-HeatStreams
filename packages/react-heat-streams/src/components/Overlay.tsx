/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { TimeDomain } from '../interfaces'

export interface IOverlayProps {
	height: number
	width: number
	x: number
	xScale: any
	highlightColor: string
	onDrag: (bounds: TimeDomain) => void
	onClick: (x: number, y: number, ctrl: boolean) => void
	timeScrub: TimeDomain
}

export interface IOverlayState {
	dragging: boolean
	dragStart: number | null
	dragEnd: number | null
	dragEndTime: number | null
	dragStartTime: number | null
}

const INITIAL_STATE: IOverlayState = Object.freeze({
	dragEnd: null,
	dragEndTime: null,
	dragStart: null,
	dragStartTime: null,
	dragging: false,
})

class Overlay extends React.PureComponent<IOverlayProps, IOverlayState> {
	constructor(props: IOverlayProps) {
		super(props)
		this.state = INITIAL_STATE
	}

	public render(): JSX.Element {
		const {
			height,
			width,
			x,
			xScale,
			highlightColor,
			timeScrub: timeScrubProps,
		} = this.props

		const timeScrub = this.state.dragging
			? [this.dragStart, this.dragEnd]
			: timeScrubProps

		const isScrubValid = timeScrub !== null && timeScrub.length === 2
		const scrub = isScrubValid ? (
			<rect
				className="selection"
				height={height}
				width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
				x={xScale(timeScrub[0])}
				stroke={highlightColor}
				strokeWidth={1}
			/>
		) : null
		return (
			<g className="overlay">
				<rect
					className="board"
					x={x}
					height={height}
					width={width}
					onMouseDown={this.onMouseDown}
					onMouseMove={this.onMouseMove}
					onMouseUp={this.onMouseUp}
					onMouseLeave={this.onMouseLeave}
				/>
				{scrub}
			</g>
		)
	}

	private onMouseDown = (evt: React.MouseEvent): void => {
		if (this.state.dragging) {
			this.cutDrag(evt)
		} else {
			this.setState({
				dragEnd: evt.clientX,
				dragStart: evt.clientX,
				dragStartTime: +Date.now(),
				dragging: true,
			})
		}
	}

	private onMouseUp = (evt: React.MouseEvent): void => {
		if (this.state.dragging) {
			this.cutDrag(evt)
		}
	}

	private onMouseMove = (evt: React.MouseEvent): void => {
		if (this.state.dragging) {
			this.setState({
				...this.state,
				dragEnd: evt.clientX,
			})
		}
	}

	private onMouseLeave = (evt: React.MouseEvent): void => {
		if (this.state.dragging) {
			this.cutDrag(evt)
		}
	}

	private cutDrag(evt: React.MouseEvent): void {
		const { xScale } = this.props
		if (this.isDragAction) {
			const bounds = [
				xScale.invert(this.dragStart),
				xScale.invert(this.dragEnd),
			] as TimeDomain
			this.setState(INITIAL_STATE)
			this.props.onDrag(bounds)
		} else {
			this.setState(INITIAL_STATE)
			this.props.onClick(evt.clientX, evt.clientY, evt.ctrlKey || evt.metaKey)
		}
	}

	private get isDragAction(): boolean {
		// TODO: re-enable this when we can support time scrubbing in tandem with category selection
		return false
		/*const dragEndTime = +Date.now()
		const timeDiff = dragEndTime - this.state.dragStartTime
		const distDiff = this.dragEnd - this.dragStart
		return timeDiff > CLICK_TIME_CUTOFF || distDiff > CLICK_DISTANCE_CUTOFF*/
	}

	private get dragStart(): number {
		return Math.min(this.state.dragStart || 0, this.state.dragEnd || 0)
	}

	private get dragEnd(): number {
		return Math.max(this.state.dragStart || 0, this.state.dragEnd || 0)
	}
}

export default Overlay
