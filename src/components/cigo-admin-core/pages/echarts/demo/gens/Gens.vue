<template>
<div class="gens-content">
    <div class="content-container">
        <div class="content">
            <div class="content-sub">
                <div class="left">
                    <keep-alive>
                        <component v-if="currComp=='boxplotChart'" :is="BoxplotChartCtrl" />
                    </keep-alive>
                    <keep-alive>
                        <component v-if="currComp=='lineChart'" :is="LineChartCtrl" />
                    </keep-alive>
                </div>
                <div class="right">
                    <div class="top">
                        <div class="chart-title">
                            <span class="zh">基因分析</span>
                            <span class="en">Gene analysis</span>
                        </div>
                        <div class="tabs">
                            <div class="tab" :class="[currComp == 'boxplotChart' ? 'curr':'']" @click.stop="changeTab('boxplotChart')">箱形图</div>
                            <div class="tab" :class="[currComp == 'lineChart' ? 'curr':'']" @click.stop="changeTab('lineChart')">相关性图</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <keep-alive>
                            <component v-if="currComp=='boxplotChart'" :is="BoxplotChart" />
                        </keep-alive>
                        <keep-alive>
                            <component v-if="currComp=='lineChart'" :is="LineChart" />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    provide,
    reactive,
    ref,
    shallowRef,
    toRef,
    watch
} from 'vue'
import LineChart from './LineChart.vue';
import LineChartCtrl from './LineChartCtrl.vue';
import BoxplotChart from './BoxplotChart.vue';
import BoxplotChartCtrl from './BoxplotChartCtrl.vue';

export default defineComponent({
    name: 'EchartDemoGens',
    setup(props, ctx) {
        let component = BoxplotChart;
        let componentCtrl = BoxplotChartCtrl;
        let currComp = ref('boxplotChart');

        const changeTab = (comp: any) => {
            currComp.value = comp;
        };

        //******************* */
        let boxplotChartData = reactive({
            dataGroup: [],
            chartConfigs: {
                groupLeft: {},
                groupRight: {},
                commonConfig: {}
            },
            dataSrc: [
                [],
                []
            ],
        });
        provide('boxplotChartData', boxplotChartData);

        let lineChartData = reactive({
            dataGroup: [],
            chartConfigs: {
                groupOne: {},
                groupTwo: {},
                commonConfig: {}
            },
            dataSrc: [
                [],
                []
            ],
        });
        provide('lineChartData', lineChartData);

        //******************* */

        return {
            LineChart,
            LineChartCtrl,
            BoxplotChart,
            BoxplotChartCtrl,
            currComp,
            changeTab,
        };
    }
})
</script>

<style lang="scss">
.gens-content {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #f8f8f8;
    overflow: scroll;

    .content-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .no-login-tip,
        .login-user-info {
            display: flex;
            align-self: flex-end;
            margin: 10px 15px;
            cursor: pointer;
        }

        .login-user-info {
            color: #333;
            font-size: 16px;
        }

        .no-login-tip {
            color: #DB1414;
            font-size: 14px;
            border-bottom: 1px solid #DB1414;
            padding-bottom: 3px;
        }

        .content {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 60px;
            background-color: #fff;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;

            .content-sub {
                background-color: #D5ECF1;
                border-radius: 20px;
                width: 100%;
                height: 860px;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;

                .left {
                    width: 360px;
                    height: 800px;
                    border-radius: 15px;
                    background-color: #212A2D;
                    padding: 30px 0px;

                    .chart-ctrl-content {
                        width: 100%;
                        margin: 0px auto;
                        max-height: 100%;
                        display: flex;
                        flex-direction: column;
                        color: #fff;
                        overflow-x: hidden;
                        overflow-y: scroll;

                        .label {
                            color: #fff;
                            font-size: 16px;
                            font-weight: bold;
                            width: 300px;
                            margin: 0px auto;
                        }

                        .divider-line {
                            width: 300px;
                            border-bottom: 1px solid #ddd;
                            margin: 30px auto 20px;
                            position: relative;

                            span {
                                position: absolute;
                                background-color: #212a2d;
                                padding: 0px 10px;
                                left: 120px;
                                top: -8px;
                                color: #ddd;
                            }
                        }

                        .select-item {
                            width: 300px;
                            margin: 10px auto;

                            .ant-select-selection--single {
                                height: 37px;
                            }

                            .ant-select-selection {
                                border-radius: 5px;
                            }

                            .ant-select-selection__rendered {
                                line-height: 35px;
                            }
                        }

                        .slider-item {
                            width: 300px;
                            margin: 10px auto 15px;

                            .ant-slider-track {
                                height: 6px;
                            }

                            .ant-slider-handle {
                                width: 25px;
                                height: 25px;
                                margin-top: -10px;
                                border-width: 3px;
                            }
                        }

                        .slider-mark {
                            margin-top: -16px;
                            margin-bottom: 10px;
                        }

                        .slider-mark.sm-01-09 {
                            width: 314px;
                            margin-left: 23px;
                        }

                        .slider-mark.sm-1-10 {
                            width: 309px;
                            margin-left: 28px;
                        }

                        .slider-mark.sm-1-15 {
                            width: 308px;
                            margin-left: 28px;
                        }

                        .slider-mark.sm-10-24 {
                            width: 311px;
                            margin-left: 25px;
                        }

                        .slider-mark.sm-10-150 {
                            width: 314px;
                            margin-left: 25px;
                        }

                        .color-picker {
                            width: 300px;
                            line-height: 37px;
                            border: 1px solid #ffffff75;
                            color: #fff;
                            border-radius: 5px;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;
                            font-size: 14px;
                            font-weight: bold;
                            margin: 10px auto 15px;
                            cursor: pointer;
                        }

                        .config-group {
                            width: 300px;
                            margin: 0px auto;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;

                            .group-item {
                                display: flex;
                                flex-direction: column;
                                width: 135px;

                                .select-item {
                                    width: 100%;
                                }

                                .color-picker {
                                    width: 100%;
                                }
                            }
                        }
                    }

                    .chart-ctrl-content::-webkit-scrollbar {
                        width: 0;
                    }
                }

                .right {
                    display: flex;
                    flex-direction: column;
                    width: 660px;
                    height: 800px;

                    .top {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;

                        .chart-title {
                            display: flex;
                            flex-direction: column;

                            .zh {
                                font-size: 32px;
                                font-weight: bold;
                                color: #0CA1BF;
                            }

                            .en {
                                font-size: 16px;
                                font-weight: regular;
                                color: #9f9f9f;
                            }
                        }

                        .tabs {
                            display: flex;
                            flex-direction: column;

                            .tab {
                                width: 105px;
                                height: 38px;
                                border-radius: 19px;
                                border: 1px solid #0CA1BF;
                                color: #666;
                                font-weight: regular;
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                                cursor: pointer;
                            }

                            .tab:first-child {
                                margin-bottom: 10px;
                            }

                            .tab:hover,
                            .tab.curr {
                                background-color: #0CA1BF;
                                color: #fff;
                                font-weight: bold;
                            }
                        }
                    }

                    .bottom {
                        width: 660px;
                        height: 660px;
                        background-color: #fff;
                        border-radius: 20px;
                        margin-top: 30px;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>
