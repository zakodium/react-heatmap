import React from 'react';
import * as d3 from 'd3';
import { Cluster } from 'ml-hclust';

import { useContextDimensions } from './Chart';

interface IYDendrogramProps {
  hierarchy: d3.HierarchyNode<Cluster>;
}

export default function YDendrogram(props: IYDendrogramProps) {
  const dimensions = useContextDimensions();
  const cluster = d3
    .cluster<Cluster>()
    .size([dimensions.boundedHeight, dimensions.marginLeft])(props.hierarchy);

  const scaleX = d3
    .scaleLinear()
    .domain([cluster.data.distance, 0])
    .range([0, dimensions.marginLeft]);

  const lines: any[] = [];
  cluster.eachAfter((node) => {
    if (node.parent) {
      lines.push(
        <line
          x1={scaleX(node.data.distance)}
          x2={scaleX(node.parent.data.distance)}
          y1={node.x}
          y2={node.x}
          stroke="black"
        />,
      );
    }
    if (node.children) {
      lines.push(
        <line
          x1={scaleX(node.data.distance)}
          x2={scaleX(node.data.distance)}
          y1={node.children[0].x}
          y2={node.children[node.children.length - 1].x}
          stroke="black"
        />,
      );
    }
  });
  return <g transform={`translate(-${dimensions.marginLeft}, 0)`}>{lines}</g>;
}