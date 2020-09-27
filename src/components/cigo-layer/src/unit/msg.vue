<template>
<div :id="'layer-msg-'+layerIndex" class="cigo-layer-msg">
    <div :id="'layer-msg-content-'+layerIndex" class="cigo-layer-msg-content">
        <span>{{msg}}</span>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onMounted
} from "vue";
import cigoLayer from "@/components/cigo-layer/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "CigoLayerMsg",
    props: {
        layerIndex: {
            type: Number,
            default: ""
        },
        msg: {
            type: String,
            default: ""
        },
        timeout: {
            type: Number,
            default: 1
        }
    },
    setup(props) {
        onMounted(() => {
            delayShow();
        });

        const delayShow = () => {
            TweenMax.to("#layer-msg-content-" + props.layerIndex, 0.5, {
                opacity: 1,
                onComplete: () => {
                    delayHide();
                }
            });
        };

        const delayHide = () => {
            TweenMax.to("#layer-msg-content-" + props.layerIndex, 0.5, {
                opacity: 0,
                delay: props.timeout,
                onComplete: () => {
                    cigoLayer.close(props.layerIndex);
                }
            });
        };
        const clickMask = () => {
            delayHide();
        };

        return {};
    }
});
</script>

<style lang="scss">
.cigo-layer-msg {
    z-index: 10000;
    position: fixed;
    top: 40%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    .cigo-layer-msg-content {
        border-radius: 8px;
        background-color: #555;
        padding: 8px 10px;
        opacity: 0.8;

        span {
            color: #fff;
            // white-space: nowrap;
        }
    }
}
</style>
