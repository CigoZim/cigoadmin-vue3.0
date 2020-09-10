<template>
<div class="cigo-open-pages">
    <div class="open-tabs-container">
        <div class="open-tabs" @click.stop="openPage(item)" :class="[currComponent == item ? 'curr' : '']" v-for="(item, index) in openTabsRef" :key="index">
            <span class="tab-dot" :style="{'--dotColor':getDotColor(item)}"></span>
            <span class="tab-name">{{makeTabName(item)}}</span>
            <span v-if="menuBaseMapRef.has(item) && menuBaseMapRef.get(item).can_close_tab" class="close-tab-icon" @click.stop="closePage(item)">x</span>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    isReactive,
    isRef,
    reactive,
    ref,
    toRef,
    watch
} from "vue";
import {
    State,
    systemStore
} from "@/store";
import {
    SystemState
} from "../utils/types";
import {
    showPage
} from "../utils/common";

//TODO 继续优化
export default defineComponent({
    name: "CigoOpenPages",
    setup() {
        let menuBaseMapRef: any = inject("menuBaseMapRef");
        let openTabsRef = toRef(systemStore.getState(), "openTabs");
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );

        const makeTabName = (name: string) => {
            if (menuBaseMapRef.value && menuBaseMapRef.value.has(name)) {
                let pageItem = menuBaseMapRef.value.get(name);
                return pageItem && pageItem.title ? pageItem.title : name;
            }
            return name;
        };

        const closePage = (name: string) => {
            console.log("closepage");

            if (menuBaseMapRef.value && menuBaseMapRef.value.has(name)) {
                let pageItem = menuBaseMapRef.value.get(name);
                if (pageItem) {
                    systemStore.closeOpenTab(
                        name,
                        pageItem,
                        menuBaseMapRef.value
                    );
                }
            }
        };

        const openPage = (name: string) => {
            console.log("openPage");

            if (menuBaseMapRef.value && menuBaseMapRef.value.has(name)) {
                let pageItem = menuBaseMapRef.value.get(name);
                pageItem ? showPage(pageItem) : false;
            }
        };

        const getDotColor = (name: string) => {
            if (menuBaseMapRef.value && menuBaseMapRef.value.has(name)) {
                let pageItem = menuBaseMapRef.value.get(name);
                return pageItem && pageItem.color ? pageItem.color : "#fff";
            }
            return "#fff";
        };

        return {
            currComponent,
            menuBaseMapRef,
            openTabsRef,
            makeTabName,
            closePage,
            openPage,
            getDotColor
        };
    }
});
</script>

<style lang="scss">
.cigo-open-pages {
    width: 100%;
    overflow: hidden;
    height: 41px;

    .open-tabs-container {
        width: 80vw; //TODO flex=1 内容超出导致宽度超出屏幕
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        overflow-y: hidden;

        .open-tabs {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-bottom: 0px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            padding: 5px 8px;
            background-color: #ddd;
            margin: 10px 8px 0px 0px;
            position: relative;
            opacity: 0.5;

            .tab-dot {
                background-color: var(--dotColor);
                width: 0px;
                height: 0px;
                border-radius: 0px;
                margin-right: 0px;
                -moz-transition: all 0.5s ease-in-out;
                -webkit-transition: all 0.5s ease-in-out;
                -o-transition: all 0.5s ease-in-out;
                -ms-transition: all 0.5s ease-in-out;
                transition: all 0.5s ease-in-out;
            }

            .tab-name {
                color: #444;
                font-size: 13px;
            }

            .close-tab-icon {
                background-color: #cc1111;
                border: 1px solid #c0c0c0;
                width: 0px;
                height: 0px;
                border-radius: 0px;
                position: absolute;
                color: #fff;
                top: 0px;
                right: 0px;
                display: flex;
                opacity: 0;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 0px;
                padding-bottom: 3px;
                -moz-transition: all 0.5s ease-in-out;
                -webkit-transition: all 0.5s ease-in-out;
                -o-transition: all 0.5s ease-in-out;
                -ms-transition: all 0.5s ease-in-out;
                transition: all 0.5s ease-in-out;
            }
        }

        .open-tabs.curr,
        .open-tabs:hover {
            opacity: 1;
            border-top: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0;
            border-right: 1px solid #f0f0f0;

            .tab-name {
                color: #fff;
            }
        }

        .open-tabs.curr {
            background-color: #4671dd;

            .tab-dot {
                width: 8px;
                height: 8px;
                border-radius: 4px;
                margin-right: 6px;
            }
        }

        .open-tabs:hover {
            background-color: #46d1ad;

            .close-tab-icon {
                border: 1px solid #c0c0c0;
                width: 18px;
                height: 18px;
                font-size: 15px;
                top: -5px;
                right: -5px;
                border-radius: 9px;
                opacity: 1;
                font-size: 15px;
            }
        }

        .open-tabs:first-child {
            margin-left: 8px;
        }
    }

    .open-tabs-container::-webkit-scrollbar {
        /** 滚动但不显示滚动条 */
        width: 0px;
    }
}
</style>
