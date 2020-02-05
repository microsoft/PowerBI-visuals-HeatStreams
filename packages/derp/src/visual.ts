/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'core-js/stable'
import './../style/visual.less'
import powerbi from 'powerbi-visuals-api'

import { VisualSettings } from './settings'
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions
import VisualObjectInstance = powerbi.VisualObjectInstance
import DataView = powerbi.DataView
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject
export class Visual implements IVisual {
	private target: HTMLElement
	private updateCount: number
	private settings: VisualSettings
	private textNode: Text

	constructor(options: VisualConstructorOptions) {
		console.log('Visual constructor', options)
		this.target = options.element
		this.updateCount = 0
		if (document) {
			const newP: HTMLElement = document.createElement('p')
			newP.appendChild(document.createTextNode('Update count:'))
			const newEm: HTMLElement = document.createElement('em')
			this.textNode = document.createTextNode(this.updateCount.toString())
			newEm.appendChild(this.textNode)
			newP.appendChild(newEm)
			this.target.appendChild(newP)
		}
	}

	public update(options: VisualUpdateOptions) {
		this.settings = Visual.parseSettings(
			options && options.dataViews && options.dataViews[0],
		)
		console.log('Visual update', options)
		if (this.textNode) {
			this.textNode.textContent = (this.updateCount++).toString()
		}
	}

	private static parseSettings(dataView: DataView): VisualSettings {
		return VisualSettings.parse(dataView) as VisualSettings
	}

	/**
	 * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
	 * objects and properties you want to expose to the users in the property pane.
	 *
	 */
	public enumerateObjectInstances(
		options: EnumerateVisualObjectInstancesOptions,
	): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
		return VisualSettings.enumerateObjectInstances(
			this.settings || VisualSettings.getDefault(),
			options,
		)
	}
}
