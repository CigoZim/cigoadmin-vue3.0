<template>
<edit :addUrl="'/add/User'" :editUrl="'/edit/User'" :layerData="layerData" :formData="formData" :formItemRules="formItemRules" :beforeEdit="beforeEdit">
    <template v-slot:content="{formDataProxy, validateInfos}">
        <a-form-item label=" " name="img">
            <cigo-avatar :avatarInfo="formDataProxy.img_info" :editable="!layerData.viewFlag" @update:avatarInfo="updateAvatarInfo($event, formDataProxy)"></cigo-avatar>
        </a-form-item>
        <a-form-item label="用户名：" name="username" v-bind="validateInfos.username">
            <a-input v-model:value="formDataProxy.username" placeholder="请输入用户名" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="密码：" name="password" v-bind="validateInfos.password">
            <a-input v-model:value="formDataProxy.password" type="password" placeholder="请设置密码" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="性别" name="sex">
            <a-radio-group v-model:value="formDataProxy.sex" :disabled="layerData.viewFlag">
                <a-radio :value="0">保密</a-radio>
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="昵称：" name="nickname">
            <a-input v-model:value="formDataProxy.nickname" placeholder="请设置昵称" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="手机号：" name="phone" v-bind="validateInfos.phone">
            <a-input v-model:value="formDataProxy.phone" placeholder="请输入手机号" :disabled="layerData.viewFlag" />
        </a-form-item>
        <a-form-item label="邮箱：" name="email" v-bind="validateInfos.email">
            <a-input v-model:value="formDataProxy.email" placeholder="请填写邮箱" :disabled="layerData.viewFlag" />
        </a-form-item>
    </template>
</edit>
</template>

<script lang="ts">
import {
    defineComponent,
    onBeforeMount,
    reactive,
    toRaw
} from "vue";
import CigoAvatar from "@/components/cigo-ui/unit/form/uploader/cigo-avatar.vue";
import Edit from "@/components/cigo-admin-core/pages/template/Edit.vue";

export default defineComponent({
    name: "CigoEditUser",
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
                props.layerData.recordCurr.id : null,
            img: props.layerData.recordCurr ?
                props.layerData.recordCurr.img : 0,
            img_info: props.layerData.recordCurr &&
                props.layerData.recordCurr.img_info ?
                props.layerData.recordCurr.img_info : {
                    id: 0
                },
            username: props.layerData.recordCurr ?
                props.layerData.recordCurr.username : "",
            nickname: props.layerData.recordCurr ?
                props.layerData.recordCurr.nickname : "",
            password: "",
            sex: props.layerData.recordCurr ?
                props.layerData.recordCurr.sex : 0,
            phone: props.layerData.recordCurr ?
                props.layerData.recordCurr.phone : "",
            email: props.layerData.recordCurr ?
                props.layerData.recordCurr.email : ""
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
            phone: [{
                    required: true,
                    message: "请输入手机号"
                },
                {
                    len: 11,
                    message: "手机号错误"
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
            updateAvatarInfo
        };
    }
});
</script>
