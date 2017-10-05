import * as React from 'react'
import CategoryText from './CategoryText'

const CategoryNameList = ({
	categories,
	showCategories,
	width,
	rowHeight,
	categoryY,
	isCategorySelected,
	onClickCategory,
	onClear,
}) => (
	<g className="category-names">
		{showCategories ? (
			<g className="category-names">
				<rect
					className="occluder"
					width={width}
					height="100%"
					fill="white"
					cursor="default"
					onClick={onClear}
				/>
				<g className="category-texts">
					{categories.map((cat, index) => (
						<CategoryText
							key={cat.id}
							rowHeight={rowHeight}
							y={categoryY(index) + rowHeight - 1}
							selected={isCategorySelected(cat)}
							onClick={evt => {
								onClickCategory(cat, evt.ctrlKey || evt.metaKey)
								evt.stopPropagation()
							}}
							name={cat.name}
						/>
					))}
				</g>
			</g>
		) : null}
	</g>
)

export default CategoryNameList
