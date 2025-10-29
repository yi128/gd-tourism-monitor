<!-- 广东实时热词  -->
<template>
  <CPanel>
    <template #header>广东实时热词</template>
    <template #content>
      <div class="words">
        <CEcharts :option="option" />
      </div>
    </template>
  </CPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import defaultIcon from '@/assets/images/real-circle-defalut.png'
import hotIcon from '@/assets/images/real-circle-hot.png'
const option = ref<any>({})
const initEcharts = () => {
  const wordsData: {
    name: string
    value: number
    position: number[]
  }[] = [
    {
      name: '澳车北上',
      value: 18,
      position: [50, 50]
    },
    {
      name: '演唱会',
      value: 15,
      position: [10, 30]
    },
    {
      name: '寻味广东',
      value: 12,
      position: [85, 80]
    },
    {
      name: '博物馆热',
      value: 7,
      position: [27, 55]
    },
    {
      name: '反向旅游',
      value: 7,
      position: [68, 17]
    },

    {
      name: '湾区之夜',
      value: 10,
      position: [20, 90]
    },
    {
      name: '研学旅行',
      value: 5,
      position: [35, 20]
    },
    {
      name: '海岛度假',
      value: 4,
      position: [65, 89]
    },
    {
      name: '广深港高铁提速',
      value: 3,
      position: [90, 40]
    }
  ]
  const optionData: any = []
  // 渲染数据，并写入chart
  wordsData.map((item: any) => {
    optionData.push({
      name: item.name,
      number: item.value,
      value: item.position,
      symbolSize: item.value > 15 ? 70 : 60,
      symbol: item.value > 15 ? 'image://' + hotIcon : 'image://' + defaultIcon
    })
  })
  const options: any = {
    grid: {
      show: false,
      top: 20,
      left: 10,
      right: 10,
      bottom: 10
    },
    xAxis: [
      {
        type: 'value',
        show: false,
        min: 0,
        max: 100
      }
    ],
    yAxis: [
      {
        min: 0,
        show: false,
        max: 100
      }
    ],

    series: [
      {
        type: 'scatter',
        label: {
          normal: {
            show: true,
            formatter: (params: any) => {
              if (params.data.number > 15) {
                return `{hotName|${params.data.name}}\n{hotValue|${params.data.number}%}`
              } else {
                return `{name|${params.data.name}}\n{value|${params.data.number}%}`
              }
            },
            rich: {
              hotName: {
                color: '#FFFFFF',
                fontSize: 18,
                padding: [0, 0, 8, 0],
                align: 'center'
              },
              hotValue: {
                color: '#F0F8FF',
                fontSize: 16
              },
              name: {
                color: '#F5F5F5',
                fontSize: 15,
                padding: [0, 0, 8, 0],
                align: 'center'
              },
              value: {
                color: '#E6E6FA',
                fontSize: 14,
                align: 'center'
              }
            }
          }
        },
        animationDurationUpdate: 500,
        animationEasingUpdate: 500,
        animationDelay: function (idx: number) {
          return idx * 100
        },
        data: optionData
      }
    ]
  }
  return options
}
onMounted(() => {
  option.value = initEcharts()
})
</script>

<style lang="scss" scoped>
::v-deep .panel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.words {
  position: relative;
  width: 100%;
  height: 200px;
  background: url('@/assets/images/热词背景.png') no-repeat center center;
  background-size: 100% 175px;
  box-sizing: border-box;
  display: flex;
  padding: 0 12px 14px 12px;
  flex-direction: column;
  gap: 16px;
}
</style>
