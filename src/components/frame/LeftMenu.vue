<template>
<div class="cigo-left-menu" :style="{'--menuWidth':(sideMenuOpen ? '200px' : '54px')}">
    <logo-area class="left-menu-logo-area"></logo-area>
    <div class="left-menu">
        <menu-list :menuList="menuListRef"></menu-list>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    isReactive,
    toRefs,
    onBeforeMount,
    ref
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

        onBeforeMount(() => {
            getMenuList();
        });

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
            ...toRefs(systemStore.getState().systemState),
            showPage,
            menuListRef
        };
    }
});
</script>

<style lang="scss">
.cigo-left-menu {
    width: var(--menuWidth);
    height: 100vh;
    display: flex;
    flex-direction: column;
    -moz-transition: all 0.5s ease-in-out;
    -webkit-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    transition-delay: 10ms;

    .left-menu {
        display: flex;
        flex: 1;
        background-color: yellow;

        .menu-list {
            width: 100%;
            display: flex;
            flex-direction: column;

            .menu-item {
                display: flex;
                cursor: pointer;
            }
        }
    }
}
</style>
