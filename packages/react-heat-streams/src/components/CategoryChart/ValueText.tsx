import * as React from 'react'

export interface IValueTextProps {
	text: string
	height: number
	x: number
	y: number
	color: string
	width: number
}

const SANE_MIN_WIDTH = 20
const SIDE_PADS = 4
const FONT_SIZE = 8

export default class ValueText extends React.PureComponent<
	IValueTextProps,
	{}
> {
	private textElement: SVGTextElement

	public componentDidMount() {
		this.remeasure()
	}

	public componentDidUpdate() {
		this.remeasure()
	}

	public render() {
		const { text, height, x, y, color, width } = this.props
		const fontSize = height > 10 ? FONT_SIZE : height - 4
		const pad = (height - fontSize) / 2
		return (
			<text
				ref={e => (this.textElement = e)}
				className="value-text"
				fontSize={`${fontSize}px`}
				x={x + width - 2}
				y={y - pad}
				fill={'transparent'}
			>
				{text}
			</text>
		)
	}

	private remeasure() {
		const { width, color } = this.props
		const box = this.textElement.getBBox()
		const spaceNeeded = box.width + SIDE_PADS

		if (width > SANE_MIN_WIDTH) {
			this.textElement.setAttribute('fill', color)
			const textContent = width >= spaceNeeded ? this.props.text : '…'
			this.textElement.textContent = textContent
		} else {
			this.textElement.setAttribute('fill', 'transparent')
		}
	}
}
