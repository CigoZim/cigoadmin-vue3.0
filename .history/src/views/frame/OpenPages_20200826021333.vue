<template>
<div class="open-pages-content">
    <span>我是打开页面标签列表</span>
    <button class="modal-close is-large" @click="testClick"></button>
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
        let pages: Object[] = [{
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

        let testClick = () => {
            console.log("111111");
        };

        return {
            pages,
            testClick
        };
    }
});
</script>

<style lang="scss">
</style>
