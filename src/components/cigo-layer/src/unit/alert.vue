<template>
<div class="cigo-layer-item cigo-layer-alert">
    <span>我是弹框提示</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
export default defineComponent({
    name: "CigoLayerAlert"
});
</script>

<style lang="scss">
.cigo-layer-alert {
    width: 100vw;
    height: 100vh;
    background-color: blue;
}
</style>
