<template>
<div class="cigo-top-bar">
    <div class="top-bar-top">
        <div class="top-bar-top-left">
            <cigo-icon-font class="left-menu-toggle-icon" :class="[sideMenuOpen ? 'open' : 'close']" @click="systemStore.toggleSideMenu()" :name="'cigoadmin-icon-menufold'"></cigo-icon-font>
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
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import BreadCrumb from "@/components/cigo-admin-core/topBar/BreadCrumb.vue";
import ToolsBar from "@/components/cigo-admin-core/topBar/ToolsBar.vue";
import ManagerIcon from "@/components/cigo-admin-core/topBar/ManagerIcon.vue";
import OpenPages from "@/components/cigo-admin-core/topBar/OpenPages.vue";
import {
    systemStore
} from "@/store/index";

export default defineComponent({
    name: "CigoTopBar",
    components: {
        CigoIconFont,
        BreadCrumb,
        ToolsBar,
        ManagerIcon,
        OpenPages
    },
    setup(props) {
        return {
            systemStore,
            ...toRefs(systemStore.getState().systemState)
        };
    }
});
</script>

<style lang="scss">
.cigo-top-bar {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    padding: 5px 12px 0px;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ddd;
    box-shadow: 0px 4px 10px #bbb;

    .top-bar-top {
        width: 100%;
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

            .left-menu-toggle-icon.open {
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
