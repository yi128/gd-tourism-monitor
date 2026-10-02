// src/ai/prompt.ts
// Prompt 构建器：接收结构化结果，生成 System Prompt

import type { QuestionType } from './questionClassifier'
import type { StructuredResult } from './dataQuery'

/**
 * 构建 system prompt
 * 核心原则：
 * 1. 明确身份 → AI 知道自己是数据助手
 * 2. 给出真实数据 → AI 不需要"知道"，只需要"转述"
 * 3. 下禁令 → "禁止编造数字"，防止幻觉
 * 4. 给格式要求 → 回答风格统一
 */
export function buildPrompt(result: StructuredResult): string {
    const base = `你是"广东省旅游数据洞察平台"的 AI 数据助手。你的职责是基于平台真实数据，为用户提供专业、简洁的数据洞察。

【核心规则】
- 你必须严格基于下方"可用数据"回答，禁止编造任何数字
- 如果数据中没有答案，请明确说明"当前数据暂未涵盖"
- 回答控制在 200 字以内，用中文

${result.context}

=== 可用数据（真实数据，禁止篡改）===
${formatDataText(result)}`

    // 针对不同类型追加回答要求
    const instructions: Record<QuestionType, string> = {
        ranking: '\n【回答要求】列出具体排名和数据，说明排名依据，可简要点评头部城市。',
        comparison: '\n【回答要求】逐项对比关键指标，用数据支撑结论，指出优势方。',
        trend: '\n【回答要求】分析变化趋势，提及关键年份（2019高峰、2020低谷、2024新高），给出恢复情况判断。',
        general: '\n【回答要求】概括性回答，突出 1-2 个关键数据亮点，避免空泛描述。',
    }

    return base + instructions[result.intent]
}

/**
 * 将结构化结果格式化为 AI 可读的文本
 */
function formatDataText(result: StructuredResult): string {
    switch (result.intent) {
        case 'ranking':
            return formatRanking(result)
        case 'comparison':
            return formatComparison(result)
        case 'trend':
            return formatTrend(result)
        case 'general':
        default:
            return formatGeneral(result)
    }
}

// ---------- 格式化排名 ----------

function formatRanking(result: StructuredResult): string {
    const r = result.ranking!
    const lines: string[] = []

    lines.push(`【查询】${result.queryDesc}`)
    lines.push('')

    lines.push(`【旅游收入排名 TOP${r.topN}】`)
    r.byRevenue.forEach(item => {
        lines.push(`${item.rank}. ${item.name}: ${item.revenue}亿元`)
    })

    lines.push('')
    lines.push(`【游客量排名 TOP${r.topN}】`)
    r.byVisitors.forEach(item => {
        lines.push(`${item.rank}. ${item.name}: ${item.visitors}万人次`)
    })

    return lines.join('\n')
}

// ---------- 格式化对比 ----------

function formatComparison(result: StructuredResult): string {
    const c = result.comparison!
    const lines: string[] = []

    lines.push(`【查询】${result.queryDesc}`)
    lines.push('')

    c.items.forEach(item => {
        lines.push(`${item.name}: 游客量${item.visitors}万人次，旅游收入${item.revenue}亿元`)
    })

    return lines.join('\n')
}

// ---------- 格式化趋势 ----------

function formatTrend(result: StructuredResult): string {
    const t = result.trend!
    const lines: string[] = []

    lines.push(`【查询】${result.queryDesc}`)
    lines.push('')

    for (const analysis of t.analyses) {
        lines.push(`【${analysis.cityName}历年数据】`)
        analysis.points.forEach(p => {
            lines.push(`${p.year}年: 游客${p.visitors}万人次，收入${p.revenue}亿元`)
        })

        if (analysis.growthRate !== null) {
            lines.push(`整体增长率: ${analysis.growthRate > 0 ? '+' : ''}${analysis.growthRate}%`)
        }
        if (analysis.recoveryRate !== null) {
            lines.push(`恢复率(2024 vs 2019): ${analysis.recoveryRate > 0 ? '+' : ''}${analysis.recoveryRate}%`)
        }
        if (analysis.peakYear && analysis.troughYear) {
            lines.push(`峰值年份: ${analysis.peakYear}，谷值年份: ${analysis.troughYear}`)
        }
        lines.push('')
    }

    return lines.join('\n')
}

// ---------- 格式化通用 ----------

function formatGeneral(result: StructuredResult): string {
    const g = result.general!
    const lines: string[] = []

    lines.push(`【查询】${result.queryDesc}`)
    lines.push('')

    if (g.cityDetail) {
        lines.push(`【${g.cityDetail.name}当前数据】`)
        lines.push(`游客量: ${g.cityDetail.visitors}万人次`)
        lines.push(`旅游收入: ${g.cityDetail.revenue}亿元`)
    } else {
        lines.push(`【${g.year}年广东省概况】`)
        lines.push(`总游客量: ${g.totalVisitors}万人次`)
        lines.push(`总收入: ${g.totalRevenue}亿元`)
        if (g.recoveryRate) lines.push(`较2019恢复率: ${g.recoveryRate}%`)
        if (g.yoyGrowth) lines.push(`同比增长: ${g.yoyGrowth}%`)
    }

    return lines.join('\n')
}