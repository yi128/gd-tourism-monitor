// src/components/AIInsight/composables/useAIChat.ts
import { ref, computed } from 'vue'
import { useTourismStore } from '@/stores/tourism'
import { storeToRefs } from 'pinia'
import { streamChat, type ChatMessage as AIMessage } from '@/services/aiService'
import { classifyQuestion } from '@/ai/questionClassifier'
import {
    preprocessRanking,
    preprocessComparison,
    preprocessTrend,
    preprocessGeneral,
} from '@/ai/preprocessor'
import { buildPrompt } from '@/ai/prompt'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    isStreaming?: boolean
}

let msgIdCounter = 0

export function useAIChat() {
    // ========== 连接 Store（胶水层的核心职责）==========
    const store = useTourismStore()
    const { currentCityStats, currentSnapshot, recoveryRate, yoyGrowth } = storeToRefs(store)

    const messages = ref<ChatMessage[]>([])
    const isLoading = ref(false)
    const hasMessages = computed(() => messages.value.length > 0)

    async function sendMessage(text: string) {
        if (!text.trim() || isLoading.value) return

        // 1. UI：添加用户消息
        messages.value.push({
            id: `u-${++msgIdCounter}`,
            role: 'user',
            content: text,
        })

        // 2. UI：AI 占位
        messages.value.push({
            id: `a-${++msgIdCounter}`,
            role: 'assistant',
            content: '',
            isStreaming: true,
        })
        isLoading.value = true

        try {
            // 3. 问题分类（本地，0 token）
            const type = classifyQuestion(text)

            // 4. 数据预处理（从 Store 精准取数）
            let preprocessResult
            switch (type) {
                case 'ranking':
                    preprocessResult = preprocessRanking(currentCityStats.value, text)
                    break
                case 'comparison':
                    preprocessResult = preprocessComparison(currentCityStats.value, text)
                    break
                case 'trend':
                    preprocessResult = preprocessTrend(
                        currentCityStats.value,
                        store.getCityTrend,
                        text
                    )
                    break
                default:
                    preprocessResult = preprocessGeneral(
                        currentCityStats.value,
                        currentSnapshot.value,
                        recoveryRate.value,
                        yoyGrowth.value,
                        text
                    )
            }

            // 5. 构建结构化 Prompt
            const systemPrompt = buildPrompt(type, preprocessResult)

            // 6. 构建对话历史（只取最近 2 轮，省 token）
            const previousMessages = messages.value
                .filter(
                    (m) =>
                        (m.role === 'user' || m.role === 'assistant') &&
                        m.content !== '' &&
                        !m.isStreaming
                )
                .slice(-4)

            const history: AIMessage[] = [
                { role: 'system', content: systemPrompt },
                ...previousMessages.map((m) => ({ role: m.role, content: m.content })),
                { role: 'user', content: text },
            ]

            // 7. 调 AI（SSE 流式）
            let fullContent = ''
            await streamChat(history, (chunk) => {
                const lastIdx = messages.value.length - 1

                if (chunk.done) {
                    messages.value[lastIdx] = {
                        ...messages.value[lastIdx],
                        isStreaming: false,
                    }
                } else {
                    fullContent += chunk.content
                    messages.value[lastIdx] = {
                        ...messages.value[lastIdx],
                        content: fullContent,
                    }
                }
            })
        } catch (err: any) {
            const lastIdx = messages.value.length - 1
            messages.value[lastIdx] = {
                ...messages.value[lastIdx],
                content: '❌ 请求失败：' + (err.message || '未知错误'),
                isStreaming: false,
            }
        } finally {
            isLoading.value = false
        }
    }

    function clearMessages() {
        messages.value = []
    }

    return {
        messages,
        isLoading,
        hasMessages,
        sendMessage,
        clearMessages,
    }
}