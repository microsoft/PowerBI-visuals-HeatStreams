/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'

export interface ICategoryTextProps {
	rowHeight: number
	y: number
	selected: boolean
	name: string
	onClick: (ent: React.MouseEvent<any>) => void
}
const CategoryText: React.StatelessComponent<ICategoryTextProps> = ({
	rowHeight,
	y,
	selected,
	name,
	onClick,
}) => (
	<text
		className="category-text"
		fontSize={`${rowHeight - 2}px`}
		clipPath="url(#clip-category-text)"
		x={2}
		y={y}
		fontWeight={selected ? 'bold' : 'normal'}
		onClick={onClick}
	>
		{name}
	</text>
)

export default CategoryText
