/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// tslint:disable no-var-requires no-string-literal no-reference
/// <reference path="../../../node_modules/powerbi-visuals-tools/templates/visuals/.api/v1.11.0/PowerBI-visuals.d.ts" />
'use strict'

import Chart from './chart'
import ChartOptions from './chart/ChartOptions'
import DataViewConverter from './data/DataViewConverter'
import Interactions from './Interactions'
import VisualSettings from './settings/VisualSettings'
const get = require('lodash/get')
import * as logger from './logger'
const packageJson = require('../package.json')

// Polyfills for IE11
require('es6-promise').polyfill()
require('es6-object-assign').polyfill()

export class Visual implements powerbi.extensibility.IVisual {
	private static parseSettings(dataView: powerbi.DataView): VisualSettings {
		return VisualSettings.parse(dataView) as VisualSettings
	}

	private settings: VisualSettings
	private chart: Chart
	private chartOptions: ChartOptions
	private interactions: Interactions
	private dataView: powerbi.DataView

	constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
		const target = options.element
		const host = options.host
		const selectionManager = host.createSelectionManager()
		const converter = new DataViewConverter(selectionManager)

		this.chartOptions = new ChartOptions(converter, target)
		this.chart = new Chart(this.chartOptions)
		this.interactions = new Interactions(host, selectionManager)
		this.interactions.onRestoreSelection(this.onRestoreSelection.bind(this))
		global['setLogLevel'] = logger.setLevel
		// tslint:disable-next-line no-console
		console.log(
			`%c🔥🔥 HeatStreams ${packageJson.version}🔥🔥%c
    For debug information, set %cwindow.LogLevel%c to
      0 = NONE
      1 = ERROR (default value)
      2 = INFO
      3 = DEBUG
    (this may need to be done in the visual's Javascript context)

    Cheers from Microsoft Research! %cmsrvizsupport@microsoft.com%c
    `,
			'font-size: 20px; font-weight: 500; text-shadow: -1px -1px hsl(0,100%,50%)',
			'',
			'font-weight: bold;',
			'',
			'font-weight: bold',
			'',
		)
	}

	public update(options: powerbi.extensibility.VisualUpdateOptions) {
		try {
			this.dataView = get(options, 'dataViews[0]')
			if (this.dataView) {
				this.settings = Visual.parseSettings(this.dataView)
				this.chartOptions.loadFromDataView(this.dataView, this.settings)
				this.render()
			}
		} catch (err) {
			logger.error('🐞Error Updating Heatstreams 🐞', err)
		}
	}

	/**
	 * This function gets called for each of the objects defined in the capabilities files and allows you to
	 * select which of the objects and properties you want to expose to the users in the property pane.
	 */
	public enumerateObjectInstances(
		options: powerbi.EnumerateVisualObjectInstancesOptions,
	):
		| powerbi.VisualObjectInstance[]
		| powerbi.VisualObjectInstanceEnumerationObject {
		return VisualSettings.enumerateObjectInstances(
			this.settings || VisualSettings.getDefault(),
			options,
		)
	}

	/**
	 * Handler for when selection should be restored from PowerBI
	 */
	private onRestoreSelection() {
		this.chartOptions.loadSelections(this.dataView)
		this.render()
	}

	private render() {
		const { interactions } = this
		this.chart.onSelectionChanged((cat, multi) => {
			interactions.selectCategory(cat, multi, this.dataView)
		})
		this.chart.onSelectionCleared(() => interactions.clearSelections())
		this.chart.onScrub(bounds => interactions.scrub(bounds, this.dataView))
		logger.info('Render', this.chartOptions)
		this.chart.render()
	}
}
