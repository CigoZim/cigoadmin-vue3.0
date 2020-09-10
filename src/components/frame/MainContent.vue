<template>
<div class="main-content">
    <div class="main-content-top">
        <content-menu class="main-content-menu"></content-menu>
        <div class="main-content-body">
            <router-view v-slot="{ Component }">
                <transition :appear="appearFlag" @enter="enter(Component)" @leave="leave(currComponent)">
                    <keep-alive :exclude="noCachePages" :max="maxCachePages">
                        <component :is="Component" />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
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

import ContentMenu from "./ContentMenu.vue";
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
    name: "MainContent",
    components: {
        ContentMenu,
        BottomPanel
    },
    setup() {
        let noCachePages = ref(["CigoDashboard"]);
        let maxCachePages = ref(200);
        let menuBaseMapRef: any = inject("menuBaseMapRef");
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );

        let transConfig = reactive({
            appearFlag: ref(true),
            leave: (componentName: string) => {
                if (
                    menuBaseMapRef.value &&
                    menuBaseMapRef.value.has(componentName)
                ) {
                    let leaveItem: Menu = menuBaseMapRef.value.get(name);
                    if (leaveItem && !leaveItem.can_cache) {
                        // 移除无需缓存的页面打开记录
                        systemStore.removeOpenTab(name);
                    }
                }
            },
            enter: (component: any) => {
                console.log("enter", component.type.name);
                //记录打开页面
                systemStore.recordCurrComponent(component.type.name);
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
.main-content {
    display: flex;
    flex: 1;
    flex-direction: column;

    .main-content-top {
        display: flex;
        flex: 1;
        flex-direction: row;

        .main-content-menu {
            display: flex;
        }

        .main-content-body {
            display: flex;
            flex: 1;
            padding: 10px;
        }
    }

    .main-content-bottom {
        display: flex;
        background-color: blue;
    }
}
</style>
