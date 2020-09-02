<template>
<div>
    <span>数据中心面板</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted
} from "vue";

export default defineComponent({
    name: "Dashboard",
    setup() {
        onMounted(() => {
            console.log("dashboard mounted");
        });
    }
});
</script>
