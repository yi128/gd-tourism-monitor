<!-- 游客年龄分布 -->
<template>
  <CPanel class="age-distribution">
    <template #header>游客年龄分布</template>
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
import type { EChartsOption, TooltipComponentOption, CustomSeriesOption, BarSeriesOption } from 'echarts'

const store = useTourismStore()
const { ageDistribution } = storeToRefs(store)

const chartRef = ref()
let highlightTimer: any = null
let currentIndex = 0
let cachedValues: number[] = []

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

const createEchartBar = (ageData: any): EChartsOption => {
  const offsetX = 10
  const offsetY = 5
  const values: number[] = ageData?.values || []
  cachedValues = values

  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: any, shape: any) {
      const xAxisPoint = shape.xAxisPoint
      const c0 = [shape.x, shape.y]
      const c1 = [shape.x - offsetX, shape.y - offsetY]
      const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1]]
      const c3 = [xAxisPoint[0], xAxisPoint[1]]
      ctx.moveTo(c0[0], c0[1])
      ctx.lineTo(c1[0], c1[1])
      ctx.lineTo(c2[0], c2[1])
      ctx.lineTo(c3[0], c3[1])
      ctx.closePath()
    }
  })
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: any, shape: any) {
      const xAxisPoint = shape.xAxisPoint
      const c1 = [shape.x, shape.y]
      const c2 = [xAxisPoint[0], xAxisPoint[1]]
      const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1]]
      const c4 = [shape.x + offsetX, shape.y - offsetY]
      ctx.moveTo(c1[0], c1[1])
      ctx.lineTo(c2[0], c2[1])
      ctx.lineTo(c3[0], c3[1])
      ctx.lineTo(c4[0], c4[1])
      ctx.closePath()
    }
  })
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx: any, shape: any) {
      const c1 = [shape.x, shape.y]
      const c2 = [shape.x + offsetX, shape.y - offsetY]
      const c3 = [shape.x, shape.y - offsetX]
      const c4 = [shape.x - offsetX, shape.y - offsetY]
      ctx.moveTo(c1[0], c1[1])
      ctx.lineTo(c2[0], c2[1])
      ctx.lineTo(c3[0], c3[1])
      ctx.lineTo(c4[0], c4[1])
      ctx.closePath()
    }
  })
  echarts.graphic.registerShape('CubeLeft', CubeLeft)
  echarts.graphic.registerShape('CubeRight', CubeRight)
  echarts.graphic.registerShape('CubeTop', CubeTop)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params: any) {
        const item = params[1]
        return item.name + ' : ' + item.value
      }
    } as TooltipComponentOption,
    grid: {
      left: '0%',
      right: '0%',
      top: '20%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ageData?.categories || [],
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
        color: 'rgba(201, 211, 234, 1)'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      name: '万人',
      nameTextStyle: {
        color: 'rgba(201, 211, 234, 1)',
        fontSize: 14,
        padding: [0, 32, 12, 0]
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(49, 58, 86, 1)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 14,
        color: 'rgba(201, 211, 234, 1)'
      }
    },
    series: [
      {
        type: 'custom',
        renderItem: (_params: any, api: any) => {
          const location = api.coord([api.value(0), api.value(1)])
          return {
            type: 'group',
            children: [
              {
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(114, 138, 192, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(68, 95, 156, 1)'
                    }
                  ])
                },
                emphasis: {
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(230, 165, 75, 1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(175, 111, 23, 1)'
                      }
                    ])
                  }
                }
              },
              {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(161, 186, 244, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(104, 134, 202, 1)'
                    }
                  ])
                },
                emphasis: {
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(230, 165, 75, 1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(175, 111, 23, 1)'
                      }
                    ])
                  }
                }
              },
              {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(198, 213, 244, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(198, 213, 244, 1)'
                    }
                  ])
                },
                emphasis: {
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(230, 165, 75, 1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(230, 165, 75, 1)'
                      }
                    ])
                  }
                }
              }
            ]
          }
        },
        data: values
      } as unknown as CustomSeriesOption,
      {
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'top',
            fontSize: 14,
            color: 'rgba(201, 211, 234, 1)',
            offset: [0, -25]
          }
        },
        itemStyle: {
          color: 'transparent'
        },
        tooltip: {},
        data: values
      } as BarSeriesOption
    ]
  }
}

const option = computed(() => {
  return createEchartBar(ageDistribution.value)
})

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