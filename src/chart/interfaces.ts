module essex.visuals.heatStreams {
    export type XDomain = [number, number] | [Date, Date];
    
    export interface Category {
        id: number;
        name: string;
    }

    export interface CategoryData {
        position: Date;
        value: number;
    }

    export interface ChartData {
        categories: Category[];
        categoryData: CategoryDataMap;    
        categoryValues: CategoryValueMap;
        positionDomain: XDomain;
        valueDomain: [number, number];
    }

    export interface ValueSlice {
        start: Date | number;
        value: number;
    }

    export interface VisualDataOptions {
        valueMin: number;
        valueMax: number;
        dateAggregation: DateAggregation;
        isLogScale: boolean;
    }

    export interface VisualRenderingOptions {
        highlightColor: string;
        rowHeight: number;
        categoryTextPercent: number;
        axisHeight: number;
        rowGap: boolean;
        colorScheme: string;
    }

    export interface ChartProps {
        options: ChartOptions;
    }

    export interface CategoryDataMap {
        [key: string]: CategoryData[];
    }

    export interface CategoryValueMap {
        [key: string]: ValueSlice[];
    }

    export interface ProcessedChartsData {
        categoryValues: CategoryValueMap;
        positionDomain: [Date, Date];
    }

    export interface ChartOptions extends VisualRenderingOptions, VisualDataOptions {
        element: HTMLElement;
        data: ChartData;
        selections: { [key: string]: Category };
        scrollOffset: number;
    }

    export type DateAggregation = 'hours' | 'days' | 'months' | 'years';
}
