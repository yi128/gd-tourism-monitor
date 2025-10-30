<!-- 游客来源地TOP5 -->
<template>
  <CPanel class="age-distribution">
    <template #header>游客来源地TOP5</template>
    <template #content>
      <CEcharts ref="chartRef" :option="option" @onload="handleChartLoad" />
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import type { EChartsOption } from 'echarts'
import { useChartConfig, use3DChartConfig } from '@/composables/useChartConfig'
import useChartHighlight from '@/composables/useChartHighlight'

const option = ref<EChartsOption>({})
const chartRef = ref()
const values: number[] = [18, 16, 12, 9, 8]

const { createBaseBarConfig } = useChartConfig()
const { create3DCubeShapes, get3DCubeSeriesConfig } = use3DChartConfig()
const { startHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()  // 添加新方法

// 注册3D形状
create3DCubeShapes()

const createEchartBar = (): EChartsOption => {
  const xAxisData = ['湖南', '广西', '江西', '福建', '湖北']
  
  return createBaseBarConfig(xAxisData, get3DCubeSeriesConfig(values), {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[1]
        return `${item.name}: ${item.value}%`
      }
    },
    yAxis: {
      name: '%'
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
    delayedResume()  // 1秒后恢复循环
  })
  
  // 启动高亮循环
  startHighlightLoop(chart, values.length)
}

onMounted(() => {
  option.value = createEchartBar()
})
</script>
<style lang="scss" scoped></style>