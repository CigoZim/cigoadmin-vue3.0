<template>
<div class="edit-user">
    <div class="title-area">
        <span>{{layerData.title}}</span>
    </div>
    <div class="content-area">
        <a-form class="form-item" :label-col="labelCol" :wrapper-col="wrapperCol" :validate-trigger="'blur'">
            <a-form-item label="用户名：" name="username" v-bind="validateInfos.username">
                <a-input v-model:value="formDataRef.username" placeholder="请输入用户名" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="密码：" name="password" v-bind="validateInfos.password">
                <a-input v-model:value="formDataRef.password" type="password" placeholder="请设置密码" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="性别" name="sex">
                <a-radio-group v-model:value="formDataRef.sex" :disabled="layerData.viewFlag">
                    <a-radio :value="0">保密</a-radio>
                    <a-radio :value="1">男</a-radio>
                    <a-radio :value="2">女</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="手机号：" name="phone" v-bind="validateInfos.phone">
                <a-input v-model:value="formDataRef.phone" placeholder="请输入手机号" :disabled="layerData.viewFlag" />
            </a-form-item>
            <a-form-item label="邮箱：" name="email" v-bind="validateInfos.email">
                <a-input v-model:value="formDataRef.email" placeholder="请填写邮箱" :disabled="layerData.viewFlag" />
            </a-form-item>
        </a-form>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doSubmit" v-if="!layerData.viewFlag">{{layerData.userCurr ? '修 改' : '添 加'}}</a-button>
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
    AuthGroup,
    User
} from "@/components/cigo-admin-core/utils/types";
import cigoLayer from "@/components/cigo-layer";
import {
    useForm
} from "@ant-design-vue/use";
import {
    toArray
} from "lodash";
import {
    defineComponent,
    onBeforeMount,
    reactive,
    toRaw
} from "vue";
export default defineComponent({
    name: "CigoEditUser",
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let formDataRef = reactive({
            id: props.layerData.userCurr ? props.layerData.userCurr.id : null,
            username: props.layerData.userCurr ?
                props.layerData.userCurr.username : "",
            password: props.layerData.userCurr ?
                props.layerData.userCurr.password : 100,
            sex: props.layerData.userCurr ? props.layerData.userCurr.sex : 0,
            phone: props.layerData.userCurr ?
                props.layerData.userCurr.phone : "",
            email: props.layerData.userCurr ?
                props.layerData.userCurr.email : ""
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
        });

        const {
            resetFields,
            validate,
            validateInfos,
            mergeValidateInfo
        } = useForm(formDataRef, formItemRules);

        const doSubmit = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params: any = {};
                    Object.assign(params, toRaw(formDataRef));
                    apiRequest.v1
                        .post(
                            props.layerData.userCurr ? "/editUser" : "/addUser",
                            params, {
                                headers: apiSign(params)
                            }
                        )
                        .then(response => {
                            //更新本地数据
                            if (props.layerData.userCurr) {
                                editRefreshLocalList(response.data.data);
                            } else {
                                addRefreshLocalList(response.data.data);
                            }
                            //刷新列表数据
                            ctx.emit(
                                "notify",
                                "refresh",
                                toRaw(props.layerData.userListRef.value)
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
            Object.assign(props.layerData.userCurr, newData);
        };
        const addRefreshLocalList = (newData: User) => {
            // 转化为响应式对象
            let newDataRef = reactive(newData);
            // 挂载新节点
            props.layerData.userListRef.value = [
                newDataRef,
                ...props.layerData.userListRef.value
            ];
        };

        const cancel = () => {
            console.log(formDataRef);

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
            doSubmit,
            cancel
        };
    }
});
</script>

<style lang="scss">
.edit-user {
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
