<template>
    <div class="cigo-gone">
        <h1>页面跑丢了，{{delayTime}}s后跳转...</h1>
    </div>
</template>

<script lang="ts">
import { systemStore } from "@/store";
import { defineComponent, onMounted, ref } from "vue";
import router from "@/router";
export default defineComponent({
    name: "CigoGone",
    notShowTab: true,
    setup() {
        let delayTime = ref(2);

        onMounted(() => {
            delayLogout();
        });

        const delayLogout = () => {
            setTimeout(() => {
                if (--delayTime.value > 0) {
                    delayLogout();
                    return;
                }
                router.push("/");
            }, 1000);
        };

        return {
            delayTime
        };
    }
});
</script>
