<!-- 旅游消费构成TOP5 -->
<template>
  <CPanel>
    <template #header>旅游消费构成TOP5</template>
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
const { createBaseBarConfig, createConeBarSeries } = useChartConfig()

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

onMounted(() => {
  option.value = createChart()
})
</script>