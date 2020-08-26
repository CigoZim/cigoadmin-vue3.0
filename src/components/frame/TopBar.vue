<template>
<div class="top-bar-content">
    <div class="top-bar-top">
        <div class="top-bar-top-left">
            <img class="left-menu-toggle-icon" @click="toggleMenu()" :src="cdnOpenIcon+'/menu-close.png'" />
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

import {
    Domain
} from "@/common/http";
import {
    systemStore
} from "@/store/index";

export default defineComponent({
    name: "TopBar",
    components: {
        BreadCrumb,
        ToolsBar,
        ManagerIcon,
        OpenPages
    },
    setup(props) {
        const toggleMenu = () => {
            console.log(
                "111:",
                systemStore.getState().systemState.sideMenuOpen
            );

            systemStore.toggleMenu();

            console.log(
                "222:",
                systemStore.getState().systemState.sideMenuOpen
            );
        };

        return {
            cdnOpenIcon: Domain.cdnOpenIcon,
            toggleMenu
        };
    }
});
</script>

<style lang="scss">
.top-bar-content {
    display: flex;
    flex-direction: column;
    padding: 15px 12px 0px;

    .top-bar-top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .top-bar-top-left {
            display: flex;
            flex-direction: row;
            align-items: center;

            .left-menu-toggle-icon {
                width: 30px;
                height: 30px;
                padding: 5px 10px 5px 5px;
            }
        }

        .top-bar-top-right {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }
}
</style>
