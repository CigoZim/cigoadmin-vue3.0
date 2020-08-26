<template>
<div class="login-page">
    <span>登录页面</span>
</div>
</template>

<script>
import {
    defineComponent
} from "vue";

import {
    Domain
} from "@/common/http";

export default defineComponent({
    name: "Login",
    setup(props) {
        console.log("domain:", Domain.cdnOpen);
    }
});
</script>

<style lang="scss">
.login-page {
    display: flex;
}
</style>
