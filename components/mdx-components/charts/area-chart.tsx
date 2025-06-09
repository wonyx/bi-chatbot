'use client'
import { SharedChart, SharedChartProps } from './shared-chart'

export type AreaChartProps = Omit<SharedChartProps, 'chartType'>
export function AreaChart(props: AreaChartProps) {
  return <SharedChart chartType='area' {...props} />
}
