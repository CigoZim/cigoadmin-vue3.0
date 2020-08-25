<template>
<div class="logo-area">
    <span>我是Logo区域</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: "LogoArea",
});
</script>

<style lang="scss">
.logo-area {
    display: flex;
    width: 100%;
    min-height: 90px;
}
</style>
