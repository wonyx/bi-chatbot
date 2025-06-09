'use client'
import { SharedChart, SharedChartProps } from './shared-chart'

export type BarChartProps = Omit<SharedChartProps, 'chartType'>

export function BarChart(props: BarChartProps) {
  return <SharedChart chartType='bar' {...props} />
}
