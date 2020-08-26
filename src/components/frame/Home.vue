<template>
<div id="app" class="home-page">
    <left-menu class="home-left-menu"></left-menu>
    <div class="home-right">
        <top-bar class="home-top-bar"></top-bar>
        <main-content class="home-main-content" />
    </div>
    <right-panel class="home-right-panel"></right-panel>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

import LeftMenu from "./LeftMenu.vue";
import TopBar from "./TopBar.vue";
import MainContent from "./MainContent.vue";
import RightPanel from "./RightPanel.vue";

import {
    Domain
} from "@/common/http";

export default defineComponent({
    name: "App",
    components: {
        LeftMenu,
        TopBar,
        MainContent,
        RightPanel
    }
});
</script>

<style lang="scss">
.home-page {
    display: flex;
    flex-direction: row;

    .home-right {
        display: flex;
        background-color: #fff;
        flex: 1;
        flex-direction: column;
    }
}
</style>
