<template>
<div class="boxplot-chart-ctrl-content chart-ctrl-content">
    <span class="label">疾病</span>
    <a-select class="select-item" v-model:value="sickness" show-search placeholder="请选择疾病" :dropdownMatchSelectWidth="true">
        <a-select-option :value="0" :itemData="{}">
            <span style="color:#666;font-weight:700;">请选择疾病</span>
        </a-select-option>
        <a-select-option v-for="(item,index) in sicknessList" :key="index+1" :value="item.value">{{item.label}}</a-select-option>
    </a-select>
    <span class="label">基因</span>
    <a-select class="select-item" v-model:value="gens" show-search placeholder="请选择基因" :dropdownMatchSelectWidth="true">
        <a-select-option :value="0" :itemData="{}">
            <span style="color:#666;font-weight:700;">请选择基因</span>
        </a-select-option>
        <a-select-option v-for="(item,index) in gensList" :key="index+1" :value="item.value">{{item.label}}</a-select-option>
    </a-select>
    <span class="label">RNA</span>
    <a-select class="select-item" v-model:value="rna" show-search placeholder="请选择RNA" :dropdownMatchSelectWidth="true">
        <a-select-option :value="0" :itemData="{}">
            <span style="color:#666;font-weight:700;">请选择RNA</span>
        </a-select-option>
        <a-select-option v-for="(item,index) in rnaList" :key="index+1" :value="item.value">{{item.label}}</a-select-option>
    </a-select>

    <div class="divider-line">
        <span>{{dataGroup[0]}}</span>
    </div>
    <span class="label">散点大小</span>
    <a-slider class="slider-item group-left-symbol-size" v-model:value="groupLeft.symbolSize" :min="symbolOptions.min" :max="symbolOptions.max" :step="symbolOptions.step" />
    <img class="slider-mark sm-1-15" :src="openCDN+'/xingbo/lixiao_spider_1_15.png'" />
    <div class="config-group">
        <div class="group-item">
            <span class="label">散点颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupLeft.symbolColor }]" @click.stop="groupLeftSymbolColor.show($event)">{{groupLeft.symbolColor}}</span>
            <color-picker ref="groupLeftSymbolColor" v-model:color="groupLeft.symbolColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
        <div class="group-item">
            <span class="label">散点样式</span>
            <a-select class="select-item" v-model:value="groupLeft.symbol" show-search :dropdownMatchSelectWidth="true">
                <a-select-option v-for="(item,index) in symbolRange" :key="index" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
        </div>
    </div>
    <div class="config-group">
        <div class="group-item">
            <span class="label">箱体颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupLeft.boxColor }]" @click.stop="groupLeftBoxColor.show($event)">{{groupLeft.boxColor}}</span>
            <color-picker ref="groupLeftBoxColor" v-model:color="groupLeft.boxColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
        <div class="group-item">
            <span class="label">箱体边线颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupLeft.borderColor }]" @click.stop="groupLeftBorderColor.show($event)">{{groupLeft.borderColor}}</span>
            <color-picker ref="groupLeftBorderColor" v-model:color="groupLeft.borderColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
    </div>

    <div class="divider-line">
        <span>{{dataGroup[1]}}</span>
    </div>
    <span class="label">散点大小</span>
    <a-slider class="slider-item group-right-symbol-size" v-model:value="groupRight.symbolSize" :min="symbolOptions.min" :max="symbolOptions.max" :step="symbolOptions.step" />
    <img class="slider-mark sm-1-15" :src="openCDN+'/xingbo/lixiao_spider_1_15.png'" />
    <div class="config-group">
        <div class="group-item">
            <span class="label">散点颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupRight.symbolColor }]" @click.stop="groupRightSymbolColor.show($event)">{{groupRight.symbolColor}}</span>
            <color-picker ref="groupRightSymbolColor" v-model:color="groupRight.symbolColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
        <div class="group-item">
            <span class="label">散点样式</span>
            <a-select class="select-item" v-model:value="groupRight.symbol" show-search :dropdownMatchSelectWidth="true">
                <a-select-option v-for="(item,index) in symbolRange" :key="index" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
        </div>
    </div>
    <div class="config-group">
        <div class="group-item">
            <span class="label">箱体颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupRight.boxColor }]" @click.stop="groupRightBoxColor.show($event)">{{groupRight.boxColor}}</span>
            <color-picker ref="groupRightBoxColor" v-model:color="groupRight.boxColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
        <div class="group-item">
            <span class="label">箱体边线颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupRight.borderColor }]" @click.stop="groupRightBorderColor.show($event)">{{groupRight.borderColor}}</span>
            <color-picker ref="groupRightBorderColor" v-model:color="groupRight.borderColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
    </div>

    <div class="divider-line">
        <span>图表相关</span>
    </div>
    <span class="label">边框宽度</span>
    <a-slider class="slider-item box-config-border-color" v-model:value="commonConfig.borderWidth" :min="borderOptions.min" :max="borderOptions.max" :step="borderOptions.step" />
    <img class="slider-mark sm-1-10" :src="openCDN+'/xingbo/lixiao_spider_1_10.png'" />
    <span class="label">刻度字体大小</span>
    <a-slider class="slider-item box-config-border-color" v-model:value="commonConfig.xySize" :min="xyOptions.min" :max="xyOptions.max" :step="xyOptions.step" />
    <img class="slider-mark sm-10-24" :src="openCDN+'/xingbo/lixiao_spider_10_24.png'" />
    <span class="label">箱体宽度</span>
    <a-slider class="slider-item" v-model:value="commonConfig.boxplotWidth" :min="boxplotOptions.min" :max="boxplotOptions.max" :step="boxplotOptions.step" />
    <img class="slider-mark sm-10-150" :src="openCDN+'/xingbo/lixiao_spider_10_150.png'" />
    <span class="label">散点抖动范围</span>
    <a-slider class="slider-item" v-model:value="commonConfig.shakeSize" :min="shakeRange.min" :max="shakeRange.max" :step="shakeRange.step" />
    <img class="slider-mark sm-01-09" :src="openCDN+'/xingbo/lixiao_spider_0.1_0.9.png'" />
    <span class="label">边框、刻度颜色</span>
    <span class="color-picker" :style="[{ backgroundColor: commonConfig.borderColor }]" @click.stop="commonConfigBorderColor.show($event)">{{commonConfig.borderColor}}</span>
    <color-picker ref="commonConfigBorderColor" v-model:color="commonConfig.borderColor" :showOpacity="false" :modelSwitch="false"></color-picker>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    isReactive,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    toRaw,
    toRef,
    toRefs,
    watch
} from "vue";
import {
    openCDN
} from "@/common/http";
import ColorPicker from "@/components/cigo-ui/unit/other/color-picker/index.vue";
import {
    TweenMax
} from "gsap";
import {
    selectData
} from './data';

export default defineComponent({
    name: "EchartDemoBoxplotChartCtrl",
    components: {
        ColorPicker,
    },
    setup(props, ctx) {
        const selectDataProxy = reactive(selectData);
        let formDataProxy = reactive({
            sickness: 0,
            gens: 0,
            rna: 0
        });
        const chartOptions = {
            symbolOptions: {
                min: 1,
                max: 15,
                step: 1
            },
            symbolRange: [{
                    value: "circle",
                    label: "圆点"
                },
                {
                    value: "rect",
                    label: "矩形"
                },
                {
                    value: "roundRect",
                    label: "圆角矩形"
                },
                {
                    value: "triangle",
                    label: "三角形"
                },
                {
                    value: "diamond",
                    label: "菱形"
                },
                {
                    value: "arrow",
                    label: "箭头"
                }
            ],
            borderOptions: {
                min: 1,
                max: 10,
                step: 1
            },
            xyOptions: {
                min: 10,
                max: 24,
                step: 1
            },
            boxplotOptions: {
                min: 10,
                max: 150,
                step: 1
            },
            shakeRange: {
                min: 0.1,
                max: 0.9,
                step: 0.1
            }
        };
        let boxplotChartData: any = inject("boxplotChartData");
        let dataGroup: any = toRef(boxplotChartData, "dataGroup");
        let chartConfigs: any = toRef(boxplotChartData, "chartConfigs");
        onBeforeMount(() => {
            dataGroup.value = [
                'Tumor', 'Normal'
            ];
            chartConfigs.value.groupLeft = {
                boxColor: "#625D03",
                borderColor: "#FF40DC",
                symbolColor: "#4340FF",
                symbol: "roundRect",
                symbolSize: 4
            };
            chartConfigs.value.groupRight = {
                boxColor: "#A39B0D",
                borderColor: "#7E0B95",
                symbolColor: "#12F125",
                symbol: "triangle",
                symbolSize: 10
            };
            chartConfigs.value.commonConfig = {
                borderColor: "#666",
                borderWidth: 1,
                boxplotWidth: 70,
                shakeSize: 0.5,
                xySize: 14
            }
        });

        onMounted(() => {
            updateSliderColor("*");
        });
        const updateSliderColor = (flag: string) => {
            //左侧散点
            if (flag == "*" || flag == "groupLeft.symbolColor") {
                TweenMax.to(".group-left-symbol-size .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.groupLeft.symbolColor
                });
                TweenMax.to(".group-left-symbol-size .ant-slider-handle", 0.5, {
                    borderColor: chartConfigs.value.groupLeft.symbolColor
                });
            }
            //右侧散点
            if (flag == "*" || flag == "groupRight.symbolColor") {
                TweenMax.to(".group-right-symbol-size .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.groupRight.symbolColor
                });
                TweenMax.to(
                    ".group-right-symbol-size .ant-slider-handle",
                    0.5, {
                        borderColor: chartConfigs.value.groupRight.symbolColor
                    }
                );
            }

            //边框
            if (flag == "*" || flag == "commonConfig.borderColor") {
                TweenMax.to(".box-config-border-color .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.commonConfig.borderColor
                });
                TweenMax.to(
                    ".box-config-border-color .ant-slider-handle",
                    0.5, {
                        borderColor: chartConfigs.value.commonConfig.borderColor
                    }
                );
            }
        };
        let groupLeftSymbolColor = ref(null);
        let groupLeftBoxColor = ref(null);
        let groupLeftBorderColor = ref(null);
        let groupRightSymbolColor = ref(null);
        let groupRightBoxColor = ref(null);
        let groupRightBorderColor = ref(null);
        let commonConfigBorderColor = ref(null);

        return {
            openCDN,
            dataGroup,
            ...chartOptions,
            ...toRefs(chartConfigs.value),

            groupLeftSymbolColor,
            groupLeftBoxColor,
            groupLeftBorderColor,
            groupRightSymbolColor,
            groupRightBoxColor,
            groupRightBorderColor,
            commonConfigBorderColor,

            ...toRefs(selectDataProxy),
            ...toRefs(formDataProxy),
        };
    }
});
</script>

<style lang="scss">
</style>
