const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface StreamChunk {
    done: boolean
    content: string
}

export async function streamChat(
    messages: ChatMessage[],
    onChunk: (chunk: StreamChunk) => void,
    options?: { signal?: AbortSignal; timeout?: number }
) {
    if (!API_KEY) {
        throw new Error('请先在 .env 文件配置 VITE_SILICONFLOW_API_KEY')
    }

    const externalSignal = options?.signal
    const timeout = options?.timeout ?? 60000
    const controller = new AbortController()

    // 外部 signal 触发时联动内部 controller，实现请求取消
    if (externalSignal) {
        if (externalSignal.aborted) {
            controller.abort()
        } else {
            externalSignal.addEventListener('abort', () => controller.abort(), { once: true })
        }
    }
    // 超时自动取消，避免请求长时间挂起
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    let res: Response
    try {
        res = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-ai/DeepSeek-V3',
                messages,
                stream: true,
                temperature: 0.7,
                max_tokens: 2048,
            }),
        })
    } catch (err: any) {
        clearTimeout(timeoutId)
        if (controller.signal.aborted) {
            throw new Error('请求已取消')
        }
        throw new Error(`网络错误: ${err?.message || err}`)
    }
    clearTimeout(timeoutId)

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`API 错误 ${res.status}: ${err}`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed || trimmed === 'data: [DONE]') continue
                if (!trimmed.startsWith('data: ')) continue

                try {
                    const json = JSON.parse(trimmed.slice(6))
                    const content = json.choices?.[0]?.delta?.content || ''
                    if (content) {
                        onChunk({ done: false, content })
                    }
                } catch {
                    // 忽略解析失败的行
                }
            }
        }
    } catch (err: any) {
        if (controller.signal.aborted) {
            throw new Error('请求已取消')
        }
        throw new Error(`流式读取失败: ${err?.message || err}`)
    }

    onChunk({ done: true, content: '' })
}