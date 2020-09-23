<template>
<div class="cigo-layer-mask-content" @click="click"></div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted
} from "vue";
export default defineComponent({
    name: "CigoLayerMask",
    setup(props, ctx) {
        const click = () => {
            ctx.emit("clickMask");
        };

        return {
            click
        };
    }
});
</script>

<style lang="scss">
.cigo-layer-mask-content {
    width: 100%;
    height: 100%;
    background-color: #222;
    opacity: 0;
    position: absolute;
    top: 0px;
    left: 0px;
}
</style>
