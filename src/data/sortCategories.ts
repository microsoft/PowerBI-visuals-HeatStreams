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
namespace essex.visuals.heatStreams.dataconvert {
    "use strict";
    import CategoryDataMap = essex.visuals.heatStreams.ICategoryDataMap;

    type Sorter = (cat1: ICategory, cat2: ICategory) => number;
    const invert = (sortComparator: Sorter) => (cat1: ICategory, cat2: ICategory) => -1 * sortComparator(cat1, cat2);

    function getSortComparator(
        categories: ICategory[],
        categoryData: CategoryDataMap,
        options: IVisualDataOptions,
    ): Sorter {
        const { sortBy, sortInvert: isInverted } = options;

        categories.forEach((cat: ICategory) => {
            const data = categoryData[cat.id];
            const count = data.length;
            const sum = data.reduce((prev, current) => prev + current.value, 0);
            const max = Math.max(...data.map((c) => c.value));

            cat.metadata = {
                average: sum / count,
                density: data.length,
                max,
                sum,
            };
        });

        const valueCompare = (field: string) => (cat1: ICategory, cat2: ICategory) => {
            const v1 = cat1.metadata[field];
            const v2 = cat2.metadata[field];
            return v2 - v1;
        };

        const SORT_COMPARATORS: {[key: string]: Sorter} = {
            average: valueCompare("average"),
            density: valueCompare("density"),
            max: valueCompare("max"),
            name: (cat1: ICategory, cat2: ICategory) => {
                if (cat1.name < cat2.name) {
                    return -1;
                } else if (cat1.name > cat2.name) {
                    return 1;
                } else {
                    return 0;
                }
            },
        };

        const comparator: Sorter = SORT_COMPARATORS[sortBy];
        return isInverted ?
            invert(comparator) :
            comparator;
    }

    export function sortCategories(
        categories: ICategory[],
        categoryData: CategoryDataMap,
        options: IVisualDataOptions,
    ) {
        const comparator = getSortComparator(categories, categoryData, options);
        return categories.sort(comparator);
    }
}
