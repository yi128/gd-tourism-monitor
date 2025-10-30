<!-- 旅游消费构成TOP5 -->
<template>
  <CPanel>
    <template #header>旅游消费构成TOP5</template>
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
const { createBaseBarConfig, createConeBarSeries } = useChartConfig()
const { startHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()

const createChart = () => {
  const xAxisData = ['交通', '住宿', '餐饮', '购物', '门票娱乐']
  const dataValues = [28, 24, 22, 18, 8]
  
  const series = [createConeBarSeries(dataValues)]

  return createBaseBarConfig(xAxisData, series, {
    yAxis: {
      name: '%',
      min: 0,
      max: 35,
      interval: 5
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '10%',
      bottom:'3%'
    },
    xAxis: {
      axisLabel: {
        fontSize: 16,
        interval: 0,
        margin: 10, 
        align: 'center'
      }
    }
  })
}

// 图表加载完成回调
const handleChartLoad = (chart: any) => {
  // 鼠标悬停事件
  chart.on('mouseover', (params: any) => {
    if (params.dataIndex !== undefined) {
      pauseAndHighlight(chart, params.dataIndex)  // 立即暂停并高亮悬停柱子
    }
  })
  
  // 鼠标移出事件
  chart.on('mouseout', () => {
    delayedResume()  
  })
  
  // 启动高亮循环
  startHighlightLoop(chart, 5) 
}

onMounted(() => {
  option.value = createChart()
})
</script>