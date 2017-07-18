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
module essex.visuals.gantt.dataconvert {
    "use strict";
    import DataView = powerbi.DataView;
    import CategoryData = essex.visuals.gantt.CategoryData;
    import CategoryDataMap = essex.visuals.gantt.CategoryDataMap;
    import CategoryValueMap = essex.visuals.gantt.CategoryValueMap;
    import ValueSlice = essex.visuals.gantt.ValueSlice;
    import GanttData = essex.visuals.gantt.GanttData;
    import GanttXDomain = essex.visuals.gantt.GanttXDomain;
    import VisualDataOptions = essex.visuals.gantt.VisualDataOptions;
    const _ = window['_'];
    const d3 = window['d3'];

    function addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function determinePositionDomain(data: CategoryDataMap): GanttXDomain {
        const domainsByCategory = Object.keys(data).map(category => (
            d3.extent(data[category], (pv: { position: Date | number }) => pv.position)
        )) as GanttXDomain[];
        const mergedDomains = [].concat.apply([], domainsByCategory);
        return d3.extent(mergedDomains) as GanttXDomain;
    }

    function coalesceValueSlices(data: CategoryDataMap, valueDomain: [number, number]): CategoryValueMap {
        return Object.keys(data)
            .reduce((agg: CategoryValueMap, current: string) => {
                // sort the category data ascending
                const catData = data[current]
                    .sort((a: any, b: any) => a.position.getTime() - b.position.getTime());
                const bucketed = d3.scaleQuantile().domain(valueDomain).range([-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1]);
                const catVals: ValueSlice[] = [];
                let currentSlice: ValueSlice;
                const shouldDataBeInserted = (d: CategoryData) => (
                    !currentSlice ||
                    bucketed(d.value) !== currentSlice.value ||
                    d.position.getTime() !== currentSlice.end.getTime()
                );
                catData.forEach((datum: CategoryData) => {
                    if (shouldDataBeInserted(datum)) {
                        currentSlice = {
                            end: addDays(datum.position as Date, 1),
                            start: datum.position as Date,
                            value: bucketed(datum.value),
                        };
                        catVals.push(currentSlice);
                    } else {
                        currentSlice.end = addDays(datum.position as Date, 1);
                    }
                });
                agg[current] = catVals;
                return agg;
            }, {} as CategoryValueMap) as CategoryValueMap;
    }

    export function convertCategoricalDataView(dataView: DataView, options: VisualDataOptions): GanttData {
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
        const categoryValues = coalesceValueSlices(categoryData, [options.valueMin, options.valueMax]);
        return {
            categories,
            categoryData,
            categoryValues,
            positionDomain,
        };
    }
}