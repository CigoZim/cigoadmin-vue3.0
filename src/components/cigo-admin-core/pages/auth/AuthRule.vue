<template>
    <div class="cigo-auth-rule">
        <div class="top-bar">
            <div class="left"></div>
            <div class="right"></div>
        </div>

        <a-table
            class="auth-rule-list"
            :pagination="false"
            :columns="columns"
            :children-column-name="'subList'"
            :data-source="menuTreeListRef"
            :row-selection="rowSelection"
            :scroll="{ x: 1000, y: 450 }"
        >
            <template #action="{ title }">
                <a>action{{title}}</a>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
export default defineComponent({
    name: "CigoAuthRule",
    setup(props) {
        let menuTreeListRef = inject("menuTreeListRef");
        const columns = [
            {
                title: "权限节点/菜单",
                dataIndex: "title",
                key: "title"
            },
            {
                title: "图标",
                dataIndex: "icon",
                key: "icon",
                width: "150px"
            },
            {
                title: "节点类型",
                dataIndex: "type",
                key: "type",
                width: "90px"
            },
            {
                title: "跳转路由/URL",
                dataIndex: "url",
                key: "url"
            },
            {
                title: "跳转类型",
                dataIndex: "target_type",
                key: "target_type",
                width: "150px"
            },
            {
                title: "对应组件名",
                dataIndex: "component_name",
                key: "component_name"
            },
            {
                title: "组件显示名称",
                dataIndex: "component_label",
                key: "component_label"
            },
            {
                title: "分组",
                dataIndex: "sort",
                key: "sort",
                width: "100px"
            },
            {
                title: "分组排序",
                dataIndex: "group_sort",
                key: "group_sort",
                width: "90px"
            },
            {
                title: "排序",
                dataIndex: "sort",
                key: "sort",
                width: "90px"
            },
            {
                title: "Action",
                key: "operation",
                fixed: "right",
                width: 150,
                slots: {
                    customRender: "action"
                }
            }
        ];

        const rowSelection = {
            fixed: true,
            type: "radio",
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                console.log(
                    `selectedRowKeys: ${selectedRowKeys}`,
                    "selectedRows: ",
                    selectedRows
                );
            },
            onSelect: (record: any, selected: any, selectedRows: any) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (
                selected: any,
                selectedRows: any,
                changeRows: any
            ) => {
                console.log(selected, selectedRows, changeRows);
            }
        };

        return {
            menuTreeListRef,
            columns,
            rowSelection
        };
    }
});
</script>

<style lang="scss">
.cigo-auth-rule {
    display: flex;
    flex-direction: column;

    .top-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>
