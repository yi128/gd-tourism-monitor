// src/stores/tourism.ts
export const TEST_TOURISM = 'tourism-file-loaded'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cities, yearSnapshots } from '@/data/cityStats'
import type { CityEntity, YearSnapshot } from '@/data/cityStats'

export const useTourismStore = defineStore('tourism', () => {
    // ========== State ==========
    const selectedYear = ref<number>(2024)

    // ========== Getters ==========

    /** 当前年份的快照数据（给数据面板用） */
    const currentSnapshot = computed<YearSnapshot | undefined>(() =>
        yearSnapshots.find(s => s.year === selectedYear.value)
    )

    /** 当前年份的城市统计（给地图标记 + 排名用） */
    const currentCityStats = computed(() =>
        cities.map(city => {
            const stat = city.stats.find(s => s.year === selectedYear.value)
            return {
                name: city.name,
                code: city.code,
                center: city.center,
                visitors: stat?.visitors ?? 0,
                revenue: stat?.revenue ?? 0,
            }
        })
    )

    /** 地图标记数据：坐标 + 游客量（给 ECharts 用） */
    const mapMarkers = computed(() =>
        currentCityStats.value
            .filter(c => c.visitors > 0)
            .sort((a, b) => b.visitors - a.visitors)
            .slice(0, 5)
            .map(c => ({
                name: c.name,
                value: c.visitors,
                coord: c.center,
            }))
    )

    /** 全省汇总（给底部 KPI 用） */
    const provinceTotal = computed(() => {
        const snapshot = currentSnapshot.value
        return {
            revenue: snapshot?.kpis.find(k => k.title.includes('旅游业收入'))?.value ?? 0,
            visitors: snapshot?.kpis.find(k => k.title.includes('来访游客'))?.value ?? 0,
            expenditure: snapshot?.kpis.find(k => k.title.includes('出游支出'))?.value ?? 0,
        }
    })

    /** 收入排名 Top5（给右侧柱状图用） */
    const revenueRanking = computed(() =>
        [...currentCityStats.value]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map(c => ({
                city: c.name.replace('市', ''),
                revenue: c.revenue,
            }))
    )

    /** 游客量排名 Top5（给右侧用，也是地图标记的来源） */
    const visitorRanking = computed(() =>
        [...currentCityStats.value]
            .sort((a, b) => b.visitors - a.visitors)
            .slice(0, 5)
    )

    // ========== AI 预处理相关 ==========

    /** 恢复率：当前年份 vs 2019 */
    const recoveryRate = computed(() => {
        const current = currentCityStats.value.reduce((s, c) => s + c.visitors, 0)
        const baseYear = 2019
        const baseStats = cities.map(c => c.stats.find(s => s.year === baseYear))
        const base = baseStats.reduce((s, stat) => s + (stat?.visitors ?? 0), 0)
        if (base === 0) return null
        return ((current / base - 1) * 100).toFixed(1)
    })

    /** 同比增长：当前年份 vs 上一年 */
    const yoyGrowth = computed(() => {
        const prevYear = selectedYear.value - 1
        const current = currentCityStats.value.reduce((s, c) => s + c.visitors, 0)
        const prevStats = cities.map(c => c.stats.find(s => s.year === prevYear))
        const prev = prevStats.reduce((s, stat) => s + (stat?.visitors ?? 0), 0)
        if (prev === 0) return null
        return ((current / prev - 1) * 100).toFixed(1)
    })

    /** 城市增长率排名 */
    const cityGrowthRanking = computed(() => {
        const prevYear = selectedYear.value - 1
        return cities
            .map(city => {
                const curr = city.stats.find(s => s.year === selectedYear.value)?.visitors ?? 0
                const prev = city.stats.find(s => s.year === prevYear)?.visitors ?? 0
                return {
                    name: city.name,
                    growth: prev === 0 ? 0 : ((curr - prev) / prev * 100),
                }
            })
            .sort((a, b) => b.growth - a.growth)
    })

    // ========== 面板数据 Getters ==========

    /** 季度接待游客对比 */
    const quarterlyReception = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        return {
            quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
            series: snap.quarterlyReception.map(q => ({
                year: q.year,
                data: q.quarters,
            })),
        }
    })

    /** 游客年龄分布 */
    const ageDistribution = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        return {
            categories: snap.ageDistribution.map(a => a.category),
            values: snap.ageDistribution.map(a => a.count),
        }
    })

    /** 游客来源地 TOP5 */
    const visitorSourceTop5 = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        const sources = [...snap.visitorSources]
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5)
        return {
            regions: sources.map(s => s.province),
            percentages: sources.map(s => s.percentage),
        }
    })

    /** 景点人流排名 */
    const scenicSpotRanking = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return []
        return snap.attractions.map(a => ({
            label: a.name,
            value: a.visitors,
        }))
    })

    /** 各市旅游收入排名 */
    const cityRevenueRank = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        const sorted = [...snap.cityRevenues].sort((a, b) => b.revenue - a.revenue)
        return {
            cities: sorted.map(c => c.city),
            revenues: sorted.map(c => c.revenue),
            unit: sorted[0]?.unit || '亿',
        }
    })

    /** 各行业收入 */
    const industryRevenue = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        return {
            industries: snap.industries.map(i => i.name),
            values: snap.industries.map(i => i.value),
            unit: snap.industries[0]?.unit || '亿',
        }
    })

    /** 接待游客人数 TOP5 */
    const top5Tourists = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        const sorted = [...snap.topCitiesByVisitors].sort((a, b) => b.count - a.count)
        return {
            cities: sorted.map(c => c.city),
            visitorCounts: sorted.map(c => c.count),
            unit: sorted[0]?.unit || '万人次',
        }
    })

    /** 旅游消费构成 TOP5 */
    const tourismSpendTop5 = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return undefined
        const sorted = [...snap.consumption].sort((a, b) => b.percentage - a.percentage).slice(0, 5)
        return {
            categories: sorted.map(c => c.category),
            percentages: sorted.map(c => c.percentage),
        }
    })

    /** 实时热词 */
    const realTimeHotWords = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return []
        return snap.hotWords.map((w, i) => ({
            name: w.name,
            value: w.value,
            position: i + 1,
        }))
    })

    /** 底部 KPI 卡片数据 */
    const footerStats = computed(() => {
        const snap = currentSnapshot.value
        if (!snap) return []
        return snap.kpis.map(k => ({
            id: k.title,
            title: k.title.replace(/^\d+年/, ''),
            value: k.value,
            unit: k.unit,
            compare: k.compare,
            proportion: k.proportion,
        }))
    })

    // ========== Actions ==========

    function setYear(year: number) {
        selectedYear.value = year
    }

    /** 根据城市名获取该城市历年趋势（用于地图下钻） */
    function getCityTrend(cityName: string) {
        const city = cities.find(c => c.name === cityName || c.code === cityName)
        return city?.stats ?? []
    }

    return {
        // state
        selectedYear,
        // getters (核心数据)
        currentSnapshot,
        currentCityStats,
        mapMarkers,
        provinceTotal,
        revenueRanking,
        visitorRanking,
        recoveryRate,
        yoyGrowth,
        cityGrowthRanking,
        // getters (面板数据 - 响应式派生)
        quarterlyReception,
        ageDistribution,
        visitorSourceTop5,
        scenicSpotRanking,
        cityRevenueRank,
        industryRevenue,
        top5Tourists,
        tourismSpendTop5,
        realTimeHotWords,
        footerStats,
        // actions
        setYear,
        getCityTrend,
    }
})