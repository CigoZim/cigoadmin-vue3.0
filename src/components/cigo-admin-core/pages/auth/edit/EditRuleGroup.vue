<template>
<edit :treeFlag="true" :addUrl="'/add/Group'" :editUrl="'/edit/Group'" :layerData="layerData" :formData="formData" :formItemRules="formItemRules" :newDataPushFlag="true">
    <template v-slot:content="{formDataProxy, validateInfos}">
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
    inject,
    watch,
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
            formItemRules,
        };
    }
});
</script>
