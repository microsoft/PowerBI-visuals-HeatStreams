import * as React from 'react'
import { ICategory } from '../interfaces'
import CategoryText from './CategoryText'

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

interface IBoundCategoryNameProps {
	category: ICategory
	rowHeight: number
	isSelected: boolean
	y: number
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
}

class BoundCategoryName extends React.PureComponent<IBoundCategoryNameProps> {
	public render() {
		const { category, rowHeight, isSelected, y } = this.props
		return (
			<CategoryText
				rowHeight={rowHeight}
				y={y}
				selected={isSelected}
				onClick={this.onClick}
				name={category.name}
			/>
		)
	}

	private onClick = (evt: React.MouseEvent<any>) => {
		const { onClickCategory, category } = this.props
		onClickCategory(category, evt.ctrlKey || evt.metaKey)
		evt.stopPropagation()
	}
}

const CategoryNameList: React.StatelessComponent<ICategoryNameListProps> = ({
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
}

export default CategoryNameList
