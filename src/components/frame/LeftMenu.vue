<template>
<div class="left-menu-content" :style="{'--menuWidth':(sideMenuOpen ? '200px' : '54px')}">
    <logo-area class="left-menu-logo-area"></logo-area>
    <div class="left-menu-list">菜单列表</div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    isReactive,
    toRefs,
    onBeforeMount
} from "vue";

import LogoArea from "./leftMenu/LogoArea.vue";

import {
    systemStore
} from "@/store/index";

export default defineComponent({
    name: "LeftMenu",
    components: {
        LogoArea
    },
    setup(props) {
        return {
            ...toRefs(systemStore.getState().systemState)
        };
    }
});
</script>

<style lang="scss">
.left-menu-content {
    width: var(--menuWidth);
    height: 100vh;
    background-color: #304156;
    display: flex;
    flex-direction: column;
    -moz-transition: all 0.5s ease-in-out;
    -webkit-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    transition-delay: 10ms;

    .left-menu-list {
        display: flex;
        flex: 1;
        background-color: yellow;
    }
}
</style>
