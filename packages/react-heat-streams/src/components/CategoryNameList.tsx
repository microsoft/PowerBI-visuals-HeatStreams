import * as React from 'react'
import { ICategory } from '../interfaces'
import CategoryText from './CategoryText'
import autobind from 'autobind-decorator'

export interface ICategoryNameListProps {
	categories: ICategory[]
	showCategories: boolean
	width: number
	rowHeight: number
	categoryY: (input: number) => number
	categoryNameFormat: string
	isCategorySelected: (category: ICategory) => boolean
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
	onClear: () => void
}

interface IBoundCategoryNameProps {
	category: ICategory
	rowHeight: number
	isSelected: boolean
	y: number
	categoryNameFormat: string
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
}

class BoundCategoryName extends React.PureComponent<IBoundCategoryNameProps> {
	public render() {
		const {
			category,
			rowHeight,
			isSelected,
			y,
			categoryNameFormat,
		} = this.props

		let name: string
		if (categoryNameFormat === 'localeDate') {
			name = (category.value as Date).toLocaleDateString()
		} else if (categoryNameFormat === 'localeTime') {
			name = (category.value as Date).toLocaleTimeString()
		} else if (categoryNameFormat === 'localeDateDate') {
			name = (category.value as Date).toLocaleString()
		} else if (categoryNameFormat === 'localeNumber') {
			name = ((category.value as unknown) as number).toLocaleString()
		} else {
			name = category.value.toString()
		}

		return (
			<CategoryText
				rowHeight={rowHeight}
				y={y}
				selected={isSelected}
				onClick={this.onClick}
				name={name}
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
	categoryNameFormat,
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
			categoryNameFormat={categoryNameFormat}
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
