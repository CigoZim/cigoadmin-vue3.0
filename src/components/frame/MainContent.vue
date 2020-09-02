<template>
<div class="main-content">
    <div class="main-content-top">
        <content-left-menu class="main-content-left-menu"></content-left-menu>
        <div class="main-content-body">
            <!-- 知识点——动态组件：https://cn.vuejs.org/v2/guide/components.html#%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6 -->
            <router-view v-slot="{ Component }">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                        <component class="view" :is="Component" />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </div>
    <bottom-panel class="main-content-bottom"></bottom-panel>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

import ContentLeftMenu from "./ContentLeftMenu.vue";
import BottomPanel from "./BottomPanel.vue";

export default defineComponent({
    name: "MainContent",
    components: {
        ContentLeftMenu,
        BottomPanel
    }
});
</script>

<style lang="scss">
.main-content {
    display: flex;
    flex: 1;
    background-color: red;
    flex-direction: column;

    .main-content-top {
        display: flex;
        flex: 1;
        flex-direction: row;

        .main-content-left-menu {
            display: flex;
        }

        .main-content-body {
            display: flex;
            flex: 1;
            background-color: #f5f5f5;
        }
    }

    .main-content-bottom {
        display: flex;
        background-color: blue;
    }
}
</style>
