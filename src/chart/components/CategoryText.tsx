import * as React from 'react'

const CategoryText = ({ rowHeight, y, selected, name, onClick }) => (
	<text
		className="category-text"
		fill="black"
		fontSize={`${rowHeight - 2}px`}
		x={2}
		y={y}
		fontWeight={selected ? 'bold' : 'normal'}
		onClick={onClick}
	>
		{name}
	</text>
)

export default CategoryText
