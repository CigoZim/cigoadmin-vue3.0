<template>
<div id="BoxplotChart" class="boxplot-chart-content"></div>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    onBeforeMount,
    onMounted,
    ref,
    toRef,
    watch
} from "vue";
import {
    boxplotData
} from "./data";
import echarts from "echarts";
let dataTool = require("echarts/extension/dataTool");
import {
    debounce
} from 'lodash'

export default defineComponent({
    name: "EchartDemoBoxplotChart",
    setup(props, ctx) {
        let boxplotChartData: any = inject('boxplotChartData');
        let dataGroup: any = toRef(boxplotChartData, 'dataGroup');
        let chartConfigs: any = toRef(boxplotChartData, 'chartConfigs');
        let dataSrc: any = toRef(boxplotChartData, 'dataSrc');
        let dataBoxSrc: any = [
            [
                [],
                []
            ],
            [
                [],
                []
            ]
        ];
        let dataBox: any = [];
        let pointData: any = [
            [],
            []
        ];
        let pearsonP = ref('0');
        onBeforeMount(() => {
            dataSrc.value = boxplotData;
        });
        let mountedFlag = false;
        onMounted(() => {
            delayDrawChart();
            mountedFlag = true;
        });
        watch(dataSrc, (newVal, preVal) => {
            initData();
        });
        watch(chartConfigs.value, (newVal, preVal) => {
            if (shakeSizeFlag) {
                shakeSizeFlag = false;
                return;
            }
            if (mountedFlag) {
                delayDrawChart();
            }
        });
        let shakeSizeRef = toRef(chartConfigs.value.commonConfig, 'shakeSize');
        let shakeSizeFlag = false;
        watch(shakeSizeRef, (newVal, preVal) => {
            shakeSizeFlag = true;
            shakeSizeChange();
        });

        const initData = () => {
            dataBoxSrc[0][0] = dataSrc.value[0];
            dataBoxSrc[1][1] = dataSrc.value[1];

            dataBox = [
                dataTool.prepareBoxplotData(dataBoxSrc[0]),
                dataTool.prepareBoxplotData(dataBoxSrc[1])
            ];
            dataBox[0].axisData[0] = dataGroup.value[0];
            dataBox[0].axisData[1] = dataGroup.value[1];
            dataBox[1].axisData[0] = dataGroup.value[0];
            dataBox[1].axisData[1] = dataGroup.value[1];

            makeP();
            makePointData();
        };
        const makeP = () => {
            pearsonP.value = '3.3465e-11';
        };
        const makePointData = () => {
            pointData[0].length = 0;
            dataBoxSrc[0][0].forEach((item: any) => {
                pointData[0].push([
                    1 +
                    Math.random() *
                    chartConfigs.value.commonConfig.shakeSize *
                    (Math.random() > chartConfigs.value.commonConfig.shakeSize ? -1 : 1),
                    item
                ]);
            });
            pointData[1].length = 0;
            dataBoxSrc[1][1].forEach((item: any) => {
                pointData[1].push([
                    3 +
                    Math.random() *
                    chartConfigs.value.commonConfig.shakeSize *
                    (Math.random() > chartConfigs.value.commonConfig.shakeSize ? -1 : 1),
                    item
                ]);
            });
        };
        const delayDrawChart = debounce(() => {
            drawChart();
        }, 300);

        const shakeSizeChange = debounce(() => {
            makePointData();
            drawChart();
        }, 300);

        const drawChart = () => {
            let elementById: any = document.getElementById("BoxplotChart");
            let boxplotChart = echarts.init(elementById);
            boxplotChart.setOption(makeChartOpt());
        };
        const makeChartOpt = (): any => {
            var option = {
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            type: "png"
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                grid: [{
                    x: "10%",
                    y: "10%",
                    width: "88%",
                    height: "78%",
                    show: true,
                    borderColor: chartConfigs.value.commonConfig.borderColor,
                    borderWidth: chartConfigs.value.commonConfig.borderWidth
                }],
                xAxis: [{
                        name: "LUAD",
                        nameLocation: "center",
                        nameTextStyle: {
                            padding: [0, 0, 0, 0]
                        },
                        show: true,
                        type: "category",
                        data: dataBox[0].axisData,
                        nameGap: chartConfigs.value.commonConfig.borderWidth + 25,
                        boundaryGap: true,
                        axisLine: {
                            show: false,
                            onZero: false
                        },
                        axisTick: {
                            length: Math.max(chartConfigs.value.commonConfig.borderWidth * 1.5, 5),
                            lineStyle: {
                                color: chartConfigs.value.commonConfig.borderColor,
                                width: chartConfigs.value.commonConfig.borderWidth
                            }
                        },
                        axisLabel: {
                            margin: chartConfigs.value.commonConfig.borderWidth + 8,
                            formatter: "{value}",
                            fontSize: chartConfigs.value.commonConfig.xySize,
                            color: chartConfigs.value.commonConfig.borderColor
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: "dashed"
                            }
                        }
                    },
                    {
                        type: "category",
                        data: dataBox[1].axisData,
                        show: false,
                        boundaryGap: true,
                        nameGap: 30
                    },
                    {
                        show: false,
                        type: "value",
                        splitLine: {
                            show: false
                        },
                        min: 0,
                        max: 4
                    }
                ],
                yAxis: [{
                        name: "Expression-log2(TPM+1)",
                        nameLocation: "center",
                        nameGap: chartConfigs.value.commonConfig.borderWidth + 25,
                        type: "value",
                        boundaryGap: ["20%", "20%"],
                        splitArea: {
                            show: false
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: "dashed"
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            length: Math.max(chartConfigs.value.commonConfig.borderWidth * 1.5, 5),
                            lineStyle: {
                                color: chartConfigs.value.commonConfig.borderColor,
                                width: chartConfigs.value.commonConfig.borderWidth
                            }
                        },
                        axisLabel: {
                            fontSize: chartConfigs.value.commonConfig.xySize,
                            color: chartConfigs.value.commonConfig.borderColor,
                            margin: chartConfigs.value.commonConfig.borderWidth + 8
                        }
                    },
                    {
                        show: false,
                        type: "value",
                        splitLine: {
                            show: false
                        },
                        min: 0,
                        max: 10
                    }
                ],
                series: [{
                        name: "T 箱体",
                        type: "boxplot",
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: dataBox[0].boxData,
                        itemStyle: {
                            color: chartConfigs.value.groupLeft.boxColor,
                            borderColor: chartConfigs.value.groupLeft.borderColor
                        },
                        boxWidth: [chartConfigs.value.commonConfig.boxplotWidth, chartConfigs.value.commonConfig.boxplotWidth],
                        tooltip: {
                            formatter: function (param: any) {
                                return [
                                    "实验： 第" + param.name + "组",
                                    "最大: " + param.data[5],
                                    "上四分位Q3: " + param.data[4],
                                    "中位数: " + param.data[3],
                                    "下四分位Q1: " + param.data[2],
                                    "最小: " + param.data[1]
                                ].join("<br/>");
                            }
                        }
                    },
                    {
                        name: "T 异常点",
                        type: "scatter",
                        data: dataBox[0].outliers,
                        symbolSize: chartConfigs.value.groupLeft.symbolSize + 1 < 3 ? 3 : chartConfigs.value.groupLeft.symbolSize + 1, //设定实心点的大小
                        color: chartConfigs.value.groupLeft.boxColor
                    },
                    {
                        name: "T 散点",
                        type: "scatter",
                        symbol: chartConfigs.value.groupLeft.symbol, //设定为实心点
                        symbolSize: chartConfigs.value.groupLeft.symbolSize, //设定实心点的大小
                        color: chartConfigs.value.groupLeft.symbolColor, //设定实心点的大小
                        xAxisIndex: 2,
                        yAxisIndex: 0,
                        data: pointData[0]
                    },
                    {
                        name: "N 箱体",
                        type: "boxplot",
                        xAxisIndex: 1,
                        yAxisIndex: 0,
                        data: dataBox[1].boxData,
                        itemStyle: {
                            color: chartConfigs.value.groupRight.boxColor,
                            borderColor: chartConfigs.value.groupRight.borderColor
                        },
                        boxWidth: [chartConfigs.value.commonConfig.boxplotWidth, chartConfigs.value.commonConfig.boxplotWidth],
                        tooltip: {
                            formatter: function (param: any) {
                                return [
                                    "实验： 第" + param.name + "组",
                                    "最大: " + param.data[5],
                                    "上四分位Q3: " + param.data[4],
                                    "中位数: " + param.data[3],
                                    "下四分位Q1: " + param.data[2],
                                    "最小: " + param.data[1]
                                ].join("<br/>");
                            }
                        }
                    },
                    {
                        name: "N 异常点",
                        type: "scatter",
                        data: dataBox[1].outliers,
                        symbolSize: chartConfigs.value.groupRight.symbolSize + 1 < 3 ? 3 : chartConfigs.value.groupRight.symbolSize + 1, //设定实心点的大小
                        color: chartConfigs.value.groupRight.boxColor
                    },
                    {
                        name: "N 散点",
                        type: "scatter",
                        symbol: chartConfigs.value.groupRight.symbol, //设定为实心点
                        symbolSize: chartConfigs.value.groupRight.symbolSize, //设定实心点的大小
                        color: chartConfigs.value.groupRight.symbolColor, //设定实心点的大小
                        xAxisIndex: 2,
                        yAxisIndex: 0,
                        data: pointData[1]
                    },
                    {
                        name: "相关性P",
                        type: "line",
                        data: [
                            [1, 9],
                            [1, 9.2],
                            [2, 9.2],
                            [3, 9.2],
                            [3, 9]
                        ],
                        symbol: "circle",
                        symbolSize: 1,
                        label: {
                            show: true,
                            formatter: (params: any) => {
                                return params.dataIndex == 2 ?
                                    "(*) p=" + pearsonP.value :
                                    "";
                            },
                            fontSize: 11,
                            color: chartConfigs.value.commonConfig.borderColor,
                            aligin: "center"
                        },
                        itemStyle: {
                            color: chartConfigs.value.commonConfig.borderColor,
                        },
                        xAxisIndex: 2,
                        yAxisIndex: 1,
                        // symbol: "none"
                        lineStyle: {
                            width: 1
                        }
                    }
                ]
            };
            return option;
        };

        return {};
    }
});
</script>

<style lang="scss">
.boxplot-chart-content {
    display: flex;
    width: 550px;
    height: 620px;
}
</style>
