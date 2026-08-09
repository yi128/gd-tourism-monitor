<!-- 各行业收入 -->
<template>
  <CPanel>
    <template #header>各行业收入</template>
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
const { industryRevenue } = storeToRefs(store)

const chartRef = ref()
let highlightTimer: any = null
let currentIndex = 0
let cachedValues: number[] = []

const option = computed(() => {
  const industryData = industryRevenue.value
  const values = industryData?.values || []
  cachedValues = values

  const xAxisData = industryData?.industries || []
  const seriesData = values.map(v => ({ value: v }))

  return {
    grid: {
      left: '0%',
      right: '0%',
      top: '20%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        show: true,
        lineStyle: {
          width: 2,
          color: 'rgba(76, 93, 130, 1)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 12,
        color: '#C5D6E6',
        textStyle: {
          color: '#C5D6E6'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      name: '亿',
      nameTextStyle: {
        color: 'rgba(201, 211, 234, 1)',
        fontSize: 14,
        padding: [0, 32, 12, 0]
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(52, 71, 112, 1)',
          type: 'dashed'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 14,
        color: '#C5D6E6',
        textStyle: {
          color: '#C5D6E6',
          fontSize: 14
        }
      }
    },
    series: [
      {
        type: 'pictorialBar',
        name: '渐变背景',
        barWidth: 14,
        symbol: 'rect',
        symbolSize: '100%',
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return [...Object.values(seriesData[params.dataIndex])].join('\n')
            },
            fontSize: 12,
            lineHeight: 16,
            color: '#93B9FF'
          }
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(218, 163, 88, 1)'
              },
              {
                offset: 1,
                color: 'rgba(255, 130, 54, 1)'
              }
            ])
          }
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(197, 213, 249, 1)'
              },
              {
                offset: 1,
                color: 'rgba(120, 144, 199, 1)'
              }
            ])
          }
        },
        z: 1,
        zlevel: 0,
        data: seriesData.map(item => item.value)
      },
      {
        type: 'pictorialBar',
        name: '块状切片',
        itemStyle: {
          normal: {
            color: '#011140'
          }
        },
        barWidth: 14,
        symbolRepeat: 28,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [14, 2],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: seriesData.map(item => item.value),
        z: 2,
        zlevel: 0
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