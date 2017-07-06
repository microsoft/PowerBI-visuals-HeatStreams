module essex.visuals.gantt {
    const d3Instance = (<any>window).d3;

    export function render(options: RenderOptions) {
        return essex.d3components.render(essex.d3components.createComponent(
            GanttChart,
            { options }
        ), d3Instance.select(options.element));
    }
}