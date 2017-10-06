import * as React from 'react'

const ValueRun = ({ value, x, y, width, height, color, title }) => (
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
