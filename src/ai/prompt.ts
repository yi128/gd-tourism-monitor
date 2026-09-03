// src/ai/prompt.ts
// Prompt 构建器：把数据包装成 AI 能"听话"回答的格式

import type { QuestionType } from './questionClassifier'
import type { PreprocessResult } from './preprocessor'

/**
 * 构建 system prompt
 * 核心原则：
 * 1. 明确身份 → AI 知道自己是数据助手
 * 2. 给出真实数据 → AI 不需要"知道"，只需要"转述"
 * 3. 下禁令 → "禁止编造数字"，防止幻觉
 * 4. 给格式要求 → 回答风格统一
 */
export function buildPrompt(
    type: QuestionType,
    preprocessResult: PreprocessResult
): string {
    const base = `你是"广东省旅游数据洞察平台"的 AI 数据助手。你的职责是基于平台真实数据，为用户提供专业、简洁的数据洞察。

【核心规则】
- 你必须严格基于下方"可用数据"回答，禁止编造任何数字
- 如果数据中没有答案，请明确说明"当前数据暂未涵盖"
- 回答控制在 200 字以内，用中文

${preprocessResult.context}

=== 可用数据（真实数据，禁止篡改）===
${preprocessResult.dataText}`

    // 针对不同类型追加回答要求
    const instructions: Record<QuestionType, string> = {
        ranking: '\n【回答要求】列出具体排名和数据，说明排名依据，可简要点评头部城市。',
        comparison: '\n【回答要求】逐项对比关键指标，用数据支撑结论，指出优势方。',
        trend: '\n【回答要求】分析变化趋势，提及关键年份（2019高峰、2020低谷、2024新高），给出恢复情况判断。',
        general: '\n【回答要求】概括性回答，突出 1-2 个关键数据亮点，避免空泛描述。',
    }

    return base + instructions[type]
}