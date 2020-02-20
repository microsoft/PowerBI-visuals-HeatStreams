/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useMemo, useCallback } from 'react'
import { ICategory } from '../types'

export interface ICategoryNameListProps {
	categories: ICategory[]
	width: number
	rowHeight: number
	categoryY: (input: number) => number
	isCategorySelected: (category: ICategory) => boolean
	onClickCategory?: (category: ICategory, ctrlKey: boolean) => void
	onClear?: () => void
}

export const CategoryNameList: React.FC<ICategoryNameListProps> = memo(
	function CategoryNameList({
		categories,
		width,
		rowHeight,
		categoryY,
		isCategorySelected,
		onClickCategory = NO_OP,
		onClear = NO_OP,
	}) {
		const categoryNames = useMemo(
			() =>
				categories.map((cat, index) => (
					<CategoryName
						key={cat.id}
						category={cat}
						height={rowHeight}
						selected={isCategorySelected(cat)}
						onClick={onClickCategory}
						y={categoryY(index) + rowHeight - 1}
					/>
				)),
			[categories, isCategorySelected, categoryY, onClickCategory, rowHeight],
		)
		return (
			<g className="category-names">
				<rect
					className="category-name-occluder"
					width={width}
					onClick={onClear}
				/>
				<g className="category-texts">{categoryNames}</g>
			</g>
		)
	},
)

interface ICategoryNameProps {
	category: ICategory
	height: number
	selected: boolean
	y: number
	onClick?: (category: ICategory, ctrlKey: boolean) => void
}

const CategoryName: React.FC<ICategoryNameProps> = memo(function CategoryName({
	category,
	height,
	selected,
	y,
	onClick: onClickCategory = NO_OP,
}) {
	const onClick = useCallback(
		(evt: React.MouseEvent<any>) => {
			onClickCategory(category, evt.ctrlKey || evt.metaKey)
			evt.stopPropagation()
		},
		[onClickCategory, category],
	)
	return (
		<CategoryText
			height={height}
			y={y}
			selected={selected}
			onClick={onClick}
			name={category.name}
		/>
	)
})

export interface ICategoryTextProps {
	height: number
	y: number
	selected: boolean
	name: string
	onClick?: (ent: React.MouseEvent<any>) => void
}
export const CategoryText: React.FC<ICategoryTextProps> = memo(
	function CategoryText({ height, y, selected, name, onClick = NO_OP }) {
		return (
			<text
				className="category-text"
				fontSize={`${height - 2}px`}
				clipPath="url(#clip-category-text)"
				x={2}
				y={y}
				fontWeight={selected ? 'bold' : 'normal'}
				onClick={onClick}
			>
				{name}
			</text>
		)
	},
)

const NO_OP = () => null
