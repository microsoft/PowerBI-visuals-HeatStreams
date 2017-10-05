import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ChartComponent from './components'

import {
	ICategory,
	IChartOptions,
	ScrubbedHandler,
	SelectionChangedHandler,
	SelectionClearedHandler,
} from './interfaces'

export default class Chart {
	private selectionChangedHandler: SelectionChangedHandler
	private selectionClearedHandler: SelectionClearedHandler
	private scrubbedHandler: ScrubbedHandler

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
		return ReactDOM.render(
			<ChartComponent
				width={width}
				height={height}
				options={this.options}
				colorizer={v => colorizer.color(v).toString()}
				onClearSelection={this.onClearSelection.bind(this)}
				onClickCategory={this.onClickCategory.bind(this)}
				onScrub={this.onScrubbed.bind(this)}
			/>,
			this.options.element,
		)
	}

	private onScrubbed(bounds: Array<Date | number>) {
		this.scrubbedHandler(bounds)
	}

	private onClickCategory(category: ICategory, ctrl: boolean) {
		this.selectionChangedHandler(category, ctrl)
	}

	private onClearSelection() {
		this.selectionClearedHandler()
	}
}
