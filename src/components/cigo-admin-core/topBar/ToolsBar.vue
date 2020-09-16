<template>
<div class="cigo-tools-bar">
    <cigo-icon-font class="tools-btn search" @click.stop="clickFullScreen" :name="'cigoadmin-icon-sousuo1'" title="全文搜索"></cigo-icon-font>
    <cigo-icon-font v-if="fullScreenFlag" class="tools-btn full-screen" @click.stop="clickFullScreen" :name="'cigoadmin-icon-tuichuquanping3'" title="全屏切换"></cigo-icon-font>
    <cigo-icon-font v-if="!fullScreenFlag" class="tools-btn full-screen" @click.stop="clickFullScreen" :name="'cigoadmin-icon-quanping'" title="全屏切换"></cigo-icon-font>
    <cigo-icon-font class="tools-btn trash" @click.stop="clickFullScreen" :name="'cigoadmin-icon-lajitong'" title="回收站"></cigo-icon-font>
    <cigo-icon-font class="tools-btn font-size" @click.stop="clickFullScreen" :name="'cigoadmin-icon-fuhao-ziti'" title="字体大小"></cigo-icon-font>
    <cigo-icon-font class="tools-btn cache" @click.stop="clickFullScreen" :name="'cigoadmin-icon-saoba'" title="缓存清理"></cigo-icon-font>
    <cigo-icon-font class="tools-btn language" @click.stop="clickFullScreen" :name="'cigoadmin-icon-zhongyingwen1'" title="语言切换"></cigo-icon-font>
    <cigo-icon-font class="tools-btn theme" @click.stop="clickFullScreen" :name="'cigoadmin-icon-zhuti'" title="主题切换"></cigo-icon-font>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref
} from "vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import {
    isFullScreen,
    toggleFullScreen
} from "../utils/common";

export default defineComponent({
    name: "CigoToolsBar",
    components: {
        CigoIconFont
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
        width: 30px;
        height: 30px;
        color: #353535;
        margin-right: 5px;
        padding: 7px;
        border-radius: 5px;
    }

    .tools-btn:hover {
        background-color: #cccccc55;
    }
}
</style>
