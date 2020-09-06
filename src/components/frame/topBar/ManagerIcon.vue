<template>
<div class="manager-icon-content">
    <span>我是管理员</span>
    <span class="btn" @click="logout">退出登录</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

import {
    systemStore
} from "@/store/index";

export default defineComponent({
    name: "ManagerIcon",
    setup() {
        const logout = () => {
            systemStore.logout();
        };

        return {
            logout
        };
    }
});
</script>

<style lang="scss">
.manager-icon-content {
    display: flex;

    .btn {
        margin: 10px;
        border: 1px solid #ccc;
    }
}
</style>
