import { ref, computed, watch } from 'vue'
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

export interface ChatSession {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt: number
    updatedAt: number
}

const STORAGE_KEY = 'gd-tourism-ai-sessions'

let msgIdCounter = 0

function genSessionId() {
    return `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function genTitle(firstMessage: string) {
    const trimmed = firstMessage.trim().replace(/\n/g, ' ')
    return trimmed.length > 20 ? trimmed.slice(0, 20) + '...' : trimmed
}

function loadFromStorage(): ChatSession[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
        return []
    } catch {
        return []
    }
}

function saveToStorage(sessions: ChatSession[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch {
    }
}

export function useAIChat() {
    const store = useTourismStore()
    const { currentCityStats, currentSnapshot, recoveryRate, yoyGrowth } = storeToRefs(store)

    const sessions = ref<ChatSession[]>([])
    const currentSessionId = ref<string | null>(null)
    const isLoading = ref(false)

    const currentSession = computed<ChatSession | null>(() => {
        if (!currentSessionId.value) return null
        return sessions.value.find((s) => s.id === currentSessionId.value) || null
    })

    const messages = computed<ChatMessage[]>(() => currentSession.value?.messages ?? [])
    const hasMessages = computed(() => messages.value.length > 0)

    function createSession(): ChatSession {
        const session: ChatSession = {
            id: genSessionId(),
            title: '新会话',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        sessions.value.unshift(session)
        currentSessionId.value = session.id
        return session
    }

    function switchSession(id: string) {
        if (sessions.value.some((s) => s.id === id)) {
            currentSessionId.value = id
        }
    }

    function deleteSession(id: string) {
        const idx = sessions.value.findIndex((s) => s.id === id)
        if (idx === -1) return

        sessions.value.splice(idx, 1)

        if (currentSessionId.value === id) {
            if (sessions.value.length > 0) {
                currentSessionId.value = sessions.value[0].id
            } else {
                currentSessionId.value = null
            }
        }
    }

    function renameSession(id: string, title: string) {
        const session = sessions.value.find((s) => s.id === id)
        if (session) {
            session.title = title
        }
    }

    function clearCurrentSessionMessages() {
        const s = currentSession.value
        if (s) {
            s.messages = []
        }
    }

    function init() {
        sessions.value = loadFromStorage()
        if (sessions.value.length === 0) {
            createSession()
        } else {
            currentSessionId.value = sessions.value[0].id
        }
    }

    watch(
        sessions,
        (val) => {
            saveToStorage(val)
        },
        { deep: true }
    )

    async function sendMessage(text: string) {
        if (!text.trim() || isLoading.value) return

        let session = currentSession.value
        if (!session) {
            session = createSession()
        }

        session.messages.push({
            id: `u-${++msgIdCounter}`,
            role: 'user',
            content: text,
        })

        if (session.messages.length === 1) {
            session.title = genTitle(text)
        }

        session.messages.push({
            id: `a-${++msgIdCounter}`,
            role: 'assistant',
            content: '',
            isStreaming: true,
        })
        isLoading.value = true

        try {
            const type = classifyQuestion(text)

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

            const systemPrompt = buildPrompt(type, preprocessResult)

            const previousMessages = session.messages
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

            let fullContent = ''
            await streamChat(history, (chunk) => {
                const lastIdx = session!.messages.length - 1

                if (chunk.done) {
                    session!.messages[lastIdx] = {
                        ...session!.messages[lastIdx],
                        isStreaming: false,
                    }
                    session!.updatedAt = Date.now()
                } else {
                    fullContent += chunk.content
                    session!.messages[lastIdx] = {
                        ...session!.messages[lastIdx],
                        content: fullContent,
                    }
                }
            })
        } catch (err: any) {
            const lastIdx = session.messages.length - 1
            session.messages[lastIdx] = {
                ...session.messages[lastIdx],
                content: '❌ 请求失败：' + (err.message || '未知错误'),
                isStreaming: false,
            }
        } finally {
            isLoading.value = false
        }
    }

    return {
        sessions,
        currentSessionId,
        currentSession,
        messages,
        isLoading,
        hasMessages,
        init,
        createSession,
        switchSession,
        deleteSession,
        renameSession,
        clearCurrentSessionMessages,
        sendMessage,
    }
}