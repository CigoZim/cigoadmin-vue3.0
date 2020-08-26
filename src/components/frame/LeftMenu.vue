<template>
<div class="left-menu-content">
    <logo-area class="left-menu-logo-area"></logo-area>
    <div class="left-menu-list">菜单列表</div>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

import LogoArea from "./leftMenu/LogoArea.vue";

export default defineComponent({
    name: "LeftMenu",
    components: {
        LogoArea,
    },
});
</script>

<style lang="scss">
.left-menu-content {
    width: 210px;
    height: 100vh;
    background-color: #304156;
    display: flex;
    flex-direction: column;

    .left-menu-list {
        display: flex;
        flex: 1;
        background-color: yellow;
    }
}
</style>
