'use client'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import { useMemo } from 'react'
import { sharedOptions } from '../constants'
import { SharedChart, SharedChartProps } from './shared-chart'

export type AreaChartProps = Omit<SharedChartProps, 'chartType'>
export function AreaChart(props: AreaChartProps) {
  return <SharedChart chartType='area' {...props} />
}
