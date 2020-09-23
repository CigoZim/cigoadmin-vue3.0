<template>
<div :id="'pop-win-'+layerIndex" class="cigo-pop-window" :class="[windowSizeRef=='min' ? 'min' : '', dragging ? 'dragging' : '']" @mousemove="mouseMoving" @mouseUp="stopDrag">
    <cigo-mask :id="'pop-window-mask-'+layerIndex" class="cigo-layer-mask" @clickMask="clickMask"></cigo-mask>
    <div :id="'pop-window-content-'+layerIndex" class="cigo-pop-window-content" :class="[dragging ? 'grabbing': '']" :style="{'--backgroundColor': backgroundColor,'--left': targetPos.targetX, '--top': targetPos.targetY}" @mouseDown="startDrag">
        <component v-if="windowSizeRef !== 'min'" :is="componentRaw" :layerData="layerData" @notify="notify" @close="notifyClose" />
        <div v-if="showCtrlBar" class="pop-window-bar">
            <cigo-icon-font v-if="windowSizeRef !== 'min'" class="pop-window-bar-icon" @click.stop="changeWinSie('min')" :name="'cigoadmin-icon-window-min'"></cigo-icon-font>
            <cigo-icon-font v-if="windowSizeRef !== 'common'" class="pop-window-bar-icon" @click.stop="changeWinSie('common')" :name="'cigoadmin-icon-window-common'"></cigo-icon-font>
            <cigo-icon-font v-if="windowSizeRef !== 'max'" class="pop-window-bar-icon" @click.stop="changeWinSie('max')" :name="'cigoadmin-icon-window-max'"></cigo-icon-font>
            <cigo-icon-font class="pop-window-bar-icon" @click.stop="clickClose" :name="'cigoadmin-icon-window-close'"></cigo-icon-font>
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
        windowSize: {
            type: String,
            default: "common"
        },
        showCtrlBar: {
            type: Boolean,
            default: true
        },
        canDragFlag: {
            type: Boolean,
            default: true
        },
        backgroundColor: {
            type: String,
            default: '#fff'
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
        let windowSizeRef = ref(props.windowSize);
        const changeWinSie = (size: string) => {
            if (dragFlag == 0) {
                windowSizeRef.value = size;
            }
        };
        watch(windowSizeRef, () => {
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
            switch (windowSizeRef.value) {
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

        const notifyClose = () => {
            delayClose();
        };
        const clickClose = () => {
            if (dragFlag != 0) {
                return;
            }
            delayClose();
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

        let dragFlag = 0;
        let moveX = ref(0);
        let moveY = ref(0);
        let dragedX = 0;
        let dragedY = 0;
        let dragStarted = false;
        let dragging = ref(false);
        let startX = 0;
        let startY = 0;
        const startDrag = (e: any) => {
            if (!props.canDragFlag) {
                return;
            }
            dragFlag = 0;
            dragStarted = true;
            startX = e.pageX;
            startY = e.pageY;
            dragedX = moveX.value;
            dragedY = moveY.value;
        };
        const mouseMoving = (e: any) => {
            if (!props.canDragFlag) {
                return;
            }
            if (!dragStarted) {
                return;
            }
            let xMoveCurr = e.pageX - startX;
            let yMoveCurr = e.pageY - startY;

            // 开启移动
            if (Math.abs(xMoveCurr) > 4 || Math.abs(yMoveCurr) > 4) {
                dragging.value = true;
            }
            if (dragging.value) {
                moveX.value = xMoveCurr + dragedX;
                moveY.value = yMoveCurr + dragedY;
            }
        };
        let targetPos = computed(() => {
            return {
                targetX: Math.round(moveX.value) + 'px',
                targetY: Math.round(moveY.value) + 'px',
            }
        });
        const stopDrag = () => {
            if (!props.canDragFlag) {
                return;
            }
            if (dragging.value) {
                dragFlag = 1;
            }
            dragStarted = false;
            dragging.value = false;
        };

        return {
            componentRaw,
            changeWinSie,
            windowSizeRef,
            clickMask,
            notifyClose,
            clickClose,
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
        background-color: var(--backgroundColor);
        left: var(--left);
        top: var(--top);
        border-radius: 8px;
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

    }

    .cigo-pop-window-content.grabbing {
        cursor: grabbing;
        cursor: -webkit-grabbing;
        cursor: -moz-grabbing;
    }
}

.cigo-pop-window.min {
    pointer-events: none;

    .cigo-layer-mask {
        display: none;
    }

    .pop-window-bar {
        background-color: #f0f0f0;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        padding-left: 5px;
        pointer-events: auto;
    }
}

.cigo-pop-window.min.dragging {
    pointer-events: auto;

    .cigo-pop-window-content>.pop-window-bar>.pop-window-bar-icon {
        cursor: grabbing;
        cursor: -webkit-grabbing;
        cursor: -moz-grabbing;
    }
}
</style>
