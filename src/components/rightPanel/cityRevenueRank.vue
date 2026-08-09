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
import { ref, computed } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { useChartConfig } from '@/composables/useChartConfig'
import useChartHighlight from '@/composables/useChartHighlight'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { cityRevenueRank } = storeToRefs(store)

const chartRef = ref()
const { createBaseBarConfig, createBarSeries } = useChartConfig()
const { startHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()

const option = computed(() => {
  const revenueData = cityRevenueRank.value
  const xAxisData = revenueData?.cities || []
  const dataValues = revenueData?.revenues || []
  const maxRevenue = computed(() => {
    const max = Math.max(...dataValues)
    if (max > 2500) {
      return Math.ceil(max / 500) * 500
    }
    return 2500
  })
  const series = [createBarSeries(dataValues, {
    barWidth: '25%',
    labelFormatter: '{c}'
  })]

  return createBaseBarConfig(xAxisData, series, {
    yAxis: {
      name: revenueData?.unit || '亿',
      min: 0,
      max: maxRevenue.value,
      interval: 500
    }
  })
})

const handleChartLoad = (chart: any) => {
  chart.on('mouseover', (params: any) => {
    if (params.dataIndex !== undefined) {
      pauseAndHighlight(chart, params.dataIndex)
    }
  })

  chart.on('mouseout', () => {
    delayedResume()
  })

  startHighlightLoop(chart, 5)
}
</script>