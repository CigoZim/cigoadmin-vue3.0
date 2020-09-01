<template>
<div class="cigo-layer-msg-content">
    <span>我是消息弹框</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
export default defineComponent({
    name: "CigoLayerMsg",
    setup() {}
});
</script>

<style lang="scss">
.cigo-layer-msg-content {
    width: 100px;
    height: 100px;
    background-color: black;
    color: white;
}
</style>
