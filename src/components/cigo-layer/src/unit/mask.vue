<template>
<div class="cigo-layer-mask-content" @click="clickMask"></div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
export default defineComponent({
    name: "CigoLayerMask",
    setup() {
        const clickMask = () => {
            console.log("click mask");
        };

        return {
            clickMask
        };
    }
});
</script>

<style lang="scss">
.cigo-layer-mask-content {
    width: 100%;
    height: 100%;
    background-color: #222;
    opacity: 0.6;
}
</style>
