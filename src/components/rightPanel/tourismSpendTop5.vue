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
import { ref, computed } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { useChartConfig } from '@/composables/useChartConfig'
import useChartHighlight from '@/composables/useChartHighlight'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { tourismSpendTop5 } = storeToRefs(store)

const chartRef = ref()
const { createBaseBarConfig, createConeBarSeries } = useChartConfig()
const { startHighlightLoop, pauseAndHighlight, delayedResume } = useChartHighlight()

const currentLength = computed(() => {
  return tourismSpendTop5.value?.percentages?.length || 0
})

const option = computed(() => {
  const spendData = tourismSpendTop5.value
  const xAxisData = spendData?.categories || []
  const dataValues = spendData?.percentages || []

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

  startHighlightLoop(chart, currentLength.value)
}
</script>