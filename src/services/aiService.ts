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
    onChunk: (chunk: StreamChunk) => void
) {
    if (!API_KEY) {
        throw new Error('请先在 .env 文件配置 VITE_SILICONFLOW_API_KEY')
    }

    const res = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            // body是json格式
            'Content-Type': 'application/json',
            // 这是我的身份凭证/API Key
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

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`API 错误 ${res.status}: ${err}`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

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

    onChunk({ done: true, content: '' })
}