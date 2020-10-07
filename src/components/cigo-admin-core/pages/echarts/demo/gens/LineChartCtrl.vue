<template>
<div class="line-chart-ctrl-content chart-ctrl-content">
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
    <a-slider class="slider-item group-one-symbol-size" v-model:value="groupOne.symbolSize" :min="symbolOptions.min" :max="symbolOptions.max" :step="symbolOptions.step" />
    <img class="slider-mark sm-1-15" :src="openCDN+'/xingbo/lixiao_spider_1_15.png'" />
    <div class="config-group">
        <div class="group-item">
            <span class="label">散点颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupOne.symbolColor }]" @click.stop="groupOneSymbolColor.show($event)">{{groupOne.symbolColor}}</span>
            <color-picker ref="groupOneSymbolColor" v-model:color="groupOne.symbolColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
        <div class="group-item">
            <span class="label">散点样式</span>
            <a-select class="select-item" v-model:value="groupOne.symbol" show-search :dropdownMatchSelectWidth="true">
                <a-select-option v-for="(item,index) in symbolRange" :key="index" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
        </div>
    </div>

    <div class="divider-line">
        <span>{{dataGroup[1]}}</span>
    </div>
    <span class="label">散点大小</span>
    <a-slider class="slider-item group-two-symbol-size" v-model:value="groupTwo.symbolSize" :min="symbolOptions.min" :max="symbolOptions.max" :step="symbolOptions.step" />
    <img class="slider-mark sm-1-15" :src="openCDN+'/xingbo/lixiao_spider_1_15.png'" />
    <div class="config-group">
        <div class="group-item">
            <span class="label">散点颜色</span>
            <span class="color-picker" :style="[{ backgroundColor: groupTwo.symbolColor }]" @click.stop="groupTwoSymbolColor.show($event)">{{groupTwo.symbolColor}}</span>
            <color-picker ref="groupTwoSymbolColor" v-model:color="groupTwo.symbolColor" :showOpacity="false" :modelSwitch="false"></color-picker>
        </div>
        <div class="group-item">
            <span class="label">散点样式</span>
            <a-select class="select-item" v-model:value="groupTwo.symbol" show-search :dropdownMatchSelectWidth="true">
                <a-select-option v-for="(item,index) in symbolRange" :key="index" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
        </div>
    </div>

    <div class="divider-line">
        <span>回归线</span>
    </div>
    <span class="label">回归线宽度</span>
    <a-slider class="slider-item line-color" v-model:value="commonConfig.lineWidth" :min="borderOptions.min" :max="borderOptions.max" :step="borderOptions.step" />
    <img class="slider-mark sm-1-10" :src="openCDN+'/xingbo/lixiao_spider_1_10.png'" />
    <span class="label">回归线颜色</span>
    <span class="color-picker" :style="[{ backgroundColor: commonConfig.lineColor}]" @click.stop="commonConfigLineColor.show($event)">{{commonConfig.lineColor}}</span>
    <color-picker ref="commonConfigLineColor" v-model:color="commonConfig.lineColor" :showOpacity="false" :modelSwitch="false"></color-picker>

    <div class="divider-line">
        <span>图表相关</span>
    </div>
    <span class="label">边框宽度</span>
    <a-slider class="slider-item line-chart-config-border-color" v-model:value="commonConfig.borderWidth" :min="borderOptions.min" :max="borderOptions.max" :step="borderOptions.step" />
    <img class="slider-mark sm-1-10" :src="openCDN+'/xingbo/lixiao_spider_1_10.png'" />
    <span class="label">刻度字体大小</span>
    <a-slider class="slider-item line-chart-config-border-color" v-model:value="commonConfig.xySize" :min="xyOptions.min" :max="xyOptions.max" :step="xyOptions.step" />
    <img class="slider-mark sm-10-24" :src="openCDN+'/xingbo/lixiao_spider_10_24.png'" />
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
    name: 'EchartDemoLineChartCtrl',
    components: {
        ColorPicker
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
        };
        let lineChartData: any = inject("lineChartData");
        let dataGroup: any = toRef(lineChartData, "dataGroup");
        let chartConfigs: any = toRef(lineChartData, "chartConfigs");
        onBeforeMount(() => {
            dataGroup.value = [
                'Tumor', 'Normal'
            ];
            chartConfigs.value.groupOne = {
                symbolColor: "#A39B0D",
                symbol: "circle",
                symbolSize: 5
            };
            chartConfigs.value.groupTwo = {
                symbolColor: "#4340FF",
                symbol: "triangle",
                symbolSize: 5
            };
            chartConfigs.value.commonConfig = {
                borderColor: "#666",
                borderWidth: 1,
                xySize: 14,
                lineColor: "#FF40DC",
                lineWidth: 1,
            }
        });

        onMounted(() => {
            updateSliderColor("*");
        });
        const updateSliderColor = (flag: string) => {
            //第一组散点
            if (flag == "*" || flag == "groupOne.symbolColor") {
                TweenMax.to(".group-one-symbol-size .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.groupOne.symbolColor
                });
                TweenMax.to(".group-one-symbol-size .ant-slider-handle", 0.5, {
                    borderColor: chartConfigs.value.groupOne.symbolColor
                });
            }
            //第二组散点
            if (flag == "*" || flag == "groupTwo.symbolColor") {
                TweenMax.to(".group-two-symbol-size .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.groupTwo.symbolColor
                });
                TweenMax.to(".group-two-symbol-size .ant-slider-handle", 0.5, {
                    borderColor: chartConfigs.value.groupTwo.symbolColor
                });
            }
            //回归线
            if (flag == "*" || flag == "commonConfig.lineColor") {
                TweenMax.to(".line-color .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.commonConfig.lineColor
                });
                TweenMax.to(
                    ".line-color .ant-slider-handle",
                    0.5, {
                        borderColor: chartConfigs.value.commonConfig.lineColor
                    }
                );
            }
            //边框
            if (flag == "*" || flag == "commonConfig.borderColor") {
                TweenMax.to(".line-chart-config-border-color .ant-slider-track", 0.5, {
                    backgroundColor: chartConfigs.value.commonConfig.borderColor
                });
                TweenMax.to(
                    ".line-chart-config-border-color .ant-slider-handle",
                    0.5, {
                        borderColor: chartConfigs.value.commonConfig.borderColor
                    }
                );
            }
        };

        let groupOneSymbolColor = ref(null);
        let groupTwoSymbolColor = ref(null);
        let commonConfigLineColor = ref(null);
        let commonConfigBorderColor = ref(null);

        return {
            openCDN,
            dataGroup,
            ...chartOptions,
            ...toRefs(chartConfigs.value),

            groupOneSymbolColor,
            groupTwoSymbolColor,
            commonConfigLineColor,
            commonConfigBorderColor,

            ...toRefs(selectDataProxy),
            ...toRefs(formDataProxy),
        };
    }
})
</script>

<style lang="scss">
</style>
