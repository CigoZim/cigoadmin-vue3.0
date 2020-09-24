<template>
<div class="edit-manager">
    <div class="title-area">
        <span>{{layerData.title}}</span>
    </div>
    <div class="content-area">
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol" :validate-trigger="'blur'">
            <a-form-item label=" " name="img">
                <cigo-avatar :avatarInfo="formDataRef.img_info" :editable="!layerData.viewFlag" @update:avatarInfo="updateAvatarInfo"></cigo-avatar>
            </a-form-item>
            <a-form-item label="管理员类型" name="role_flag">
                <a-radio-group v-model:value="formDataRef.role_flag" :disabled="layerData.viewFlag">
                    <a-radio :value="2">管理员</a-radio>
                    <a-radio :value="4">超级管理员</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="用户名：" name="username" v-bind="validateInfos.username">
                <a-input v-model:value="formDataRef.username" placeholder="请输入用户名" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="密码：" name="password" v-bind="validateInfos.password">
                <a-input v-model:value="formDataRef.password" type="password" placeholder="请设置密码" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="昵称：" name="nickname">
                <a-input v-model:value="formDataRef.nickname" placeholder="请设置昵称" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="邮箱：" name="email" v-bind="validateInfos.email">
                <a-input v-model:value="formDataRef.email" placeholder="请填写邮箱" :disabled="layerData.viewFlag" />
            </a-form-item>
            <div class="line"></div>
            <a-form-item label="角色配置：" name="auth_group">
                <a-tree v-model:checkedKeys="formDataRef.auth_group" :replaceFields="{children: 'subList', key: 'id'}" checkable :auto-expand-parent="true" :defaultExpandAll="true" :tree-data="layerData.groupList" :disabled="layerData.viewFlag" />
            </a-form-item>
        </a-form>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doSubmit" v-if="!layerData.viewFlag">{{layerData.managerCurr ? '修 改' : '添 加'}}</a-button>
            <a-button type="default" @click.stop="cancel">{{layerData.viewFlag ? '关 闭' :'取 消'}}</a-button>
        </a-button-group>
    </div>
</div>
</template>

<script lang="ts">
import {
    apiErrorCatch,
    apiRequest,
    apiSign,
    bucket
} from "@/common/http";
import {
    User
} from "@/components/cigo-admin-core/utils/types";
import cigoLayer from "@/components/cigo-layer";
import CigoAvatar from "@/components/cigo-ui/unit/form/uploader/cigo-avatar.vue";
import {
    useForm
} from "@ant-design-vue/use";
import {
    toArray
} from "lodash";
import {
    defineComponent,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    toRaw,
    toRef,
    watch
} from "vue";
export default defineComponent({
    name: "CigoEditManager",
    components: {
        CigoAvatar
    },
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let formDataRef = reactive({
            id: props.layerData.managerCurr ?
                props.layerData.managerCurr.id : null, //Tips_Flag PHP后端识别null为空
            img: props.layerData.managerCurr ?
                props.layerData.managerCurr.img : 0,
            img_info: props.layerData.managerCurr &&
                props.layerData.managerCurr.img_info ?
                props.layerData.managerCurr.img_info : {
                    id: 0
                }, //Tips_Flag 前端识别undefined
            role_flag: props.layerData.managerCurr ?
                props.layerData.managerCurr.role_flag : 2,
            username: props.layerData.managerCurr ?
                props.layerData.managerCurr.username : "",
            nickname: props.layerData.managerCurr ?
                props.layerData.managerCurr.nickname : "",
            password: "",
            email: props.layerData.managerCurr ?
                props.layerData.managerCurr.email : "",
            auth_group: props.layerData.managerCurr ?
                props.layerData.managerCurr.auth_group : []
        });
        const formItemRules = reactive({
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
        });
        const {
            resetFields,
            validate,
            validateInfos,
            mergeValidateInfo
        } = useForm(formDataRef, formItemRules);

        const updateAvatarInfo = (avatarInfo: any) => {
            formDataRef.img = avatarInfo.id;
            formDataRef.img_info = avatarInfo;
        };

        const doSubmit = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params: any = {};
                    Object.assign(params, toRaw(formDataRef));
                    delete params.img_info;
                    apiRequest.v1
                        .post(
                            props.layerData.managerCurr ?
                            "/edit/Manager" :
                            "/add/Manager",
                            params, {
                                headers: apiSign(params)
                            }
                        )
                        .then(response => {
                            //更新本地数据
                            if (props.layerData.managerCurr) {
                                editRefreshLocalList(response.data.data);
                            } else {
                                addRefreshLocalList(response.data.data);
                            }
                            //刷新列表数据
                            ctx.emit(
                                "notify",
                                "refresh",
                                toRaw(props.layerData.managerListRef.value)
                            );
                            //提示及关闭窗口
                            cigoLayer.msg(response.data.msg);
                            ctx.emit("close");
                        })
                        .catch(apiErrorCatch.v1);
                })
                .catch(err => {
                    console.log("error", err);
                });
        };

        const editRefreshLocalList = (newData: User) => {
            Object.assign(props.layerData.managerCurr, newData);
        };
        const addRefreshLocalList = (newData: User) => {
            // 转化为响应式对象
            let newDataRef = reactive(newData);
            // 挂载新节点
            props.layerData.managerListRef.value = [
                newDataRef,
                ...props.layerData.managerListRef.value
            ];
        };

        const cancel = () => {
            ctx.emit("close");
        };

        return {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 19
            },
            validateInfos,
            formDataRef,
            updateAvatarInfo,
            doSubmit,
            cancel
        };
    }
});
</script>

<style lang="scss">
.edit-manager {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .title-area {
        background-color: #f5f5f5;
        border-bottom: 1px solid #f0f0f0;
        padding: 15px 12px;
        display: flex;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        flex-direction: row;
        justify-content: center;
        font-size: 16px;
    }

    .content-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        flex: 1;
        padding: 8px 12px;
        overflow-x: hidden;
        overflow-y: scroll;

        .form-item {
            width: 100%;

            .line {
                width: 90%;
                height: 1px;
                background-color: #f0f0f0;
                margin: 0px auto;
            }
        }
    }

    .btn-area {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 8px 12px;
        border-top: 1px solid #f0f0f0;
    }
}
</style>
