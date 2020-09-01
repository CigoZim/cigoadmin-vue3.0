<template>
<div class="cigo-layer-item cigo-layer-msg">
    <cigo-mask></cigo-mask>
    <div class="cigo-layer-msg-content">
        <span>我是消息弹框</span>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

import CigoMask from "./mask.vue";

export default defineComponent({
    name: "CigoLayerMsg",
    components: {
        CigoMask
    },
    setup() {}
});
</script>

<style lang="scss">
.cigo-layer-msg {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    //TODO 需完善为按照配置进行定位
    justify-content: center;
    align-items: center;

    .cigo-layer-msg-content {
        min-width: 300px;
        background: white;
        border-radius: 8px;
        border: 1px solid #666;
        position: absolute;
    }
}
</style>
