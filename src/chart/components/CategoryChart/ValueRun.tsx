import * as React from "react";

const BASE_PROPS = Object.freeze({
  className: "value-run",
  shapeRendering: "crisp-edges",
  stroke: "none",
});

const ValueRun = ({
  value,
  x,
  y,
  width,
  height,
  color,
  title,
}) => (
  <rect {...BASE_PROPS} fill={color} height={height} width={width} x={x} y={y}>
    <title>{title}</title>
  </rect>
);

export default ValueRun;
