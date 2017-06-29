module essex.visuals.gantt {
    const d3Instance = (<any>window).d3;

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

    export function render(element: SVGElement, data: GanttData, selections: number[], options: RenderOptions) {
        const negPosColorScale = d3Instance
            .scaleLinear()
            .domain([-1, 1])
            .range([options.negativeColor, options.positiveColor] as any);

        const textPercent = Math.max(0, Math.min(100, options.categoryTextPercent)) / 100;
        const chartPercent = 1 - textPercent;
        const svg = d3Instance.select(element);
        const box = element.getBoundingClientRect();
        const timeRange = d3Instance.extent(data.timeSeries, ts => new Date(ts.date)) as [Date, Date];
        const { width, height } = box;
        const { 
            rowHeight
        } = options;
        const maxCategories = Math.floor((height - options.axisHeight) / options.rowHeight);
        const fontSize = +options.fontSize;

        const xScale = d3Instance.scaleTime()
            .domain(timeRange)
            .range([width * textPercent, width]);

        // Create a container for all of the category drawings
        const categoryList = svg
            .append('g')
            .attr('class', 'category-list');

        const isSelected = (index: number) => selections.indexOf(index) >= 0;

        const catTextYPadAdjust = rowHeight > fontSize ? Math.floor((rowHeight - fontSize) / 2) : 0;
        const categoryTextY = (index) => options.rowHeight * index + +options.fontSize + catTextYPadAdjust;

        // Create a container per category
        const category = categoryList
            .selectAll('.category')
            .data(data.categories.slice(0, maxCategories))
            .enter().append('g')
            .attr('class', 'category')
            .attr('stroke', 'gray')
            .attr('stroke-width', (d, index) => isSelected(index) ? 1 : 0)
            .on('click', (d, ...args) => options.onClick(d.index, false)); // TODO: try to detect CTRL for multi-select

        // Write out category text
        category.append('text')
            .attr('class', 'category-text')
            .attr('font-size', `${options.fontSize}px`)
            .attr('font-weight', (d, index) => isSelected(index) ? 'bold' : 'normal')
            .attr('y', (d, index) => categoryTextY(index))
            .text(d => d.name);

        // Write out category chart area
        category.append('rect')
            .attr('class', 'category-chart')
            .attr('height', options.rowHeight)
            .attr('width', width * chartPercent)
            .attr('fill', 'none')
            .attr('y', (d, index) => options.rowHeight * index)
            .attr('x', width * textPercent)
            .each((d: any, i) => d.index = i);

        // Draw each value run in the chart area
        category
            .selectAll('.value-run')
            .data(d => getCategoryValues(d, data.timeSeries))
            .enter().append('rect')
            .attr('class', 'value-run')
            .attr('fill', d => negPosColorScale(d.value))
            .attr('x', (d: any) => xScale(d.start))
            .attr('y', (d: any, index: number, nodes: SVGRectElement[]) => (
                options.rowHeight * (d3Instance.select(nodes[index].parentElement).datum() as any).index
            ))
            .attr('height', options.rowHeight)
            .attr('width', (d: any) => xScale(d.end) - xScale(d.start));

        const axisOffset = Math.min(height - options.axisHeight, data.categories.length * options.rowHeight + options.axisHeight);

        // Add the x Axis
        svg.append('g')
            .attr('transform', `translate(0, ${axisOffset})`)
            .call(d3Instance.axisBottom(xScale));
    }
}