<template>
<div class="cigo-main-content">
    <div class="main-content-body">
        <router-view v-slot="{ Component }">
            <transition :appear="appearFlag" @enter="enter(Component)" @leave="leave(currComponent)">
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
                    let leaveItem: Menu = menuNameBaseMapRef.value.get(name);
                    if (leaveItem && !leaveItem.can_cache) {
                        // 移除无需缓存的页面打开记录
                        systemStore.removeOpenTab(name);
                    }
                }
            },
            enter: (component: any) => {
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
.cigo-main-content {
    width: 100%;
    height: 0;
    display: flex;
    flex: 1;
    flex-direction: column;

    .main-content-body {
        display: flex;
        flex: 1;
        padding: 10px;
    }

    .main-content-bottom {
        display: flex;
        background-color: blue;
    }
}
</style>
