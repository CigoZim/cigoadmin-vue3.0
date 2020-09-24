<template>
<div class="login-page">
    <div class="login-page-form">
        <div class="form-layer shadow three"></div>
        <div class="form-layer shadow two"></div>
        <div class="form-layer shadow one">
            <div class="adv-content">
                <p class="title">{{Env.VUE_APP_PROJECT_NAME_EN +"："+Env.VUE_APP_PROJECT_NAME_CN}}</p>
                <p class="sub-title">——{{Env.VUE_APP_COMPANY_SHORT}}出品</p>
            </div>
        </div>
        <div class="form-layer content">
            <div class="logo">
                <span>C</span>
            </div>

            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="用户名：" v-bind="validateInfos.username">
                    <a-input v-model:value="username" placeholder="请输入用户名" />
                </a-form-item>
                <a-form-item label="密 码：" v-bind="validateInfos.password">
                    <a-input v-model:value="password" placeholder="请输入密码" />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 22, offset: 6 }">
                    <a-button type="primary" @click="doLogin">登 陆</a-button>
                    <a-button style="margin-left: 10px;" @click="resetFields">重 置</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    readonly,
    toRaw,
    onUnmounted
} from "vue";

import {
    apiRequest,
    apiSign,
    apiErrorCatch
} from "@/common/http";
import {
    User
} from "@/components/cigo-admin-core/utils/types";
import {
    systemStore
} from "@/store/index";
import {
    TweenMax
} from "gsap";
import toArray from "lodash/toArray";
import {
    useForm
} from "@ant-design-vue/use";
import cigoLayer from "@/components/cigo-layer";
import router from "@/router";

export default defineComponent({
    name: "Login",
    setup(props) {
        let Env = reactive(process.env);
        const modelRef = reactive({
            username: "admin",
            password: "123456",
            module: "admin"
        });
        const rulesRef = reactive({
            username: [{
                required: true,
                message: "请输入用户名"
            }],
            password: [{
                required: true,
                message: "请输入密码"
            }]
        });
        const {
            resetFields,
            validate,
            validateInfos,
            mergeValidateInfo
        } = useForm(modelRef, rulesRef);

        onMounted(() => {
            TweenMax.to(".login-page-form", 1, {
                top: "30%",
                right: "10%",
                opacity: 1,
                delay: 0.8
            });
        });

        const doLogin = (e: any) => {
            e.preventDefault();
            validate()
                .then(() => {
                    let params = toRaw(modelRef);
                    apiRequest.v1
                        .post("/login", params, {
                            headers: apiSign(params)
                        })
                        .then(response => {
                            let userInfo: User = response.data.data;
                            userInfo.isLogin = true;
                            cigoLayer.msg("登录成功");
                            systemStore.saveUserInfo(userInfo);

                            router.push("/");
                        })
                        .catch(apiErrorCatch.v1);
                })
                .catch(err => {
                    console.log("error", err);
                });
        };

        return {
            Env,
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 16
            },
            validateInfos,
            resetFields,
            doLogin,
            ...toRefs(modelRef)
        };
    }
});
</script>

<style lang="scss">
.login-page {
    display: flex;
    background-color: #4671dd;
    height: 100vh;
    flex: 1;
    flex-direction: row;
    position: relative;

    .login-page-form {
        width: 880px;
        height: 300px;
        position: absolute;
        right: 50px;
        bottom: 50px;
        opacity: 0;

        .form-layer {
            border-radius: 5px;
            position: absolute;
        }

        .form-layer.shadow {
            width: 100%;
            height: 300px;
        }

        .form-layer.three {
            top: 24px;
            left: 24px;
            background-color: #4b76e1;
            z-index: 1;
            opacity: 0.85;
        }

        .form-layer.two {
            top: 12px;
            left: 12px;
            background-color: #5785ed;
            z-index: 2;
            opacity: 0.95;
        }

        .form-layer.one {
            display: flex;
            background-color: #6b9afa;
            z-index: 3;
            opacity: 0.8;

            .adv-content {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 40px;

                .title {
                    font-size: 35px;
                    font-style: italic;
                    color: #fff;
                    font-weight: 700;
                    -webkit-box-reflect: below 8px -webkit-linear-gradient(transparent, transparent 40%, rgba(255, 255, 255, 0.3));
                }

                .sub-title {
                    font-size: 14px;
                    color: #fff;
                    font-weight: 500;
                    margin-left: 280px;
                    margin-top: 30px;
                }
            }
        }

        .form-layer.content {
            right: 30px;
            top: -80px;
            background-color: #fff;
            z-index: 100;
            width: 300px;
            height: 420px;
            padding: 0px 18px;

            .logo {
                width: 70px;
                height: 70px;
                border: 1px solid #f0f0f0;
                border-radius: 10px;
                margin: 27px auto 31px;
                color: #4b76e1;
                font-size: 4em;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-weight: 900;
                font-style: italic;
                padding-top: 5px;
                padding-right: 6px;
            }
        }
    }
}
</style>
