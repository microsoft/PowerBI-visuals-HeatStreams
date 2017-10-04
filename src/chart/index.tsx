import {
  Colorizer,
  DivergingScaler,
  isDivergingColorScheme,
  LinearScaler,
} from "@essex/d3-coloring-scales";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ChartComponent from "./components";

import {
  ICategory,
  IChartOptions,
  ScrubbedHandler,
  SelectionChangedHandler,
  SelectionClearedHandler,
} from "./interfaces";

export default class Chart {
  public scrollPosition: number = 0;
  private optionsInternal: IChartOptions;
  private colorizer: Colorizer;
  private selectionChangedHandler: SelectionChangedHandler;
  private selectionClearedHandler: SelectionClearedHandler;
  private scrubbedHandler: ScrubbedHandler;

  public set options(value: IChartOptions) {
    this.optionsInternal = value;
    const scaler = isDivergingColorScheme(this.options.colorScheme) ?
      new DivergingScaler(this.valueMin, this.valueMid, this.valueMax, this.options.isLogScale) :
      new LinearScaler(this.valueMin, this.valueMax, this.options.isLogScale);

    this.colorizer = new Colorizer(scaler, this.options.colorScheme);
  }

  public get options() {
    return this.optionsInternal;
  }

  private get element() {
    return this.options.element;
  }

  private get width(): number {
    return this.options.element.getBoundingClientRect().width;
  }

  private get height(): number {
    return this.options.element.getBoundingClientRect().height;
  }

  private get valueMin(): number {
    const valueMin = this.options.valueMin;
    return (valueMin !== null && valueMin !== undefined) ? valueMin : this.options.data.valueDomain[0];
  }

  private get valueMax(): number {
    const valueMax = this.options.valueMax;
    return (valueMax !== null && valueMax !== undefined) ? valueMax : this.options.data.valueDomain[1];
  }

  private get valueMid() {
    const scoreSplit = this.options.scoreSplit;
    return (scoreSplit !== null && scoreSplit !== undefined) ? scoreSplit : (this.valueMax + this.valueMin) / 2;
  }

  public onSelectionChanged(handler: SelectionChangedHandler) {
    this.selectionChangedHandler = handler;
  }

  public onSelectionCleared(handler: SelectionClearedHandler) {
    this.selectionClearedHandler = handler;
  }

  public onScrub(handler: ScrubbedHandler) {
    this.scrubbedHandler = handler;
  }

  public render() {
    const { options, width, height, colorizer } = this;
    return ReactDOM.render(
      <ChartComponent
        width={width}
        height={height}
        options={options}
        colorizer={(v) => colorizer.color(v).toString()}
        onClearSelection={this.onClearSelection.bind(this)}
        onClickCategory={this.onClickCategory.bind(this)}
        onScrub={this.onScrubbed.bind(this)}
      />, this.element);
  }

  private onScrubbed(bounds: Array<Date | number>) {
    this.scrubbedHandler(bounds);
  }

  private onClickCategory(category: ICategory, ctrl: boolean) {
    this.selectionChangedHandler(category.id, ctrl);
  }

  private onClearSelection() {
    this.selectionClearedHandler();
  }
}
