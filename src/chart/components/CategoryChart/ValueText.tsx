import * as React from 'react'

const ValueText = ({ text, rowHeight, x, y, color }) => (
	<text
		className="value-text"
		fontSize={`${rowHeight - 2}px`}
		x={x}
		y={y}
		stroke="none"
		fill={color}
	>
		{text}
	</text>
)

export default ValueText
