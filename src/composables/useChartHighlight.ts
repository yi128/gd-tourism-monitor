import { onUnmounted } from "vue"

export default function useChartHighlight() {
    let highlightTimer: any = null
    let currentIndex = 0

    const startHighlightLoop = (chart: any, dataLength: number) => {
        if (!chart) {
            console.warn('Chart instance is not available')
            return
        }

        // 先停止现有的定时器
        stopHighlightLoop()

        // 确保图表已经渲染
        setTimeout(() => {
            if (!chart) return

            highlightTimer = setInterval(() => {
                try {
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
                } catch (error) {
                    console.error('Highlight error:', error)
                    stopHighlightLoop()
                }
            }, 1500)
        }, 500) // 延迟启动，确保图表就绪
    }

    const stopHighlightLoop = () => {
        if (highlightTimer) {
            clearInterval(highlightTimer)
            highlightTimer = null
        }
    }

    onUnmounted(() => {
        stopHighlightLoop()
    })

    return {
        startHighlightLoop,
        stopHighlightLoop
    }
}