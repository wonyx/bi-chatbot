'use client'

import React from 'react'
import ReactECharts, { EChartsOption } from 'echarts-for-react'

export function Echarts(props: EChartsOption) {
  return <ReactECharts {...props} />
}
