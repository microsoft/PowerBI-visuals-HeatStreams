module essex.visuals.gantt {
    const d3: any = window['d3'];

    function addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function sanitizeCategoryData(data: CategoryData[]) {
        return data.map(v => ({ ...v, position: new Date(v.position) }));
    }

    function determinePositionDomain(data: CategoryData[]) {
        return d3.extent(data,
            (pv: { position: Date | number }) => pv.position,
        ) as [Date, Date];
    }

    function aggregateCategoryData(data: CategoryData[]): CategoryDataMap {
        return data.reduce((agg: CategoryDataMap, value: CategoryData) => {
            if (!agg[value.category]) {
                agg[value.category] = [value];
            } else {
                agg[value.category].push(value);
            }
            return agg;
        }, {});
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

    export class DataProcessor {
        public processData(data: GanttData, valueDomain: [number, number]): ProcessedGanttData {
            const { values } = data;

            // Sanitize dates coming in (e.g. turn numerics into Dates)
            const processedValues = sanitizeCategoryData(values);

            const positionDomain = determinePositionDomain(processedValues);

            // Group the raw category data by category
            const categoryData: CategoryDataMap = aggregateCategoryData(processedValues);

            // Transform the category data objects into valueslices
            const categoryValues: CategoryValueMap = coalesceValueSlices(categoryData, valueDomain);

            return {
                categoryValues,
                positionDomain,
            };
        }
    }
}