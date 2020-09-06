<template>
<div class="cigo-left-menu">
    <logo-area class="left-menu-logo-area"></logo-area>
    <div class="left-menu-list-container" :style="{'--leftMenuContainerWidth': leftMenuContainerWidth}">
        <div class="left-menu-list">
            <menu-list :menuList="menuListRef" :level="0"></menu-list>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    isReactive,
    onBeforeMount,
    ref,
    toRef,
    watch,
    onMounted,
    provide,
    toRefs
} from "vue";
import {
    useRouter,
    useRoute
} from "vue-router";
import LogoArea from "./leftMenu/LogoArea.vue";
import MenuList from "./leftMenu/MenuList.vue";
import {
    systemStore
} from "@/store/index";
import {
    apiRequest,
    apiSign,
    apiErrorCatch
} from "@/common/http";
import {
    Menu
} from "@/components/frame/types/index";
import {
    TweenMax
} from "gsap";
import {
    makeRandomColor
} from "@/components/frame/utils/common";

export default defineComponent({
    name: "LeftMenu",
    components: {
        LogoArea,
        MenuList
    },
    setup(props, context) {
        const router = useRouter();
        let menuList: Menu[] = [];
        let menuListRef = ref(menuList);
        let menuOpenFlag = toRef(
            systemStore.getState().systemState,
            "sideMenuOpen"
        );

        onBeforeMount(() => {
            getMenuList();
        });
        watch(menuOpenFlag, (openFlag: boolean, preOpenFLag: boolean) => {
            menuChange(openFlag);
        });

        onMounted(() => {
            menuChange(menuOpenFlag.value);
        });

        const menuChange = (openFlag: boolean) => {
            TweenMax.to([".cigo-left-menu", ".left-menu-list"], 0.8, {
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
            });
        };

        // 加载页面
        const showPage = (path: string) => {
            router.push(path);
        };
        // 获取菜单数据
        const getMenuList = () => {
            apiRequest.v1
                .get("/menu", {
                    headers: apiSign({})
                })
                .then(response => {
                    menuListRef.value = response.data.data;
                    initMenuItemColor(menuListRef.value);
                })
                .catch(apiErrorCatch.v1);
        };

        const initMenuItemColor = (list: Menu[]) => {
            list.every((val: Menu, index: number, arr) => {
                val.color = makeRandomColor(1, 100, 250);
                if (val.subList && val.subList.length) {
                    initMenuItemColor(val.subList);
                }
                return true;
            });
        };

        return {
            ...toRefs(systemStore.getState().systemState),
            showPage,
            menuListRef
        };
    }
});
</script>

<style lang="scss">
.cigo-left-menu {
    widows: 0px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: blue;

    .left-menu-list-container {
        background-color: transparent;
        position: absolute;
        width: var(--leftMenuContainerWidth);
        top: 10vh;
        display: flex;
        height: 90vh;
        overflow-y: scroll;
        overflow-x: hidden;
        -moz-transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        -ms-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;

        .left-menu-list {
            width: 0px;
            display: flex;
            height: 100%;
            position: relative;
        }
    }

    .left-menu-list-container::-webkit-scrollbar {
        /** 滚动但不显示滚动条 */
        width: 0px;
    }
}
</style>
