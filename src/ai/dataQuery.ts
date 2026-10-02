// src/ai/dataQuery.ts
// 数据查询 / 计算引擎
// 接收 StructuredQuery，从 Store 取数并计算，输出结构化结果

import type { StructuredQuery, QuestionType } from './questionClassifier'
import type { YearSnapshot, CityEntity } from '@/data/cityStats'

// ============================================
// 结构化结果定义
// ============================================

/** 单条排名项 */
export interface RankItem {
    name: string
    visitors: number
    revenue: number
    rank: number
}

/** 单条对比项 */
export interface CompareItem {
    name: string
    visitors: number
    revenue: number
}

/** 单年趋势数据 */
export interface TrendPoint {
    year: number
    visitors: number
    revenue: number
}

/** 趋势分析计算结果 */
export interface TrendAnalysis {
    cityName: string
    points: TrendPoint[]
    growthRate: number | null      // 首尾年增长率
    recoveryRate: number | null    // 2024 vs 2019
    peakYear: number | null
    troughYear: number | null
}

/** 通用查询结果 */
export interface GeneralResult {
    year: number
    totalVisitors: number
    totalRevenue: number
    recoveryRate: string | null
    yoyGrowth: string | null
    cityDetail?: {
        name: string
        visitors: number
        revenue: number
    }
}

/** 数据查询结构化结果 */
export interface StructuredResult {
    intent: QuestionType
    /** 人类可读的查询描述 */
    queryDesc: string
    /** 排名结果 */
    ranking?: {
        byVisitors: RankItem[]
        byRevenue: RankItem[]
        topN: number
    }
    /** 对比结果 */
    comparison?: {
        items: CompareItem[]
        metric: 'visitors' | 'revenue' | 'both'
    }
    /** 趋势结果 */
    trend?: {
        analyses: TrendAnalysis[]
        metric: 'visitors' | 'revenue' | 'both'
    }
    /** 通用结果 */
    general?: GeneralResult
    /** 给 AI 的上下文提示 */
    context: string
}

// ============================================
// 查询执行器
// ============================================

export interface QueryContext {
    cityStats: { name: string; visitors: number; revenue: number }[]
    snapshot: YearSnapshot | undefined
    recoveryRate: string | null
    yoyGrowth: string | null
    getCityTrend: (name: string) => { year: number; visitors: number; revenue: number }[]
    allCities: CityEntity[]
}

/** 执行结构化查询 */
export function executeQuery(query: StructuredQuery, ctx: QueryContext): StructuredResult {
    switch (query.intent) {
        case 'ranking':
            return queryRanking(query, ctx)
        case 'comparison':
            return queryComparison(query, ctx)
        case 'trend':
            return queryTrend(query, ctx)
        case 'general':
        default:
            return queryGeneral(query, ctx)
    }
}

// ---------- 排名查询 ----------

function queryRanking(query: StructuredQuery, ctx: QueryContext): StructuredResult {
    const { cityStats } = ctx
    const n = query.topN

    const byRevenue = [...cityStats]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, n)
        .map((c, i) => ({ name: c.name, visitors: c.visitors, revenue: c.revenue, rank: i + 1 }))

    const byVisitors = [...cityStats]
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, n)
        .map((c, i) => ({ name: c.name, visitors: c.visitors, revenue: c.revenue, rank: i + 1 }))

    const metricDesc = query.metric === 'visitors' ? '游客量' : query.metric === 'revenue' ? '旅游收入' : '综合'

    return {
        intent: 'ranking',
        queryDesc: `广东省各城市旅游${metricDesc}排名前${n}`,
        ranking: {
            byVisitors,
            byRevenue,
            topN: n,
        },
        context: `用户询问排名相关问题，请基于以上数据列出具体排名并简要分析。`,
    }
}

// ---------- 对比查询 ----------

function queryComparison(query: StructuredQuery, ctx: QueryContext): StructuredResult {
    const { cityStats } = ctx

    // 从问题中提取提到的城市，或默认取 TOP2
    let items: CompareItem[] = []

    if (query.cities.length >= 2) {
        items = query.cities
            .map(name => cityStats.find(c => c.name === name))
            .filter(Boolean)
            .map(c => ({ name: c!.name, visitors: c!.visitors, revenue: c!.revenue }))
    } else {
        // 默认取游客量 TOP2
        const top2 = [...cityStats].sort((a, b) => b.visitors - a.visitors).slice(0, 2)
        items = top2.map(c => ({ name: c.name, visitors: c.visitors, revenue: c.revenue }))
    }

    const metricDesc = query.metric === 'visitors' ? '游客量' : query.metric === 'revenue' ? '旅游收入' : '综合指标'

    return {
        intent: 'comparison',
        queryDesc: `${items.map(i => i.name).join(' vs ')} 的${metricDesc}对比`,
        comparison: {
            items,
            metric: query.metric,
        },
        context: `用户对比以下城市，请逐项对比关键指标并给出结论。`,
    }
}

// ---------- 趋势查询 ----------

function queryTrend(query: StructuredQuery, ctx: QueryContext): StructuredResult {
    const { getCityTrend, allCities } = ctx

    const targetCities = query.cities.length > 0
        ? query.cities
        : allCities.map(c => c.name)

    const analyses: TrendAnalysis[] = []

    for (const cityName of targetCities) {
        const raw = getCityTrend(cityName)
        if (!raw || raw.length === 0) continue

        const points = raw
            .sort((a, b) => a.year - b.year)
            .map(t => ({ year: t.year, visitors: t.visitors, revenue: t.revenue }))

        // 计算增长率
        const first = points[0]
        const last = points[points.length - 1]
        const growthRate = first.visitors > 0
            ? +(((last.visitors - first.visitors) / first.visitors) * 100).toFixed(1)
            : null

        // 计算恢复率 2024 vs 2019
        const p2019 = points.find(p => p.year === 2019)
        const p2024 = points.find(p => p.year === 2024)
        const recoveryRate = p2019 && p2024 && p2019.visitors > 0
            ? +(((p2024.visitors / p2019.visitors - 1) * 100).toFixed(1))
            : null

        // 找峰值和谷值年份
        const sortedByVisitors = [...points].sort((a, b) => b.visitors - a.visitors)
        const peakYear = sortedByVisitors[0]?.year ?? null
        const troughYear = sortedByVisitors[sortedByVisitors.length - 1]?.year ?? null

        analyses.push({
            cityName,
            points,
            growthRate,
            recoveryRate,
            peakYear,
            troughYear,
        })
    }

    const metricDesc = query.metric === 'visitors' ? '游客量' : query.metric === 'revenue' ? '旅游收入' : '综合'

    return {
        intent: 'trend',
        queryDesc: `${targetCities.join('、')} 的${metricDesc}历年趋势`,
        trend: {
            analyses,
            metric: query.metric,
        },
        context: `用户询问历年趋势，请分析增长/下降/恢复情况，提及关键年份（2019高峰、2020低谷、2024新高）。`,
    }
}

// ---------- 通用查询 ----------

function queryGeneral(query: StructuredQuery, ctx: QueryContext): StructuredResult {
    const { cityStats, snapshot, recoveryRate, yoyGrowth } = ctx

    // 先检查是否提到具体城市
    if (query.cities.length > 0) {
        const cityName = query.cities[0]
        const city = cityStats.find(c => c.name === cityName)
        if (city) {
            return {
                intent: 'general',
                queryDesc: `${cityName}的当前旅游数据`,
                general: {
                    year: snapshot?.year || new Date().getFullYear(),
                    totalVisitors: city.visitors,
                    totalRevenue: city.revenue,
                    recoveryRate: null,
                    yoyGrowth: null,
                    cityDetail: {
                        name: city.name,
                        visitors: city.visitors,
                        revenue: city.revenue,
                    },
                },
                context: `用户询问${cityName}的具体数据，请基于该城市数据给出概括性回答。`,
            }
        }
    }

    // 全省概况
    const totalVisitors = cityStats.reduce((s, c) => s + c.visitors, 0)
    const totalRevenue = cityStats.reduce((s, c) => s + c.revenue, 0)
    const year = snapshot?.year || new Date().getFullYear()

    return {
        intent: 'general',
        queryDesc: `${year}年广东省旅游概况`,
        general: {
            year,
            totalVisitors,
            totalRevenue,
            recoveryRate,
            yoyGrowth,
        },
        context: '用户询问通用问题，请基于全省概况给出概括性回答，突出关键数据和亮点。',
    }
}