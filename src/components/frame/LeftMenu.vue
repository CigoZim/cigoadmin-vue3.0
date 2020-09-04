<template>
<div class="cigo-left-menu">
    <logo-area class="left-menu-logo-area"></logo-area>
    <div class="left-menu-list">
        <menu-list :menuList="menuListRef" :level="0"></menu-list>
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
    onMounted
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
            TweenMax.to(".cigo-left-menu", 0.8, {
                width: openFlag ? "240px" : "103px",
                delay: 0
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
                })
                .catch(apiErrorCatch.v1);
        };

        return {
            showPage,
            menuListRef
        };
    }
});
</script>

<style lang="scss">
.cigo-left-menu {
    width: 240px;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .left-menu-list {
        display: flex;
        flex: 1;
        // overflow-y: auto;
        // overflow-x: hidden;
    }

    .left-menu-list::-webkit-scrollbar {
        /** 滚动但不显示滚动条 */
        width: 0px;
    }
}
</style>
