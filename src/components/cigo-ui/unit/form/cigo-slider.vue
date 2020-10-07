<template>
<div class="cigo-slider">
    <div class="slider" :style="[sliderStyle, {'--width': width, '--height': height}]">
        <div v-if="showTrack" class="track" :style="[trackStyle, {'--trackWidth': trackWidth, '--trackHeight': trackHeight}]"></div>
    </div>
    <div class="block" :class="{'grabbing': grabbing}" :style="[blockStyle, posPxStyle]" @mousedown.stop="onGrabStart" @touchstart.stop="onGrabStart"></div>
</div>
</template>

<script lang="ts">
import {
    prev
} from "locutus/php/array";
import {
    debounce
} from "lodash";
import {
    computed,
    defineComponent,
    onMounted,
    ref,
    watch
} from "vue";
export default defineComponent({
    name: "CigoSlider",
    props: {
        vertical: {
            type: Boolean,
            default: false
        },
        barLength: {
            type: Number,
            default: 200
        },
        barWidth: {
            type: Number,
            default: 10
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 30
        },
        disabled: {
            type: Boolean,
            default: false
        },
        sliderStyle: {
            type: Object,
            default: {
                backgroundColor: "#e5e5e5",
                borderRadius: "5px"
            }
        },
        showTrack: {
            type: Boolean,
            default: true
        },
        trackStyle: {
            type: Object,
            default: {
                backgroundColor: "#4b76e1",
                borderRadius: "5px"
            }
        },
        blockStyle: {
            type: Object,
            default: {
                border: "3px solid #4b76e1aa",
                backgroundColor: "#fff",
                width: "20px",
                height: "20px",
                borderRadius: "50%"
            }
        }
    },
    setup(props, ctx) {
        let width = computed(() => {
            let w = props.vertical ? props.barWidth : props.barLength;
            return w + "px";
        });
        let height = computed(() => {
            let h = props.vertical ? props.barLength : props.barWidth;
            return h + "px";
        });
        let trackWidth = computed(() => {
            let w = props.vertical ? props.barWidth : (currPosPx.value + props.barLength / 2);
            return w + "px";
        });
        let trackHeight = computed(() => {
            let h = props.vertical ? (currPosPx.value + props.barLength / 2) : props.barWidth;
            return h + "px";
        });
        let perStepPx = computed(() => {
            let count = Math.ceil((props.max - props.min) / props.step);
            return Math.round(props.barLength / count);
        });
        let currValue = ref(0);
        let currPosPx = ref(0);
        let posPxStyle = computed(() => {
            return props.vertical ? {
                marginBottom: currPosPx.value * 2 + "px"
            } : {
                marginLeft: currPosPx.value * 2 + "px"
            };
        });
        watch(currPosPx, (newVal: number) => {
            let pos = newVal + props.barLength / 2;
            let count = pos / perStepPx.value;
            currValue.value = count * props.step + props.min;

            ctx.emit("update:value", currValue.value); //Tips_Flag Vue3.0区别Vue2.0中v-model的用法
        });

        onMounted(() => {
            initData();
        });
        const initData = () => {
            currValue.value = props.value;

            let val = 0;
            if (props.value < props.min) {
                val = props.min;
            } else if (props.value > props.max) {
                val = props.max;
            } else {
                val = props.value;
            }
            let count = Math.floor((val - props.min) / props.step);
            let pos = Math.round(count * perStepPx.value);
            let newPosPx = pos - props.barLength / 2;
            if (Math.abs(newPosPx) > props.barLength / 2) {
                currPosPx.value = (newPosPx < 0 ? -1 : 1) * props.barLength / 2;
                return;
            }
            currPosPx.value = newPosPx;
        };

        let grabbing = ref(false);
        let startX = 0;
        let startY = 0;
        let lastPosPx = 0;
        const onGrabStart = (event: any) => {
            if (props.disabled) return;

            startX = event.pageX;
            startY = event.pageY;
            lastPosPx = currPosPx.value;

            window.addEventListener("mousemove", mouseMoving);
            window.addEventListener("touchmove", mouseMoving);
            window.addEventListener("mouseup", stopGrab);
            window.addEventListener("touchend", stopGrab);
            window.addEventListener("contextmenu", stopGrab);
        };
        const mouseMoving = (event: any) => {
            grabbing.value = true;
            let currMovePx = props.vertical ?
                startY - event.pageY :
                event.pageX - startX;
            //TODO 如何过半则跳格，稍微回退则回格，对比其他UI框架
            if (currMovePx % perStepPx.value == 0) {
                let newPosPx = currMovePx + lastPosPx;
                if (Math.abs(newPosPx) > props.barLength / 2) {
                    currPosPx.value = (newPosPx < 0 ? -1 : 1) * props.barLength / 2;
                    return;
                }
                currPosPx.value = newPosPx;
            }
        };
        const stopGrab = () => {
            grabbing.value = false;

            window.removeEventListener("mousemove", mouseMoving);
            window.removeEventListener("touchmove", mouseMoving);
            window.removeEventListener("mouseup", stopGrab);
            window.removeEventListener("touchend", stopGrab);
            window.removeEventListener("contextmenu", stopGrab);

            ctx.emit("change", currValue.value);
        };

        return {
            width,
            height,
            trackWidth,
            trackHeight,

            grabbing,
            onGrabStart,

            posPxStyle
        };
    }
});
</script>

<style lang="scss">
.cigo-slider {
    width: auto;
    height: auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .slider {
        width: var(--width);
        height: var(--height);
        cursor: pointer;
        position: relative;

        .track {
            width: var(--trackWidth);
            height: var(--trackHeight);
            position: absolute;
            left: 0px;
            bottom: 0px;
        }
    }

    .block {
        position: absolute;
        cursor: grab;
    }

    .block.grabbing {
        cursor: grabbing;
    }

    //TODO 改为TS代码动画
    .block:hover,
    .block.grabbing {
        border-color: #4b76e1 !important;
    }
}
</style>
