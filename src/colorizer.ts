module essex.visuals.gantt {
    const d3: any = window['d3'];

    // NOTE: The coloring uses the "Diverging" HCL Pattern described here
    // http://hclwizard.org:64230/hclwizard/
    export class Colorizer {
        private minHcl: d3.HCLColor;
        private maxHcl: d3.HCLColor;
        private valueMid: number;
        private chroma: d3.ScaleLinear<number, number>;
        private luminance: d3.ScaleLinear<number, number>;
        private valueMin: number;
        private valueMax: number;

        constructor(private options: RenderOptions) {
            const {
        negativeColor,
                positiveColor,
                chromaMin,
                chromaMax,
                luminanceMin,
                luminanceMax,
                valueMin,
                valueMax,
        } = this.options;
            this.minHcl = d3.hcl(negativeColor);
            this.maxHcl = d3.hcl(positiveColor);
            this.valueMin = valueMin;
            this.valueMax = valueMax;
            this.valueMid = (this.options.valueMax + this.options.valueMin) / 2;

            this.chroma = d3
                .scaleLinear()
                .domain([valueMin, this.valueMid, valueMax])
                .range([chromaMax, chromaMin, chromaMax]);

            this.luminance = d3
                .scaleLinear()
                .domain([valueMin, this.valueMid, valueMax])
                .range([luminanceMin, luminanceMax, luminanceMin]);
        }

        public color(value: number): d3.HCLColor {
            const sanitized = this.sanitizeValue(value);
            const h = this.hue(sanitized);
            const c = this.chroma(sanitized);
            const l = this.luminance(sanitized);
            return d3.hcl(h, c, l);
        }

        private hue(value: number) {
            return value < this.valueMid ? this.minHcl.h : this.maxHcl.h;
        }

        private sanitizeValue(value: number) {
            return Math.max(this.valueMin, Math.min(this.valueMax, value));
        }
    }
}
