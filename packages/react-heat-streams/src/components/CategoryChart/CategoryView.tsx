import * as React from 'react'

export interface ICategoryViewProps {
	y: number
	highlightColor: string
	width: number
	height: number
	selected?: boolean
}
const CategoryView: React.StatelessComponent<ICategoryViewProps> = ({
	y,
	highlightColor,
	width,
	height,
	selected,
}) => (
	<rect
		className="category-view"
		stroke={highlightColor}
		y={y}
		height={height}
		width={width - 2}
		x={1}
		strokeWidth={selected ? 1 : 0}
	/>
)

export default CategoryView
