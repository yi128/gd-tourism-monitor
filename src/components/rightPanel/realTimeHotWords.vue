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
import { computed } from 'vue'
import CPanel from '@/components/common/CPanel.vue'
import CEcharts from '@/components/common/CEcharts.vue'
import defaultIcon from '@/assets/images/real-circle-defalut.png'
import hotIcon from '@/assets/images/real-circle-hot.png'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'

const store = useTourismStore()
const { currentSnapshot } = storeToRefs(store)

// 预定义 9 个不重叠的坐标位置（x: 0-100, y: 0-100）
// 按视觉重要性从中心向四周扩散
const POSITIONS: [number, number][] = [
  [50, 72],  // 中心偏上 —— 给热度最高的词
  [22, 58],  // 左上
  [78, 58],  // 右上
  [18, 32],  // 左中
  [82, 32],  // 右中
  [35, 18],  // 左下
  [65, 18],  // 右下
  [12, 78],  // 最左
  [88, 78],  // 最右
]

const option = computed(() => {
  // ✅ 从 currentSnapshot 取 hotWords，兜底空数组
  const wordsData = currentSnapshot.value?.hotWords ?? []
  
  // 按热度从高到低排序，依次分配最佳位置
  const sortedWords = [...wordsData].sort((a, b) => b.value - a.value)
  
  const optionData = sortedWords.map((item, index) => {
    const pos = POSITIONS[index] || [50, 50]
    return {
      name: item.name,
      number: item.value,
      value: pos,  // ✅ 用预定义坐标，不再依赖旧版 position
      symbolSize: item.value > 15 ? 70 : 60,
      symbol: item.value > 15 ? 'image://' + hotIcon : 'image://' + defaultIcon
    }
  })

  return {
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
        type: 'value',  // ✅ 补全 type
        min: 0,
        show: false,
        max: 100
      }
    ],
    series: [
      {
        type: 'scatter',
        label: {
          show: true,
          formatter: (params: any) => {
            if (params.data.number > 15) {
              return `{hotName|${params.data.name}}\n{hotValue|${params.data.number}}`
            } else {
              return `{name|${params.data.name}}\n{value|${params.data.number}}`
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
              fontSize: 16,
              align: 'center'
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
        },
        animationDurationUpdate: 500,
        animationEasingUpdate: 500,
        animationDelay: (idx: number) => idx * 100,
        data: optionData
      }
    ]
  }
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