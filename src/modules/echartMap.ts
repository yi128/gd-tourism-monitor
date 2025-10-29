import * as echarts from 'echarts'
import sdData from '@/assets/data/guangdong-geo'
import lineTop1 from '@/assets/images/lineTop1.png'
import lineTop2 from '@/assets/images/lineTop2.png'
import lineTop3 from '@/assets/images/lineTop3.png'
import lineTop4 from '@/assets/images/lineTop4.png'
import lineTop5 from '@/assets/images/lineTop5.png'
echarts.registerMap('sd', sdData as any)
const lineTopList: any = [lineTop1, lineTop2, lineTop3, lineTop4, lineTop5]
// 获取地图配置
export const getMapOption = () => {
  // 渐变层颜色
  const colorList: string[] = [
    '#8b5e70',
    '#81596d',
    '#78556a',
    '#6e5068',
    '#644c65',
    '#5b4762',
    '#51435f',
    '#483e5c',
    '#3e3a59',
    '#343557',
    '#2b3154',
    '#212c51'
  ]
  // 生成渐变图层
  const geoList: any = []
  for (let i = 1; i <= colorList.length; i++) {
    const mapOption: any = {
      map: 'sd',
      aspectScale: 0.85,
      emphasis: {
        disabled: true
      },
      z: 12 - i,
      layoutCenter: ['50%', `${i * 0.3 + 55}%`], //地图位置
      layoutSize: '90%',
      itemStyle: {
        normal: {
          areaColor: colorList[i - 1],
          borderWidth: 0
        }
      }
    }
    if (i === colorList.length) {
      mapOption.itemStyle.normal.shadowColor = 'rgba(0, 0, 0, 0.71)'
      mapOption.itemStyle.normal.shadowBlur = 100
    }
    geoList.push(mapOption)
  }
  // 获取柱状图配置
  const lineSeriesData = getLineData()
  const option = {
    geo: [
      // 最外围发光边界
      {
        map: 'sd',
        aspectScale: 0.85,
        layoutCenter: ['50%', '55%'], //地图位置
        layoutSize: '90%',
        z: 12,
        emphasis: {
          disabled: true
        },
        itemStyle: {
          normal: {
            borderColor: 'rgb(180, 137, 81)',
            borderWidth: 8,
            shadowColor: 'rgba(218, 163, 88, 0.4)',
            shadowBlur: 20
          }
        }
      },
      // 最外层遮罩蒙版
      {
        map: 'sd',
        aspectScale: 0.85,
        layoutCenter: ['50%', '55%'], //地图位置
        layoutSize: '90%',
        z: 14,
        itemStyle: {
          normal: {
            areaColor: 'rgba(106, 125, 171, 0.45)',
            borderWidth: 0
          }
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 14
        }
      },
      // 内部蓝色边界
      {
        map: 'sd',
        aspectScale: 0.85,
        layoutCenter: ['50%', '55%'], //地图位置
        layoutSize: '90%',
        z: 12,
        emphasis: {
          disabled: true
        },
        itemStyle: {
          normal: {
            borderColor: '#8aa5db',
            borderWidth: 1
          }
        }
      },
      ...geoList
    ],
    series: [
      // 地图数据柱子
      ...lineSeriesData
    ]
  }
  return option
}

// 生成地图数据柱数据
const getLineData = () => {
  const districtData: {
    name: string
    value: number
    point: number[]
  }[] = [
      {
        name: '广州市',
        value: 287,
        point: [113.27, 23.15]
      },
      {
        name: '深圳市',
        value: 256,
        point: [114.057, 22.543]
      },
      {
        name: '东莞市',
        value: 185,
        point: [113.751765, 23.020536]
      },
      {
        name: '佛山市',
        value: 168,
        point: [113.10, 23.05]
      },
      {
        name: '惠州市',
        value: 142,
        point: [114.40, 23.15]
      }
    ]
  const lineSeriesData: any = []
  const maxValue: number = Math.max(...districtData.map(item => item.value))
  districtData.forEach((item: any, index: number) => {
    // 柱子
    const lineData = {
      type: 'lines',
      zlevel: 5,
      effect: {
        show: false,
        symbolSize: 5
      },
      lineStyle: {
        width: 8,
        color: {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(232, 204, 149, 1)'
            },
            {
              offset: 1,
              color: 'rgba(170, 144, 91, 1)'
            }
          ],
          global: false
        },
        opacity: 1,
        curveness: 0
      },
      label: {
        show: 0,
        position: 'end',
        formatter: '245'
      },
      silent: true,
      data: [
        {
          ...item,
          coords: [item.point, [item.point[0], item.point[1] + item.value / maxValue]]
        }
      ]
    }
    // 柱子顶部
    const lineTop: any = {
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 5,
      label: {
        show: false
      },
      symbol: 'circle',
      symbolSize: [8, 4],
      itemStyle: {
        color: 'rgba(255, 255, 179, 1)'
      },
      silent: true,
      data: [
        [item.point[0], item.point[1] + item.value / maxValue],
        [item.point[0], item.point[1] + item.value / maxValue]
      ]
    }
    // 柱子底部
    const lineBottom: any = {
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 4,
      label: {
        show: false
      },
      symbol: 'circle',
      symbolSize: [8, 4],
      itemStyle: {
        color: {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(232, 204, 149, 1)'
            },
            {
              offset: 1,
              color: 'rgba(170, 144, 91, 1)'
            }
          ],
          global: false
        }
      },
      silent: true,
      data: [item.point]
    }
    // 底部光圈
    const lineBottomCircle: any = {
      name: 'Top 5',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: [
        {
          name: item['name'],
          value: [item.point[0], item.point[1], item['value']]
        }
      ],
      showEffectOn: 'render',
      rippleEffect: {
        scale: 5,
        brushType: 'stroke'
      },
      label: {
        normal: {
          formatter: '{b}',
          position: 'bottom',
          show: false,
          color: '#fff',
          distance: 10
        }
      },
      symbol: 'circle',
      symbolSize: [20, 10],
      itemStyle: {
        normal: {
          color: 'rgba(232, 204, 149, 1)',
          shadowBlur: 10,
          shadowColor: 'rgba(232, 204, 149, 1)'
        },
        opacity: 1
      },
      zlevel: 4
    }
    // 顶部图标
    const lineTopIcon = {
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 5,
      label: {
        normal: {
          show: true,
          formatter: function (params: any) {
            return `{cityName|${params.name}}\n {value|${params.data.data}} {unit|万人}`
          },
          rich: {
            cityName: {
              color: 'rgba(201, 211, 234, 1)',
              fontSize: 12, // 减小字体
              padding: [4, 0, 2, 40] // 调整padding
            },
            value: {
              color: 'rgba(255, 187, 94, 1)',
              fontSize: 16,
              fontWeight: 800,
              padding: [0, 0, 0, 44]
            },
            unit: {
              color: 'rgba(255, 187, 94, 1)',
              fontSize: 14
            }
          }
        },
        emphasis: {
          show: true
        }
      },
      symbol: `image://` + lineTopList[index],
      symbolSize: [120, 40],
      symbolOffset: [0, 0],
      z: 999,
      data: [
        {
          name: item.name,
          data: item.value,
          value: [item.point[0], item.point[1] + item.value / maxValue + 0.2]
        }
      ]
    }
    lineSeriesData.push(lineData)
    lineSeriesData.push(lineTop)
    lineSeriesData.push(lineBottom)
    lineSeriesData.push(lineBottomCircle)
    lineSeriesData.push(lineTopIcon)
  })
  return lineSeriesData
}
