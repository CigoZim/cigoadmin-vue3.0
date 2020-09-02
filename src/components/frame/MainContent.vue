<template>
<div class="main-content">
    <transition name="fade-transform" mode="out-in">
        <div class="main-content-top">
            <content-left-menu class="main-content-left-menu"></content-left-menu>
            <div class="main-content-body">页面内容主体</div>
        </div>
    </transition>
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
            background-color: pink;
        }
    }

    .main-content-bottom {
        display: flex;
        background-color: blue;
    }
}
</style>
