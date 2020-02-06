/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import powerbi from 'powerbi-visuals-api'
import Chart from './chart'
import ChartOptions from './chart/ChartOptions'
import DataViewConverter from './data/DataViewConverter'
import Interactions from './Interactions'
import VisualSettings from './settings/VisualSettings'
import * as logger from './logger'
import { TimeDomain } from '@essex/react-heat-streams'
const get = require('lodash/get')
const packageJson = require('../package.json')

export class Visual implements powerbi.extensibility.IVisual {
	private static parseSettings(dataView: powerbi.DataView): VisualSettings {
		return VisualSettings.parse(dataView) as VisualSettings
	}

	private settings: VisualSettings | undefined
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

	public update(
		options: powerbi.extensibility.visual.VisualUpdateOptions,
	): void {
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
	private onRestoreSelection(): void {
		this.chartOptions.loadSelections(this.dataView)
		this.render()
	}

	private render(): void {
		const { interactions } = this
		this.chart.onSelectionChanged((cat, multi) => {
			interactions.selectCategory(cat, multi, this.dataView)
		})
		this.chart.onSelectionCleared(() => interactions.clearSelections())
		this.chart.onScrub(bounds =>
			interactions.scrub(bounds as TimeDomain, this.dataView),
		)
		logger.info('Render', this.chartOptions)
		this.chart.render()
	}
}
