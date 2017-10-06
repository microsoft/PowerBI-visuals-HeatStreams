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
'use strict'
import * as d3 from 'd3'
import {
	ICategoryDataMap,
	IVisualDataOptions,
	XDomain,
} from '../chart/interfaces'
import getSliceEnd from './getSliceEnd'

export default function determinePositionDomain(
	data: ICategoryDataMap,
	options: IVisualDataOptions,
): XDomain {
	// Get the domain of each category
	const domainsByCategory = Object.keys(data).map(category =>
		d3.extent(data[category], (pv: { position: Date | number }) => pv.position),
	) as XDomain[]

	// Smang the domains together into an array
	const mergedDomains = [].concat.apply([], domainsByCategory)

	// Get the extent of the domain
	const domain = d3.extent(mergedDomains) as XDomain

	// The actual end should be the end of the final slice
	domain[1] = getSliceEnd(domain[1], options)
	return domain
}
