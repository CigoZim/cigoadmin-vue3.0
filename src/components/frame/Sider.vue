<template>
<div class="cigo-sider">
    <logo-area class="sider-logo-area"></logo-area>
    <div class="sider-menu-list-container" :style="{'--leftMenuContainerWidth': leftMenuContainerWidth}">
        <div class="sider-menu-list">
            <menu-list :menuList="menuTreeListRef" :level="0"></menu-list>
        </div>
    </div>
    <div class="copy-right">
        <span>@西谷开源 出品</span>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    toRef,
    watch,
    onMounted,
    toRefs,
    inject
} from "vue";
import LogoArea from "./sider/LogoArea.vue";
import MenuList from "./sider/MenuList.vue";
import {
    systemStore
} from "@/store/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "CigoSider",
    components: {
        LogoArea,
        MenuList
    },
    setup(props, context) {
        let menuTreeListRef = inject("menuTreeListRef");
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
            TweenMax.to(
                [
                    ".cigo-sider",
                    ".sider-logo-area",
                    ".sider-menu-list",
                    ".copy-right"
                ],
                0.8, {
                    width: openFlag ? "240px" : "103px",
                    onStart: () => {
                        if (openFlag) {
                            systemStore.setLeftMenuContainerWidth("250px");
                        }
                    },
                    onComplete: () => {
                        if (!openFlag) {
                            systemStore.setLeftMenuContainerWidth("113px");
                        }
                    }
                }
            );
        };

        return {
            ...toRefs(systemStore.getState().systemState),
            menuTreeListRef
        };
    }
});
</script>

<style lang="scss">
.cigo-sider {
    width: 0px;
    height: 100vh;
    display: flex;
    z-index: 8000;
    flex-direction: column;
    position: relative;
    background-color: #424d52;

    .sider-menu-list-container {
        background-color: transparent;
        position: absolute;
        width: var(--leftMenuContainerWidth);
        top: 10vh;
        display: flex;
        height: 85vh;
        overflow-y: scroll;
        overflow-x: hidden;
        //TODO 待解决，因transition导致的TweenMax动画卡顿问题
        -moz-transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        -ms-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;

        .sider-menu-list {
            width: 0px;
            display: flex;
            height: 100%;
            position: relative;
        }
    }

    .sider-menu-list-container::-webkit-scrollbar {
        /** 滚动但不显示滚动条 */
        width: 0px;
    }

    .copy-right {
        position: absolute;
        bottom: 0px;
        width: 0px;
        height: 5vh;
        color: #f5f5f5;
        font-size: 10px;
        border-top: 1px solid #555;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: row;
        padding-top: 10px;
    }
}
</style>
