'use client';
import { SharedChart, SharedChartProps } from './shared-chart';

export type LineChartProps = Omit<SharedChartProps, 'chartType'>;
export function LineChart(props: LineChartProps) {
  return <SharedChart chartType="line" {...props} />;
}
