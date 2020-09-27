<template>
<div class="cigo-dashboard">
    <h1>数据中心面板</h1>
    <br />
    <h3>即将跳转到温度计页面：{{delayTime}}s后跳转...</h3>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    ref
} from "vue";
import router from "@/router";
export default defineComponent({
    name: "CigoDashboard",
    setup() {
        let delayTime = ref(3);

        onMounted(() => {
            delayJump();
        });

        const delayJump = () => {
            setTimeout(() => {
                if (--delayTime.value > 0) {
                    delayJump();
                    return;
                }
                router.push("/frame/animation/thermometer/one");
            }, 1000);
        };

        return {
            delayTime
        };
    }
});
</script>

<style lang="scss">
.cigo-dashboard {}
</style>
