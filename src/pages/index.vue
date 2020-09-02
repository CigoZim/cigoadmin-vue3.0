<template>
<div>
    <h1>我是首页面</h1>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted
} from "vue";

export default defineComponent({
    name: "index",
    setup() {
        onMounted(() => {
            console.log("index mounted");
        });
    }
});
</script>
