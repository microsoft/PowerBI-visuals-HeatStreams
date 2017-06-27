module essex.visuals.gantt {
    import GanttData = essex.visuals.gantt.interfaces.GanttData;
    import Category = essex.visuals.gantt.interfaces.Category;
    import CategoryData = essex.visuals.gantt.interfaces.CategoryData;
    const d3 = (<any>window).d3;

    export interface ValueSlice {
        start: Date;
        end: Date;
        value: number;
    }

    const AXIS_HEIGHT = 20;

    function addDays(date: Date, days: number): Date {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function getCategoryValues(category: Category, timeSeries: CategoryData[]): ValueSlice[] {
        // Get the time-series data for this category sorted by time ascending
        const catData = timeSeries
            .filter(ts => ts.category === category.id)
            .map(ts => ({
                ...ts,
                date: new Date(ts.date),
            }))
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

    const CATEGORY_HEIGHT = 30;
    const CATEGORY_TEXT_FONT_SIZE = 16;

    export function render(element: SVGElement, data: GanttData) {
        console.log('render!', d3);
        
        const svg = d3.select(element);
        const box = element.getBoundingClientRect();
        const timeRange = d3.extent(data.timeSeries, ts => new Date(ts.date)) as [Date, Date];
        const { width, height } = box;
        console.log('%sx%s', width, height);

        const xScale = d3.scaleTime()
            .domain(timeRange)
            .range([width * 0.2, width]);

        // Create a container for all of the category drawings
        const categoryList = svg
            .append('g')
            .attr('class', 'category-list')
            .attr('transform', 'translate(10,10)');

        // Create a container per category
        const category = categoryList
            .selectAll('.category')
            .data(data.categories)
            .enter().append('g')
            .attr('class', 'category');

        // Write out category text
        category.append('text')
            .attr('class', 'category-text')
            .attr('font-size', `${CATEGORY_TEXT_FONT_SIZE}px`)
            .attr('y', (d, index) => CATEGORY_HEIGHT * index + CATEGORY_TEXT_FONT_SIZE + 5)
            .text(d => d.name);

        // Write out category chart area
        category.append('rect')
            .attr('class', 'category-chart')
            .attr('height', CATEGORY_HEIGHT)
            .attr('width', width * 0.8)
            .attr('fill', 'none')
            .attr('y', (d, index) => CATEGORY_HEIGHT * index)
            .attr('x', width * 0.2)
            .each((d: any, i) => d.index = i);

        // Draw each value run in the chart area
        category
            .selectAll('.value-run')
            .data(d => getCategoryValues(d, data.timeSeries))
            .enter().append('rect')
            .attr('class', 'value-run')
            .attr('fill', d => d3.interpolateInferno(d.value))
            .attr('x', (d: any) => xScale(d.start))
            .attr('y', (d: any, index: number, nodes: SVGRectElement[]) => (
                CATEGORY_HEIGHT * (d3.select(nodes[index].parentElement).datum() as any).index
            ))
            .attr('height', 30)
            .attr('width', (d: any) => xScale(d.end) - xScale(d.start));

        const axisOffset = Math.min(height - AXIS_HEIGHT, data.categories.length * CATEGORY_HEIGHT + AXIS_HEIGHT);

        // Add the x Axis
        svg.append('g')
            .attr('transform', `translate(0, ${axisOffset})`)
            .call(d3.axisBottom(xScale));
    }
}