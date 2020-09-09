<template>
<div class="cigo-top-bar">
    <div class="top-bar-top">
        <div class="top-bar-top-left">
            <img class="left-menu-toggle-icon" :class="[sideMenuOpen?'open':'close']" @click="systemStore.toggleSideMenu()" :src="cdnOpenIcon + '/menu-close.png'" />
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
    defineComponent,
    toRefs
} from "vue";

import BreadCrumb from "@/components/frame/topBar/BreadCrumb.vue";
import ToolsBar from "@/components/frame/topBar/ToolsBar.vue";
import ManagerIcon from "@/components/frame/topBar/ManagerIcon.vue";
import OpenPages from "@/components/frame/topBar/OpenPages.vue";

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
        return {
            cdnOpenIcon: Domain.cdnOpenIcon,
            systemStore,
            ...toRefs(systemStore.getState().systemState)
        };
    }
});
</script>

<style lang="scss">
.cigo-top-bar {
    display: flex;
    flex-direction: column;
    padding: 15px 12px 0px;
    border-bottom: 1px solid #f0f0f0;

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
                width: 35px;
                height: 35px;
                padding: 5px 10px 5px 5px;
                cursor: pointer;
                -moz-transition: all 0.8s ease-in-out;
                -webkit-transition: all 0.8s ease-in-out;
                -o-transition: all 0.8s ease-in-out;
                -ms-transition: all 0.8s ease-in-out;
                transition: all 0.8s ease-in-out;
            }

            .left-menu-toggle-icon.close {
                -moz-transform: rotate(900deg);
                -webkit-transform: rotate(900deg);
                -o-transform: rotate(900deg);
                -ms-transform: rotate(900deg);
                transform: rotate(900deg);
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
