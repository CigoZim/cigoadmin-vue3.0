<template>
<div class="open-pages-content">
    <span>我是打开页面标签列表</span>
    <p class="panel-tabs">
        <span v-for="(item, index) in pages" :key="index">{{item.label}}</span>
    </p>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: "OpenPages",
    setup(props, content) {
        const pages: Object[] = [{
                id: 1,
                label: "page1"
            },
            {
                id: 2,
                label: "page2"
            },
            {
                id: 3,
                label: "page3"
            },
            {
                id: 4,
                label: "page4"
            },
            {
                id: 5,
                label: "page5"
            }
        ];

        return {
            pages
        };
    }
});
</script>

<style lang="scss">
</style>
