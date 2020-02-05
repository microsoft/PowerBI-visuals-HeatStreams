/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!powerbi-visuals-utils-typeutils/lib/index'
import 'script-loader!powerbi-visuals-utils-svgutils/lib/index'
import 'script-loader!powerbi-visuals-utils-dataviewutils/lib/index'
import {
	IVisualDataOptions,
	IVisualRenderingOptions,
} from '../chart/interfaces'
import VisualDataOptionsImpl from './VisualDataOptionsImpl'
import VisualRenderingOptionsImpl from './VisualRenderingOptionsImpl'

export default class VisualSettings extends powerbi.extensibility.utils.dataview
	.DataViewObjectsParser {
	public rendering: IVisualRenderingOptions = new VisualRenderingOptionsImpl()
	public data: IVisualDataOptions = new VisualDataOptionsImpl()
}
