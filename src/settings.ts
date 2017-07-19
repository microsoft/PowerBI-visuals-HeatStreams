/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
  import VisualRenderingOptions = essex.visuals.gantt.VisualRenderingOptions;
  import VisualDataOptions = essex.visuals.gantt.VisualDataOptions;
  import DateAggregation = essex.visuals.gantt.DateAggregation;

  export class VisualSettings extends DataViewObjectsParser {
    public rendering: VisualRenderingOptions = new VisualRenderingOptionsImpl();
    public data: VisualDataOptions = new VisualDataOptionsImpl();
  }

  export class VisualDataOptionsImpl implements VisualDataOptions {
    public dateAggregation: DateAggregation = "days";    
    public valueMin = -1.0;
    public valueMax = 1.0;
    public isDivergent = true;
  }

  export class VisualRenderingOptionsImpl implements VisualRenderingOptions {
    public positiveColor = "#3494E6";
    public negativeColor = "#EC6EAD";
    public highlightColor = "gray";
    public fontSize = 12;
    public rowHeight = 15;
    public categoryTextPercent = 10;
    public axisHeight = 20;
    public chromaMin = 5;
    public chromaMax = 45;
    public luminanceMin = 35;
    public luminanceMax = 100; 
    public rowGap = true;
  }
}