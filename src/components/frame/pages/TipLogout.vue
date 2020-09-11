<template>
<div class="cigo-tip-logout">
    <h1>已退出登录，{{delayTime}}s后跳转...</h1>
</div>
</template>

<script lang="ts">
import {
    systemStore
} from "@/store";
import {
    defineComponent,
    onMounted,
    ref
} from "vue";
export default defineComponent({
    name: "CigoTipLogout",
    notShowTab: true,
    setup() {
        let delayTime = ref(2);

        onMounted(() => {
            delayLogout();
        });

        const delayLogout = () => {
            setTimeout(() => {
                if (--delayTime.value > 1) {
                    delayLogout();
                    return;
                }
                systemStore.logout();
            }, 1000);
        };

        return {
            delayTime
        };
    }
});
</script>
