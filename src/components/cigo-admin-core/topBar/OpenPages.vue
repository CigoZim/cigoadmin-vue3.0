<template>
<div class="cigo-open-pages">
    <cigo-icon-font class="more-icon left-more" :name="'cigoadmin-icon-zuo'"></cigo-icon-font>
    <div class="open-tabs-container">
        <div class="open-tabs" @click.stop="openPage(item)" :class="[currComponent == item ? 'curr' : '']" v-for="(item, index) in openTabsRef" :key="index" :style="{'--tabBgColor':getDotColor(item)}">
            <span class="tab-dot" :style="{'--dotBgColor':getDotColor(item)}"></span>
            <span class="tab-name">{{makeTabName(item)}}</span>
            <cigo-icon-font v-if="menuBaseListNameMapRef.has(item) && !menuBaseListNameMapRef.get(item).can_not_close_opentab" class="close-tab-icon" @click.stop="closePage(item)" :name="'cigoadmin-icon-shanchu'"></cigo-icon-font>
        </div>
    </div>
    <cigo-icon-font class="more-icon right-more" :name="'cigoadmin-icon-zuo'"></cigo-icon-font>
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
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
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
    components: {
        CigoIconFont
    },
    setup() {
        let menuBaseListNameMapRef: any = inject("menuBaseListNameMapRef");
        let openTabsRef = toRef(systemStore.getState(), "openTabs");
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );

        const makeTabName = (name: string) => {
            if (
                menuBaseListNameMapRef.value &&
                menuBaseListNameMapRef.value.has(name)
            ) {
                let pageItem = menuBaseListNameMapRef.value.get(name);
                return pageItem && pageItem.title ? pageItem.title : name;
            }
            return name;
        };

        const closePage = (name: string) => {
            if (
                menuBaseListNameMapRef.value &&
                menuBaseListNameMapRef.value.has(name)
            ) {
                let pageItem = menuBaseListNameMapRef.value.get(name);
                if (pageItem) {
                    systemStore.closeOpenTab(
                        name,
                        pageItem,
                        menuBaseListNameMapRef.value
                    );
                }
            }
        };

        const openPage = (name: string) => {
            if (
                menuBaseListNameMapRef.value &&
                menuBaseListNameMapRef.value.has(name)
            ) {
                let pageItem = menuBaseListNameMapRef.value.get(name);
                pageItem ? showPage(pageItem) : false;
            }
        };

        const getDotColor = (name: string) => {
            if (
                menuBaseListNameMapRef.value &&
                menuBaseListNameMapRef.value.has(name)
            ) {
                let pageItem = menuBaseListNameMapRef.value.get(name);
                return pageItem && pageItem.color ? pageItem.color : "#fff";
            }
            return "#fff";
        };

        return {
            currComponent,
            menuBaseListNameMapRef,
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
    height: 41px;
    display: flex;
    flex-direction: row;

    .more-icon {
        width: 18px;
        height: 25px;
        margin-top: 15px;
        background-color: #ddd;
        color: #fff;
        cursor: pointer;
        -moz-transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        -ms-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
        opacity: 0.3;
    }

    .more-icon:hover {
        opacity: 1;
        width: 20px;
        height: 31px;
        margin-top: 10px;
    }

    .left-more {
        margin-right: 3px;
        border-top-left-radius: 3px;
    }

    .right-more {
        margin-left: 5px;
        border-bottom-left-radius: 3px;
        -moz-transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .open-tabs-container {
        height: 58px;
        flex: 1;
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        overflow-y: hidden;

        .open-tabs {
            white-space: nowrap;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            padding: 5px 10px;
            background-color: var(--tabBgColor);
            margin: 10px 8px 0px 0px;
            position: relative;
            opacity: 0.5;

            .tab-dot {
                background-color: var(--dotBgColor);
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
                color: #000;
                font-size: 14px;
            }

            .close-tab-icon {
                width: 0px;
                height: 0px;
                position: absolute;
                color: red;
                background-color: #fff;
                top: -5px;
                right: -5px;
                display: flex;
                opacity: 0;
                border-radius: 50%;
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
            .close-tab-icon {
                width: 18px;
                height: 18px;
                opacity: 1;
            }
        }

        .open-tabs:first-child {
            margin-left: 5px;
        }

        .open-tabs:last-child {
            margin-right: 0px;
        }
    }

    .open-tabs-container::-webkit-scrollbar {
        /** 滚动但不显示滚动条 */
        width: 0px;
    }
}
</style>
