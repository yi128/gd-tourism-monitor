<!-- 各季度接待游客对比 -->
<template>
  <CPanel>
    <template #header>各季度接待游客对比</template>
    <template #content>
      <CEcharts :option="option" />
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as echarts from 'echarts'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { quarterlyReception } = storeToRefs(store)

const option = computed(() => {
  const quarterlyData = quarterlyReception.value
  return {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: '#2c3e50',
        fontSize: 16
      }
    },
    legend: {
      top: '5%',
      right: '2%',
      itemGap: 20,
      itemWidth: 15,
      itemHeight: 1,
      textStyle: {
        color: '#2c3e50',
        fontSize: 16
      }
    },
    grid: {
      left: '1%',
      right: '2%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: quarterlyData?.quarters || [],
        axisLabel: {
          textStyle: {
            color: '#2c3e50',
            fontSize:16
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(76, 93, 130, 1)'
          }
        },
        axisTick: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '万人次',
        nameTextStyle: {
          color: '#2c3e50', 
          fontSize: 16,
          padding: [0, 32, 12, 0]
        },
        splitNumber: 4,
        splitLine: {
          lineStyle: {
            color: 'rgba(52, 71, 112, 1)',
            type: 'dashed'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#2c3e50', 
            fontSize: 16
          }
        },
        axisLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: `${quarterlyData?.series?.[0]?.year || 2022}年`,
        type: 'line',
        data: quarterlyData?.series?.[0]?.data || [],
        lineStyle: {
          normal: {
            width: 2,
            color: 'rgba(109, 128, 175, 1)'
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(109, 128, 175, 1)'
                },
                {
                  offset: 1,
                  color: 'rgba(109, 128, 175, 0)'
                }
              ],
              false
            )
          }
        },
        itemStyle: {
          color: 'rgba(109, 128, 175, 1)'
        },
        smooth: true,
        symbol: 'none'
      },
      {
        name: `${quarterlyData?.series?.[1]?.year || 2023}年`,
        type: 'line',
        data: quarterlyData?.series?.[1]?.data || [],
        lineStyle: {
          normal: {
            width: 2,
            color: 'rgba(218, 163, 88, 1)',
            shadowColor: 'rgba(218, 163, 88, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(218, 163, 88, 1)'
                },
                {
                  offset: 1,
                  color: 'rgba(218, 163, 88, 0)'
                }
              ],
              false
            )
          }
        },
        itemStyle: {
          color: 'rgba(15, 222, 255, 1)'
        },
        smooth: true,
        symbol: 'none'
      }
    ]
  }
})
</script>
<style lang="scss" scoped></style>