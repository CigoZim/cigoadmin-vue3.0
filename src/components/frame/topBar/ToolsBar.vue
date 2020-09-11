<template>
<div class="cigo-tools-bar">
    <span>我是顶部工具条</span>
    <icon-font v-if="fullScreenFlag" class="tools-btn full-screen" @click.stop="clickFullScreen" :iconFlag="'cigoadmin-icon-tuichuquanping3'" title="全屏切换"></icon-font>
    <icon-font v-if="!fullScreenFlag" class="tools-btn full-screen" @click.stop="clickFullScreen" :iconFlag="'cigoadmin-icon-quanping'" title="全屏切换"></icon-font>
</div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    ref
} from "vue";
import IconFont from "@/components/frame/other/IconFont.vue";
import {
    isFullScreen,
    toggleFullScreen
} from "../utils/common";

export default defineComponent({
    name: "CigoToolsBar",
    components: {
        IconFont
    },
    setup() {
        let fullScreenFlag = ref(isFullScreen());
        const clickFullScreen = () => {
            toggleFullScreen();
            setTimeout(() => {
                fullScreenFlag.value = isFullScreen();
            }, 100);
        };
        return {
            fullScreenFlag,
            clickFullScreen,
            isFullScreen,
            toggleFullScreen
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
        cursor: pointer;
        width: 15px;
        height: 15px;
    }
}
</style>
