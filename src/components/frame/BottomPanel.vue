<template>
    <div class="cigo-bottom-panel">
        <div>
            <span class="info-item">前端基于Vue-v3.0.0-0</span>
        </div>
        <div>
            <span class="info-item">后端（Tp6版：ThinkPHP-v6.0.3，NestJs版：NestJs-v7.0.0）</span>
        </div>
        <div>
            <span class="info-item">开源：码云、Github、西谷云</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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

    .info-item {
        color: #757575;
        font-size: 10px;
        margin-right: 10px;
    }
}
</style>
