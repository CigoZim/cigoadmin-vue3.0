<template>
    <div id="app" class="cigo-frame">
        <sider class="frame-left-menu"></sider>
        <div class="frame-right">
            <top-bar class="frame-top-bar"></top-bar>
            <main-content class="frame-main-content"></main-content>
        </div>
        <right-panel class="frame-right-panel"></right-panel>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, provide, ref, watch } from "vue";

import Sider from "./Sider.vue";
import TopBar from "./TopBar.vue";
import MainContent from "./MainContent.vue";
import RightPanel from "./RightPanel.vue";

import { apiErrorCatch, apiRequest, apiSign, Domain } from "@/common/http";
import { Menu } from "./utils/types";
import { makeRandomColor } from "./utils/common";

export default defineComponent({
    name: "CigoFrame",
    components: {
        Sider,
        TopBar,
        MainContent,
        RightPanel
    },
    setup() {
        let treeListTmp: Menu[] = [];
        let menuTreeListRef = ref(treeListTmp);
        let treeListForEditTmp: Menu[] = [];
        let menuTreeListForEdit = ref(treeListForEditTmp);
        let menuNameBaseMapRef = ref(new Map());
        let menuIdBaseMapRef = ref(new Map());

        provide("menuTreeListRef", menuTreeListRef);
        provide("menuTreeListForEdit", menuTreeListForEdit);
        provide("menuNameBaseMapRef", menuNameBaseMapRef);
        provide("menuIdBaseMapRef", menuIdBaseMapRef);

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
                    initMenuMapData(response.data.data.baseList);

                    //初始化层级菜单数据
                    let treeList = response.data.data.treeList;
                    let treeListForEdit: Menu[] = [];
                    initTreeMenuList(treeList, treeListForEdit);

                    menuTreeListForEdit.value = [...treeListForEdit];
                    menuTreeListRef.value = [...treeList];
                })
                .catch(apiErrorCatch.v1);
        };

        const initMenuMapData = (baseList: []) => {
            let idMap = new Map();
            let nameMap = new Map();
            baseList.every((item: Menu, index: number, arr) => {
                if (item.component_name) {
                    nameMap.set(item.component_name, item);
                }
                idMap.set("id_" + item.id, item);
                return true;
            });
            menuIdBaseMapRef.value = idMap;
            menuNameBaseMapRef.value = nameMap;
        };

        const initTreeMenuList = (list: Menu[], treeListForEdit?: Menu[]) => {
            list.every((item: Menu, index: number, arr) => {
                item.color = makeRandomColor(1, 100, 250);

                //同步基础菜单数据颜色
                if (
                    item.component_name &&
                    menuNameBaseMapRef.value.has(item.component_name)
                ) {
                    menuNameBaseMapRef.value.get(item.component_name).color =
                        item.color;
                }

                //同步编辑菜单数据
                let itemFormEdit: Menu = {
                    id: 0,
                    title: ""
                };
                if (!item.group_flag && treeListForEdit) {
                    Object.assign(itemFormEdit, item); //Knowledge_Flag 知识点：深拷贝vs浅拷贝
                    itemFormEdit.subList = [];
                    treeListForEdit.push(itemFormEdit);
                }

                if (item.subList && item.subList.length) {
                    initTreeMenuList(item.subList, itemFormEdit.subList);
                } else {
                    delete item.subList;
                    delete itemFormEdit.subList;
                }
                return true;
            });
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
        width: 0;
        height: 100%;
        display: flex;
        background-color: #fff;
        flex: 1;
        flex-direction: column;
    }
}
</style>
