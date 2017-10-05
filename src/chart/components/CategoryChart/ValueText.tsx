import * as React from 'react'

const ValueText = ({ text, rowHeight, x, y }) => (
	<text className="value-text" fontSize={`${rowHeight - 2}px`} x={x} y={y}>
		{text}
	</text>
)

export default ValueText
