module essex.visuals.gantt {

    function addDays(date: Date, days: number): Date {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function getCategoryValues(category: Category, timeSeries: CategoryData[]): ValueSlice[] {
        // Get the time-series data for this category sorted by time ascending
        const catData = timeSeries
            .filter(ts => ts.category === category.id)
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        // Map the time-series data into date spans
        const result: ValueSlice[] = [];
        let currentSlice: ValueSlice;
        catData.forEach((datum, index) => {
            if (!currentSlice || datum.value !== currentSlice.value) {
                currentSlice = {
                    start: datum.date,
                    end: addDays(datum.date, 1),
                    value: datum.value,
                };
                result.push(currentSlice);
            } else {
                currentSlice.end = addDays(datum.date, 1);
            }
        });
        return result;
    }

    const createComponent = essex.d3components.createComponent;

    const BaseComponent = essex.d3components.BaseComponent;
    const Enter = essex.d3components.Enter;
    const Data = essex.d3components.Data;
    const Dom = essex.d3components.Dom;
    const SelectAll = essex.d3components.SelectAll;

    const d3Instance = (<any>window).d3;

    export interface GanttChartProps {
        data: GanttData;
        option: RenderOptions;
        onScroll: (distance: number) => void;
    }

    export class GanttChart extends BaseComponent<any> {
        public render() {
            const {
                options: {
                    data,
                    element,
                    categoryOffsetStart,
                    maxCategories,
                    onScroll,
                    onClick,
                    rowHeight,
                    highlightColor,
                    selections,
                    axisHeight,
                },
            } = this.props;
            const box = element.getBoundingClientRect();
            const { width, height } = box;
            const textPercent = Math.max(0, Math.min(100, this.props.options.categoryTextPercent)) / 100;
            const chartPercent = 1 - textPercent;
            const fontSize = +this.props.options.fontSize;
            const catTextYPadAdjust = rowHeight > fontSize ? Math.floor((rowHeight - fontSize) / 2) : 0;

            const isSelected = (index: number) => selections.indexOf(categoryOffsetStart + index) >= 0;
            const categoryTextY = (index) => rowHeight * index + fontSize + catTextYPadAdjust;

            const colorizer = new Colorizer(this.props.options);
            const timeRange = d3Instance.extent(data.timeSeries, ts => new Date(ts.date)) as [Date, Date];
            const xScale = d3Instance
                .scaleTime()
                .domain(timeRange)
                .range([width * textPercent, width]);

            const axisOffset = Math.min(height - axisHeight, data.categories.length * rowHeight + axisHeight);

            return {
                selection: this.props.parent, continuation:
                    createComponent(Dom, {
                        'type': 'g',
                        'class': 'category-list',
                        [on('wheel.zoom')]: () => onScroll(d3Instance.event.deltaY)
                    }, [
                            createComponent(Dom, {
                                'type': 'g',
                                'transform': `translate(0, ${axisOffset})`,
                                'call': d3Instance.axisBottom(xScale),
                            }),
                            createComponent(SelectAll, {
                                'selector': '.category',
                            }, [
                                    createComponent(Data, {
                                        'data': data.categories.slice(categoryOffsetStart, categoryOffsetStart + maxCategories)
                                    }, [
                                            createComponent(Enter, {}, [
                                                createComponent(Dom, {
                                                    'type': 'g',
                                                    'class': 'category',
                                                    [on('click')]: (d) => {
                                                        const categoryIndex = categoryOffsetStart + d.index;
                                                        onClick(categoryIndex, d3Instance.event.ctrlKey);
                                                    },
                                                }, [
                                                        // Write out category chart area
                                                        createComponent(Dom, {
                                                            'type': 'rect',
                                                            'class': 'category-view',
                                                            'fill': 'none',
                                                            'height': rowHeight,
                                                            'stroke': highlightColor,
                                                            'width': width - 2, // reserve 2px for border select
                                                            'y': (d, index) => rowHeight * index,
                                                            'stroke-width': (d, index) => isSelected(index) ? 1 : 0,
                                                        }),

                                                        // Write out category text
                                                        createComponent(Dom, {
                                                            'class': 'category-text',
                                                            'font-size': `${fontSize}px`,
                                                            'font-weight': (d, index) => isSelected(index) ? 'bold' : 'normal',
                                                            'y': (d, index) => categoryTextY(index),
                                                            'text': d => d.name,
                                                        }),

                                                        // Write out category chart area
                                                        createComponent(Dom, {
                                                            'type': 'rect',
                                                            'class': 'category-chart',
                                                            'height': rowHeight,
                                                            'width': Math.floor(width * chartPercent) - 1,
                                                            'fill': 'none',
                                                            'y': (d, index) => rowHeight * index,
                                                            'x': width * textPercent,
                                                            'each': (d, i) => d.index = i,
                                                        }),

                                                        // Draw each value run in the chart area
                                                        createComponent(SelectAll, { selection: '.value-run' }, [
                                                            createComponent(Data, { data: d => getCategoryValues(d, data.timeSeries) }, [
                                                                createComponent(Enter, {}, [
                                                                    createComponent(Dom, {
                                                                        'type': 'rect',
                                                                        'class': 'value-run',
                                                                        'fill': d => colorizer.color(d.value).toString(),
                                                                        'x': (d: any) => xScale(d.start),
                                                                        'y': (d: any, index: number, nodes: SVGRectElement[]) => (
                                                                            rowHeight * (d3Instance.select(nodes[index].parentElement).datum() as any).index
                                                                        ),
                                                                        'height': rowHeight,
                                                                        'width': (d: any) => xScale(d.end) - xScale(d.start),
                                                                    }),
                                                                ]),
                                                            ]),
                                                        ]),
                                                    ]),
                                            ]),
                                        ]),
                                ]),
                        ]),
            };
        }
    }
}