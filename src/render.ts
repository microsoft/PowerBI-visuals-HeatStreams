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

    export function render(options: RenderOptions) {
        const { 
            element, 
            data, 
            selections,
            scrollOffset,
            rowHeight,
            axisHeight,
            onClick,
            onScroll,
        } = options;

        // Clear the drawing surface
        element.innerHTML = "";

        const negPosColorScale = d3Instance
            .scaleLinear()
            .domain([options.valueMin, options.valueMax])
            .range([options.negativeColor, options.positiveColor] as any);

        const textPercent = Math.max(0, Math.min(100, options.categoryTextPercent)) / 100;
        const chartPercent = 1 - textPercent;
        const fontSize = +options.fontSize;

        const svg = d3Instance.select(element);
        const box = element.getBoundingClientRect();
        const timeRange = d3Instance.extent(data.timeSeries, ts => new Date(ts.date)) as [Date, Date];
        const { width, height } = box;
        const maxCategories = Math.floor((height - axisHeight) / rowHeight);

        let categoryOffsetStart = scrollOffset / rowHeight;
        if (data.categories.length < categoryOffsetStart) {
            categoryOffsetStart = data.categories.length - maxCategories;
        }

        const xScale = d3Instance.scaleTime()
            .domain(timeRange)
            .range([width * textPercent, width]);

        // Create a container for all of the category drawings
        const categoryList = svg
            .append('g')
            .attr('class', 'category-list')
            .on('wheel.zoom', () => onScroll(d3Instance.event.deltaY));

        const isSelected = (index: number) => selections.indexOf(index) >= 0;

        const catTextYPadAdjust = rowHeight > fontSize ? Math.floor((rowHeight - fontSize) / 2) : 0;
        const categoryTextY = (index) => rowHeight * index + fontSize + catTextYPadAdjust;

        // Create a container per category
        const category = categoryList
            .selectAll('.category')
            .data(data.categories.slice(categoryOffsetStart, categoryOffsetStart + maxCategories))
            .enter().append('g')
            .attr('class', 'category')
            .on('click', (d, ...args) => onClick(d.index, d3Instance.event.ctrlKey));

        category.append('rect')
            .attr('class', 'category-view')
            .attr('height', rowHeight)
            .attr('fill', 'none')
            .attr('stroke', options.highlightColor)
            .attr('y', (d, index) => rowHeight * index)
            .attr('stroke-width', (d, index) => isSelected(index) ? 1 : 0)
            .attr('width', width - 2); // reserve 2px for border select

        // Write out category text
        category.append('text')
            .attr('class', 'category-text')
            .attr('font-size', `${fontSize}px`)
            .attr('font-weight', (d, index) => isSelected(index) ? 'bold' : 'normal')
            .attr('y', (d, index) => categoryTextY(index))
            .text(d => d.name);

        // Write out category chart area
        category.append('rect')
            .attr('class', 'category-chart')
            .attr('height', rowHeight)
            .attr('width', Math.floor(width * chartPercent) - 1)
            .attr('fill', 'none')
            .attr('y', (d, index) => rowHeight * index)
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
                rowHeight * (d3Instance.select(nodes[index].parentElement).datum() as any).index
            ))
            .attr('height', rowHeight)
            .attr('width', (d: any) => xScale(d.end) - xScale(d.start));

        const axisOffset = Math.min(height - axisHeight, data.categories.length * rowHeight + axisHeight);

        // Add the x Axis
        svg.append('g')
            .attr('transform', `translate(0, ${axisOffset})`)
            .call(d3Instance.axisBottom(xScale));
    }
}