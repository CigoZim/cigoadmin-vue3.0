<template>
<div :id="'pop-win-'+layerIndex" class="cigo-pop-window" @mousemove="mouseMoving" @mouseUp="stopDrag">
    <cigo-mask :id="'pop-window-mask-'+layerIndex" class="cigo-layer-mask" @clickMask="clickMask"></cigo-mask>
    <div :id="'pop-window-content-'+layerIndex" class="cigo-pop-window-content" :class="[dragging ? 'grabbing': '']" :style="{'--left': targetPos.targetX, '--top': targetPos.targetY}" @mouseDown="startDrag">
        <component :is="componentRaw" :layerData="layerData" @notify="notify" @close="delayHide" />
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onMounted,
    reactive,
    markRaw,
    computed,
    toRefs
} from "vue";
import CigoMask from "./mask.vue";
import cigoLayer from "@/components/cigo-layer/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "CigoPopWindow",
    props: {
        layerIndex: {
            type: Number,
            default: ""
        },
        component: {
            type: Object,
            default: {}
        },
        width: {
            type: String,
            default: "500px"
        },
        height: {
            type: String,
            default: "400px"
        },
        maskClose: {
            type: Boolean,
            default: true
        },
        layerData: {
            type: Object,
            default: {}
        },
        notify: {
            type: Function,
            default: () => {}
        }
    },
    components: {
        CigoMask
    },
    setup(props) {
        let componentRaw = computed(() => {
            return markRaw(props.component);
        });
        onMounted(() => {
            delayShow();
        });

        const delayShow = () => {
            TweenMax.to("#pop-window-mask-" + props.layerIndex, 0.5, {
                opacity: 0.6
            });
            TweenMax.to("#pop-window-content-" + props.layerIndex, 0.5, {
                opacity: 1,
                width: props.width,
                height: props.height
            });
        };

        const delayHide = () => {
            TweenMax.to("#pop-window-mask-" + props.layerIndex, 0.5, {
                opacity: 0
            });
            TweenMax.to("#pop-window-content-" + props.layerIndex, 0.5, {
                opacity: 0,
                width: "0px",
                height: "0px",
                onComplete: () => {
                    cigoLayer.close(props.layerIndex);
                }
            });
        };
        const clickMask = () => {
            props.maskClose && delayHide(); //Tips_Flag &&创新用法
        };

        let moveX = ref(0);
        let moveY = ref(0);
        let dragedX = 0;
        let dragedY = 0;
        let dragging = ref(false);
        let startX = 0;
        let startY = 0;
        const startDrag = (e: any) => {
            dragging.value = true;
            startX = e.pageX;
            startY = e.pageY;
            dragedX = moveX.value;
            dragedY = moveY.value;
        };
        const stopDrag = () => {
            dragging.value = false;
        };
        const mouseMoving = (e: any) => {
            if (dragging.value) {
                moveX.value = e.pageX - startX + dragedX;
                moveY.value = e.pageY - startY + dragedY;
            }
        };
        let targetPos = computed(() => {
            return {
                targetX: Math.round(moveX.value) + 'px',
                targetY: Math.round(moveY.value) + 'px',
            }
        });

        return {
            componentRaw,
            clickMask,
            delayHide,
            targetPos,
            startDrag,
            dragging,
            stopDrag,
            mouseMoving
        };
    }
});
</script>

<style lang="scss">
.cigo-pop-window {
    width: 100vw;
    height: 100vh;
    opacity: 1;
    z-index: 10000;
    position: fixed;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .cigo-pop-window-content {
        position: relative;
        width: 0px;
        height: 0px;
        opacity: 0;
        display: flex;
        left: var(--left);
        top: var(--top);
        border-radius: 8px;
        background-color: #fff;
        cursor: grab;
        cursor: -webkit-grab;
        cursor: -moz-grab;
    }

    .cigo-pop-window-content.grabbing {
        cursor: grabbing;
        cursor: -webkit-grabbing;
        cursor: -moz-grabbing;
    }
}
</style>
