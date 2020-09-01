<template>
<div class="login-page">
    <div class="login-page-form">
        <div class="form-layer shadow three"></div>
        <div class="form-layer shadow two"></div>
        <div class="form-layer shadow one"></div>
        <div class="form-layer content">
            <div class="logo">
                <span>C</span>
            </div>
            <div class="form-item field">
                <label class="label">用户名</label>
                <div class="control">
                    <input class="input" v-model="username" type="text" placeholder="请输入用户名" />
                </div>
            </div>
            <div class="form-item field">
                <label class="label">密码</label>
                <div class="control">
                    <input class="input" v-model="password" type="password" placeholder="请输入密码" />
                </div>
            </div>

            <div class="form-item btns field is-grouped">
                <div class="control">
                    <button class="button is-link" @click="doLogin">登 录</button>
                </div>
                <div class="control">
                    <button class="button is-link is-light">取 消</button>
                </div>
            </div>
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
    toRaw
} from "vue";

import {
    Domain,
    apiRequest,
    apiSign,
    apiErrorCatch
} from "@/common/http";
import {
    string
} from "locutus/python";
import {
    LoginUserInfo
} from "@/types/index";
import {
    systemStore
} from "@/store/index";

export default defineComponent({
    name: "Login",
    setup(props) {
        // 表单数据
        const formData = reactive({
            username: "admin",
            password: "123456"
            // module: "admin"
        });

        // 登录函数
        const doLogin = () => {
            console.log("dologin");
            console.log(formData);

            let params = toRaw(formData);
            const res = apiRequest.v1
                .post("/login", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    console.log("response:", response);
                    let userInfo: LoginUserInfo = {
                        isLogin: true,
                        id: response.data.data.id,
                        token: response.data.data.token,
                        username: response.data.data.username,
                        phone: response.data.data.phone,
                        nickname: response.data.data.nickname,
                        real_name: response.data.data.real_name,
                        email: response.data.data.email,
                        role_flag: response.data.data.role_flag
                    };

                    systemStore.saveUserInfo(userInfo);
                })
                .catch(apiErrorCatch.v1);

            console.log("res:", res);
        };

        return {
            doLogin,
            ...toRefs(formData)
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
    justify-content: center;

    .login-page-form {
        align-self: center;
        width: 800px;
        height: 300px;
        display: flex;
        margin-top: -100px;
        margin-left: 100px;
        position: relative;

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
            }

            .form-item.field {
                .label {
                    font-size: 14px;
                    color: #666;
                }
            }

            .form-item.btns {
                padding-top: 20px;
            }
        }
    }
}
</style>
