// src/ai/preprocessor.ts
// 数据预处理器：从 Store 取数 → 格式化成 AI 可读的文本

import type { YearSnapshot } from '@/data/cityStats'

export interface PreprocessResult {
    type: string
    dataText: string   // 格式化后的数据文本，直接塞进 Prompt
    context: string    // 给 AI 的上下文提示
}

/** 排名类：提取 TOP5 收入 + TOP5 游客量 */
export function preprocessRanking(
    cityStats: { name: string; visitors: number; revenue: number }[],
    question: string
): PreprocessResult {
    const byRevenue = [...cityStats].sort((a, b) => b.revenue - a.revenue)
    const byVisitors = [...cityStats].sort((a, b) => b.visitors - a.visitors)

    const top5Revenue = byRevenue.slice(0, 5).map((c, i) =>
        `${i + 1}. ${c.name}: ${c.revenue}亿元`
    ).join('\n')

    const top5Visitors = byVisitors.slice(0, 5).map((c, i) =>
        `${i + 1}. ${c.name}: ${c.visitors}万人次`
    ).join('\n')

    return {
        type: 'ranking',
        dataText: `【旅游收入排名TOP5】\n${top5Revenue}\n\n【游客量排名TOP5】\n${top5Visitors}`,
        context: '用户询问排名相关问题，请基于以上数据列出具体排名并简要分析。'
    }
}

/** 对比类：提取问题中提到的城市数据 */
export function preprocessComparison(
    cityStats: { name: string; visitors: number; revenue: number }[],
    question: string
): PreprocessResult {
    // 从问题中找提到的城市（去掉"市"字匹配更灵活）
    const mentioned = cityStats.filter(c =>
        question.includes(c.name) || question.includes(c.name.replace('市', ''))
    )

    if (mentioned.length >= 2) {
        const dataText = mentioned.map(c =>
            `${c.name}: 游客量${c.visitors}万人次，旅游收入${c.revenue}亿元`
        ).join('\n')

        return {
            type: 'comparison',
            dataText,
            context: `用户对比以下城市，请逐项对比关键指标并给出结论。`
        }
    }

    // 没提到明确城市，给默认 TOP5 对比
    const top5 = [...cityStats].sort((a, b) => b.visitors - a.visitors).slice(0, 5)
    return {
        type: 'comparison',
        dataText: '用户未指定对比城市，以下是游客量TOP5城市数据：\n' +
            top5.map(c => `${c.name}: 游客${c.visitors}万人次，收入${c.revenue}亿元`).join('\n'),
        context: '用户询问对比，但未指定明确城市，请基于TOP5数据回答。'
    }
}

/** 趋势类：提取指定城市的历年数据 */
export function preprocessTrend(
    cityStats: { name: string; code: string }[],
    getCityTrend: (name: string) => { year: number; visitors: number; revenue: number }[] | undefined,
    question: string
): PreprocessResult {
    // 找问题中的城市
    const city = cityStats.find(c =>
        question.includes(c.name) || question.includes(c.name.replace('市', ''))
    )

    if (city) {
        const trend = getCityTrend(city.name)
        if (trend && trend.length > 0) {
            const dataText = trend
                .sort((a, b) => a.year - b.year)
                .map(t => `${t.year}年: 游客${t.visitors}万人次，收入${t.revenue}亿元`)
                .join('\n')

            // 计算恢复率（2024 vs 2019）
            const data2019 = trend.find(t => t.year === 2019)
            const data2024 = trend.find(t => t.year === 2024)
            let recovery = ''
            if (data2019 && data2024) {
                const rate = ((data2024.visitors / data2019.visitors - 1) * 100).toFixed(1)
                recovery = `\n恢复率(2024 vs 2019): ${rate}%`
            }

            return {
                type: 'trend',
                dataText: `【${city.name}历年数据】\n${dataText}${recovery}`,
                context: `用户询问${city.name}历年趋势，请分析增长/下降/恢复情况，提及关键年份（2019高峰、2020低谷、2024新高）。`
            }
        }
    }

    // 没指定城市，给全省概况
    return {
        type: 'trend',
        dataText: '用户未指定具体城市。',
        context: '用户询问趋势，请基于全省整体V型恢复趋势回答（2019高峰→2020低谷→2024新高）。'
    }
}

/** 通用类：全省概况，或提取问题中提到的具体城市 */
export function preprocessGeneral(
    cityStats: { name: string; visitors: number; revenue: number }[],
    snapshot: YearSnapshot | undefined,
    recoveryRate: string | null,
    yoyGrowth: string | null,
    question: string
): PreprocessResult {
    // 先检查是否提到具体城市
    const city = cityStats.find(c =>
        question.includes(c.name) || question.includes(c.name.replace('市', ''))
    )

    if (city) {
        return {
            type: 'general',
            dataText: `【${city.name}当前数据】\n游客量: ${city.visitors}万人次\n旅游收入: ${city.revenue}亿元`,
            context: `用户询问${city.name}的具体数据，请基于该城市数据给出概括性回答。`
        }
    }

    // 全省概况
    const totalVisitors = cityStats.reduce((s, c) => s + c.visitors, 0)
    const totalRevenue = cityStats.reduce((s, c) => s + c.revenue, 0)
    const year = snapshot?.year || new Date().getFullYear()

    return {
        type: 'general',
        dataText: `【${year}年广东省概况】\n总游客量: ${totalVisitors}万人次\n总收入: ${totalRevenue}亿元\n较2019恢复率: ${recoveryRate || '未知'}%\n同比增长: ${yoyGrowth || '未知'}%`,
        context: '用户询问通用问题，请基于全省概况给出概括性回答，突出关键数据和亮点。'
    }
}