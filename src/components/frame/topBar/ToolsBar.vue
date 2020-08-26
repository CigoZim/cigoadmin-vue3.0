<template>
<div class="tools-bar-content">
    <span>我是顶部工具条</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: "ToolsBar",
});
</script>

<style lang="scss">
.tools-bar-content {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
