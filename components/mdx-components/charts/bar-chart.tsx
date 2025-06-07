'use client'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import { useMemo } from 'react'
import { useLegend } from '../hooks'
import { SharedChart, SharedChartProps } from './shared-chart'

export type BarChartProps = Omit<SharedChartProps, 'chartType'>

export function BarChart(props: BarChartProps) {
  return <SharedChart chartType='bar' {...props} />
}
