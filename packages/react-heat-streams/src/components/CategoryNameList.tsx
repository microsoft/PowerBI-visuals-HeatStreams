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
	textColor: string
	onClickCategory?: (category: ICategory, ctrlKey: boolean) => void
	onClear?: () => void
}

export const CategoryNameList: React.FC<ICategoryNameListProps> = memo(
	function CategoryNameList({
		categories,
		width,
		rowHeight,
		textColor,
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
						textColor={textColor}
						selected={isCategorySelected(cat)}
						onClick={onClickCategory}
						y={categoryY(index) + rowHeight - 1}
					/>
				)),
			[
				categories,
				isCategorySelected,
				categoryY,
				onClickCategory,
				rowHeight,
				textColor,
			],
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
	textColor: string
	onClick?: (category: ICategory, ctrlKey: boolean) => void
}

const CategoryName: React.FC<ICategoryNameProps> = memo(function CategoryName({
	category,
	height,
	selected,
	y,
	textColor,
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
			textColor={textColor}
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
	textColor: string
	onClick?: (ent: React.MouseEvent<any>) => void
}
export const CategoryText: React.FC<ICategoryTextProps> = memo(
	function CategoryText({
		height,
		y,
		selected,
		name,
		textColor,
		onClick = NO_OP,
	}) {
		console.log('TC', textColor)
		return (
			<text
				className="category-text"
				fontSize={`${height - 2}px`}
				clipPath="url(#clip-category-text)"
				fill={textColor}
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

const NO_OP = (): void => {
	/* do nothing */
}
