import * as React from 'react'

/* Having this in the background allows the top-level g element to catch scroll and click events */

const Backboard = ({ height, width, x }) => (
	<rect x={x} height={height} width={width} fill="white" />
)

export default Backboard
