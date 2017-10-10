import * as React from 'react'

export interface IValueRunProps {
	x: number
	y: number
	width: number
	height: number
	color: string
	title: string
}
const ValueRun: React.StatelessComponent<IValueRunProps> = ({
	x,
	y,
	width,
	height,
	color,
	title,
}) => (
	<rect
		className="value-run"
		fill={color}
		height={height}
		width={width}
		x={x}
		y={y}
	>
		<title>{title}</title>
	</rect>
)

export default ValueRun
