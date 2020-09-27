<template>
<list-manager :add-label="'新建角色分组'" :dataUrl="'/groupList'" :statusUrl="'/status/Group'" :columns="columns" :editComponent="EditRuleGroup" :editWinW="'800px'" :editWinH="'600px'" :attachDataForEdit="{menuList: menuTreeListForEditRef}" :treeFlag="true"></list-manager>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    toRaw,
    watch
} from "vue";
import ListManager from "@/components/cigo-admin-core/pages/template/ListManager.vue";
import EditRuleGroup from "@/components/cigo-admin-core/pages/auth/edit/EditRuleGroup.vue";
import {
    Menu
} from "../../utils/types";

export default defineComponent({
    name: "CigoAuthRuleGroup",
    components: {
        ListManager
    },
    setup(props, ctx) {
        let menuTreeListForEditRef: any = inject("menuTreeListForEditRef");

        const columns = [{
                title: "角色",
                dataIndex: "title",
                width: "300px"
            },
            {
                title: "编号",
                dataIndex: "id",
                width: "80px"
            },
            {
                title: "排序",
                dataIndex: "sort",
                width: "90px"
            },
            {
                title: "说明",
                dataIndex: "summary",
                width: "400px"
            }
        ];

        return {
            columns,
            EditRuleGroup,
            menuTreeListForEditRef
        };
    }
});
</script>
