'use client';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useMemo } from 'react';
import { useLegend } from '../hooks';

export type SharedChartProps = {
  chartType: 'bar' | 'line' | 'area';
  dataset: echarts.EChartsOption['dataset'];
  x?: string;
  y?: string | string[];
  y2?: string | string[];
  y2SeriesType?: 'line' | 'bar';
  stack?: boolean;
  horizontal?: boolean;
  customOption?: echarts.EChartsOption;
};
export function SharedChart(props: SharedChartProps) {
  const legend = useLegend();
  const option = useMemo((): echarts.EChartsOption => {
    const { chartType, dataset, x, y, horizontal, stack } = props;
    const encoder = (x: string, y: string) => {
      return horizontal ? { x: y, y: x } : { x, y };
    };
    // @ts-ignore: TODO: fix this type error
    const series: echarts.SeriesOption = Array.isArray(y)
      ? y.map((yItem) => ({
          type: chartType === 'area' ? 'line' : chartType,
          name: yItem,
          emphasis: {
            focus: 'series',
          },
          stack: stack ? 'total' : undefined,
          encode: x ? encoder(x, yItem) : undefined,
          areaStyle: chartType === 'area' ? {} : undefined,
          // connectNulls: true,
        }))
      : [
          {
            type: chartType === 'area' ? 'line' : chartType,
            name: y,
            emphasis: {
              focus: 'series',
            },
            stack: stack ? 'total' : undefined,
            encode: x && y ? encoder(x, y) : undefined,
            areaStyle: chartType === 'area' ? {} : undefined,
            // connectNulls: true,
          },
        ];

    return {
      xAxis: {
        name: x ?? undefined,
        type: horizontal ? 'value' : 'category',
      },
      yAxis: {
        // name: Array.isArray(y) ? y.join(', ') : (y ?? undefined),
        type: horizontal ? 'category' : 'value',
      },
      series,
      dataset,
      legend,
      tooltip: {},
      ...props.customOption,
    };
  }, [props, legend]);
  return <ReactECharts className="w-full" option={option} />;
}
