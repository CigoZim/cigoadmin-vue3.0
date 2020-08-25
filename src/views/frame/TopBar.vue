<template>
<div class="top-bar-content">
    <div class="top-bar-top">
        <div class="top-bar-top-left">
            <image class="left-menu-toggle-icon" src />
            <bread-crumb class="top-bar-bread-crumb"></bread-crumb>
        </div>
        <div class="top-bar-top-right">
            <tools-bar class="top-bar-tools-bar"></tools-bar>
            <manager-icon class="top-bar-manager-icon"></manager-icon>
        </div>
    </div>
    <open-pages class="top-bar-open-pages"></open-pages>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

import BreadCrumb from "./BreadCrumb.vue";
import ToolsBar from "./topBar/ToolsBar.vue";
import ManagerIcon from "./topBar/ManagerIcon.vue";
import OpenPages from "./OpenPages.vue";

export default defineComponent({
    name: "TopBar",
    components: {
        BreadCrumb,
        ToolsBar,
        ManagerIcon,
        OpenPages,
    },
});
</script>

<style lang="scss">
.top-bar-content {
    display: flex;
    flex-direction: column;
    background-color: green;

    .top-bar-top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .top-bar-top-left {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .top-bar-top-right {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }
}
</style>
