import * as echarts from 'echarts'
import type { EChartsOption, TooltipComponentOption, SeriesOption } from 'echarts'

export const useChartConfig = () => {
    // 创建基础柱状图配置
    const createBaseBarConfig = (
        xAxisData: string[],
        seriesData: any[],
        customConfig: Partial<EChartsOption> = {}
    ): EChartsOption => {
        const baseConfig: EChartsOption = {
            grid: {
                left: '0%',
                right: '0%',
                top: '20%',
                bottom: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    color: '#2c3e50'
                }
            } as TooltipComponentOption,
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 2,
                        color: 'rgba(76, 93, 130, 1)'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 16,
                    color: '#2c3e50'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                nameTextStyle: {
                    color: '#2c3e50',
                    fontSize: 16,
                    padding: [0, 32, 12, 0]
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(160, 160, 160, 0.6)'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 16,
                    color: '#2c3e50'
                }
            },
            series: seriesData
        }

        // 深度合并配置
        return deepMerge(baseConfig, customConfig)
    }

    // 深度合并函数
    const deepMerge = (target: any, source: any): any => {
        const result = { ...target }

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(result[key] || {}, source[key])
            } else {
                result[key] = source[key]
            }
        }

        return result
    }

    // 创建普通柱状图系列配置
    const createBarSeries = (data: number[], options: any = {}): SeriesOption => {
        return {
            type: 'bar',
            data,
            barWidth: options.barWidth || '40%',
            label: {
                show: options.showLabel !== false,
                position: 'top',
                fontSize: 14,
                color: '#2c3e50',
                formatter: options.labelFormatter || '{c}'
            },
            itemStyle: {
                color: options.color || new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(120, 144, 199, 1)' },
                    { offset: 1, color: 'rgba(94, 111, 153, 1)' }
                ]),
                borderRadius: options.borderRadius || [2, 2, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(218, 163, 88, 1)' },
                        { offset: 1, color: 'rgba(175, 111, 23, 1)' }
                    ])
                }
            },
            ...options
        }
    }

    // 创建锥子形状柱状图系列配置
    const createConeBarSeries = (data: number[]): SeriesOption => {
        return {
            name: '百分比',
            type: 'pictorialBar',
            barWidth: '150%',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            label: {
                show: true,
                position: 'top',
                fontSize: 14,
                color: '#2c3e50',
                offset: [0, -10],
                formatter: '{c}%'
            },
            itemStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(94, 111, 153, 0.2)' },
                    { offset: 0.6, color: 'rgba(94, 111, 153, 0.8)' },
                    { offset: 1, color: 'rgba(94, 111, 153, 1)' }
                ]),
                borderColor: 'rgba(109, 128, 175, 1)',
                borderWidth: 4,
                borderRadius: [100, 100]
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        { offset: 0, color: 'rgba(218, 163, 88, 0.3)' },
                        { offset: 0.6, color: 'rgba(218, 163, 88, 0.8)' },
                        { offset: 1, color: 'rgba(218, 163, 88, 0)' }
                    ]),
                    borderColor: 'rgba(218, 163, 88, 1)'
                }
            },
            data,
            z: 10
        }
    }

    return {
        createBaseBarConfig,
        createBarSeries,
        createConeBarSeries
    }
}

// 3D立方体配置（单独导出）
export const use3DChartConfig = () => {
    const create3DCubeShapes = () => {
        const offsetX = 10
        const offsetY = 5

        // 创建左侧面
        const CubeLeft = echarts.graphic.extendShape({
            shape: { x: 0, y: 0 },
            buildPath: function (ctx: any, shape: any) {
                const xAxisPoint = shape.xAxisPoint
                const c0 = [shape.x, shape.y]
                const c1 = [shape.x - offsetX, shape.y - offsetY]
                const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1]]
                const c3 = [xAxisPoint[0], xAxisPoint[1]]
                ctx.moveTo(c0[0], c0[1])
                ctx.lineTo(c1[0], c1[1])
                ctx.lineTo(c2[0], c2[1])
                ctx.lineTo(c3[0], c3[1])
                ctx.closePath()
            }
        })

        // 绘制右侧面
        const CubeRight = echarts.graphic.extendShape({
            shape: { x: 0, y: 0 },
            buildPath: function (ctx: any, shape: any) {
                const xAxisPoint = shape.xAxisPoint
                const c1 = [shape.x, shape.y]
                const c2 = [xAxisPoint[0], xAxisPoint[1]]
                const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1]]
                const c4 = [shape.x + offsetX, shape.y - offsetY]
                ctx.moveTo(c1[0], c1[1])
                ctx.lineTo(c2[0], c2[1])
                ctx.lineTo(c3[0], c3[1])
                ctx.lineTo(c4[0], c4[1])
                ctx.closePath()
            }
        })

        // 绘制顶面
        const CubeTop = echarts.graphic.extendShape({
            shape: { x: 0, y: 0 },
            buildPath: function (ctx: any, shape: any) {
                const c1 = [shape.x, shape.y]
                const c2 = [shape.x + offsetX, shape.y - offsetY]
                const c3 = [shape.x, shape.y - offsetX]
                const c4 = [shape.x - offsetX, shape.y - offsetY]
                ctx.moveTo(c1[0], c1[1])
                ctx.lineTo(c2[0], c2[1])
                ctx.lineTo(c3[0], c3[1])
                ctx.lineTo(c4[0], c4[1])
                ctx.closePath()
            }
        })

        // 注册三个面图形
        echarts.graphic.registerShape('CubeLeft', CubeLeft)
        echarts.graphic.registerShape('CubeRight', CubeRight)
        echarts.graphic.registerShape('CubeTop', CubeTop)

        return { CubeLeft, CubeRight, CubeTop }
    }

    const get3DCubeSeriesConfig = (values: number[]) => {
        return [
            {
                type: 'custom',
                renderItem: (_params: any, api: any) => {
                    const location = api.coord([api.value(0), api.value(1)])
                    return {
                        type: 'group',
                        children: [
                            {
                                type: 'CubeLeft',
                                shape: {
                                    api,
                                    xValue: api.value(0),
                                    yValue: api.value(1),
                                    x: location[0],
                                    y: location[1],
                                    xAxisPoint: api.coord([api.value(0), 0])
                                },
                                style: {
                                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(114, 138, 192, 1)' },
                                        { offset: 1, color: 'rgba(68, 95, 156, 1)' }
                                    ])
                                },
                                emphasis: {
                                    style: {
                                        fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            { offset: 0, color: 'rgba(230, 165, 75, 1)' },
                                            { offset: 1, color: 'rgba(175, 111, 23, 1)' }
                                        ])
                                    }
                                }
                            },
                            {
                                type: 'CubeRight',
                                shape: {
                                    api,
                                    xValue: api.value(0),
                                    yValue: api.value(1),
                                    x: location[0],
                                    y: location[1],
                                    xAxisPoint: api.coord([api.value(0), 0])
                                },
                                style: {
                                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(161, 186, 244, 1)' },
                                        { offset: 1, color: 'rgba(104, 134, 202, 1)' }
                                    ])
                                },
                                emphasis: {
                                    style: {
                                        fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            { offset: 0, color: 'rgba(230, 165, 75, 1)' },
                                            { offset: 1, color: 'rgba(175, 111, 23, 1)' }
                                        ])
                                    }
                                }
                            },
                            {
                                type: 'CubeTop',
                                shape: {
                                    api,
                                    xValue: api.value(0),
                                    yValue: api.value(1),
                                    x: location[0],
                                    y: location[1],
                                    xAxisPoint: api.coord([api.value(0), 0])
                                },
                                style: {
                                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(198, 213, 244, 1)' },
                                        { offset: 1, color: 'rgba(198, 213, 244, 1)' }
                                    ])
                                },
                                emphasis: {
                                    style: {
                                        fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            { offset: 0, color: 'rgba(230, 165, 75, 1)' },
                                            { offset: 1, color: 'rgba(230, 165, 75, 1)' }
                                        ])
                                    }
                                }
                            }
                        ]
                    }
                },
                data: values
            },
            {
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 18,
                        color: '#2c3e50',
                        offset: [0, -25]
                    }
                },
                itemStyle: {
                    color: 'transparent'
                },
                tooltip: {},
                data: values
            }
        ]
    }

    return {
        create3DCubeShapes,
        get3DCubeSeriesConfig
    }
}