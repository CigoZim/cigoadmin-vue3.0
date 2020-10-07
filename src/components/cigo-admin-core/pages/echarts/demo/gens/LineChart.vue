<template>
<div id="LineChartRegression" class="line-chart-content"></div>
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
    lineData
} from "./data";
import echarts from "echarts";
import echartsStat from "echarts-stat";
import {
    debounce
} from 'lodash';
let phpTools = require("locutus/php/");
let {
    jStat
} = require("jstat");

export default defineComponent({
    name: "EchartDemoLineChart",
    setup(props, ctx) {
        let lineChartData: any = inject("lineChartData");
        let dataGroup: any = toRef(lineChartData, "dataGroup");
        let chartConfigs: any = toRef(lineChartData, "chartConfigs");
        let dataSrc: any = toRef(lineChartData, 'dataSrc');
        let dataMerge: any = [];
        let myRegression: any = null;
        let pearsonCor = ref(0);
        let pearsonP = ref('0');

        onBeforeMount(() => {
            dataSrc.value = lineData;
        });
        let mountedFlag = false;
        onMounted(() => {
            delayDrawChart();
            mountedFlag = true;
        });
        watch(dataSrc, (newVal, preVal) => {
            dataMerge = phpTools.array.array_merge(dataSrc.value[0], dataSrc.value[1]);
            initData();
        });
        watch(chartConfigs.value, (newVal, preVal) => {
            if (mountedFlag) {
                delayDrawChart();
            }
        });

        const initData = () => {
            myRegression = echartsStat.regression("linear", dataMerge, 0);
            myRegression.points.sort(function (a: any, b: any) {
                return a[0] - b[0];
            });

            pearsonCor.value = makeCor();
            pearsonP.value = makeP();
        };
        const makeCor = () => {
            let cor = jStat.corrcoeff(
                jStat.cola(dataMerge, 0),
                jStat.cola(dataMerge, 1)
            );

            return Math.round(cor * 10000) / 10000;
        };
        const makeP = () => {
            let tScore =
                pearsonCor.value *
                Math.sqrt(
                    (dataMerge.length - 2) / (1 - pearsonCor.value * pearsonCor.value)
                );

            let p = jStat.ttest(tScore, dataMerge.length, 2);
            var num = new Number(p);
            return num.toExponential(4);
        };
        const delayDrawChart = debounce(() => {
            drawChart();
        }, 300);
        const drawChart = () => {
            let elementById: any = document.getElementById(
                "LineChartRegression"
            );
            let lineChart = echarts.init(elementById);
            lineChart.setOption(makeChartOpt());
        };
        const makeChartOpt = (): any => {
            var option = {
                title: [{
                    text: "cor=" + pearsonCor.value + "，p=" + pearsonP.value,
                    left: "center",
                    top: "70",
                    textStyle: {
                        color: "#888",
                        fontSize: 12
                    }
                }],
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            type: "png"
                        }
                    }
                },
                grid: [{
                    x: "10%",
                    y: "10%",
                    width: "88%",
                    height: "78%",
                    show: true,
                    borderColor: chartConfigs.value.commonConfig.borderColor,
                    borderWidth: chartConfigs.value.commonConfig.borderWidth,
                }],
                tooltip: {
                    trigger: "item",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                xAxis: [{
                    name: "hsa-miR-30c-2-3p",
                    nameLocation: "center",
                    nameGap: chartConfigs.value.commonConfig.borderWidth + 25,
                    type: "value",
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
                        fontSize: chartConfigs.value.commonConfig.xySize,
                        color: chartConfigs.value.commonConfig.borderColor,
                        margin: chartConfigs.value.commonConfig.borderWidth + 8
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: "dashed"
                        }
                    }
                }],
                yAxis: [{
                    name: "LINC01936",
                    nameLocation: "center",
                    nameGap: chartConfigs.value.commonConfig.borderWidth + 25,
                    type: "value",
                    boundaryGap: ["5%", "5%"],
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
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: "dashed"
                        }
                    }
                }],
                series: [{
                        name: "Tumor",
                        type: "scatter",
                        symbol: chartConfigs.value.groupOne.symbol, //设定为实心点
                        symbolSize: chartConfigs.value.groupOne.symbolSize, //设定实心点的大小
                        color: chartConfigs.value.groupOne.symbolColor, //设定实心点的大小
                        data: dataSrc.value[0]
                    },
                    {
                        name: "Normal",
                        type: "scatter",
                        symbol: chartConfigs.value.groupTwo.symbol, //设定为实心点
                        symbolSize: chartConfigs.value.groupTwo.symbolSize, //设定实心点的大小
                        color: chartConfigs.value.groupTwo.symbolColor, //设定实心点的大小
                        data: dataSrc.value[1]
                    },
                    {
                        name: "趋势线",
                        type: "line",
                        color: chartConfigs.value.commonConfig.lineColor,
                        lineStyle: {
                            width: chartConfigs.value.commonConfig.lineWidth
                        },
                        showSymbol: false,
                        data: myRegression.points
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
.line-chart-content {
    display: flex;
    width: 550px;
    height: 620px;
}
</style>
