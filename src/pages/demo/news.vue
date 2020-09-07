<template>
<div class="page-news">
    <h1>我是新闻页面</h1>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    onUnmounted,
    onActivated,
    onDeactivated
} from "vue";

export default defineComponent({
    name: "DemoNews",
    setup() {
        onMounted(() => {
            console.log("news mounted");
        });
        onActivated(() => {
            console.log("news onActivated");
        });
        onDeactivated(() => {
            console.log("news onDeactivated");
        });
        onUnmounted(() => {
            console.log("news unmounted");
        });
    }
});
</script>

<style lang="scss">
.page-index {
    background-color: darkorange;
    display: flex;
    flex: 1;
}
</style>
