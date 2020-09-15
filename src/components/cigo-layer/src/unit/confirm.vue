<template>
<div :id="'cigo-confirm-'+layerIndex" class="cigo-confirm">
    <cigo-mask :id="'confirm-mask-'+layerIndex" class="cigo-layer-mask" @clickMask="clickMask"></cigo-mask>
    <div :id="'confirm-content-'+layerIndex" class="cigo-confirm-content">
        <div class="title-area">
            <span>{{title}}</span>
        </div>
        <div class="content-area">
            <span>{{msg}}</span>
        </div>
        <div class="btn-area">
            <a-button type="primary" size="small" @click.stop="delayHide">确 定</a-button>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onMounted,
    reactive
} from "vue";
import CigoMask from "./mask.vue";
import cigoLayer from "@/components/cigo-layer/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "CigoConfirm",
    props: {
        layerIndex: {
            type: Number,
            default: ""
        },
        width: {
            type: String,
            default: "300px"
        },
        height: {
            type: String,
            default: "170px"
        },
        title: {
            type: String,
            default: "提 示"
        },
        msg: {
            type: String,
            default: ""
        }
    },
    components: {
        CigoMask
    },
    setup(props) {
        onMounted(() => {
            delayShow();
        });

        const delayShow = () => {
            TweenMax.to("#confirm-mask-" + props.layerIndex, 0.5, {
                opacity: 0.6
            });
            TweenMax.to("#confirm-content-" + props.layerIndex, 0.5, {
                opacity: 1,
                width: props.width,
                height: props.height
            });
        };

        const delayHide = () => {
            TweenMax.to("#confirm-mask-" + props.layerIndex, 0.5, {
                opacity: 0
            });
            TweenMax.to("#confirm-content-" + props.layerIndex, 0.5, {
                opacity: 0,
                width: "0px",
                height: "0px",
                onComplete: () => {
                    cigoLayer.close(props.layerIndex);
                }
            });
        };
        const clickMask = () => {
            delayHide();
        };

        return {
            clickMask,
            delayHide
        };
    }
});
</script>

<style lang="scss">
.cigo-confirm {
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

    .cigo-confirm-content {
        position: relative;
        width: 0px;
        height: 0px;
        opacity: 0;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background-color: #fff;
        padding: 8px 0px;
        overflow: hidden;

        .title-area {
            border-bottom: 1px solid #f0f0f0;
            padding: 8px 12px;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }

        .content-area {
            padding: 20px 12px;
            font-size: 13px;
            color: #666;
            text-align: center;
        }

        .btn-area {
            display: flex;
            flex-direction: row;
            justify-content: center;
            padding: 15px 12px;
            border-top: 1px solid #f0f0f0;
        }
    }
}
</style>
