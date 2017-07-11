module essex.visuals.gantt {
    const d3Instance = (window as any).d3;
    
    export function render(options: RenderOptions) {
        options.element.innerHTML = "";
        return D3Components.render(<GanttChart options={options} />, d3Instance.select(options.element));
    }
}