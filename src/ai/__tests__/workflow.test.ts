/**
 * AI 数据助手新链路测试
 * 覆盖：意图识别 → 结构化 Query → 数据查询 → 结构化结果 → Prompt
 *
 * 运行方式：npx tsx --tsconfig tsconfig.app.json src/ai/__tests__/workflow.test.ts
 * 或：node --loader ts-node/esm src/ai/__tests__/workflow.test.ts
 */

import { classifyQuestion, type StructuredQuery } from '../questionClassifier'
import { executeQuery, type QueryContext, type StructuredResult } from '../dataQuery'
import { buildPrompt } from '../prompt'

// 直接内联 cityStats 数据，避免 @/ 路径解析问题
interface CityEntity {
    name: string
    code: string
    center: [number, number]
    stats: { year: number; visitors: number; revenue: number }[]
}

const cities: CityEntity[] = [
    {
        name: '广州市', code: 'guangzhou', center: [113.26, 23.13],
        stats: [
            { year: 2024, visitors: 335, revenue: 3100 },
            { year: 2023, visitors: 287, revenue: 2500 },
            { year: 2022, visitors: 195, revenue: 1800 },
            { year: 2021, visitors: 175, revenue: 1650 },
            { year: 2020, visitors: 130, revenue: 1200 },
            { year: 2019, visitors: 320, revenue: 3000 },
        ]
    },
    {
        name: '深圳市', code: 'shenzhen', center: [114.06, 22.54],
        stats: [
            { year: 2024, visitors: 300, revenue: 2600 },
            { year: 2023, visitors: 256, revenue: 2000 },
            { year: 2022, visitors: 180, revenue: 1500 },
            { year: 2021, visitors: 160, revenue: 1450 },
            { year: 2020, visitors: 115, revenue: 1000 },
            { year: 2019, visitors: 290, revenue: 2600 },
        ]
    },
    {
        name: '佛山市', code: 'foshan', center: [113.12, 23.02],
        stats: [
            { year: 2024, visitors: 200, revenue: 1850 },
            { year: 2023, visitors: 168, revenue: 1500 },
            { year: 2022, visitors: 120, revenue: 1100 },
            { year: 2021, visitors: 105, revenue: 1000 },
            { year: 2020, visitors: 75, revenue: 700 },
            { year: 2019, visitors: 190, revenue: 1800 },
        ]
    },
    {
        name: '东莞市', code: 'dongguan', center: [113.75, 23.05],
        stats: [
            { year: 2024, visitors: 220, revenue: 1250 },
            { year: 2023, visitors: 185, revenue: 1000 },
            { year: 2022, visitors: 130, revenue: 750 },
            { year: 2021, visitors: 115, revenue: 650 },
            { year: 2020, visitors: 85, revenue: 450 },
            { year: 2019, visitors: 210, revenue: 1200 },
        ]
    },
    {
        name: '珠海市', code: 'zhuhai', center: [113.57, 22.27],
        stats: [
            { year: 2024, visitors: 120, revenue: 650 },
            { year: 2023, visitors: 98, revenue: 500 },
            { year: 2022, visitors: 70, revenue: 380 },
            { year: 2021, visitors: 60, revenue: 350 },
            { year: 2020, visitors: 45, revenue: 240 },
            { year: 2019, visitors: 115, revenue: 620 },
        ]
    },
    {
        name: '惠州市', code: 'huizhou', center: [114.42, 23.11],
        stats: [
            { year: 2024, visitors: 175, revenue: 980 },
            { year: 2023, visitors: 142, revenue: 800 },
            { year: 2022, visitors: 95, revenue: 580 },
            { year: 2021, visitors: 85, revenue: 520 },
            { year: 2020, visitors: 65, revenue: 380 },
            { year: 2019, visitors: 170, revenue: 980 },
        ]
    },
    {
        name: '韶关市', code: 'shaoguan', center: [113.59, 24.81],
        stats: [
            { year: 2024, visitors: 55, revenue: 260 },
            { year: 2023, visitors: 45, revenue: 200 },
            { year: 2022, visitors: 30, revenue: 140 },
            { year: 2021, visitors: 28, revenue: 150 },
            { year: 2020, visitors: 22, revenue: 100 },
            { year: 2019, visitors: 55, revenue: 260 },
        ]
    },
    {
        name: '清远市', code: 'qingyuan', center: [113.03, 23.68],
        stats: [
            { year: 2024, visitors: 65, revenue: 240 },
            { year: 2023, visitors: 52, revenue: 180 },
            { year: 2022, visitors: 35, revenue: 130 },
            { year: 2021, visitors: 32, revenue: 130 },
            { year: 2020, visitors: 25, revenue: 90 },
            { year: 2019, visitors: 65, revenue: 240 },
        ]
    },
    {
        name: '肇庆市', code: 'zhaoqing', center: [112.46, 23.05],
        stats: [
            { year: 2024, visitors: 48, revenue: 200 },
            { year: 2023, visitors: 38, revenue: 150 },
            { year: 2022, visitors: 25, revenue: 100 },
            { year: 2021, visitors: 23, revenue: 110 },
            { year: 2020, visitors: 18, revenue: 70 },
            { year: 2019, visitors: 48, revenue: 200 },
        ]
    },
    {
        name: '潮州市', code: 'chaozhou', center: [116.63, 23.66],
        stats: [
            { year: 2024, visitors: 45, revenue: 160 },
            { year: 2023, visitors: 35, revenue: 120 },
            { year: 2022, visitors: 22, revenue: 80 },
            { year: 2021, visitors: 20, revenue: 90 },
            { year: 2020, visitors: 16, revenue: 55 },
            { year: 2019, visitors: 42, revenue: 150 },
        ]
    }
]

// ============================================
// 测试工具
// ============================================

const PASS = '\x1b[32m✓ PASS\x1b[0m'
const FAIL = '\x1b[31m✗ FAIL\x1b[0m'

let total = 0
let passed = 0

function test(name: string, fn: () => void) {
    total++
    try {
        fn()
        passed++
        console.log(`${PASS} ${name}`)
    } catch (err: any) {
        console.log(`${FAIL} ${name}`)
        console.log(`  ${err.message}`)
    }
}

function assertEqual(actual: any, expected: any, msg?: string) {
    if (actual !== expected) {
        throw new Error(msg || `Expected ${expected}, got ${actual}`)
    }
}

function assertTrue(val: boolean, msg?: string) {
    if (!val) throw new Error(msg || 'Expected true')
}

function assertArrayLength(arr: any[], len: number, msg?: string) {
    if (arr.length !== len) {
        throw new Error(msg || `Expected array length ${len}, got ${arr.length}`)
    }
}

// ============================================
// 构造 Mock QueryContext
// ============================================

function createMockContext(): QueryContext {
    const cityStats = cities.map(c => {
        const latest = c.stats.find(s => s.year === 2024) || c.stats[0]
        return {
            name: c.name,
            visitors: latest.visitors,
            revenue: latest.revenue,
        }
    })

    const snapshot = {
        year: 2024,
        news: [],
        kpis: [
            { title: '旅游业收入', value: 12500, unit: '亿元', compare: 'up' as const, proportion: 12.5 },
            { title: '来访游客数', value: 7.2, unit: '亿人', compare: 'up' as const, proportion: 10.2 },
        ],
        ageDistribution: [],
        quarterlyReception: [],
        visitorSources: [],
        attractions: [],
        cityRevenues: [],
        industries: [],
        topCitiesByVisitors: [],
        consumption: [],
        hotWords: [],
    }

    return {
        cityStats,
        snapshot,
        recoveryRate: '105.2%',
        yoyGrowth: '12.3%',
        getCityTrend: (name: string) => {
            const city = cities.find(c => c.name === name)
            return city ? city.stats.map(s => ({ year: s.year, visitors: s.visitors, revenue: s.revenue })) : []
        },
        allCities: cities,
    }
}

const ctx = createMockContext()

// ============================================
// 一、意图识别层测试
// ============================================

console.log('\n========== 一、意图识别层测试 ==========\n')

// --- 排名类 ---
test('排名意图："广东旅游收入排名前3"', () => {
    const q = classifyQuestion('广东旅游收入排名前3')
    assertEqual(q.intent, 'ranking')
    assertEqual(q.metric, 'revenue')
    assertEqual(q.topN, 3)
})

test('排名意图："哪个城市游客最多"', () => {
    const q = classifyQuestion('哪个城市游客最多')
    assertEqual(q.intent, 'ranking')
    assertEqual(q.metric, 'visitors')
})

test('排名意图："top5城市"', () => {
    const q = classifyQuestion('top5城市')
    assertEqual(q.intent, 'ranking')
    assertEqual(q.topN, 5)
})

test('排名意图："榜单"', () => {
    const q = classifyQuestion('给我看看榜单')
    assertEqual(q.intent, 'ranking')
})

// --- 对比类 ---
test('对比意图："广州和深圳哪个收入高"', () => {
    const q = classifyQuestion('广州和深圳哪个收入高')
    assertEqual(q.intent, 'comparison')
    assertArrayLength(q.cities, 2)
    assertTrue(q.cities.includes('广州市'))
    assertTrue(q.cities.includes('深圳市'))
})

test('对比意图："佛山vs东莞游客量"', () => {
    const q = classifyQuestion('佛山vs东莞游客量')
    assertEqual(q.intent, 'comparison')
    assertEqual(q.metric, 'visitors')
})

test('对比意图："比较珠海和惠州"', () => {
    const q = classifyQuestion('比较珠海和惠州')
    assertEqual(q.intent, 'comparison')
})

// --- 趋势类 ---
test('趋势意图："广州历年游客变化"', () => {
    const q = classifyQuestion('广州历年游客变化')
    assertEqual(q.intent, 'trend')
    assertArrayLength(q.cities, 1)
    assertEqual(q.cities[0], '广州市')
    assertEqual(q.metric, 'visitors')
})

test('趋势意图："深圳2020到2024年收入走势"', () => {
    const q = classifyQuestion('深圳2020到2024年收入走势')
    assertEqual(q.intent, 'trend')
    assertEqual(q.startYear, 2020)
    assertEqual(q.endYear, 2024)
    assertEqual(q.metric, 'revenue')
})

test('趋势意图："近几年广东旅游趋势"', () => {
    const q = classifyQuestion('近几年广东旅游趋势')
    assertEqual(q.intent, 'trend')
    assertArrayLength(q.cities, 0) // 未指定城市
})

// --- 通用类 ---
test('通用意图："广东今年旅游数据怎么样"', () => {
    const q = classifyQuestion('广东今年旅游数据怎么样')
    assertEqual(q.intent, 'general')
})

test('通用意图："广州的情况"', () => {
    const q = classifyQuestion('广州的情况')
    assertEqual(q.intent, 'general')
    assertArrayLength(q.cities, 1)
})

// --- 边界情况 ---
test('空字符串应返回通用意图', () => {
    const q = classifyQuestion('')
    assertEqual(q.intent, 'general')
})

test('未识别城市时 cities 为空', () => {
    const q = classifyQuestion('排名前10')
    assertArrayLength(q.cities, 0)
    assertEqual(q.topN, 10)
})

test('同时提及游客和收入时 metric 为 both', () => {
    const q = classifyQuestion('广州游客量和收入排名')
    assertEqual(q.metric, 'both')
})

// ============================================
// 二、数据查询引擎测试
// ============================================

console.log('\n========== 二、数据查询引擎测试 ==========\n')

// --- 排名查询 ---
test('排名查询：返回正确数量的结果', () => {
    const query: StructuredQuery = {
        intent: 'ranking', cities: [], metric: 'both', topN: 3,
        startYear: null, endYear: null, rawText: '前3名',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.intent, 'ranking')
    assertArrayLength(result.ranking!.byRevenue, 3)
    assertArrayLength(result.ranking!.byVisitors, 3)
    assertEqual(result.ranking!.topN, 3)
})

test('排名查询：收入第1名是广州', () => {
    const query: StructuredQuery = {
        intent: 'ranking', cities: [], metric: 'revenue', topN: 5,
        startYear: null, endYear: null, rawText: '收入排名',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.ranking!.byRevenue[0].name, '广州市')
})

test('排名查询：游客量第1名是广州', () => {
    const query: StructuredQuery = {
        intent: 'ranking', cities: [], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '游客排名',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.ranking!.byVisitors[0].name, '广州市')
})

// --- 对比查询 ---
test('对比查询：指定两个城市', () => {
    const query: StructuredQuery = {
        intent: 'comparison', cities: ['广州市', '深圳市'], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '广州和深圳对比',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.intent, 'comparison')
    assertArrayLength(result.comparison!.items, 2)
    assertTrue(result.comparison!.items.some(i => i.name === '广州市'))
    assertTrue(result.comparison!.items.some(i => i.name === '深圳市'))
})

test('对比查询：未指定城市时默认取TOP2', () => {
    const query: StructuredQuery = {
        intent: 'comparison', cities: [], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '对比',
    }
    const result = executeQuery(query, ctx)
    assertArrayLength(result.comparison!.items, 2)
    // 游客量 TOP2 应该是广州、深圳
    assertEqual(result.comparison!.items[0].name, '广州市')
    assertEqual(result.comparison!.items[1].name, '深圳市')
})

// --- 趋势查询 ---
test('趋势查询：指定城市', () => {
    const query: StructuredQuery = {
        intent: 'trend', cities: ['广州市'], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '广州趋势',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.intent, 'trend')
    assertArrayLength(result.trend!.analyses, 1)
    assertEqual(result.trend!.analyses[0].cityName, '广州市')
    // 应该有6年数据
    assertEqual(result.trend!.analyses[0].points.length, 6)
})

test('趋势查询：未指定城市时取全部', () => {
    const query: StructuredQuery = {
        intent: 'trend', cities: [], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '全部趋势',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.trend!.analyses.length, cities.length)
})

test('趋势查询：增长率计算正确', () => {
    const query: StructuredQuery = {
        intent: 'trend', cities: ['广州市'], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '广州趋势',
    }
    const result = executeQuery(query, ctx)
    const analysis = result.trend!.analyses[0]
    // 广州 2019: 320, 2024: 335 → 增长率约 4.7%
    assertTrue(analysis.growthRate !== null)
    assertTrue(analysis.growthRate! > 0)
})

test('趋势查询：恢复率计算正确', () => {
    const query: StructuredQuery = {
        intent: 'trend', cities: ['广州市'], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '广州恢复情况',
    }
    const result = executeQuery(query, ctx)
    const analysis = result.trend!.analyses[0]
    // 广州 2024 vs 2019: 335/320 - 1 ≈ 4.7%
    assertTrue(analysis.recoveryRate !== null)
    assertTrue(analysis.recoveryRate! > 0)
})

test('趋势查询：峰值和谷值年份正确', () => {
    const query: StructuredQuery = {
        intent: 'trend', cities: ['广州市'], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '广州趋势',
    }
    const result = executeQuery(query, ctx)
    const analysis = result.trend!.analyses[0]
    assertEqual(analysis.peakYear, 2024)
    assertEqual(analysis.troughYear, 2020)
})

// --- 通用查询 ---
test('通用查询：询问具体城市', () => {
    const query: StructuredQuery = {
        intent: 'general', cities: ['广州市'], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '广州数据',
    }
    const result = executeQuery(query, ctx)
    assertEqual(result.intent, 'general')
    assertTrue(result.general!.cityDetail !== undefined)
    assertEqual(result.general!.cityDetail!.name, '广州市')
})

test('通用查询：未指定城市返回全省概况', () => {
    const query: StructuredQuery = {
        intent: 'general', cities: [], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '广东数据',
    }
    const result = executeQuery(query, ctx)
    assertTrue(result.general!.cityDetail === undefined)
    assertEqual(result.general!.year, 2024)
    assertTrue(result.general!.totalVisitors > 0)
    assertTrue(result.general!.totalRevenue > 0)
})

// ============================================
// 三、Prompt 构建测试
// ============================================

console.log('\n========== 三、Prompt 构建测试 ==========\n')

test('Prompt 包含身份设定', () => {
    const query: StructuredQuery = {
        intent: 'ranking', cities: [], metric: 'both', topN: 3,
        startYear: null, endYear: null, rawText: '前3',
    }
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    assertTrue(prompt.includes('广东省旅游数据洞察平台'))
    assertTrue(prompt.includes('禁止编造'))
})

test('排名 Prompt 包含排名数据', () => {
    const query: StructuredQuery = {
        intent: 'ranking', cities: [], metric: 'both', topN: 3,
        startYear: null, endYear: null, rawText: '前3',
    }
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    assertTrue(prompt.includes('旅游收入排名 TOP3'))
    assertTrue(prompt.includes('游客量排名 TOP3'))
    assertTrue(prompt.includes('广州市'))
})

test('对比 Prompt 包含对比数据', () => {
    const query: StructuredQuery = {
        intent: 'comparison', cities: ['广州市', '深圳市'], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '广深对比',
    }
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    assertTrue(prompt.includes('广州市'))
    assertTrue(prompt.includes('深圳市'))
    assertTrue(prompt.includes('游客量'))
    assertTrue(prompt.includes('收入'))
})

test('趋势 Prompt 包含历年数据', () => {
    const query: StructuredQuery = {
        intent: 'trend', cities: ['广州市'], metric: 'visitors', topN: 5,
        startYear: null, endYear: null, rawText: '广州趋势',
    }
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    assertTrue(prompt.includes('2019年'))
    assertTrue(prompt.includes('2024年'))
    assertTrue(prompt.includes('整体增长率'))
    assertTrue(prompt.includes('恢复率'))
})

test('通用 Prompt 包含全省概况', () => {
    const query: StructuredQuery = {
        intent: 'general', cities: [], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '概况',
    }
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    assertTrue(prompt.includes('广东省概况'))
    assertTrue(prompt.includes('总游客量'))
    assertTrue(prompt.includes('总收入'))
})

test('通用 Prompt 包含城市详情', () => {
    const query: StructuredQuery = {
        intent: 'general', cities: ['广州市'], metric: 'both', topN: 5,
        startYear: null, endYear: null, rawText: '广州',
    }
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    assertTrue(prompt.includes('广州市当前数据'))
})

test('Prompt 包含对应意图的回答要求', () => {
    const intents: StructuredQuery['intent'][] = ['ranking', 'comparison', 'trend', 'general']
    for (const intent of intents) {
        const query: StructuredQuery = {
            intent, cities: [], metric: 'both', topN: 5,
            startYear: null, endYear: null, rawText: 'test',
        }
        const result = executeQuery(query, ctx)
        const prompt = buildPrompt(result)
        assertTrue(prompt.includes('【回答要求】'), `Intent ${intent} 缺少回答要求`)
    }
})

// ============================================
// 四、端到端链路测试
// ============================================

console.log('\n========== 四、端到端链路测试 ==========\n')

function runFullWorkflow(question: string): { query: StructuredQuery; result: StructuredResult; prompt: string } {
    const query = classifyQuestion(question)
    const result = executeQuery(query, ctx)
    const prompt = buildPrompt(result)
    return { query, result, prompt }
}

test('端到端：排名问题', () => {
    const { query, result, prompt } = runFullWorkflow('广东旅游收入前3名是哪些')
    assertEqual(query.intent, 'ranking')
    assertEqual(query.topN, 3)
    assertEqual(result.ranking!.byRevenue[0].name, '广州市')
    assertTrue(prompt.includes('TOP3'))
})

test('端到端：对比问题', () => {
    const { query, result, prompt } = runFullWorkflow('广州和深圳哪个游客多')
    assertEqual(query.intent, 'comparison')
    assertArrayLength(result.comparison!.items, 2)
    assertTrue(prompt.includes('广州市') && prompt.includes('深圳市'))
})

test('端到端：趋势问题', () => {
    const { query, result, prompt } = runFullWorkflow('珠海近几年旅游收入变化')
    assertEqual(query.intent, 'trend')
    assertEqual(result.trend!.analyses[0].cityName, '珠海市')
    assertTrue(prompt.includes('2019') && prompt.includes('2024'))
})

test('端到端：通用问题（全省）', () => {
    const { query, result, prompt } = runFullWorkflow('广东今年旅游怎么样')
    assertEqual(query.intent, 'general')
    assertTrue(result.general!.totalVisitors > 0)
    assertTrue(prompt.includes('广东省概况'))
})

test('端到端：通用问题（城市）', () => {
    const { query, result, prompt } = runFullWorkflow('东莞的数据')
    assertEqual(query.intent, 'general')
    assertEqual(result.general!.cityDetail!.name, '东莞市')
    assertTrue(prompt.includes('东莞市当前数据'))
})

test('端到端：复杂排名问题', () => {
    const { query, result } = runFullWorkflow('2024年广东省各城市旅游收入top10排名')
    assertEqual(query.intent, 'ranking')
    assertEqual(query.metric, 'revenue')
    assertEqual(query.topN, 10)
    assertEqual(result.ranking!.byRevenue.length, 10)
})

test('端到端：带年份趋势问题', () => {
    const { query, result } = runFullWorkflow('深圳2019到2024年游客量走势')
    assertEqual(query.intent, 'trend')
    assertEqual(query.cities[0], '深圳市')
    assertEqual(query.startYear, 2019)
    assertEqual(query.endYear, 2024)
    assertEqual(query.metric, 'visitors')
    assertEqual(result.trend!.analyses[0].points.length, 6)
})

// ============================================
// 测试总结
// ============================================

console.log('\n========== 测试总结 ==========\n')
console.log(`总计: ${total} 项`)
console.log(`通过: ${passed} 项`)
console.log(`失败: ${total - passed} 项`)

if (passed === total) {
    console.log('\n🎉 所有测试通过！')
} else {
    console.log(`\n⚠️ 有 ${total - passed} 项测试失败，请检查。`)
    process.exit(1)
}