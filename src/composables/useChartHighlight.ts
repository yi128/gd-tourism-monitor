import { onUnmounted } from "vue"

export default function useChartHighlight() {
    let highlightTimer: any = null
    let currentIndex = 0
    let isPaused = false
    let resumeTimer: any = null

    const startHighlightLoop = (chart: any, dataLength: number) => {
        if (!chart) return

        stopHighlightLoop()
        isPaused = false

        setTimeout(() => {
            if (!chart) return

            highlightTimer = setInterval(() => {
                if (isPaused) return

                try {
                    chart.dispatchAction({ type: 'downplay' })
                    chart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: currentIndex
                    })
                    currentIndex = (currentIndex + 1) % dataLength
                } catch (error) {
                    stopHighlightLoop()
                }
            }, 1500)
        }, 500)
    }

    // 暂停并高亮当前柱子
    const pauseAndHighlight = (chart: any, index: number) => {
        // 清除之前的恢复定时器
        if (resumeTimer) {
            clearTimeout(resumeTimer)
            resumeTimer = null
        }

        isPaused = true

        try {
            // 取消所有高亮
            chart.dispatchAction({ type: 'downplay' })
            // 高亮悬停的柱子
            chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: index
            })
            // 更新当前索引
            currentIndex = index
        } catch (error) {
            console.error('暂停高亮错误:', error)
        }
    }

    // 延迟恢复循环
    const delayedResume = () => {
        // 清除之前的恢复定时器
        if (resumeTimer) {
            clearTimeout(resumeTimer)
            resumeTimer = null
        }

        // 0.5秒后恢复
        resumeTimer = setTimeout(() => {
            isPaused = false
        }, 500)
    }

    const stopHighlightLoop = () => {
        if (highlightTimer) {
            clearInterval(highlightTimer)
            highlightTimer = null
        }
        if (resumeTimer) {
            clearTimeout(resumeTimer)
            resumeTimer = null
        }
        isPaused = false
    }

    onUnmounted(() => {
        stopHighlightLoop()
    })

    return {
        startHighlightLoop,
        stopHighlightLoop,
        pauseAndHighlight,
        delayedResume
    }
}