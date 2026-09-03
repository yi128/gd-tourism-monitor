// src/ai/questionClassifier.ts
// 问题分类器：本地关键词匹配，0 token 消耗

export type QuestionType = 'ranking' | 'comparison' | 'trend' | 'general'

/**
 * 根据关键词判断用户想问什么类型的问题
 * 为什么不用 AI 分类？因为正则更快（<1ms）、免费、不依赖网络
 */
export function classifyQuestion(text: string): QuestionType {
    const t = text.toLowerCase()

    // 趋势类：历年、增长、下降、恢复、走势、年份范围
    if (/趋势|变化|历年|增长|下降|恢复|走势|近几年|多少年|\d{4}.*\d{4}/.test(t)) {
        return 'trend'
    }

    // 排名类：排名、前几、top、最多、最少
    if (/排名|前几|top|最多|最少|第几|榜首/.test(t)) {
        return 'ranking'
    }

    // 对比类：对比、比较、vs、哪个多、差异
    if (/对比|比较|vs|和.*相比|哪个.*多|哪个.*少|差异|差距/.test(t)) {
        return 'comparison'
    }

    // 默认通用：问"广州游客量多少"也归这里，预处理器会提取具体城市
    return 'general'
}