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
            showPage,
            menuListRef
        };
    }
});
</script>

<style lang="scss">
.cigo-left-menu {
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
