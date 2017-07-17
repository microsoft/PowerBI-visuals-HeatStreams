module essex.visuals.gantt {
    export interface Category {
        id: number;
        name: string;
    }

    export interface CategoryData {
        category: number;
        position: Date;
        value: number;
    }

    export interface GanttData {
        categories: Category[];
        values: CategoryData[];
    }

    export interface ValueSlice {
        start: Date;
        end: Date;
        value: number;
    }

    export interface VisualOptions {
        positiveColor: string;
        negativeColor: string;
        highlightColor: string;
        fontSize: number;
        rowHeight: number;
        categoryTextPercent: number;
        axisHeight: number;
        valueMin: number;
        valueMax: number;
        chromaMin: number;
        chromaMax: number;
        luminanceMin: number;
        luminanceMax: number;
    }

    export interface RenderOptions extends VisualOptions {
        element: HTMLElement;
        data: GanttData;
        selections: { [key: string]: Category };
        scrollOffset: number;
    }

    export interface GanttChartProps {
        options: RenderOptions;
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
}
