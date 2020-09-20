<template>
<div :id="'pop-win-'+layerIndex" class="cigo-pop-window" @mousemove="mouseMoving" @mouseUp="stopDrag">
    <cigo-mask :id="'pop-window-mask-'+layerIndex" class="cigo-layer-mask" @clickMask="clickMask"></cigo-mask>
    <div :id="'pop-window-content-'+layerIndex" class="cigo-pop-window-content" :class="[dragging ? 'grabbing': '']" :style="{'--left': targetPos.targetX, '--top': targetPos.targetY}" @mouseDown="startDrag">
        <component v-if="windowSize !== 'min'" :is="componentRaw" :layerData="layerData" @notify="notify" @close="delayClose" />
        <div class="pop-window-bar" :class="[windowSize=='min' ? 'min' : '']">
            <cigo-icon-font v-if="windowSize !== 'min'" class="pop-window-bar-icon" @click.stop="windowSize = 'min'" :name="'cigoadmin-icon-window-min'"></cigo-icon-font>
            <cigo-icon-font v-if="windowSize !== 'common'" class="pop-window-bar-icon" @click.stop="windowSize = 'common'" :name="'cigoadmin-icon-window-common'"></cigo-icon-font>
            <cigo-icon-font v-if="windowSize !== 'max'" class="pop-window-bar-icon" @click.stop="windowSize = 'max'" :name="'cigoadmin-icon-window-max'"></cigo-icon-font>
            <cigo-icon-font class="pop-window-bar-icon" @click.stop="delayClose" :name="'cigoadmin-icon-window-close'"></cigo-icon-font>
        </div>
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
    toRefs,
    watch
} from "vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
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
        CigoMask,
        CigoIconFont
    },
    setup(props) {
        let componentRaw = computed(() => {
            return markRaw(props.component);
        });
        onMounted(() => {
            winResize();
        });

        let windowSize = ref('common');
        watch(windowSize, () => {
            moveX.value = 0;
            moveY.value = 0;
            dragedX = 0;
            dragedY = 0;
            winResize();
        });
        let showOptions = computed(() => {
            let maskOpacity = 0.6;
            let contentOpacity = 1;
            let contentWidth = props.width;
            let contentHeight = props.height;
            switch (windowSize.value) {
                case 'max':
                    contentWidth = '100%';
                    contentHeight = '100%';
                    break;
                case 'min':
                    maskOpacity = 0;
                    contentOpacity = 1;
                    contentWidth = '0px';
                    contentHeight = '0px';
                    break;
                case 'common':
                default:
                    break;
            }
            return {
                mask: {
                    opacity: maskOpacity
                },
                content: {
                    opacity: contentOpacity,
                    width: contentWidth,
                    height: contentHeight
                }
            };
        });
        const winResize = () => {
            TweenMax.to("#pop-window-mask-" + props.layerIndex, 0.5, showOptions.value.mask);
            TweenMax.to("#pop-window-content-" + props.layerIndex, 0.5, showOptions.value.content);
        };

        const delayClose = () => {
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
            props.maskClose && delayClose(); //Tips_Flag &&创新用法
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
            windowSize,
            clickMask,
            delayClose,
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

        .pop-window-bar {
            position: absolute;
            top: 0px;
            right: 0px;
            display: flex;
            flex-direction: row;
            padding-right: 5px;

            .pop-window-bar-icon {
                width: 25px;
                height: 33px;
                padding: 9px 5px;
                color: #666;
                cursor: pointer;
            }
        }

        .pop-window-bar.min {
            background-color: #f0f0f0;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding-left: 5px;
        }
    }

    .cigo-pop-window-content.grabbing {
        cursor: grabbing;
        cursor: -webkit-grabbing;
        cursor: -moz-grabbing;
    }
}
</style>
