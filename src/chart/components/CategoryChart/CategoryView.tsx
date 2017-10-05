import * as React from 'react'

const CategoryView = ({ y, highlightColor, width, height, selected }) => (
	<rect
		className="category-view"
		fill="none"
		shapeRendering="geometricPrecision"
		stroke={highlightColor}
		y={y}
		height={height}
		width={width - 2}
		x={1}
		z-index={1}
		strokeWidth={selected ? 1 : 0}
	/>
)

export default CategoryView
