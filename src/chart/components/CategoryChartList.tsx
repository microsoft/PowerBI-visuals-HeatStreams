import * as React from 'react'
import CategoryChart from './CategoryChart'

const CategoryChartList = ({
	categories,
	categoryValues,
	xScale,
	colorizer,
	rowHeight,
	showValues,
	width,
	highlightColor,
	isCategorySelected,
	categoryY,
	sliceWidth,
	xPan,
}) => (
	<g className="category-charts" transform={`translate(${xPan})`}>
		{categories.map((cat, index) => (
			<CategoryChart
				key={cat.id}
				category={cat}
				categoryData={categoryValues[cat.id]}
				colorizer={colorizer}
				xScale={xScale}
				rowHeight={rowHeight}
				showValues={showValues}
				width={width}
				highlightColor={highlightColor}
				selected={isCategorySelected(cat)}
				y={categoryY(index)}
				sliceWidth={sliceWidth}
			/>
		))}
	</g>
)

export default CategoryChartList
