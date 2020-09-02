<template>
<div class="cigo-left-menu" :style="{'--menuWidth':(sideMenuOpen ? '200px' : '54px')}">
    <logo-area class="left-menu-logo-area"></logo-area>
    <div class="left-menu-list">
        <ul>
            <li class="menu-item" @click.stop="showPage('/')">数据面板</li>
            <li class="menu-item" @click.stop="showPage('/pages/index')">首页</li>
        </ul>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    isReactive,
    toRefs,
    onBeforeMount
} from "vue";
import {
    useRouter,
    useRoute
} from "vue-router";

import LogoArea from "./leftMenu/LogoArea.vue";

import {
    systemStore
} from "@/store/index";

export default defineComponent({
    name: "LeftMenu",
    components: {
        LogoArea
    },
    setup(props, context) {
        const router = useRouter();

        const showPage = (path: string) => {
            router.push(path);
        };

        return {
            ...toRefs(systemStore.getState().systemState),
            showPage
        };
    }
});
</script>

<style lang="scss">
.cigo-left-menu {
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

        .menu-item {
            cursor: pointer;
        }
    }
}
</style>
