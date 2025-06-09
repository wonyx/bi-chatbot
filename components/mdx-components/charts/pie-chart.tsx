'use client'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import { useMemo } from 'react'

export type PieChartProps = {
  dataset: any
}
export function PieChart(props: PieChartProps) {
  const option = useMemo((): EChartsOption => {
    return {
      series: [
        {
          type: 'pie',
        },
      ],
      dataset: props.dataset,
      // ...sharedOptions,
    }
  }, [props.dataset])
  return <ReactECharts option={option} />
}
