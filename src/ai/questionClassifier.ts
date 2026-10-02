// src/ai/questionClassifier.ts
// 意图识别层：本地关键词匹配，0 token 消耗
// 输出结构化 Query，供下游数据查询引擎使用

export type QuestionType = 'ranking' | 'comparison' | 'trend' | 'general'

/** 结构化查询对象：意图 + 提取的参数 */
export interface StructuredQuery {
    intent: QuestionType
    /** 问题中提到的城市名列表 */
    cities: string[]
    /** 问题中提到的指标：visitors | revenue | both */
    metric: 'visitors' | 'revenue' | 'both'
    /** 排名类：前几名 */
    topN: number
    /** 趋势类：起始年份 */
    startYear: number | null
    /** 趋势类：结束年份 */
    endYear: number | null
    /** 原始问题文本 */
    rawText: string
}

const ALL_CITIES = [
    '广州市', '深圳市', '佛山市', '东莞市', '珠海市',
    '惠州市', '韶关市', '清远市', '肇庆市', '潮州市',
]

/**
 * 从问题中提取提到的城市
 */
function extractCities(text: string): string[] {
    const found: string[] = []
    for (const city of ALL_CITIES) {
        const short = city.replace('市', '')
        if (text.includes(city) || text.includes(short)) {
            found.push(city)
        }
    }
    return [...new Set(found)]
}

/**
 * 提取指标偏好：游客量 / 收入 / 两者
 */
function extractMetric(text: string): 'visitors' | 'revenue' | 'both' {
    const t = text.toLowerCase()
    const hasVisitors = /游客|人次|客流|人数|接待/.test(t)
    const hasRevenue = /收入|营收|gdp|产值|消费/.test(t)

    if (hasVisitors && !hasRevenue) return 'visitors'
    if (hasRevenue && !hasVisitors) return 'revenue'
    return 'both'
}

/**
 * 提取排名数量：前几/top几
 */
function extractTopN(text: string): number {
    const match = text.match(/前(\d+)|top\s*(\d+)/i)
    return match ? parseInt(match[1] || match[2]) : 5
}

/**
 * 提取年份范围
 */
function extractYearRange(text: string): { start: number | null; end: number | null } {
    const years = text.match(/\d{4}/g)?.map(Number) ?? []
    if (years.length >= 2) {
        return { start: Math.min(...years), end: Math.max(...years) }
    }
    if (years.length === 1) {
        return { start: years[0], end: years[0] }
    }
    return { start: null, end: null }
}

/**
 * 意图识别：返回结构化 Query
 * 为什么不用 AI 分类？因为正则更快（<1ms）、免费、不依赖网络
 */
export function classifyQuestion(text: string): StructuredQuery {
    const t = text.toLowerCase()
    const cities = extractCities(text)
    const metric = extractMetric(text)
    const topN = extractTopN(text)
    const { start, end } = extractYearRange(text)

    // 趋势类：历年、增长、下降、恢复、走势、年份范围
    if (/趋势|变化|历年|增长|下降|恢复|走势|近几年|多少年/.test(t) || (start && end && start !== end)) {
        return {
            intent: 'trend',
            cities,
            metric,
            topN,
            startYear: start,
            endYear: end,
            rawText: text,
        }
    }

    // 排名类：排名、前几、top、最多、最少、榜单、排行、前列、前N名
    if (/排名|排行|榜单|前列|前几|前\d+|top|最多|最少|第几|榜首/.test(t)) {
        return {
            intent: 'ranking',
            cities,
            metric,
            topN,
            startYear: null,
            endYear: null,
            rawText: text,
        }
    }

    // 对比类：对比、比较、vs、哪个多/少/高/低、差异
    if (/对比|比较|vs|和.*相比|哪个.*多|哪个.*少|哪个.*高|哪个.*低|差异|差距/.test(t)) {
        return {
            intent: 'comparison',
            cities,
            metric,
            topN,
            startYear: null,
            endYear: null,
            rawText: text,
        }
    }

    // 默认通用
    return {
        intent: 'general',
        cities,
        metric,
        topN,
        startYear: null,
        endYear: null,
        rawText: text,
    }
}