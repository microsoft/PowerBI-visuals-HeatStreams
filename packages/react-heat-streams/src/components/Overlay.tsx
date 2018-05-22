import * as React from 'react'
import autobind from 'autobind-decorator'

export interface IOverlayProps {
	height: number
	width: number
	x: number
	xScale: any
	highlightColor: string
	onDrag: (bounds: Array<number | Date>) => void
	onClick: (x: number, y: number, ctrl: boolean) => void
	timeScrub: any
}

const CLICK_TIME_CUTOFF = 200
const CLICK_DISTANCE_CUTOFF = 15

export interface IOverlayState {
	dragging: boolean
	dragStart: number
	dragEnd: number
	dragEndTime: number
	dragStartTime: number
}

const INITIAL_STATE = Object.freeze({
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

	public render() {
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

	@autobind
	private onMouseDown(evt) {
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

	@autobind
	private onMouseUp(evt) {
		if (this.state.dragging) {
			this.cutDrag(evt)
		}
	}

	@autobind
	private onMouseMove(evt) {
		if (this.state.dragging) {
			this.setState({
				...this.state,
				dragEnd: evt.clientX,
			})
		}
	}

	@autobind
	private onMouseLeave(evt) {
		if (this.state.dragging) {
			this.cutDrag(evt)
		}
	}

	private cutDrag(evt) {
		const { xScale } = this.props
		if (this.isDragAction) {
			const bounds = [
				xScale.invert(this.dragStart),
				xScale.invert(this.dragEnd),
			]
			this.setState(INITIAL_STATE)
			this.props.onDrag(bounds)
		} else {
			this.setState(INITIAL_STATE)
			this.props.onClick(evt.clientX, evt.clientY, evt.ctrlKey || evt.metaKey)
		}
	}

	private get isDragAction() {
		// TODO: re-enable this when we can support time scrubbing in tandem with category selection
		return false
		/*const dragEndTime = +Date.now()
		const timeDiff = dragEndTime - this.state.dragStartTime
		const distDiff = this.dragEnd - this.dragStart
		return timeDiff > CLICK_TIME_CUTOFF || distDiff > CLICK_DISTANCE_CUTOFF*/
	}

	private get dragStart() {
		return Math.min(this.state.dragStart, this.state.dragEnd)
	}

	private get dragEnd() {
		return Math.max(this.state.dragStart, this.state.dragEnd)
	}
}

export default Overlay
