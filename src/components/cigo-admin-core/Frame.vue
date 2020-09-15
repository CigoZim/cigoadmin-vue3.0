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
    name: "CigoFrame",
    components: {
        Sider,
        TopBar,
        MainContent,
        RightPanel
    },
    setup() {
        let baseListTmp: Menu[] = [];
        let baseListForEditTmp: Menu[] = [];
        let treeListTmp: Menu[] = [];
        let treeListForEditTmp: Menu[] = [];
        let treeListForEditBaseTmp: Menu[] = [];

        let menuBaseListRef = ref(baseListTmp);
        let menuBaseListForEditRef = ref(baseListForEditTmp); //去除分组且不分层
        let menuBaseListNameMapRef = ref(new Map());
        let menuBaseListIdMapRef = ref(new Map());
        let menuTreeListRef = ref(treeListTmp); //带分组
        let menuTreeListForEditRef = ref(treeListForEditTmp); //去除分组

        provide("menuBaseListRef", menuBaseListRef);
        provide("menuBaseListForEditRef", menuBaseListForEditRef);
        provide("menuBaseListNameMapRef", menuBaseListNameMapRef);
        provide("menuBaseListIdMapRef", menuBaseListIdMapRef);
        provide("menuTreeListRef", menuTreeListRef);
        provide("menuTreeListForEditRef", menuTreeListForEditRef);

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
                    menuBaseListRef.value = response.data.data.baseList;
                    initMenuMapData();

                    //初始化层级菜单数据
                    let treeList = response.data.data.treeList;
                    let treeListForEdit: Menu[] = [];
                    let baseListForEdit: Menu[] = [];
                    initTreeMenuList(
                        treeList,
                        baseListForEdit,
                        treeListForEdit,
                        0
                    );

                    menuTreeListRef.value = [...treeList];
                    menuBaseListForEditRef.value = [...baseListForEdit];
                    menuTreeListForEditRef.value = [...treeListForEdit];
                })
                .catch(apiErrorCatch.v1);
        };

        const initMenuMapData = () => {
            let idMap = new Map();
            let nameMap = new Map();
            menuBaseListRef.value.every((item: Menu, index: number, arr) => {
                if (item.component_name) {
                    nameMap.set(item.component_name, item);
                }
                idMap.set("id_" + item.id, item);
                return true;
            });
            menuBaseListIdMapRef.value = idMap;
            menuBaseListNameMapRef.value = nameMap;
        };

        const initTreeMenuList = (
            list: Menu[],
            baseListForEdit: Menu[],
            treeListForEdit: Menu[],
            level: number
        ) => {
            list.every((item: Menu, index: number, arr) => {
                item.color = makeRandomColor(1, 100, 250);

                /** 标注菜单项层级 */
                item.level = level;

                /** 同步基础菜单数据颜色 */
                if (
                    item.component_name &&
                    menuBaseListNameMapRef.value.has(item.component_name)
                ) {
                    menuBaseListNameMapRef.value.get(
                        item.component_name
                    ).color = item.color;
                }

                /** 同步编辑菜单数据 */
                let itemForBase: Menu = {
                    id: 0,
                    title: ""
                };
                let itemForEdit: Menu = {
                    id: 0,
                    title: ""
                };
                //添加当前菜单项
                if (!item.group_flag) {
                    Object.assign(itemForBase, item); //Tips_Flag 知识点：深拷贝vs浅拷贝
                    baseListForEdit.push(itemForBase);

                    Object.assign(itemForEdit, item);
                    treeListForEdit.push(itemForEdit);
                }
                //处理子级
                if (item.subList && item.subList.length) {
                    itemForEdit.subList = [];
                    initTreeMenuList(
                        item.subList,
                        baseListForEdit,
                        itemForEdit.subList,
                        level + 1
                    );
                } else {
                    delete item.subList; //防止编辑菜单界面以subList字段标识子项会出现展开图标
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
