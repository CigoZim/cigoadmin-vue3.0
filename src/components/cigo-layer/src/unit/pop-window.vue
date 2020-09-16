<template>
<div :id="'pop-win-'+layerIndex" class="cigo-pop-window">
    <cigo-mask :id="'pop-window-mask-'+layerIndex" class="cigo-layer-mask" @clickMask="clickMask"></cigo-mask>
    <div :id="'pop-window-content-'+layerIndex" class="cigo-pop-window-content">
        <component :is="componentRaw" :data="data" @notify="notify" @close="delayHide" />
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
    computed
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
        data: {
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

        return {
            componentRaw,
            clickMask,
            delayHide
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
        border-radius: 8px;
        background-color: #fff;
    }
}
</style>
