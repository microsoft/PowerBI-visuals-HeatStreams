module essex.visuals.gantt {
    const d3: any = window['d3'];

    // NOTE: The coloring uses the "Diverging" HCL Pattern described here
    // http://hclwizard.org:64230/hclwizard/
    export class Colorizer {
        private minHcl: d3.HCLColor;
        private maxHcl: d3.HCLColor;
        private chroma: d3.ScaleLinear<number, number>;
        private luminance: d3.ScaleLinear<number, number>;

        private get isDivergent(): boolean {
            return this.options.isDivergent;
        }

        private get valueMin(): number {
            return this.options.valueMin;
        }

        private get valueMax(): number {
            return this.options.valueMax;
        }

        private get valueMid(): number {
            return (this.valueMax + this.valueMin) / 2;
        }

        private get chromaMin() {
            return this.options.chromaMin;
        }

        private get chromaMax() {
            return this.options.chromaMax;
        }

        private get luminanceMin() {
            return this.options.luminanceMin;
        }

        private get luminanceMax() {
            return this.options.luminanceMax;
        }

        private getChromaScale() {
            const { isDivergent, valueMin, valueMid, valueMax, chromaMin, chromaMax } = this;
            const domain = isDivergent ? [valueMin, valueMid, valueMax] : [valueMin, valueMax];
            const range = isDivergent ? [chromaMax, chromaMin, chromaMax] : [chromaMin, chromaMax];
            return d3
                .scaleLinear()
                .domain(domain)
                .range(range);
        }

        private getLuminanceScale() {
            const { isDivergent, valueMin, valueMid, valueMax, luminanceMin, luminanceMax } = this;
            const domain = isDivergent ? [valueMin, valueMid, valueMax] : [valueMin, valueMax];
            const range = isDivergent ? [luminanceMin, luminanceMax, luminanceMin] : [luminanceMax, luminanceMin];
            return d3
                .scaleLinear()
                .domain(domain)
                .range(range);
        }

        constructor(private options: GanttOptions) {
            const {
                negativeColor,
                positiveColor,
            } = this.options;
            this.minHcl = d3.hcl(negativeColor);
            this.maxHcl = d3.hcl(positiveColor);
            this.chroma = this.getChromaScale();
            this.luminance = this.getLuminanceScale();
        }

        public color(value: number): d3.HCLColor {
            const sanitized = this.sanitizeValue(value);
            const h = this.hue(sanitized);
            const c = this.chroma(sanitized);
            const l = this.luminance(sanitized);
            return d3.hcl(h, c, l);
        }

        private hue(value: number) {
            if (!this.isDivergent) {
                return this.maxHcl.h;
            } else {
                return value < this.valueMid ? this.minHcl.h : this.maxHcl.h;
            }
        }

        private sanitizeValue(value: number) {
            return Math.max(this.valueMin, Math.min(this.valueMax, value));
        }
    }
}
