import * as React from 'react'

export interface IValueTextProps {
	text: string
	rowHeight: number
	x: number
	y: number
	color: string
	sliceWidth: number
}

const SANE_MIN_WIDTH = 15
const SIDE_PADS = 4

export default class ValueText extends React.Component<IValueTextProps, {}> {
	private textElement: SVGTextElement

	public componentDidMount() {
		this.remeasure()
	}

	public componentDidUpdate() {
		this.remeasure()
	}

	public render() {
		const { text, rowHeight, x, y, color, sliceWidth } = this.props
		return (
			<text
				ref={e => (this.textElement = e)}
				className="value-text"
				fontSize={`${rowHeight - 2}px`}
				x={x}
				y={y}
				fill={'transparent'}
			>
				{text}
			</text>
		)
	}

	private remeasure() {
		const { sliceWidth, color } = this.props
		const box = this.textElement.getBBox()
		const spaceNeeded = box.width + SIDE_PADS
		if (sliceWidth >= spaceNeeded) {
			this.textElement.setAttribute('fill', color)
		} else {
			this.textElement.setAttribute('fill', 'transparent')
		}
	}
}
