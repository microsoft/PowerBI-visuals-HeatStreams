module essex.visuals.gantt {
    const d3Instance = (<any>window).d3;

    // NOTE: The coloring uses the "Diverging" HCL Pattern described here
    // http://hclwizard.org:64230/hclwizard/
    export class Colorizer {
        private minHcl: d3.HCLColor;
        private maxHcl: d3.HCLColor;
        private valueMid: number;
        private chromaScale: d3.ScaleLinear<number, number>;
        private luminanceScale: d3.ScaleLinear<number, number>;

        constructor(private options: RenderOptions) {
            const {
                valueMin,
                valueMax,
                negativeColor,
                positiveColor,
                chromaMin,
                chromaMax,
                luminanceMin,
                luminanceMax,
            } = this.options;
            this.minHcl = d3Instance.hcl(negativeColor);
            this.maxHcl = d3Instance.hcl(positiveColor);
            this.valueMid = (this.options.valueMax + this.options.valueMin) / 2;

            this.chromaScale = d3Instance
                .scaleLinear()
                .domain([valueMin, this.valueMid, valueMax])
                .range([chromaMax, chromaMin, chromaMax]);

            this.luminanceScale = d3Instance
                .scaleLinear()
                .domain([valueMin, this.valueMid, valueMax])
                .range([luminanceMin, luminanceMax, luminanceMin]);
        }

        public color(value: number): d3.HCLColor {
            const { 
                valueMin,
                valueMax,
            } = this.options;
            const { valueMid } = this;

            const sanitized = Math.max(valueMin, Math.min(valueMax, value));
            const h = sanitized < valueMid ? this.minHcl.h : this.maxHcl.h;
            const c = this.chromaScale(sanitized);
            const l = this.luminanceScale(sanitized);
            return d3Instance.hcl(h, c, l);
        }
    }
}