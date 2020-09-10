<template>
<div class="cigo-tools-bar">
    <span>我是顶部工具条</span>
    <span class="tools-btn go-fullscreen" @click.stop="goFullScreen">全屏</span>
    <span class="tools-btn exit-fullscreen" @click.stop="exitFullScreen">退出全屏</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
import {
    goFullScreen,
    exitFullScreen
} from "../utils/common";

export default defineComponent({
    name: "CigoToolsBar",
    setup() {
        return {
            goFullScreen,
            exitFullScreen
        };
    }
});
</script>

<style lang="scss">
.cigo-tools-bar {
    display: flex;
    flex-direction: row;
    align-items: center;

    .tools-btn {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
    }
}
</style>
