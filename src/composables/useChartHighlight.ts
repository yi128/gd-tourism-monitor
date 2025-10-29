import { onUnmounted } from "vue"
// 高亮循环方法
export default function useChartHighlight() {
    let highlightTimer: any = null
    let currentIndex = 0
    const startHighlightLoop = (chart: any, dataLength: number) => {
        if (!chart) return
        // 如果已经存在定时器，先清除
        if (highlightTimer) {
            clearInterval(highlightTimer)
            highlightTimer = null
        }
        highlightTimer = setInterval(() => {
            // 取消之前的高亮
            chart.dispatchAction({
                type: 'downplay'
            })
            // 高亮当前柱子
            chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: currentIndex
            })
            // 更新索引，循环
            currentIndex = (currentIndex + 1) % dataLength
        }, 1500)
    }
    const stopHighlightLoop = () => {
        if (highlightTimer) {
            clearInterval(highlightTimer)
            highlightTimer = null
        }
    }
    // 自动清理
    onUnmounted(() => {
        stopHighlightLoop()
    })

    return {
        startHighlightLoop,
        stopHighlightLoop
    }
}