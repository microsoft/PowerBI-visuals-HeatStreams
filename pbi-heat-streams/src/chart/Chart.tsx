/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	HeatStreamsChart,
	ICategory,
	Scrub,
	ScrubbedHandler,
	SelectionChangedHandler,
	SelectionClearedHandler,
	TimeDomain,
} from 'react-heat-streams'
import * as React from 'react'
import { render } from 'react-dom'
import { IChartOptions } from './types'

export class Chart {
	private selectionChangedHandler: SelectionChangedHandler | undefined
	private selectionClearedHandler: SelectionClearedHandler | undefined
	private scrubbedHandler: ScrubbedHandler | undefined

	// tslint:disable-next-line no-empty
	constructor(private options: IChartOptions) {}

	public onSelectionChanged(handler: SelectionChangedHandler): void {
		this.selectionChangedHandler = handler
	}

	public onSelectionCleared(handler: SelectionClearedHandler): void {
		this.selectionClearedHandler = handler
	}

	public onScrub(handler: ScrubbedHandler): void {
		this.scrubbedHandler = handler
	}

	public render(): void {
		const { width, height, colorizer } = this.options
		const props = {
			width,
			height,
			textPercent: this.options.renderOptions.categoryTextPercent / 100.0,
			rowHeight: this.options.renderOptions.rowHeight,
			axisHeight: this.options.renderOptions.axisHeight,
			numTicks: this.options.renderOptions.numTicks,
			zoomLevel: this.options.renderOptions.zoomLevel,
			xDomain: this.options.data.positionDomain,
			highlightColor: this.options.renderOptions.highlightColor,
			showCategories: this.options.renderOptions.showCategories,
			showValues: this.options.renderOptions.showValues,
			rowGap: this.options.renderOptions.rowGap,
			timeScrub: this.options.timeScrub as TimeDomain,
			colorizer: (v: any): string => colorizer.color(v).toString(),
			categories: this.options.data.categories,
			categoryValues: this.options.data.categoryValues,
			textColor: this.options.renderOptions.textColor,
			selections: this.options.selections,
			dateAggregation: this.options.dataOptions.dateAggregation,
			numericAggregation: this.options.dataOptions.numericAggregation,
			onClearSelection: this.onClearSelection,
			onClickCategory: this.onClickCategory,
			onScrub: this.onScrubbed,
		}
		render(<HeatStreamsChart {...props} />, this.options.element)
	}

	private onScrubbed = (bounds: Scrub): void => {
		this.scrubbedHandler && this.scrubbedHandler(bounds)
	}

	private onClickCategory = (category: ICategory, ctrl: boolean): void => {
		this.selectionChangedHandler && this.selectionChangedHandler(category, ctrl)
	}

	private onClearSelection = (): void => {
		this.selectionClearedHandler && this.selectionClearedHandler()
	}
}
