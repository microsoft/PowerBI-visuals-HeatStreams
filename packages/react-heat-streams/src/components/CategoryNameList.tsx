/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useCallback } from 'react'
import { ICategory } from '../interfaces'
import { CategoryText } from './CategoryText'

export interface ICategoryNameListProps {
	categories: ICategory[]
	showCategories: boolean
	width: number
	rowHeight: number
	categoryY: (input: number) => number
	isCategorySelected: (category: ICategory) => boolean
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
	onClear: () => void
}

export const CategoryNameList: React.FC<ICategoryNameListProps> = memo(
	({
		categories,
		showCategories,
		width,
		rowHeight,
		categoryY,
		isCategorySelected,
		onClickCategory,
		onClear,
	}) => {
		const categoryNames = categories.map((cat, index) => (
			<BoundCategoryName
				key={cat.id}
				category={cat}
				rowHeight={rowHeight}
				isSelected={isCategorySelected(cat)}
				onClickCategory={onClickCategory}
				y={categoryY(index) + rowHeight - 1}
			/>
		))
		const categoryNameList = showCategories ? (
			<g className="category-names">
				<rect
					className="category-name-occluder"
					width={width}
					onClick={onClear}
				/>
				<g className="category-texts">{categoryNames}</g>
			</g>
		) : null
		return <g className="category-names">{categoryNameList}</g>
	},
)
CategoryNameList.displayName = 'CategoryNameList'

interface IBoundCategoryNameProps {
	category: ICategory
	rowHeight: number
	isSelected: boolean
	y: number
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
}

const BoundCategoryName: React.FC<IBoundCategoryNameProps> = memo(
	({ category, rowHeight, isSelected, y, onClickCategory }) => {
		const onClick = useCallback(
			(evt: React.MouseEvent<any>) => {
				onClickCategory(category, evt.ctrlKey || evt.metaKey)
				evt.stopPropagation()
			},
			[onClickCategory, category],
		)
		return (
			<CategoryText
				rowHeight={rowHeight}
				y={y}
				selected={isSelected}
				onClick={onClick}
				name={category.name}
			/>
		)
	},
)
BoundCategoryName.displayName = 'BoundCategoryName'
