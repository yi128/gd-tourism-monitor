<!-- 底部组件 -->
<template>
  <footer class="number-footer">
    <div class="number-item" v-for="item in numberData" :key="item.id">
      <!-- 标题 -->
      <div class="title">{{ item.title }}</div>
      <!-- 数据 -->
      <div class="data">
        <img class="data-img" :src="item.img" alt="图标" />
        <div class="data-info">
          <!-- 数字 -->
          <div class="number">
            <Vue3Odometer class="number-value" :value="item.value" />
            <span class="number-unit">{{ item.unit }}</span>
          </div>
          <!-- 比较信息 -->
          <div class="compare">
            <span class="compare-label">较上次</span>
            <img class="compare-img" :src="item.compare === 'up' ? up : down" alt="上涨下跌图标" />
            <span
              class="compare-value"
              :style="{ color: item.compare === 'up' ? 'rgba(247, 61, 75, 1)' : 'rgba(11, 212, 167, 1)' }"
            >
              {{ item.proportion }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Vue3Odometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-default.css'
import 行李箱图标 from '@/assets/images/行李箱图标.png'
import 收入图标 from '@/assets/images/收入图标.png'
import 刷卡图标 from '@/assets/images/刷卡图标.png'
import up from '@/assets/images/up.png'
import down from '@/assets/images/down.png'
const numberData = ref<any>([
  {
    title: '2023年旅游业收入',
    value: 9525.58,
    unit: '亿元',
    compare: 'up',
    proportion: 15.8,
    img: 收入图标
  },
  {
    title: '2023年来访游客数',
    value: 8.74,
    unit: '亿人',
    compare: 'up',
    proportion: 12.4,
    img: 行李箱图标
  },
  {
    title: '2023年广东人口出游支出',
    value: 4.91,
    unit: '万亿元',
    compare: 'up',
    proportion: 140.3,
    img: 刷卡图标
  }
])

let intervalId: any = null

// 用于存储上一次的 value 值
const lastValues = ref<number[]>(numberData.value.map((item: any) => item.value))

function randomizeNumberData() {
  numberData.value = numberData.value.map((item: any, idx: number) => {
    // 生成一个基于当前值的随机浮动（±10%）
    const randomFactor = 1 + (Math.random() - 0.5) * 0.2 // ±10%
    const prevValue = lastValues.value[idx]
    const newValue = +(item.value * randomFactor).toFixed(1)
    // 计算变化百分比
    let proportion = 0
    let compare: 'up' | 'down' = 'up'
    if (prevValue !== 0) {
      proportion = +(((newValue - prevValue) / Math.abs(prevValue)) * 100).toFixed(1)
      compare = proportion >= 0 ? 'up' : 'down'
      proportion = Math.abs(proportion)
    }
    // 更新lastValues
    lastValues.value[idx] = newValue
    return {
      ...item,
      value: newValue,
      proportion,
      compare
    }
  })
}

onMounted(() => {
  // 初始化lastValues
  lastValues.value = numberData.value.map((item: any) => item.value)
  intervalId = window.setInterval(() => {
    randomizeNumberData()
  }, 10000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style lang="scss" scoped>
.number-footer {
  position: absolute;
  width: 100%;
  bottom: 24px;
  display: flex;
  justify-content: center;
  gap: 72px;
  pointer-events: none;
  bottom: -200px;
    animation: entranceAnimation ease-in-out 0.75s forwards;
}
.number-item {
  position: relative;
  width: 268px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  pointer-events: auto;
  .title {
    height: 35px;
    width: 100%;
    background: url('@/assets/images/titleBg.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .data {
    height: 82px;
    width: 100%;
    display: flex;
    gap: 28px;
    justify-content: center;
    .data-img {
      width: 82px;
      height: 82px;
    }
    .data-info {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
    }
    .number {
      display: flex;
      align-items: end;
      gap: 10px;
      .number-value {
        font-size: 32px;
        font-family: 'UniDreamLED';
        color: #fff;
        text-shadow: 0px 0px 13px rgb(154, 110, 44);
      }
      .number-unit {
        font-size: 16px;
        color: #fff;
      }
    }
    .compare {
      display: flex;
      align-items: center;
      gap: 10px;
      .compare-label {
        font-size: 16px;
        color: #576a7d;
        margin-right: 14px;
      }
      .compare-img {
        width: 20px;
        height: 12px;
      }
    }
  }
}
@keyframes entranceAnimation {
  0%{
    bottom: -200px;
  }
  100%{
    bottom: 24px;
  }
}
</style>
