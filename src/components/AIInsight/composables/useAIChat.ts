import { ref, computed, watch } from 'vue'
import { useTourismStore, cities } from '@/stores/tourism'
import { storeToRefs } from 'pinia'
import { streamChat, type ChatMessage as AIMessage } from '@/services/aiService'
import { classifyQuestion } from '@/ai/questionClassifier'
import { executeQuery, type QueryContext } from '@/ai/dataQuery'
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

/** 生成唯一的会话 ID */
function genSessionId() {
    return `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** 根据用户首条消息自动生成会话标题（截取前 20 字） */
function genTitle(firstMessage: string) {
    const trimmed = firstMessage.trim().replace(/\n/g, ' ')
    return trimmed.length > 20 ? trimmed.slice(0, 20) + '...' : trimmed
}

/** 从 localStorage 读取历史会话列表 */
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

/** 将会话列表持久化到 localStorage */
function saveToStorage(sessions: ChatSession[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch {
    }
}

/**
 * AI 聊天核心逻辑 Composable
 *
 * 职责：
 *  - 会话管理（创建、切换、删除、持久化）
 *  - 消息发送与流式接收
 *  - 请求竞态处理（发送新请求时自动 abort 旧请求，仅保留最新请求）
 *  - 支持手动取消进行中的请求
 *
 * 数据链路：用户问题 → 意图识别(classifyQuestion) → 结构化数据查询(executeQuery)
 *          → 构建系统 Prompt(buildPrompt) → 调用 AI 流式接口(streamChat)
 */
export function useAIChat() {
    const store = useTourismStore()
    const { currentCityStats, currentSnapshot, recoveryRate, yoyGrowth } = storeToRefs(store)

    // 全部会话列表（持久化）
    const sessions = ref<ChatSession[]>([])
    // 当前激活的会话 ID
    const currentSessionId = ref<string | null>(null)
    // AI 是否正在生成回答
    const isLoading = ref(false)
    // 当前进行中请求的 AbortController，用于取消
    let currentController: AbortController | null = null

    /** 当前会话对象的计算属性 */
    const currentSession = computed<ChatSession | null>(() => {
        if (!currentSessionId.value) return null
        return sessions.value.find((s) => s.id === currentSessionId.value) || null
    })

    /** 当前会话的消息列表 */
    const messages = computed<ChatMessage[]>(() => currentSession.value?.messages ?? [])
    /** 当前会话是否已有消息 */
    const hasMessages = computed(() => messages.value.length > 0)

    /** 创建一个新会话并自动切换过去 */
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

    /** 切换到指定会话；若有进行中请求则先取消 */
    function switchSession(id: string) {
        if (sessions.value.some((s) => s.id === id)) {
            cancelRequest()
            currentSessionId.value = id
        }
    }

    /** 删除指定会话；若删的是当前会话则自动切换到第一个或清空 */
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

    /** 重命名指定会话 */
    function renameSession(id: string, title: string) {
        const session = sessions.value.find((s) => s.id === id)
        if (session) {
            session.title = title
        }
    }

    /** 清空当前会话的所有消息；若有进行中请求则先取消 */
    function clearCurrentSessionMessages() {
        cancelRequest()
        const s = currentSession.value
        if (s) {
            s.messages = []
        }
    }

    /** 取消当前进行中的 AI 请求（调用 AbortController.abort） */
    function cancelRequest() {
        if (currentController) {
            currentController.abort()
        }
    }

    /**
     * 初始化：从 localStorage 加载历史会话到侧边栏，
     * 然后创建一个全新的空会话作为当前会话（保证每次刷新后从新对话开始）
     */
    function init() {
        sessions.value = loadFromStorage()
        createSession()
    }

    // 监听 sessions 变化，自动持久化到 localStorage
    watch(
        sessions,
        (val) => {
            saveToStorage(val)
        },
        { deep: true }
    )

    /**
     * 发送用户消息并接收 AI 流式回答
     *
     * 流程：
     *  1. 若有旧请求进行中，先 abort（竞态处理，保证只保留最新请求）
     *  2. 将用户消息 + 占位 assistant 消息追加到当前会话
     *  3. 数据链路：意图识别 → 结构化查询 → 构建 Prompt
     *  4. 调用 streamChat 流式接收，逐块更新 assistant 消息内容
     *  5. finally 通过 currentController === controller 判断是否为当前请求，
     *     只有最新请求才清理 isLoading，避免旧请求覆盖新请求的状态
     */
    async function sendMessage(text: string) {
        if (!text.trim()) return

        // 竞态处理：如果已有进行中的请求，先取消它
        if (currentController) {
            currentController.abort()
        }

        let session = currentSession.value
        if (!session) {
            session = createSession()
        }

        // 追加用户消息
        session.messages.push({
            id: `u-${++msgIdCounter}`,
            role: 'user',
            content: text,
        })

        // 首条消息自动生成会话标题
        if (session.messages.length === 1) {
            session.title = genTitle(text)
        }

        // 追加占位的 assistant 消息（标记 isStreaming）
        session.messages.push({
            id: `a-${++msgIdCounter}`,
            role: 'assistant',
            content: '',
            isStreaming: true,
        })
        isLoading.value = true

        // 创建本次请求的 AbortController，保存到局部变量供 finally 判断
        const controller = new AbortController()
        currentController = controller

        try {
            // 1) 意图识别：将自由文本问题分类为结构化 Query
            const query = classifyQuestion(text)

            // 2) 结构化数据查询：从 store 提取上下文，执行查询/计算
            const queryCtx: QueryContext = {
                cityStats: currentCityStats.value,
                snapshot: currentSnapshot.value,
                recoveryRate: recoveryRate.value,
                yoyGrowth: yoyGrowth.value,
                getCityTrend: store.getCityTrend,
                allCities: cities,
            }

            const structuredResult = executeQuery(query, queryCtx)

            // 3) 构建系统 Prompt：将结构化数据注入 Prompt 模板
            const systemPrompt = buildPrompt(structuredResult)

            // 取最近 4 条有效历史消息（排除 streaming 中的空消息）
            const previousMessages = session.messages
                .filter(
                    (m) =>
                        (m.role === 'user' || m.role === 'assistant') &&
                        m.content !== '' &&
                        !m.isStreaming
                )
                .slice(-4)

            // 组装 AI API 的消息历史
            const history: AIMessage[] = [
                { role: 'system', content: systemPrompt },
                ...previousMessages.map((m) => ({ role: m.role, content: m.content })),
                { role: 'user', content: text },
            ]

            // 4) 流式调用 AI 接口，逐块追加到占位消息
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
            }, { signal: controller.signal })
        } catch (err: any) {
            const lastIdx = session.messages.length - 1
            if (err.message === '请求已取消') {
                // 请求被取消：移除正在生成的空消息
                session.messages.splice(lastIdx, 1)
            } else {
                session.messages[lastIdx] = {
                    ...session.messages[lastIdx],
                    content: '❌ 请求失败：' + (err.message || '未知错误'),
                    isStreaming: false,
                }
            }
        } finally {
            // 竞态安全清理：只有当前 controller 对应的请求才清理状态
            // 若 sendMessage 已被重新调用，currentController 已指向新 controller，
            // 旧请求此处不做清理，交由新请求的 finally 处理
            const isCurrentRequest = currentController === controller
            if (isCurrentRequest) {
                currentController = null
                isLoading.value = false
            }
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
        cancelRequest,
    }
}