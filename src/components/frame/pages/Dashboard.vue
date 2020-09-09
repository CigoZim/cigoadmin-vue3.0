<template>
<div class="cigo-dashboard">
    <span>数据中心面板</span>
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
    name: "CigoDashboard",
    setup() {
        onMounted(() => {
            console.log("dashboard mounted");
        });
        onActivated(() => {
            console.log("dashboard onActivated");
        });
        onDeactivated(() => {
            console.log("dashboard onDeactivated");
        });
        onUnmounted(() => {
            console.log("dashboard unmounted");
        });
    }
});
</script>

<style lang="scss">
.cigo-dashboard {
    display: flex;
    flex: 1;
}
</style>
