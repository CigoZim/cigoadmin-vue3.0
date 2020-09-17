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
    toRef,
    watch
} from "vue";

import Sider from "./Sider.vue";
import TopBar from "./TopBar.vue";
import MainContent from "./MainContent.vue";
import RightPanel from "./RightPanel.vue";

import {
    apiErrorCatch,
    apiRequest,
    apiSign
} from "@/common/http";
import {
    Menu
} from "./utils/types";
import {
    makeRandomColor
} from "./utils/common";
import {
    TransStatus,
    frameTrans
} from "@/components/cigo-admin-core/utils/trans";

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
        let treeListForEditTmp: Menu[] = [];
        let baseListForEditTmp: Menu[] = [];

        let menuTreeListRef = ref(treeListTmp); //带分组
        let menuTreeListForEditRef = ref(treeListForEditTmp); //去除分组
        let menuBaseListForEditRef = ref(baseListForEditTmp); //去除分组且不分层
        let menuBaseListNameMapRef = ref(new Map());
        let menuBaseListIdMapRef = ref(new Map());

        provide("menuTreeListRef", menuTreeListRef);
        provide("menuTreeListForEditRef", menuTreeListForEditRef);
        provide("menuBaseListForEditRef", menuBaseListForEditRef);
        provide("menuBaseListNameMapRef", menuBaseListNameMapRef);
        provide("menuBaseListIdMapRef", menuBaseListIdMapRef);

        onBeforeMount(() => {
            getMenuList();
        });
        let refreshMenuRef = toRef(
            frameTrans.getTransStatus(),
            "refreshMenuTrans"
        );

        watch(refreshMenuRef, (newVal, preVal) => {
            getMenuList();
        });

        // 获取菜单数据
        const getMenuList = () => {
            apiRequest.v1
                .get("/menu/tree", {
                    headers: apiSign({})
                })
                .then(response => {
                    //初始化层级菜单数据
                    let srcTreeList: Menu[] = response.data.data;
                    let treeList: Menu[] = [];
                    let treeListForEdit: Menu[] = [];
                    let baseListForEdit: Menu[] = [];
                    let idMap = new Map();
                    let nameMap = new Map();
                    initTreeMenuList(
                        srcTreeList,
                        treeList,
                        baseListForEdit,
                        treeListForEdit,
                        idMap,
                        nameMap,
                        0
                    );

                    menuTreeListRef.value = [...treeList];
                    menuBaseListForEditRef.value = [...baseListForEdit];
                    menuTreeListForEditRef.value = [...treeListForEdit];
                    menuBaseListIdMapRef.value = idMap;
                    menuBaseListNameMapRef.value = nameMap;
                })
                .catch(apiErrorCatch.v1);
        };

        const initTreeMenuList = (
            srcTreeList: Menu[],
            treeList: Menu[] | null,
            baseListForEdit: Menu[],
            treeListForEdit: Menu[],
            idMap: Map < string, Menu > ,
            nameMap: Map < string, Menu > ,
            level: number
        ) => {
            srcTreeList.every((item: Menu, index: number, arr) => {
                /** 创建动态颜色 */
                item.color = makeRandomColor(1, 100, 250);

                /** 标注菜单项层级 */
                item.level = level;
                item.last = index == arr.length - 1;

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
                let itemForTree: Menu = {
                    id: 0,
                    title: ""
                };
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
                    //左侧sider级联菜单数据
                    if (treeList && item.status) {
                        Object.assign(itemForTree, item);
                        delete itemForTree.subList; //避免空数组字段出现
                        treeList.push(itemForTree);
                    }
                    //编辑页面基础菜单数组
                    Object.assign(itemForBase, item); //Tips_Flag 知识点：深拷贝vs浅拷贝
                    delete itemForBase.subList; //避免空数组字段出现
                    baseListForEdit.push(itemForBase);
                    idMap.set("id_" + itemForBase.id, itemForBase);
                    if (itemForBase.component_name)
                        nameMap.set(itemForBase.component_name, itemForBase);
                    //编辑页面级联菜单数组
                    Object.assign(itemForEdit, item);
                    delete itemForEdit.subList; //避免空数组字段出现
                    treeListForEdit.push(itemForEdit);
                }
                //处理子级
                if (item.subList && item.subList.length) {
                    itemForTree.id ? (itemForTree.subList = []) : false;
                    itemForEdit.subList = [];
                    initTreeMenuList(
                        item.subList,
                        itemForTree.subList ? itemForTree.subList : null,
                        baseListForEdit,
                        itemForEdit.subList,
                        idMap,
                        nameMap,
                        level + 1
                    );
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
