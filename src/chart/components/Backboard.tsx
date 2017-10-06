import * as React from 'react'

/* Having this in the background allows the top-level g element to catch scroll and click events */

const Backboard = ({ height, width, x, onClick }) => (
	<rect
		className="backboard"
		x={x}
		height={height}
		width={width}
		onClick={onClick}
	/>
)

export default Backboard
