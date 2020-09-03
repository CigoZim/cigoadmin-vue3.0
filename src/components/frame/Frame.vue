<template>
<div id="app" class="cigo-frame">
    <left-menu class="frame-left-menu"></left-menu>
    <div class="frame-right">
        <top-bar class="frame-top-bar"></top-bar>
        <main-content class="frame-main-content" />
    </div>
    <right-panel class="frame-right-panel"></right-panel>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted
} from "vue";

import LeftMenu from "./LeftMenu.vue";
import TopBar from "./TopBar.vue";
import MainContent from "./MainContent.vue";
import RightPanel from "./RightPanel.vue";

import {
    Domain
} from "@/common/http";

export default defineComponent({
    name: "Frame",
    components: {
        LeftMenu,
        TopBar,
        MainContent,
        RightPanel
    },
    setup() {
        onMounted(() => {
            console.log("frame mounted");
        });
    }
});
</script>

<style lang="scss">
.cigo-frame {
    display: flex;
    flex-direction: row;

    .frame-right {
        display: flex;
        background-color: #fff;
        flex: 1;
        flex-direction: column;
    }
}
</style>
