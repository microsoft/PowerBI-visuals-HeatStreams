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
module essex.visuals.heatStreams.dataconvert {
    "use strict";
    import DataView = powerbi.DataView;
    import CategoryData = essex.visuals.heatStreams.CategoryData;
    import CategoryDataMap = essex.visuals.heatStreams.CategoryDataMap;
    import CategoryValueMap = essex.visuals.heatStreams.CategoryValueMap;
    import XDomain = essex.visuals.heatStreams.XDomain;
    import DateAggregation = essex.visuals.heatStreams.DateAggregation;
    const _ = window['_'];
    const d3 = window['d3'];

    function determinePositionDomain(data: CategoryDataMap): XDomain {
        const domainsByCategory = Object.keys(data).map(category => (
            d3.extent(data[category], (pv: { position: Date | number }) => pv.position)
        )) as XDomain[];
        const mergedDomains = [].concat.apply([], domainsByCategory);
        return d3.extent(mergedDomains) as XDomain;
    }

    function sliceStart(date: Date, dateAggregation: DateAggregation, positionDomain: [Date, Date]): Date {
        const result = new Date(date);
        result.setUTCMilliseconds(0);
        result.setUTCSeconds(0);
        result.setUTCMinutes(0);
        
        if (dateAggregation === 'days') {
            result.setUTCHours(0);
        } else if (dateAggregation === 'months') {
            result.setUTCHours(0);
            result.setUTCDate(1);
        } else if (dateAggregation === 'years') {
            result.setUTCHours(0);
            result.setUTCDate(1);
            result.setUTCMonth(1);
        }

        if (result.getTime() < positionDomain[0].getTime()) {
            return positionDomain[0];
        }
        return result;
    }

    function coalesceValueSlices(
        data: CategoryDataMap, 
        positionDomain: XDomain,
        dateAggregation: DateAggregation
    ) {
        let valueMin: number = undefined;
        let valueMax: number = undefined;
        const isNumericDomain = typeof positionDomain[0] === 'number';

        const categoryIds = Object.keys(data);
        const result = categoryIds.reduce((agg: CategoryValueMap, current: string) => {
            // sort the category data ascending
            const categoryData = data[current];
            
            // Bucket out the values by their aggregated position (within day, within year, etc..)
            const valuePositions: {[dateCode: string]: number[]} = {};
            categoryData.forEach(cd => {
                if (cd.value !== undefined && cd.value !== null) {
                    const start = isNumericDomain ? 
                        `${cd.position}` :  
                        sliceStart(cd.position, dateAggregation, positionDomain as [Date, Date]).toUTCString();
                        
                    if (!valuePositions[start]) {
                        valuePositions[start] = [];
                    }
                    if (valueMin === undefined || cd.value < valueMin) {
                        valueMin = cd.value;
                    }
                    if (valueMax === undefined || cd.value > valueMax) {
                        valueMax = cd.value;
                    }
                    valuePositions[start].push(cd.value);
                }
            });

            const slices = Object.keys(valuePositions).map(vp => {
                const start = isNumericDomain ? parseInt(vp, 10) : new Date(vp);
                return {
                    start,
                    value: d3.mean(valuePositions[vp]),
                };
            });
            agg[current] = slices;
            return agg;
        }, {} as CategoryValueMap) as CategoryValueMap;

        return { 
            categoryValues: result, 
            valueDomain: [valueMin, valueMax] as [number, number],
        };
    }

    export function convertCategoricalDataView(dataView: DataView, options: VisualDataOptions): ChartData {
        const { categorical } = dataView;

        const categories = _.get(categorical, 'categories[0].values', [])
            .map((t, index) => ({
                id: index,
                name: (t || '').toString(),
            }));

        const categoryData: CategoryDataMap = {};
        categories.forEach(category => {
            categoryData[category.id] = categorical.values.map(categoricalValue => {
                const position = categoricalValue.source.groupName;
                const value = categoricalValue.values[category.id];
                return { position, value } as CategoryData;
            });
        });

        const positionDomain = determinePositionDomain(categoryData);
        const valueSlices = coalesceValueSlices(
            categoryData, 
            positionDomain,
            options.dateAggregation,
        );
        const result = {
            categories,
            categoryData,
            ...valueSlices,
            positionDomain,
        };
        console.log("Data Conversion Result", result);
        return result;
    }
}