module essex.visuals.gantt {
    declare var D3Components;
    const Select = D3Components.Select;
    const Enter = D3Components.Enter;
    const d3Instance = (window as any).d3;

    export interface GanttChartProps {
        options: RenderOptions;
    }

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

    /**
     * The Time Axis Component
     */
    const TimeAxis = ({ axisOffset, xScale }) => (
        <g
            transform={`translate(0, ${axisOffset})`}
            call={d3Instance.axisBottom(xScale)}
        />
    );

    export interface ValueProps {
        xScale: d3.ScaleLinear<Date, number>;
        rowHeight: number,
        colorizer: Colorizer;
    }

    const Value = ({
        colorizer, 
        xScale, 
        rowHeight,
    }: ValueProps) => (
        <rect
            class='value-run'
            fill={d => colorizer.color(d.value).toString()}
            x={d => xScale(d.start)}
            y={(d, index, nodes) => {
                const parent = nodes[index].parentElement;
                const parentDatum = d3Instance.select(parent).datum();
                return rowHeight * parentDatum['index'];
            }}
            height={rowHeight}
            width={d => xScale(d.end) - xScale(d.start)}
        />
    );

    export interface ValuesProps extends ValueProps {
        values: number[];
    }

    export const Values = (props: ValuesProps) => (
         <Select all selector='.value-run' data={props.values}>
            <Enter>
                <Value {...props} />
            </Enter>
        </Select>
    );

    export interface CategoryProps {
        xScale: d3.ScaleLinear<Date, number>;
        categoryOffsetStart: number;
        maxCategories: number;
        rowHeight: number;
        width: number;
        fontSize: number;
        highlightColor: string;
        chartPercent: number;
        textPercent: number;
        colorizer: Colorizer;
        onCategoryClick: (d: Category) => void;
        isCategorySelected: (index: number) => boolean;
        categoryTextY: (d: Category, index: number) => number;
    }

    export const Category = ({
        xScale,
        data,
        categoryOffsetStart,
        maxCategories,
        rowHeight,
        width,
        fontSize,
        highlightColor,
        onCategoryClick,
        isCategorySelected,
        categoryTextY,
        chartPercent,
        textPercent,
        colorizer,
    }) => (
        <g 
            class="category" 
            on={{ 'click': onCategoryClick }}
            each={(d, i) => d.index = i}
        >
            <rect
                class='category-view'
                fill='none'
                height={rowHeight}
                stroke={highlightColor}
                width={width - 2} // reserve 2px for border select
                y={(d, index) => rowHeight * index}
                stroke-width={(d, index) => isCategorySelected(index) ? 1 : 0}
            />
            <text
                class='category-text'
                font-size={`${fontSize}px`}
                font-weight={(d, index) => isCategorySelected(index) ? 'bold' : 'normal'}
                y={categoryTextY}
            >
                {d => d.name}
            </text>
            <rect
                class='category-chart'
                height={rowHeight}
                width={Math.floor(width * chartPercent) - 1}
                fill='none'
                y={(d, index) => rowHeight * index}
                x={width * textPercent}
            />
            <Values 
                rowHeight={rowHeight}
                xScale={xScale}
                colorizer={colorizer}
                values={d => getCategoryValues(d, data.timeSeries)}
            />
        </g>
    );

    export interface CategoriesProps extends CategoryProps {
        data: GanttData;
    }

    export const Categories = (props: CategoriesProps) => (
        <Select
            all
            selector=".category"
            data={props.data.categories.slice(props.categoryOffsetStart, props.categoryOffsetStart + props.maxCategories)}
        >
            <Enter>
                <Category {...props } />
            </Enter>
        </Select>
    )

    export const GanttChart = (props: GanttChartProps) => {
        const {
            options: {
                data,
            element,
            onScroll,
            onClick,
            rowHeight,
            highlightColor,
            selections,
            axisHeight,
            scrollOffset,
            },
        } = props;
        const box = element.getBoundingClientRect();
        const { width, height } = box;
        const textPercent = Math.max(0, Math.min(100, props.options.categoryTextPercent)) / 100;
        const chartPercent = 1 - textPercent;
        const fontSize = +props.options.fontSize;
        const catTextYPadAdjust = rowHeight > fontSize ? Math.floor((rowHeight - fontSize) / 2) : 0;

        const isCategorySelected = (index: number) => selections.indexOf(categoryOffsetStart + index) >= 0;
        const categoryTextY = (d, index) => rowHeight * index + fontSize + catTextYPadAdjust;

        const colorizer = new Colorizer(props.options);
        const timeRange = d3Instance.extent(data.timeSeries, ts => new Date(ts.date)) as [Date, Date];
        const xScale = d3Instance
            .scaleTime()
            .domain(timeRange)
            .range([width * textPercent, width]);

        const axisOffset = Math.min(height - axisHeight, data.categories.length * rowHeight + axisHeight);
        const maxCategories = Math.floor((height - axisHeight) / rowHeight);

        let categoryOffsetStart = Math.floor(scrollOffset / rowHeight);
        if (data.categories.length < categoryOffsetStart) {
            categoryOffsetStart = data.categories.length - maxCategories;
        }

        const onCategoryClick = (d) => {
            const categoryIndex = categoryOffsetStart + d.index;
            onClick(categoryIndex, d3Instance.event.ctrlKey);
        };

        return (
            <g
                class="category-list"
                on={{ 'wheel.zoom': () => onScroll(d3Instance.event.deltaY) }}
            >
                <TimeAxis axisOffset={axisOffset} xScale={xScale} />
                <Categories
                    xScale={xScale}
                    colorizer={colorizer}
                    data={data}
                    chartPercent={chartPercent}
                    textPercent={textPercent}
                    categoryOffsetStart={categoryOffsetStart}
                    maxCategories={maxCategories}
                    onCategoryClick={onCategoryClick}
                    isCategorySelected={isCategorySelected}
                    rowHeight={rowHeight}
                    highlightColor={highlightColor}
                    fontSize={fontSize}
                    categoryTextY={categoryTextY}
                    width={width}
                />
            </g>
        );
    }
}