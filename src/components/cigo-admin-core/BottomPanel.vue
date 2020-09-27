<template>
<div class="cigo-bottom-panel">
    <div>
        <span class="info-item">前端基于Vue-v3.0.0-0</span>
    </div>
    <div>
        <span class="info-item">后端（Tp6版：ThinkPHP-v6.0.3，NestJs版：NestJs-v7.0.0）</span>
    </div>
    <div>
        <div class="info-item">
            <span>码云：</span>
            <a href='https://gitee.com/cigozim/cigoadmin-vue3.0/stargazers'><img src='https://gitee.com/cigozim/cigoadmin-vue3.0/badge/star.svg?theme=white' alt='star' /></a>
            <a href='https://gitee.com/cigozim/cigoadmin-vue3.0/members'><img src='https://gitee.com/cigozim/cigoadmin-vue3.0/badge/fork.svg?theme=white' alt='fork' /></a>
            <span class="divider"></span>
            <span>Github</span>
            <span class="divider"></span>
            <span>西谷云</span>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: "CigoBottomPanel"
});
</script>

<style lang="scss">
.cigo-bottom-panel {
    display: flex;
    border-top: 1px solid #e5e5e5;
    background-color: #f7f7f7;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px 10px;
    box-shadow: 0px -2px 10px #f0f0f0;

    .info-item {
        color: #757575;
        font-size: 10px;
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .divider {
            margin: 0px 10px;
            display: inline-block;
            width: 1px;
            height: 13px;
            background-color: #ddd;
        }
    }
}
</style>
