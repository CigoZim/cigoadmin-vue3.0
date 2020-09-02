<template>
<div class="app-page">
    <router-view />
</div>
</template>

<script lang="ts">
import {
    onMounted
} from "vue";

import {
    systemStore
} from "@/store/index";

export default {
    name: "App",
    setup() {
        onMounted(() => {
            console.log("app mounted");

            systemStore.recoverStore();
        });
    }
};
</script>

<style lang="scss">
.app-pege {
    display: flex;
}
</style>
