// ============================================
// 实体定义（保持不变）
// ============================================

/** 城市实体 - 核心，给地图 + AI + 排名用 */
export interface CityEntity {
    name: string
    code: string
    center: [number, number]
    stats: {
        year: number
        visitors: number
        revenue: number
    }[]
}

/** 景点实体 */
export interface AttractionEntity {
    name: string
    city: string
    visitors: number
}

/** 年份快照 - 给各面板用 */
export interface YearSnapshot {
    year: number
    news: string[]
    kpis: {
        title: string
        value: number
        unit: string
        compare: 'up' | 'down'
        proportion: number
    }[]
    ageDistribution: { category: string; count: number }[]
    quarterlyReception: { year: number; quarters: number[] }[]
    visitorSources: { province: string; percentage: number }[]
    attractions: AttractionEntity[]
    cityRevenues: { city: string; revenue: number; unit: string }[]
    industries: { name: string; value: number; unit: string }[]
    topCitiesByVisitors: { city: string; count: number; unit: string }[]
    consumption: { category: string; percentage: number }[]
    hotWords: { name: string; value: number }[]
}

// ============================================
// 城市实体cities（10个城市，2019-2024六年数据）
// ============================================

export const cities: CityEntity[] = [
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
// 年份快照yearSnapshots（2019-2024，每年完整自洽）
// ============================================

export const yearSnapshots: YearSnapshot[] = [
    // ========== 2019：疫情前高峰 ==========
    {
        year: 2019,
        news: [
            '广深港高铁全线贯通，香港西九龙站正式启用',
            '港珠澳大桥通车一周年，珠海口岸客流持续攀升',
            '广州北京路步行街入选全国首批夜间文旅消费集聚区',
            '深圳华侨城旅游度假区年接待量突破3000万人次',
            '佛山岭南天地举办首届岭南文化节，非遗展演受热捧',
            '惠州巽寮湾滨海旅游区获评国家级旅游度假区',
            '韶关丹霞山列入世界地质公园，国际知名度大幅提升',
            '清远古龙峡玻璃大峡谷创吉尼斯世界纪录',
            '肇庆星湖景区推出"星湖夜游"项目，夜经济收入增长30%',
            '潮州牌坊街修缮完工，古城文旅焕发新活力'
        ],
        kpis: [
            { title: '2019年旅游业收入', value: 12500.0, unit: '亿元', compare: 'up', proportion: 12.5 },
            { title: '2019年来访游客数', value: 7.2, unit: '亿人', compare: 'up', proportion: 10.2 },
            { title: '2019年广东人口出游支出', value: 3.8, unit: '万亿元', compare: 'up', proportion: 15.6 }
        ],
        ageDistribution: [
            { category: '20以下', count: 2500 },
            { category: '20-30', count: 1600 },
            { category: '30-40', count: 900 },
            { category: '40-50', count: 450 },
            { category: '50以上', count: 150 }
        ],
        quarterlyReception: [
            { year: 2018, quarters: [16000, 14800, 19500, 13800] },
            { year: 2019, quarters: [18500, 17000, 23000, 16500] }
        ],
        visitorSources: [
            { province: '湖南', percentage: 20 },
            { province: '广西', percentage: 15 },
            { province: '江西', percentage: 13 },
            { province: '福建', percentage: 10 },
            { province: '湖北', percentage: 9 }
        ],
        attractions: [
            { name: '广州长隆旅游度假区', city: '广州市', visitors: 35.0 },
            { name: '深圳华侨城度假区', city: '深圳市', visitors: 28.0 },
            { name: '广州塔及花城广场', city: '广州市', visitors: 20.0 },
            { name: '珠海长隆海洋王国', city: '珠海市', visitors: 16.0 },
            { name: '韶关丹霞山', city: '韶关市', visitors: 18.0 },
            { name: '海陵岛大角湾', city: '阳江市', visitors: 15.0 },
            { name: '佛山西樵山', city: '佛山市', visitors: 12.0 },
            { name: '惠州罗浮山', city: '惠州市', visitors: 11.0 },
            { name: '巽寮湾滨海度假区', city: '惠州市', visitors: 10.0 },
            { name: '连州地下河', city: '清远市', visitors: 9.0 }
        ],
        cityRevenues: [
            { city: '广州', revenue: 3000, unit: '亿' },
            { city: '深圳', revenue: 2600, unit: '亿' },
            { city: '佛山', revenue: 1800, unit: '亿' },
            { city: '东莞', revenue: 1200, unit: '亿' },
            { city: '珠海', revenue: 620, unit: '亿' }
        ],
        industries: [
            { name: '旅游', value: 150, unit: '亿' },
            { name: '住宿', value: 300, unit: '亿' },
            { name: '餐饮', value: 450, unit: '亿' },
            { name: '购物', value: 550, unit: '亿' },
            { name: '娱乐', value: 650, unit: '亿' },
            { name: '交通', value: 800, unit: '亿' },
            { name: '其他', value: 900, unit: '亿' }
        ],
        topCitiesByVisitors: [
            { city: '广州市', count: 320, unit: '万人次' },
            { city: '深圳市', count: 290, unit: '万人次' },
            { city: '东莞市', count: 210, unit: '万人次' },
            { city: '佛山市', count: 190, unit: '万人次' },
            { city: '惠州市', count: 170, unit: '万人次' }
        ],
        consumption: [
            { category: '交通', percentage: 25 },
            { category: '住宿', percentage: 23 },
            { category: '餐饮', percentage: 24 },
            { category: '购物', percentage: 20 },
            { category: '门票娱乐', percentage: 8 }
        ],
        hotWords: [
            { name: '粤港澳大湾区', value: 20 },
            { name: '一程多站', value: 16 },
            { name: '高铁旅游', value: 14 },
            { name: '夜间经济', value: 12 },
            { name: '文旅融合', value: 10 },
            { name: '智慧旅游', value: 8 },
            { name: '红色旅游', value: 7 },
            { name: '非遗体验', value: 5 },
            { name: '滨海度假', value: 4 }
        ]
    },

    // ========== 2020：疫情谷底 ==========
    {
        year: 2020,
        news: [
            '广东暂停跨省团队旅游，省内短途游成主流',
            '广州塔推出"云游广州"直播，累计观看超千万人次',
            '深圳大鹏半岛封闭管理后有序恢复开放',
            '佛山祖庙-岭南天地推出线上非遗展览',
            '东莞松山湖举办首届线上马拉松，吸引全国跑者参与',
            '惠州西湖景区实行预约限流，单日接待量控制在50%',
            '韶关丹霞山开展"云赏丹霞"活动，线上客流创新高',
            '清远古龙峡推出医护人员免票政策，致敬逆行者',
            '肇庆星湖景区推出年卡延期服务，保障游客权益',
            '潮州古城暂停大型民俗活动，小规模文创市集持续运营'
        ],
        kpis: [
            { title: '2020年旅游业收入', value: 4800.0, unit: '亿元', compare: 'down', proportion: 61.6 },
            { title: '2020年来访游客数', value: 3.8, unit: '亿人', compare: 'down', proportion: 47.2 },
            { title: '2020年广东人口出游支出', value: 1.2, unit: '万亿元', compare: 'down', proportion: 68.4 }
        ],
        ageDistribution: [
            { category: '20以下', count: 1500 },
            { category: '20-30', count: 1000 },
            { category: '30-40', count: 600 },
            { category: '40-50', count: 400 },
            { category: '50以上', count: 200 }
        ],
        quarterlyReception: [
            { year: 2019, quarters: [18500, 17000, 23000, 16500] },
            { year: 2020, quarters: [5000, 4500, 8000, 7000] }
        ],
        visitorSources: [
            { province: '湖南', percentage: 22 },
            { province: '广西', percentage: 18 },
            { province: '江西', percentage: 15 },
            { province: '福建', percentage: 12 },
            { province: '湖北', percentage: 10 }
        ],
        attractions: [
            { name: '广州长隆旅游度假区', city: '广州市', visitors: 15.0 },
            { name: '深圳华侨城度假区', city: '深圳市', visitors: 12.0 },
            { name: '广州塔及花城广场', city: '广州市', visitors: 10.0 },
            { name: '惠州西湖', city: '惠州市', visitors: 7.0 },
            { name: '韶关丹霞山', city: '韶关市', visitors: 8.0 },
            { name: '肇庆七星岩', city: '肇庆市', visitors: 6.0 },
            { name: '佛山祖庙-岭南天地', city: '佛山市', visitors: 5.0 },
            { name: '清远古龙峡', city: '清远市', visitors: 7.0 },
            { name: '佛山西樵山', city: '佛山市', visitors: 6.0 },
            { name: '惠州罗浮山', city: '惠州市', visitors: 5.0 }
        ],
        cityRevenues: [
            { city: '广州', revenue: 1200, unit: '亿' },
            { city: '深圳', revenue: 1000, unit: '亿' },
            { city: '佛山', revenue: 700, unit: '亿' },
            { city: '东莞', revenue: 450, unit: '亿' },
            { city: '珠海', revenue: 240, unit: '亿' }
        ],
        industries: [
            { name: '旅游', value: 60, unit: '亿' },
            { name: '住宿', value: 120, unit: '亿' },
            { name: '餐饮', value: 180, unit: '亿' },
            { name: '购物', value: 220, unit: '亿' },
            { name: '娱乐', value: 260, unit: '亿' },
            { name: '交通', value: 320, unit: '亿' },
            { name: '其他', value: 360, unit: '亿' }
        ],
        topCitiesByVisitors: [
            { city: '广州市', count: 130, unit: '万人次' },
            { city: '深圳市', count: 115, unit: '万人次' },
            { city: '东莞市', count: 85, unit: '万人次' },
            { city: '佛山市', count: 75, unit: '万人次' },
            { city: '惠州市', count: 65, unit: '万人次' }
        ],
        consumption: [
            { category: '交通', percentage: 20 },
            { category: '住宿', percentage: 18 },
            { category: '餐饮', percentage: 28 },
            { category: '购物', percentage: 24 },
            { category: '门票娱乐', percentage: 10 }
        ],
        hotWords: [
            { name: '云旅游', value: 20 },
            { name: '周边游', value: 18 },
            { name: '预约旅游', value: 14 },
            { name: '康养旅居', value: 12 },
            { name: '直播带货', value: 10 },
            { name: '无接触服务', value: 8 },
            { name: '省内循环', value: 7 },
            { name: '自驾游', value: 6 },
            { name: '乡村民宿', value: 5 }
        ]
    },

    // ========== 2021：恢复中 ==========
    {
        year: 2021,
        news: [
            '五一假期广东旅游收入超2019年同期，恢复势头强劲',
            '广州长隆度假区暑期接待量恢复至疫情前80%',
            '深圳华侨城推出"国潮文化节"，Z世代游客占比提升',
            '佛山岭南天地举办非遗市集，日均客流突破5万人次',
            '东莞松山湖科学城成为工业旅游新热点',
            '惠州巽寮湾暑期亲子游预订量同比增长120%',
            '韶关丹霞山举办国际山地旅游大会，吸引全球目光',
            '清远古龙峡漂流季开幕，珠三角游客超百万人次',
            '肇庆星湖景区惠民年卡销量突破10万张',
            '潮州古城举办小型潮剧展演，线上同步直播'
        ],
        kpis: [
            { title: '2021年旅游业收入', value: 6800.0, unit: '亿元', compare: 'up', proportion: 41.7 },
            { title: '2021年来访游客数', value: 5.2, unit: '亿人', compare: 'up', proportion: 36.8 },
            { title: '2021年广东人口出游支出', value: 1.8, unit: '万亿元', compare: 'up', proportion: 50.0 }
        ],
        ageDistribution: [
            { category: '20以下', count: 1700 },
            { category: '20-30', count: 1200 },
            { category: '30-40', count: 700 },
            { category: '40-50', count: 380 },
            { category: '50以上', count: 120 }
        ],
        quarterlyReception: [
            { year: 2020, quarters: [5000, 4500, 8000, 7000] },
            { year: 2021, quarters: [10000, 9000, 15000, 12000] }
        ],
        visitorSources: [
            { province: '湖南', percentage: 20 },
            { province: '广西', percentage: 16 },
            { province: '江西', percentage: 14 },
            { province: '福建', percentage: 11 },
            { province: '湖北', percentage: 10 }
        ],
        attractions: [
            { name: '广州长隆旅游度假区', city: '广州市', visitors: 22.0 },
            { name: '深圳华侨城度假区', city: '深圳市', visitors: 18.0 },
            { name: '广州塔及花城广场', city: '广州市', visitors: 14.0 },
            { name: '韶关丹霞山', city: '韶关市', visitors: 12.0 },
            { name: '清远古龙峡', city: '清远市', visitors: 8.0 },
            { name: '惠州西湖', city: '惠州市', visitors: 9.0 },
            { name: '肇庆七星岩', city: '肇庆市', visitors: 8.0 },
            { name: '佛山祖庙-岭南天地', city: '佛山市', visitors: 7.0 },
            { name: '海陵岛大角湾', city: '阳江市', visitors: 8.0 },
            { name: '连州地下河', city: '清远市', visitors: 7.0 }
        ],
        cityRevenues: [
            { city: '广州', revenue: 1650, unit: '亿' },
            { city: '深圳', revenue: 1450, unit: '亿' },
            { city: '佛山', revenue: 1000, unit: '亿' },
            { city: '东莞', revenue: 650, unit: '亿' },
            { city: '珠海', revenue: 350, unit: '亿' }
        ],
        industries: [
            { name: '旅游', value: 90, unit: '亿' },
            { name: '住宿', value: 180, unit: '亿' },
            { name: '餐饮', value: 270, unit: '亿' },
            { name: '购物', value: 330, unit: '亿' },
            { name: '娱乐', value: 390, unit: '亿' },
            { name: '交通', value: 480, unit: '亿' },
            { name: '其他', value: 540, unit: '亿' }
        ],
        topCitiesByVisitors: [
            { city: '广州市', count: 175, unit: '万人次' },
            { city: '深圳市', count: 160, unit: '万人次' },
            { city: '东莞市', count: 115, unit: '万人次' },
            { city: '佛山市', count: 105, unit: '万人次' },
            { city: '惠州市', count: 85, unit: '万人次' }
        ],
        consumption: [
            { category: '交通', percentage: 22 },
            { category: '住宿', percentage: 20 },
            { category: '餐饮', percentage: 26 },
            { category: '购物', percentage: 22 },
            { category: '门票娱乐', percentage: 10 }
        ],
        hotWords: [
            { name: '红色旅游', value: 18 },
            { name: '乡村游', value: 16 },
            { name: '微度假', value: 14 },
            { name: '露营热', value: 12 },
            { name: '亲子游', value: 10 },
            { name: 'Z世代', value: 8 },
            { name: '国潮风', value: 7 },
            { name: '非遗研学', value: 6 },
            { name: '民宿集群', value: 5 }
        ]
    },

    // ========== 2022：低位徘徊（你原有数据，保持不变） ==========
    {
        year: 2022,
        news: [
            '广东多地推出文旅消费券，助力旅游市场回暖',
            '深圳大鹏半岛获评国家级旅游度假区',
            '广州北京路步行街入选国家级夜间文旅消费集聚区',
            '韶关丹霞山举办国际山地旅游大会',
            '清远漂流季开幕，吸引珠三角游客超百万人次',
            '佛山岭南天地举办非遗文化节，客流增长显著',
            '惠州巽寮湾暑期亲子游热度攀升',
            '肇庆星湖景区推出惠民年卡，游客量稳步回升',
            '潮州牌坊街入选省级旅游休闲街区',
            '珠海横琴长隆二期项目动工，预计2025年开业'
        ],
        kpis: [
            { title: '2022年旅游业收入', value: 8226.0, unit: '亿元', compare: 'down', proportion: 5.2 },
            { title: '2022年来访游客数', value: 7.77, unit: '亿人', compare: 'down', proportion: 8.1 },
            { title: '2022年广东人口出游支出', value: 2.04, unit: '万亿元', compare: 'down', proportion: 15.3 }
        ],
        ageDistribution: [
            { category: '20以下', count: 1800 },
            { category: '20-30', count: 1200 },
            { category: '30-40', count: 650 },
            { category: '40-50', count: 350 },
            { category: '50以上', count: 90 }
        ],
        quarterlyReception: [
            { year: 2021, quarters: [10000, 9000, 15000, 12000] },
            { year: 2022, quarters: [9080, 6440, 13540, 9650] }
        ],
        visitorSources: [
            { province: '湖南', percentage: 17 },
            { province: '广西', percentage: 15 },
            { province: '江西', percentage: 13 },
            { province: '福建', percentage: 10 },
            { province: '湖北', percentage: 9 }
        ],
        attractions: [
            { name: '广州长隆旅游度假区', city: '广州市', visitors: 20.0 },
            { name: '深圳华侨城度假区', city: '深圳市', visitors: 16.0 },
            { name: '珠海长隆海洋王国', city: '珠海市', visitors: 14.0 },
            { name: '广州塔及花城广场', city: '广州市', visitors: 12.0 },
            { name: '韶关丹霞山', city: '韶关市', visitors: 9.0 },
            { name: '清远古龙峡', city: '清远市', visitors: 8.0 },
            { name: '肇庆七星岩', city: '肇庆市', visitors: 7.0 },
            { name: '佛山祖庙-岭南天地', city: '佛山市', visitors: 6.0 },
            { name: '惠州西湖', city: '惠州市', visitors: 5.0 },
            { name: '潮州广济桥古城', city: '潮州市', visitors: 4.5 }
        ],
        cityRevenues: [
            { city: '广州', revenue: 1800, unit: '亿' },
            { city: '深圳', revenue: 1500, unit: '亿' },
            { city: '佛山', revenue: 1100, unit: '亿' },
            { city: '东莞', revenue: 750, unit: '亿' },
            { city: '珠海', revenue: 380, unit: '亿' }
        ],
        industries: [
            { name: '旅游', value: 80, unit: '亿' },
            { name: '住宿', value: 160, unit: '亿' },
            { name: '餐饮', value: 240, unit: '亿' },
            { name: '购物', value: 320, unit: '亿' },
            { name: '娱乐', value: 400, unit: '亿' },
            { name: '交通', value: 480, unit: '亿' },
            { name: '其他', value: 520, unit: '亿' }
        ],
        topCitiesByVisitors: [
            { city: '广州市', count: 195, unit: '万人次' },
            { city: '深圳市', count: 180, unit: '万人次' },
            { city: '东莞市', count: 130, unit: '万人次' },
            { city: '佛山市', count: 120, unit: '万人次' },
            { city: '惠州市', count: 95, unit: '万人次' }
        ],
        consumption: [
            { category: '交通', percentage: 30 },
            { category: '住宿', percentage: 22 },
            { category: '餐饮', percentage: 20 },
            { category: '购物', percentage: 19 },
            { category: '门票娱乐', percentage: 9 }
        ],
        hotWords: [
            { name: '周边游', value: 20 },
            { name: '露营热', value: 16 },
            { name: '微度假', value: 14 },
            { name: '乡村游', value: 11 },
            { name: '红色旅游', value: 9 },
            { name: '自驾游', value: 8 },
            { name: '亲子游', value: 6 },
            { name: '康养旅居', value: 5 },
            { name: '云旅游', value: 3 }
        ]
    },

    // ========== 2023：强劲反弹（你原有数据，保持不变） ==========
    {
        year: 2023,
        news: [
            '广州长隆度假区年接待量突破2000万人次，创历史新高',
            '深圳华侨城推出数字文旅新体验，沉浸式项目受追捧',
            '珠海长隆海洋王国入选"亚洲最佳主题公园"前十强',
            '韶关丹霞山获评国家级生态旅游示范区，客流增长40%',
            '清远古龙峡玻璃桥升级，暑期单日接待量超3万人次',
            '粤港澳大湾区联合推出"一程多站"旅游线路受青睐',
            '广州塔推出云端露营项目，夜经济收入增长显著',
            '潮州古城举办国际潮文化节，带动民宿业蓬勃发展',
            '肇庆七星岩引入AI智能导览，游客满意度达95%',
            '惠州巽寮湾滨海旅游区入选国家级旅游度假区'
        ],
        kpis: [
            { title: '2023年旅游业收入', value: 9525.58, unit: '亿元', compare: 'up', proportion: 15.8 },
            { title: '2023年来访游客数', value: 8.74, unit: '亿人', compare: 'up', proportion: 12.4 },
            { title: '2023年广东人口出游支出', value: 4.91, unit: '万亿元', compare: 'up', proportion: 140.3 }
        ],
        ageDistribution: [
            { category: '20以下', count: 2000 },
            { category: '20-30', count: 1430 },
            { category: '30-40', count: 800 },
            { category: '40-50', count: 410 },
            { category: '50以上', count: 120 }
        ],
        quarterlyReception: [
            { year: 2022, quarters: [9080, 6440, 13540, 9650] },
            { year: 2023, quarters: [22800, 19800, 22500, 20500] }
        ],
        visitorSources: [
            { province: '湖南', percentage: 18 },
            { province: '广西', percentage: 16 },
            { province: '江西', percentage: 12 },
            { province: '福建', percentage: 9 },
            { province: '湖北', percentage: 8 }
        ],
        attractions: [
            { name: '广州长隆旅游度假区', city: '广州市', visitors: 28.5 },
            { name: '深圳华侨城度假区', city: '深圳市', visitors: 22.3 },
            { name: '珠海长隆海洋王国', city: '珠海市', visitors: 19.8 },
            { name: '广州塔及花城广场', city: '广州市', visitors: 16.4 },
            { name: '韶关丹霞山', city: '韶关市', visitors: 12.7 },
            { name: '清远古龙峡', city: '清远市', visitors: 11.2 },
            { name: '肇庆七星岩', city: '肇庆市', visitors: 9.6 },
            { name: '佛山祖庙-岭南天地', city: '佛山市', visitors: 8.3 },
            { name: '惠州西湖', city: '惠州市', visitors: 7.1 },
            { name: '潮州广济桥古城', city: '潮州市', visitors: 6.5 }
        ],
        cityRevenues: [
            { city: '广州', revenue: 2500, unit: '亿' },
            { city: '深圳', revenue: 2000, unit: '亿' },
            { city: '佛山', revenue: 1500, unit: '亿' },
            { city: '东莞', revenue: 1000, unit: '亿' },
            { city: '珠海', revenue: 500, unit: '亿' }
        ],
        industries: [
            { name: '旅游', value: 100, unit: '亿' },
            { name: '住宿', value: 200, unit: '亿' },
            { name: '餐饮', value: 300, unit: '亿' },
            { name: '购物', value: 400, unit: '亿' },
            { name: '娱乐', value: 500, unit: '亿' },
            { name: '交通', value: 600, unit: '亿' },
            { name: '其他', value: 700, unit: '亿' }
        ],
        topCitiesByVisitors: [
            { city: '广州市', count: 287, unit: '万人次' },
            { city: '深圳市', count: 256, unit: '万人次' },
            { city: '佛山市', count: 168, unit: '万人次' },
            { city: '东莞市', count: 185, unit: '万人次' },
            { city: '惠州市', count: 142, unit: '万人次' }
        ],
        consumption: [
            { category: '交通', percentage: 28 },
            { category: '住宿', percentage: 24 },
            { category: '餐饮', percentage: 22 },
            { category: '购物', percentage: 18 },
            { category: '门票娱乐', percentage: 8 }
        ],
        hotWords: [
            { name: '澳车北上', value: 18 },
            { name: '演唱会', value: 15 },
            { name: '寻味广东', value: 12 },
            { name: '湾区之夜', value: 10 },
            { name: '博物馆热', value: 7 },
            { name: '反向旅游', value: 7 },
            { name: '研学旅行', value: 5 },
            { name: '海岛度假', value: 4 },
            { name: '广深港高铁提速', value: 3 }
        ]
    },

    // ========== 2024：历史新高 ==========
    {
        year: 2024,
        news: [
            '广东推出"请到广东过大年"系列活动，春节文旅消费破纪录',
            '深圳万架无人机表演惊艳全国，"天空之城"文旅IP出圈',
            '佛山西樵广东千古情景区开业即爆款，单日演出场次创纪录',
            '广州长隆度假区年接待量突破2200万人次，再创新高',
            '东莞草莓音乐节带动周边消费1.6亿元，演艺经济成新引擎',
            '珠海长隆海洋王国二期开业，沉浸式体验全面升级',
            '韶关丹霞山入选世界自然遗产预备名录，国际影响力提升',
            '清远古龙峡获评国家5A级景区，年接待量突破150万人次',
            '肇庆星湖景区推出"星湖夜宴"项目，夜间客流增长50%',
            '潮州古城举办国际潮商大会，文旅融合迈向国际化'
        ],
        kpis: [
            { title: '2024年旅游业收入', value: 11000.0, unit: '亿元', compare: 'up', proportion: 15.5 },
            { title: '2024年来访游客数', value: 9.1, unit: '亿人', compare: 'up', proportion: 4.1 },
            { title: '2024年广东人口出游支出', value: 5.5, unit: '万亿元', compare: 'up', proportion: 12.0 }
        ],
        ageDistribution: [
            { category: '20以下', count: 2200 },
            { category: '20-30', count: 1550 },
            { category: '30-40', count: 850 },
            { category: '40-50', count: 430 },
            { category: '50以上', count: 130 }
        ],
        quarterlyReception: [
            { year: 2023, quarters: [22800, 19800, 22500, 20500] },
            { year: 2024, quarters: [26000, 24000, 28500, 25000] }
        ],
        visitorSources: [
            { province: '湖南', percentage: 19 },
            { province: '广西', percentage: 15 },
            { province: '江西', percentage: 12 },
            { province: '福建', percentage: 9 },
            { province: '湖北', percentage: 8 }
        ],
        attractions: [
            { name: '广州长隆旅游度假区', city: '广州市', visitors: 32.0 },
            { name: '深圳华侨城度假区', city: '深圳市', visitors: 26.0 },
            { name: '广东千古情景区', city: '佛山市', visitors: 20.0 },
            { name: '珠海长隆海洋王国', city: '珠海市', visitors: 18.0 },
            { name: '广州塔及花城广场', city: '广州市', visitors: 19.0 },
            { name: '韶关丹霞山', city: '韶关市', visitors: 16.0 },
            { name: '海陵岛大角湾', city: '阳江市', visitors: 14.0 },
            { name: '巽寮湾滨海度假区', city: '惠州市', visitors: 12.0 },
            { name: '清远古龙峡', city: '清远市', visitors: 13.0 },
            { name: '连州地下河', city: '清远市', visitors: 10.0 }
        ],
        cityRevenues: [
            { city: '广州', revenue: 3100, unit: '亿' },
            { city: '深圳', revenue: 2600, unit: '亿' },
            { city: '佛山', revenue: 1850, unit: '亿' },
            { city: '东莞', revenue: 1250, unit: '亿' },
            { city: '珠海', revenue: 650, unit: '亿' }
        ],
        industries: [
            { name: '旅游', value: 140, unit: '亿' },
            { name: '住宿', value: 280, unit: '亿' },
            { name: '餐饮', value: 420, unit: '亿' },
            { name: '购物', value: 520, unit: '亿' },
            { name: '娱乐', value: 620, unit: '亿' },
            { name: '交通', value: 760, unit: '亿' },
            { name: '其他', value: 860, unit: '亿' }
        ],
        topCitiesByVisitors: [
            { city: '广州市', count: 335, unit: '万人次' },
            { city: '深圳市', count: 300, unit: '万人次' },
            { city: '东莞市', count: 220, unit: '万人次' },
            { city: '佛山市', count: 200, unit: '万人次' },
            { city: '惠州市', count: 175, unit: '万人次' }
        ],
        consumption: [
            { category: '交通', percentage: 27 },
            { category: '住宿', percentage: 24 },
            { category: '餐饮', percentage: 22 },
            { category: '购物', percentage: 19 },
            { category: '门票娱乐', percentage: 8 }
        ],
        hotWords: [
            { name: '广东过大年', value: 20 },
            { name: '演唱会经济', value: 16 },
            { name: '无人机表演', value: 14 },
            { name: '广东千古情', value: 12 },
            { name: '文博热', value: 10 },
            { name: '澳车北上', value: 9 },
            { name: '沉浸式演艺', value: 8 },
            { name: '湾区夜游', value: 6 },
            { name: '冰雪旅游', value: 4 }
        ]
    }
]

export default yearSnapshots