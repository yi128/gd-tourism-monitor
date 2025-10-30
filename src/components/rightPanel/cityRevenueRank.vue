<!-- 各市旅游收入排名 -->
<template>
  <CPanel>
    <template #header>各市旅游收入排名</template>
    <template #content>
      <CEcharts ref="chartRef" :option="option" @onload="handleChartLoad" />
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { useChartConfig } from '@/composables/useChartConfig'
import useChartHighlight from '@/composables/useChartHighlight'

const option = ref<any>({})
const chartRef = ref()
const { createBaseBarConfig, createBarSeries } = useChartConfig()
const { startHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()

const createChart = () => {
  const xAxisData = ['广州', '深圳', '佛山', '东莞', '珠海']
  const dataValues = [2500, 2000, 1500, 1000, 500]
  
  const series = [createBarSeries(dataValues, {
    barWidth: '25%',
    labelFormatter: '{c}'
  })]

  return createBaseBarConfig(xAxisData, series, {
    yAxis: {
      name: '亿',
      min: 0,
      max: 2500,
      interval: 500
    }
  })
}

const handleChartLoad = (chart: any) => {
  // 鼠标悬停事件
  chart.on('mouseover', (params: any) => {
    if (params.dataIndex !== undefined) {
      pauseAndHighlight(chart, params.dataIndex)  // 使用传入的chart参数
    }
  })
  
  // 鼠标移出事件
  chart.on('mouseout', () => {
    delayedResume()  // 1秒后恢复循环
  })
  
  // 启动高亮循环
  startHighlightLoop(chart, 5)
}

onMounted(() => {
  option.value = createChart()
})
</script>