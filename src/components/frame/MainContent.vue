<template>
<div class="main-content">
    <div class="main-content-top">
        <content-left-menu class="main-content-left-menu"></content-left-menu>
        <div class="main-content-body">
            <!-- 知识点——动态组件：https://cn.vuejs.org/v2/guide/components.html#%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6 -->
            <router-view v-slot="{ Component }">
                <transition :css="transCss" :appear="transAppear" :duration="transTime" @before-leave="beforeLeave">
                    <keep-alive :exclude="noCachePages" :max="maxCachePages">
                        <component class="view" :is="Component" />
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
    reactive
} from "vue";

import ContentLeftMenu from "./ContentLeftMenu.vue";
import BottomPanel from "./BottomPanel.vue";

import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "MainContent",
    components: {
        ContentLeftMenu,
        BottomPanel
    },
    setup() {
        let noCachePages = ref(["Dashboard"]);
        let maxCachePages = ref(20);
        let transConfig = reactive({
            transCss: ref(false),
            transAppear: ref(true),
            transTime: 3000,
            beforeLeave: () => {
                console.log("beforeLeave");
                TweenMax.to(".main-content-body", 0.8, {
                    opacity: 0.5,
                    onComplete: () => {
                        TweenMax.to(".main-content-body", 0.8, {
                            opacity: 1
                        });
                    }
                });
            }
        });

        return {
            noCachePages,
            maxCachePages,
            ...toRefs(transConfig)
        };
    }
});
</script>

<style lang="scss">
.main-content {
    display: flex;
    flex: 1;
    background-color: red;
    flex-direction: column;

    .main-content-top {
        display: flex;
        flex: 1;
        flex-direction: row;

        .main-content-left-menu {
            display: flex;
        }

        .main-content-body {
            display: flex;
            flex: 1;
            background-color: #f5f5f5;
        }
    }

    .main-content-bottom {
        display: flex;
        background-color: blue;
    }
}
</style>
