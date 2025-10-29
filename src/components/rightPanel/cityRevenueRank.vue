<!-- 各市旅游收入排名 -->
<template>
  <CPanel>
    <template #header>各市旅游收入排名</template>
    <template #content>
      <CEcharts :option="option" />
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { useChartConfig } from '@/composables/useChartConfig'

const option = ref<any>({})
const { createBaseBarConfig, createBarSeries } = useChartConfig()

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

onMounted(() => {
  option.value = createChart()
})
</script>