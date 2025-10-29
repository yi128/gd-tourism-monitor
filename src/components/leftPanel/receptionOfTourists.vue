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
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
const option = ref<any>({})
const createEchartLine = () => {
  return {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: '#2c3e50' 
      }
    },
    legend: {
      top: '5%',
      right: '2%',
      itemGap: 20,
      itemWidth: 15,
      itemHeight: 1,
      textStyle: {
        color: '#2c3e50'
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
        data: ['第一季度', '第二季度', '第三季度', '第四季度'],
        axisLabel: {
          textStyle: {
            color: '#2c3e50',
            fontSize:14
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
          fontSize: 14,
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
            fontSize: 14
          }
        },
        axisLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '2022年',
        type: 'line',
        data: [9080, 6440, 13540, 9650],
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
        name: '2023年',
        type: 'line',
        data: [22800, 19800, 22500, 20500],
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
}
onMounted(() => {
  option.value = createEchartLine()
})
</script>
<style lang="scss" scoped></style>