<template>
<div class="page-news">
    <h1>我是新闻页面</h1>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: "DemoNews",
    setup() {}
});
</script>

<style lang="scss">
.page-news {
    display: flex;
    flex: 1;
}
</style>
