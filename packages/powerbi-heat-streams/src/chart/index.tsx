import {
	HeatStreamsChart,
	ICategory,
	Scrub,
	ScrubbedHandler,
	SelectionChangedHandler,
	SelectionClearedHandler,
} from '@essex/react-heat-streams'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IChartOptions } from './interfaces'

export default class Chart {
	private selectionChangedHandler: SelectionChangedHandler
	private selectionClearedHandler: SelectionClearedHandler
	private scrubbedHandler: ScrubbedHandler

	// tslint:disable-next-line no-empty
	constructor(private options: IChartOptions) {}

	public onSelectionChanged(handler: SelectionChangedHandler) {
		this.selectionChangedHandler = handler
	}

	public onSelectionCleared(handler: SelectionClearedHandler) {
		this.selectionClearedHandler = handler
	}

	public onScrub(handler: ScrubbedHandler) {
		this.scrubbedHandler = handler
	}

	public render() {
		const { width, height, colorizer } = this.options
		const renderProps = {
			width,
			height,
			textPercent: this.options.renderOptions.categoryTextPercent / 100.0,
			rowHeight: this.options.renderOptions.rowHeight,
			axisHeight: this.options.renderOptions.axisHeight,
			numTicks: this.options.renderOptions.numTicks,
			zoomLevel: this.options.renderOptions.zoomLevel,
			xDomain: this.options.data.positionDomain,
			categoryNameFormat: this.options.renderOptions.categoryNameFormat,
			highlightColor: this.options.renderOptions.highlightColor,
			showCategories: this.options.renderOptions.showCategories,
			showValues: this.options.renderOptions.showValues,
			rowGap: this.options.renderOptions.rowGap,
			timeScrub: this.options.timeScrub,
			colorizer: v => colorizer.color(v).toString(),
			categories: this.options.data.categories,
			categoryValues: this.options.data.categoryValues,
			selections: this.options.selections,
			dateAggregation: this.options.dataOptions.dateAggregation,
			numericAggregation: this.options.dataOptions.numericAggregation,
			onClearSelection: this.onClearSelection.bind(this),
			onClickCategory: this.onClickCategory.bind(this),
			onScrub: this.onScrubbed.bind(this),
		}
		return ReactDOM.render(
			<HeatStreamsChart {...renderProps} />,
			this.options.element,
		)
	}

	private onScrubbed(bounds: Scrub) {
		this.scrubbedHandler(bounds)
	}

	private onClickCategory(category: ICategory, ctrl: boolean) {
		this.selectionChangedHandler(category, ctrl)
	}

	private onClearSelection() {
		this.selectionClearedHandler()
	}
}
