module essex.visuals.gantt {
    export type GanttXDomain = [number, number] | [Date, Date];
    
    export interface Category {
        id: number;
        name: string;
    }

    export interface CategoryData {
        position: Date;
        value: number;
    }

    export interface GanttData {
        categories: Category[];
        categoryData: CategoryDataMap;    
        categoryValues: CategoryValueMap;
        positionDomain: GanttXDomain;
        valueDomain: [number, number];
    }

    export interface ValueSlice {
        start: Date | number;
        value: number;
    }

    export interface VisualDataOptions {
        valueMin: number;
        valueMax: number;
        isDivergent: boolean;
        dateAggregation: DateAggregation;
        positionDomainType: PositionDomainType;
        isLogScale: boolean;
    }

    export type PositionDomainType = 'date' | 'number';

    export interface VisualRenderingOptions {
        positiveColor: string;
        negativeColor: string;
        highlightColor: string;
        fontSize: number;
        rowHeight: number;
        categoryTextPercent: number;
        axisHeight: number;
        chromaMin: number;
        chromaMax: number;
        luminanceMin: number;
        luminanceMax: number;
        rowGap: boolean;
    }

    export interface GanttChartProps {
        options: GanttOptions;
    }

    export interface CategoryDataMap {
        [key: string]: CategoryData[];
    }

    export interface CategoryValueMap {
        [key: string]: ValueSlice[];
    }

    export interface ProcessedGanttData {
        categoryValues: CategoryValueMap;
        positionDomain: [Date, Date];
    }

    export interface GanttOptions extends VisualRenderingOptions, VisualDataOptions {
        element: HTMLElement;
        data: GanttData;
        selections: { [key: string]: Category };
        scrollOffset: number;
    }

    export type DateAggregation = 'hours' | 'days' | 'months' | 'years';
}
