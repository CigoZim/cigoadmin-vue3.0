<template>
<div class="cigo-color-picker-element">
    <div class="top-area">
        <div class="top-left-area">
            <div class="panel" :style="{'--panelColor': rgbHexPanel}">
                <div class="panel-white"></div>
                <div class="panel-black"></div>
                <div class="panel-cursor" @click.stop="changeSV">
                    <div class="pointer" ref="pointerRef"></div>
                </div>
            </div>
            <cigo-slider v-if="layerData.showOpacity" class="opacity-bar" v-model:value="opacity" :min="0.0" :max="1.0" :step="0.01" :barWidth="15" :barLength="280" :sliderStyle="opacitySliderStyle" :blockStyle="opacityBlockStyle" :showTrack="false"></cigo-slider>
        </div>
        <div class="top-right-area">
            <cigo-slider class="color-bar" v-model:value="hue" :vertical="true" :min="0" :max="360" :step="1" :barWidth="15" :barLength="180" :sliderStyle="colorSliderStyle" :blockStyle="colorBlockStyle" :showTrack="false"></cigo-slider>
        </div>
    </div>
    <div class="bottom-area">
        <input class="value-input" :value="showVal" />
        <!-- //TODO 为何不能使用v-model -->
        <a-checkbox v-if="layerData.modelSwitch" v-model:checked="hexFlag">Hex</a-checkbox>
        <div class="btns">
            <div class="btn clear-btn" @click.stop="cancel">取消</div>
            <div class="btn confirm-btn" @click.stop="confirm">确定</div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    reactive,
    ref,
    toRef,
    toRefs,
    watch
} from "vue";
import CigoSlider from "@/components/cigo-ui/unit/form/cigo-slider.vue";
import {
    revertHsvToRGBA,
    toRgbaFunc,
    toRgbaHex,
    toRgbFunc,
    toRgbHex
} from "./utils";

export default defineComponent({
    name: "CigoColorPicker",
    components: {
        CigoSlider
    },
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let showVal = computed(() => {
            if (hexFlag.value) {
                return props.layerData.showOpacity ?
                    rgbaHex.value :
                    rgbHex.value;
            } else {
                return props.layerData.showOpacity ?
                    rgbaFunc.value :
                    rgbFunc.value;
            }
        });

        let hue = ref(-1);
        let saturation = ref(-0.1);
        let value = ref(-0.1);
        let opacity = ref(1.0);
        let rgbaPanelProxy = reactive({
            r: 0,
            g: 0,
            b: 0,
            a: 0
        });
        let rgbHexPanel = ref("");
        watch(rgbaPanelProxy, newVal => {
            rgbHexPanel.value = toRgbHex(rgbaPanelProxy);
        });
        let rgbaProxy = reactive({
            r: 0,
            g: 0,
            b: 0,
            a: 0
        });
        let rgbHex = ref("");
        let rgbaHex = ref("");
        let rgbFunc = ref("");
        let rgbaFunc = ref("");
        let hexFlag = ref(true);
        watch(rgbaProxy, newVal => {
            rgbHex.value = toRgbHex(rgbaProxy);
            rgbaHex.value = toRgbaHex(rgbaProxy);
            rgbFunc.value = toRgbFunc(rgbaProxy);
            rgbaFunc.value = toRgbaFunc(rgbaProxy);
        });

        let opacitySliderStyle = computed(() => {
            return {
                background: "linear-gradient(to right, " +
                    "rgba(0,0,0,0)" +
                    " 0%, " +
                    rgbFunc.value +
                    " 100%)"
            };
        });
        let opacityBlockStyle = reactive({
            width: "8px",
            height: "25px",
            borderRadius: "2px",
            backgroundColor: "#fff",
            border: "1px solid #e3e3e3",
            boxShadow: "1px 2px 5px #ccc"
        });
        let colorSliderStyle = reactive({});
        let colorBlockStyle = reactive({
            width: "25px",
            height: "8px",
            borderRadius: "2px",
            backgroundColor: "#fff",
            border: "1px solid #e3e3e3",
            boxShadow: "2px 1px 5px #ccc"
        });
        let pointerTmp: any = null;
        let pointerRef = ref(pointerTmp);
        const changeSV = (event: any) => {
            saturation.value =
                Math.round(
                    (Math.min(Math.abs(event.layerX), 280) / 280) * 100
                ) / 100;
            value.value =
                Math.round(
                    (Math.min(Math.abs(event.layerY - 180), 180) / 180) * 100
                ) / 100;
        };

        onMounted(() => {
            saturation.value = 1.0;
            value.value = 1.0;
        });

        watch(hue, newHue => {
            revertHsvToRGBA(rgbaPanelProxy, newHue, 1, 1);
        });
        watch(saturation, (newVal) => {
            let xPx = 280 * newVal - 3;
            xPx = Math.min(xPx, 277);
            xPx = Math.max(xPx, -3);
            pointerRef.value.style.left = xPx + "px";
        });
        watch(value, (newVal) => {
            let yPx = 180 * (1 - newVal) - 3;
            yPx = Math.min(yPx, 177);
            yPx = Math.max(yPx, -3);
            pointerRef.value.style.top = yPx + "px";
        });
        watch(
            [hue, saturation, value],
            (
                [newHue, newSaturation, newValue],
                [oldHue, oldSaturation, oldValue]
            ) => {
                //Tips_Flag Vue3.0 watch多个ref对象
                revertHsvToRGBA(rgbaProxy, newHue, newSaturation, newValue);
            }
        );
        watch(opacity, newOpacity => {
            rgbaProxy.a = Math.round(newOpacity * 100) / 100;
        });

        const confirm = () => {
            console.log('5555', showVal.value);

            ctx.emit('notify', 'change', showVal.value);
            ctx.emit('close');
        };
        const cancel = () => {
            ctx.emit('close');
        };

        return {
            showVal,
            hue,
            opacity,
            rgbHexPanel,
            hexFlag,
            changeSV,
            pointerRef,

            opacitySliderStyle,
            opacityBlockStyle,
            colorSliderStyle,
            colorBlockStyle,

            confirm,
            cancel
        };
    }
});
</script>

<style lang="scss">
$left-panel-width: 280px;
$left-panel-height: 180px;
$bar-width: 15px;

.cigo-color-picker-element {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 10px;
    overflow: hidden;
    cursor: default;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    box-shadow: 1px 2px 5px #ccc;

    .top-area {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .top-left-area {
            display: flex;
            flex-direction: column;

            .panel {
                width: $left-panel-width;
                height: $left-panel-height;
                margin-bottom: 10px;
                background-color: var(--panelColor);
                position: relative;
                cursor: pointer;

                .panel-cursor,
                .panel-white,
                .panel-black {
                    width: $left-panel-width;
                    height: $left-panel-height;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                }

                .panel-white {
                    background: linear-gradient(90deg,
                            #fff,
                            hsla(0, 0%, 100%, 0));
                }

                .panel-black {
                    background: linear-gradient(0deg, #000, transparent);
                }

                .panel-cursor {
                    position: relative;

                    .pointer {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        border: 1px solid #fff;
                        background-color: #666;
                        position: absolute;
                    }
                }
            }

            .opacity-bar {
                width: $left-panel-width;
                height: $bar-width;
                margin-bottom: 10px;
                background: url("https://cdn-open.cigoadmin.com/icon/opacity.png");
            }
        }

        .top-right-area {
            display: flex;

            .color-bar {
                width: $bar-width;
                height: $left-panel-height;
                background: linear-gradient(0deg,
                        red 0,
                        #ff0 17%,
                        #0f0 33%,
                        #0ff 50%,
                        #00f 67%,
                        #f0f 83%,
                        red);
            }
        }
    }

    .bottom-area {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .value-input {
            width: 140px;
            line-height: 30px;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            font-size: 10px;
            color: #666;
            margin-right: 5px;
            text-align: center;
        }

        .btns {
            display: flex;
            flex-direction: row;

            .btn {
                cursor: pointer;
                padding: 3px 8px;
                font-size: 14px;
            }

            .clear-btn {
                color: #4b76e1;
            }

            .confirm-btn {
                border-radius: 5px;
                border: 1px solid #dcdfe6;
                color: #666;
            }

            .confirm-btn:hover {
                color: #fff;
                background-color: #4b76e1;
            }
        }
    }
}
</style>
