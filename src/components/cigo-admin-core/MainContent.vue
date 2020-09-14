<template>
<div class="cigo-main-content">
    <div class="main-content-body">
        <router-view v-slot="{ Component }">
            <transition :appear="appearFlag" @leave="leave(currComponent)" @enter="enter(Component)">
                <keep-alive :exclude="noCachePages" :max="maxCachePages">
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </div>
    <bottom-panel class="main-content-bottom"></bottom-panel>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    watch,
    toRefs,
    reactive,
    toRaw,
    toRef,
    provide,
    isRef,
    isReactive,
    inject
} from "vue";

import BottomPanel from "./BottomPanel.vue";

import {
    TweenMax
} from "gsap";

import {
    systemStore
} from "@/store/index";
import {
    Menu
} from "./utils/types";

export default defineComponent({
    name: "CigoMainContent",
    components: {
        BottomPanel
    },
    setup() {
        let noCachePages = ref(["CigoDashboard"]);
        let maxCachePages = ref(200);
        let menuNameBaseMapRef: any = inject("menuNameBaseMapRef");
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );

        let transConfig = reactive({
            appearFlag: ref(true),
            leave: (componentName: string) => {
                if (
                    menuNameBaseMapRef.value &&
                    menuNameBaseMapRef.value.has(componentName)
                ) {
                    //TODO 组件的控制标识设置
                    // 1：组件代码内部可以设置默认标识控制
                    // 2：数据库菜单节点可以配置动态标识控制
                    // 3：优先级：数据库动态控制>组件内部默认控制
                    // 4：标识：是否记录历史、是否显示、是否可关闭、是否缓存
                    let leaveItem: Menu = menuNameBaseMapRef.value.get(name);
                    if (leaveItem && !leaveItem.can_cache) {
                        // 移除无需缓存的页面打开记录
                        systemStore.removeOpenTab(name);
                    }
                }
            },
            enter: (component: any) => {
                //记录打开页面
                systemStore.recordCurrComponent(component);
                //开启切换动画
                //TODO 点击过快，需要取消原动画
                TweenMax.to(".main-content-body", 0, {
                    opacity: 0,
                    marginLeft: 30,
                    onComplete: () => {
                        TweenMax.to(".main-content-body", 0.8, {
                            opacity: 1,
                            marginLeft: 0,
                            delay: 0.15
                        });
                    }
                });
            }
        });

        return {
            noCachePages,
            maxCachePages,
            currComponent,
            ...toRefs(transConfig)
        };
    }
});
</script>

<style lang="scss">
.cigo-main-content {
    width: 100%;
    height: 0;
    display: flex;
    flex: 1;
    flex-direction: column;

    .main-content-body {
        display: flex;
        flex: 1;
        margin: 15px 0px;
        padding: 0px 12px;
        overflow: hidden;
    }
}
</style>
