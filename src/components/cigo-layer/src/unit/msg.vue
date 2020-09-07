<template>
<div class="cigo-layer-msg" :class="[showFlag]">
    <div class="cigo-layer-msg-content">
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

import CigoMask from "./mask.vue";

import cigoLayer from "@/components/cigo-layer/index";

export default defineComponent({
    name: "CigoLayerMsg",
    props: {
        msg: {
            type: String,
            default: ""
        },
        layerIndex: {
            type: Number,
            default: ""
        }
    },
    components: {
        CigoMask
    },
    setup(props) {
        let showFlag = ref("");

        onMounted(() => {
            delayShow();
        });

        const delayShow = () => {
            setTimeout(() => {
                showFlag.value = "show";
                delayHide();
            }, 50);
        };

        const delayHide = () => {
            setTimeout(() => {
                showFlag.value = "hide";

                cigoLayer.close(props.layerIndex);
            }, 2000);
        };

        return {
            showFlag
        };
    }
});
</script>

<style lang="scss">
.cigo-layer-msg {
    z-index: 10000;
    position: absolute;
    top: -10%;
    left: 45%;
    display: flex;
    -moz-transition: all 0.6s ease-in-out;
    -webkit-transition: all 0.6s ease-in-out;
    -o-transition: all 0.6s ease-in-out;
    -ms-transition: all 0.6s ease-in-out;
    transition: all 0.6s ease-in-out;
    opacity: 0;

    .cigo-layer-msg-content {
        background: white;
        border-radius: 8px;
        background-color: #555;
        padding: 8px 10px;
        color: white;
        opacity: 0.9;
    }
}

.cigo-layer-msg.show {
    top: 55%;
    opacity: 1;
}

.cigo-layer-msg.hide {
    //TODO 左移消失
    // left: -100%;
    // top: 55%;

    //TODO 就地消失
    top: 55%;
    opacity: 0;
}
</style>
