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
const { get3DCubeSeriesConfig } = use3DChartConfig()
const { startHighlightLoop } = useChartHighlight()

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
  startHighlightLoop(chart, values.length)
}

onMounted(() => {
  option.value = createEchartBar()
})
</script>
<style lang="scss" scoped></style>