<template>
<edit :addUrl="'/add/Manager'" :editUrl="'/edit/Manager'" :layerData="layerData" :formData="formData" :formItemRules="formItemRules" :beforeEdit="beforeEdit" :columnFlag="true">
    <template v-slot:content="{formDataProxy, validateInfos}">
        <a-form-item label=" " name="img">
            <!-- //Tips_Flag 观察属性函数如何补充参数 -->
            <cigo-avatar :avatarInfo="formDataProxy.img_info" :editable="!layerData.viewFlag" @update:avatarInfo="updateAvatarInfo($event, formDataProxy)"></cigo-avatar>
        </a-form-item>
        <a-form-item label="管理员类型" name="role_flag">
            <a-radio-group v-model:value="formDataProxy.role_flag" :disabled="layerData.viewFlag">
                <a-radio :value="2">管理员</a-radio>
                <a-radio :value="4">超级管理员</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="用户名" name="username" v-bind="validateInfos.username">
            <a-input v-model:value="formDataProxy.username" placeholder="请输入用户名" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="密码" name="password" v-bind="validateInfos.password">
            <a-input v-model:value="formDataProxy.password" type="password" placeholder="请设置密码" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
            <a-input v-model:value="formDataProxy.nickname" placeholder="请设置昵称" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="邮箱" name="email" v-bind="validateInfos.email">
            <a-input v-model:value="formDataProxy.email" placeholder="请填写邮箱" :disabled="layerData.viewFlag" />
        </a-form-item>
    </template>
    <template v-slot:content-right="{formDataProxy}">
        <div class="">角色配置</div>
        <div class="line"></div>
        <a-form-item label="" name="auth_group">
            <a-tree v-model:checkedKeys="formDataProxy.auth_group" :replaceFields="{children: 'subList', key: 'id'}" checkable :auto-expand-parent="true" :defaultExpandAll="true" :tree-data="layerData.groupList" :disabled="layerData.viewFlag" />
        </a-form-item>
    </template>
</edit>
</template>

<script lang="ts">
import {
    defineComponent,
} from "vue";
import cigoLayer from "@/components/cigo-layer";
import CigoAvatar from "@/components/cigo-ui/unit/form/uploader/cigo-avatar.vue";
import Edit from "@/components/cigo-admin-core/pages/template/Edit.vue";

export default defineComponent({
    name: "CigoEditManager",
    components: {
        CigoAvatar,
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
            id: props.layerData.recordCurr ?
                props.layerData.recordCurr.id : null, //Tips_Flag PHP后端识别null为空
            img: props.layerData.recordCurr ?
                props.layerData.recordCurr.img : 0,
            img_info: props.layerData.recordCurr &&
                props.layerData.recordCurr.img_info ?
                props.layerData.recordCurr.img_info : {
                    id: 0
                }, //Tips_Flag 前端识别undefined
            role_flag: props.layerData.recordCurr ?
                props.layerData.recordCurr.role_flag : 2,
            username: props.layerData.recordCurr ?
                props.layerData.recordCurr.username : "",
            nickname: props.layerData.recordCurr ?
                props.layerData.recordCurr.nickname : "",
            password: "",
            email: props.layerData.recordCurr ?
                props.layerData.recordCurr.email : "",
            auth_group: props.layerData.recordCurr ?
                props.layerData.recordCurr.auth_group : []
        };
        const formItemRules = {
            username: [{
                required: true,
                message: "请输入用户名"
            }],
            password: [{
                    required: true,
                    message: "请设置密码"
                },
                {
                    max: 20,
                    message: "密码最多20个字符"
                },
                {
                    min: 6,
                    message: "密码最少6个字符"
                }
            ],
            email: [{
                type: "email",
                message: "邮箱格式错误"
            }]
        };

        const beforeEdit = (params: any) => {
            delete params.img_info;
        };

        const updateAvatarInfo = (avatarInfo: any, formDataProxy: any) => {
            formDataProxy.img = avatarInfo.id;
            formDataProxy.img_info = avatarInfo;
        };

        return {
            formData,
            formItemRules,
            beforeEdit,
            updateAvatarInfo,
        };
    }
});
</script>
