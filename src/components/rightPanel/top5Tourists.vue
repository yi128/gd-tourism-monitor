<!-- 接待游客人数TOP5 -->
<template>
  <CPanel>
    <template #header>接待游客人数TOP5</template>
    <template #content>
      <CEcharts ref="chartRef" :option="option" @onload="handleChartLoad" />
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { top5Tourists } = storeToRefs(store)

const chartRef = ref()
let highlightTimer: any = null
let currentIndex = 0
let cachedValues: number[] = []

const option = computed(() => {
  const top5Data = top5Tourists.value
  const values = top5Data?.visitorCounts || []
  cachedValues = values

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: top5Data?.cities || [],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#C5D6E6',
        fontSize: 12
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(52, 71, 112, 1)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#C5D6E6',
        fontSize: 14
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: '数(人次)',
        type: 'pictorialBar',
        barWidth: '150%',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        label: {
          show: true,
          position: 'top',
          fontSize: 14,
          color: 'rgba(201, 211, 234, 1)',
          offset: [0, -10]
        },
        itemStyle: {
          normal: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: 'rgba(94, 111, 153, 0.2)'
                },
                {
                  offset: 0.6,
                  color: 'rgba(94, 111, 153, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(94, 111, 153, 1)'
                }
              ],
              false
            ),
            borderColor: 'rgba(109, 128, 175, 1)',
            borderWidth: 4,
            borderRadius: [100, 100]
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: 'rgba(218, 163, 88, 0.3)'
                },
                {
                  offset: 0.6,
                  color: 'rgba(218, 163, 88, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(218, 163, 88, 0)'
                }
              ],
              false
            ),
            borderColor: 'rgba(218, 163, 88, 1)'
          }
        },
        data: values,
        z: 10
      }
    ]
  }
})

const startHighlightLoop = (chart: any, values: number[]) => {
  if (!chart) return

  if (highlightTimer) {
    clearInterval(highlightTimer)
    highlightTimer = null
  }

  if (!values.length) return

  highlightTimer = setInterval(() => {
    chart.dispatchAction({
      type: 'downplay'
    })
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndex
    })
    currentIndex = (currentIndex + 1) % values.length
  }, 1500)
}

const handleChartLoad = (chart: any) => {
  startHighlightLoop(chart, cachedValues)
}

onUnmounted(() => {
  if (highlightTimer) {
    clearInterval(highlightTimer)
  }
})
</script>
<style lang="scss" scoped></style>