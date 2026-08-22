<!-- 游客来源地TOP5 -->
<template>
  <CPanel class="age-distribution">
    <template #header>游客来源地TOP5</template>
    <template #content>
      <CEcharts ref="chartRef" :option="option" />
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
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
let chartInstance: any = null

const { createBaseBarConfig } = useChartConfig()
const { create3DCubeShapes, get3DCubeSeriesConfig } = use3DChartConfig()
const { startHighlightLoop, stopHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()

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
    yAxis: { name: '%' }
  })
})

// ========== 核心修复：自己从 DOM 找 chart 实例 ==========

const resolveChart = () => {
  if (chartInstance) return chartInstance
  const el = chartRef.value?.$el
  if (!el) return null
  const inst = echarts.getInstanceByDom(el)
  if (inst) chartInstance = inst
  return inst
}
const setupHighlight = (chart: any) => {
  // 先清理旧绑定，防止重复
  chart.off('mouseover')
  chart.off('mouseout')
  chart.off('globalout')
  stopHighlightLoop()

  chart.on('mouseover', (params: any) => {
    if (params.dataIndex !== undefined) {
      pauseAndHighlight(chart, params.dataIndex)
    }
  })
  chart.on('mouseout', () => delayedResume())
  chart.on('globalout', () => delayedResume())

  startHighlightLoop(chart, currentValues.value.length)
}

// 数据就绪后，等 CEcharts 内部 setOption 完成，再初始化高亮
watch(currentValues, (vals) => {
  if (vals.length === 0) return

  nextTick(() => {
    const timer = setInterval(() => {
      const chart = resolveChart()
      if (chart) {
        clearInterval(timer)
        setupHighlight(chart)
      }
    }, 100)
  })
}, { immediate: true })
</script>
<style lang="scss" scoped></style>