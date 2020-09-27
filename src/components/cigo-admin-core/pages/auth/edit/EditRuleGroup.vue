<template>
<edit :treeFlag="true" :addUrl="'/add/Group'" :editUrl="'/edit/Group'" :layerData="layerData" :formData="formData" :formItemRules="formItemRules" :newDataPushFlag="true">
    <template v-slot:content="{formDataProxy, validateInfos}">
        <a-form-item label="父级角色：" name="pid">
            <a-select v-model:value="formDataProxy.pid" show-search placeholder="请选择父级角色" not-found-content="当前无父级角色" :filter-option="filterParentGroupOption" @change="pGroupChange" :disabled="layerData.viewFlag">
                <a-select-option :value="0" :itemData="{id:0, title:'', pid:0, path:'0,', rules:[]}">
                    <span style="color:#666;font-weight:700;">--设置根科室--</span>
                </a-select-option>
                <a-select-option v-for="(item,index) in groupNoTreeListRef" :key="index+1" :value="item.id" :itemData="item" :disabled="layerData.recordCurr && layerData.recordCurr.id == item.id">
                    <span v-if="item.level">
                        <span v-for="(tabItem,tabIndex) in item.level" :key="tabIndex">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{{item.last ? '└ ':'├ '}}</span>
                    </span>
                    {{item.title +(layerData.recordCurr && layerData.recordCurr.id == item.id ? ' (当前)' :'')}}
                </a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="角色名：" name="title" v-bind="validateInfos.title">
            <a-input v-model:value="formDataProxy.title" placeholder="请输入角色名" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="角色排序：" name="sort" v-bind="validateInfos.sort">
            <a-input v-model:value="formDataProxy.sort" placeholder="请设置排序" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="说明：" name="summary">
            <a-textarea v-model:value="formDataProxy.summary" :disabled="layerData.viewFlag" />
        </a-form-item>
        <div class="line"></div>
        <a-form-item label="权限配置：" name="rules">
            <a-tree v-model:checkedKeys="formDataProxy.rules" :replaceFields="{children: 'subList', key: 'id'}" checkable :auto-expand-parent="true" :defaultExpandAll="true" :tree-data="layerData.menuList" :disabled="layerData.viewFlag" />
        </a-form-item>
    </template>
</edit>
</template>

<script lang="ts">
import {
    defineComponent,
} from "vue";
import Edit from "@/components/cigo-admin-core/pages/template/Edit.vue";

export default defineComponent({
    name: "CigoEditRuleGroup",
    components: {
        Edit
    },
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let formData = {
            id: props.layerData.recordCurr ? props.layerData.recordCurr.id : null,
            title: props.layerData.recordCurr ?
                props.layerData.recordCurr.title : "",
            sort: props.layerData.recordCurr ?
                props.layerData.recordCurr.sort : 100,
            summary: props.layerData.recordCurr ?
                props.layerData.recordCurr.summary : "",
            rules: props.layerData.recordCurr ?
                props.layerData.recordCurr.rules : [],
        };
        const formItemRules = {
            title: [{
                required: true,
                message: "请输入角色名"
            }],
            sort: [{
                    required: true,
                    message: "请配置角色排序"
                },
                {
                    type: "integer",
                    transform: (value: any) => {
                        return Number(value);
                    },
                    message: "排序为正整数"
                }
            ]
        };

        return {
            formData,
            formItemRules
        };
    }
});
</script>
