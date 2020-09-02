<template>
<div class="cigo-logo-area">
    <p class="short-title">C</p>
    <p class="full-title">CigoAdmin 西谷后台</p>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    watch,
    ref,
    toRef
} from "vue";

import {
    systemStore
} from "@/store/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "LogoArea",
    setup() {
        let menuOpenFlag = toRef(
            systemStore.getState().systemState,
            "sideMenuOpen"
        );
        watch(menuOpenFlag, (openFlag: boolean, preOpenFLag: boolean) => {
            menuChange(openFlag);
        });

        onMounted(() => {
            menuChange(menuOpenFlag.value);
        });

        const menuChange = (openFlag: boolean) => {
            TweenMax.to(".short-title", openFlag ? 1 : 0.3, {
                opacity: openFlag ? 0 : 1,
                delay: openFlag ? 0.5 : 0
            });
            TweenMax.to(".full-title", openFlag ? 1 : 0.3, {
                opacity: openFlag ? 1 : 0,
                delay: openFlag ? 0.5 : 0
            });
        };

        return {
            menuOpenFlag
        };
    }
});
</script>

<style lang="scss">
.cigo-logo-area {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #6b9afa;
    position: relative;

    .short-title {
        color: #fff;
        font-size: 2.5em;
        font-weight: 900;
        font-style: italic;
        padding-left: 8px;
        position: absolute;
    }

    .full-title {
        // width: "200px";
        font-size: 1.15em;
        font-style: italic;
        color: #fff;
        font-weight: 700;
        padding-left: 5px;
        overflow: hidden;
        position: absolute;
    }
}
</style>
