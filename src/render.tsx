module essex.visuals.gantt {
    const d3Instance = (window as any).d3;
    declare var D3Components;
    export function render(options: RenderOptions) {
        options.element.innerHTML = "";
        const root = d3Instance.select(options.element);
        return D3Components.render(root, <GanttChart options={options} />);
    }
}