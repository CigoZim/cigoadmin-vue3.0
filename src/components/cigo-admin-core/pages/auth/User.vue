<template>
    <div class="cigo-user">
        <span>用户管理</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "CigoUser",
    setup(props) {
        console.log("22222 init");

        return {};
    }
});
</script>

<style lang="scss">
.cigo-user {
    display: flex;

    color: blue;
}
</style>
