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
import { ref, computed } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import type { EChartsOption } from 'echarts'
import { useChartConfig, use3DChartConfig } from '@/composables/useChartConfig'
import useChartHighlight from '@/composables/useChartHighlight'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { visitorSourceTop5 } = storeToRefs(store)

const chartRef = ref()

const { createBaseBarConfig } = useChartConfig()
const { create3DCubeShapes, get3DCubeSeriesConfig } = use3DChartConfig()
const { startHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()

create3DCubeShapes()

const currentValues = computed(() => visitorSourceTop5.value?.percentages || [])

const option = computed<EChartsOption>(() => {
  const visitorData = visitorSourceTop5.value
  const values = visitorData?.percentages || []
  const xAxisData = visitorData?.regions || []

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
})

const handleChartLoad = (chart: any) => {
  console.log('✅ chart onload 触发', chart?.id, '数据长度:', currentValues.value.length)
  chart.on('mouseover', (params: any) => {
    if (params.dataIndex !== undefined) {
      pauseAndHighlight(chart, params.dataIndex)
    }
  })

  chart.on('mouseout', () => {
    delayedResume()
  })

  startHighlightLoop(chart, currentValues.value.length)
}
</script>
<style lang="scss" scoped></style>