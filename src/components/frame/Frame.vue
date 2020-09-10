<template>
<div id="app" class="cigo-frame">
    <sider class="frame-left-menu"></sider>
    <div class="frame-right">
        <top-bar class="frame-top-bar"></top-bar>
        <main-content class="frame-main-content" />
    </div>
    <right-panel class="frame-right-panel"></right-panel>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onBeforeMount,
    provide,
    ref,
    watch
} from "vue";

import Sider from "./Sider.vue";
import TopBar from "./TopBar.vue";
import MainContent from "./MainContent.vue";
import RightPanel from "./RightPanel.vue";

import {
    apiErrorCatch,
    apiRequest,
    apiSign,
    Domain
} from "@/common/http";
import {
    Menu
} from "./utils/types";
import {
    makeRandomColor
} from "./utils/common";

export default defineComponent({
    name: "Frame",
    components: {
        Sider,
        TopBar,
        MainContent,
        RightPanel
    },
    setup() {
        let treeList: Menu[] = [];
        let menuTreeListRef = ref(treeList);
        let baseMap = new Map();
        let menuBaseMapRef = ref(baseMap);
        let firstLevel = new Map();
        let menuBaseMapRefFirstLevel = ref(firstLevel);

        provide("menuTreeListRef", menuTreeListRef);
        provide("menuBaseMapRef", menuBaseMapRef);
        provide("menuBaseMapRefFirstLevel", menuBaseMapRefFirstLevel);

        onBeforeMount(() => {
            getMenuList();
        });

        // 获取菜单数据
        const getMenuList = () => {
            apiRequest.v1
                .get("/menu/both", {
                    headers: apiSign({})
                })
                .then(response => {
                    //初始化基础菜单数据
                    initBaseMap(response.data.data.baseList);

                    //初始化层级菜单数据
                    let treeList = response.data.data.treeList;
                    initTreeMenuList(response.data.data.treeList, 0);
                    menuTreeListRef.value = [...treeList];
                })
                .catch(apiErrorCatch.v1);
        };

        const initBaseMap = (baseList: []) => {
            let map = new Map();
            baseList.every((item: Menu, index: number, arr) => {
                if (item.component_name) {
                    map.set(item.component_name, item);
                }
                return true;
            });
            menuBaseMapRef.value = map;
        };

        const initTreeMenuList = (list: Menu[], level: number) => {
            let map = new Map();
            list.every((item: Menu, index: number, arr) => {
                item.color = makeRandomColor(1, 100, 250);
                //同步基础菜单数据颜色
                if (
                    item.component_name &&
                    menuBaseMapRef.value.has(item.component_name)
                ) {
                    menuBaseMapRef.value.get(item.component_name).color =
                        item.color;
                    if (level == 0) {
                        map.set(item.component_name, item);
                    }
                }

                if (item.subList && item.subList.length) {
                    initTreeMenuList(item.subList, level + 1);
                }
                return true;
            });
            if (level == 0) {
                menuBaseMapRefFirstLevel.value = map;
            }
        };

        return {};
    }
});
</script>

<style lang="scss">
.cigo-frame {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .frame-right {
        display: flex;
        background-color: #fff;
        flex: 1;
        flex-direction: column;
    }
}
</style>
