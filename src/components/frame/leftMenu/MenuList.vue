<template>
<div class="cigo-menu-list">
    <div class="menu-container" :class="makeMenuItemContainerClass(item)" v-for="(item, index) in menuList" :key="index" @click.stop="clickMenu(item)">
        <div class="menu-common" :class="makeMenuItemClass(item)">
            <div class="item-left">
                <i class="item-line" v-if="!item.group_flag"></i>
                <icon-font class="item-icon" v-if="!item.group_flag" :style="[item.color ? {color: item.color} : {}]" :iconFlag="item.icon"></icon-font>
            </div>
            <div class="item-right">
                <span class="item-title" :class="[level==0 && !item.group_flag && titleGoneFlag ? 'gone' : '']">{{item.title}}</span>
                <label class="item-label" :class="[item.label_class]" :style="[item.color ? {backgroundColor: item.color} : {}]">22</label>
                <icon-font class="item-more" :class="[!item.group_flag && item.subList && item.subList.length ? 'show' : 'hide']" :iconFlag="'cigoadmin-icon-expand'"></icon-font>
            </div>
        </div>
        <menu-list class="item-sublist" v-if="item.subList && item.subList.length" :style="{'--subListHeight': (item.subList && item.subList.length ? item.subList.length * 40 + 'px' : 'auto')}" :menuList="item.subList" :level="level+1"></menu-list>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    ref,
    computed,
    toRef,
    watch,
    onBeforeMount
} from "vue";
import IconFont from "@/components/frame/other/IconFont.vue";
import {
    systemStore
} from "@/store/index";
import {
    Menu
} from "@/components/frame/types";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "MenuList",
    components: {
        IconFont
    },
    props: {
        menuList: {
            type: Array as() => Menu[],
            require: true,
            default: []
        },
        level: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        let openMenuId = ref(0);
        let menuOpenFlag = toRef(
            systemStore.getState().systemState,
            "sideMenuOpen"
        );
        let titleGoneFlag = ref(false);

        onMounted(() => {
            menuChange(menuOpenFlag.value);
        });

        watch(menuOpenFlag, (openFlag: boolean, preOpenFLag: boolean) => {
            menuChange(openFlag);
        });

        /** 监听菜单变化 */
        const menuChange = (openFlag: boolean) => {
            TweenMax.to(".first-level>.menu-item .item-title", 0.8, {
                opacity: openFlag ? 1 : 0,
                delay: 0
            });
            TweenMax.to(".first-level>.menu-group", 0.8, {
                height: openFlag ? "35px" : "0px",
                delay: 0
            });
            if (!openFlag) {
                setTimeout(() => {
                    titleGoneFlag.value = true;
                }, 800);
            } else {
                titleGoneFlag.value = false;
            }
        };

        /** 获取菜单项容器Class */
        const makeMenuItemContainerClass = (item: Menu) => {
            let classes: string[] = [];
            classes.push(menuOpenFlag.value ? "menu-open" : "menu-close");
            classes.push(props.level == 0 ? "first-level" : "");
            if (!item.group_flag) {
                classes.push(item.id == openMenuId.value ? "expand" : "close");
            }
            return classes;
        };

        /** 获取菜单项Class */
        const makeMenuItemClass = (item: Menu) => {
            let classes: string[] = [];
            if (!item.group_flag) {
                classes.push("menu-item");
            } else {
                classes.push("menu-group");
                if (props.level == 0 && titleGoneFlag.value) {
                    classes.push("gone");
                }
            }
            return classes;
        };

        /** 点击菜单项事件处理 */
        const clickMenu = (item: Menu) => {
            // 无子菜单直接跳转
            if (!item.subList || item.subList.length == 0) {
                //TODO 执行跳转
                return;
            }
            // 非一级菜单无动作
            if (props.level > 0) {
                return;
            }
            // 分组项无动作
            if (item.group_flag) {
                return;
            }

            openMenuId.value = item.id ?
                item.id == openMenuId.value ?
                0 :
                item.id :
                0;
        };

        return {
            openMenuId,
            makeMenuItemContainerClass,
            makeMenuItemClass,
            clickMenu,
            titleGoneFlag
        };
    }
});
</script>

<style lang="scss">
$menu-list-color-bg-highlight: #525d62;
$menu-list-color-bg: #424d52;
$menu-list-color-menu-group: #2f373d;
$menu-list-color-menu-main: #2a3429;
$menu-list-color-menu-sub: #1a2419;

.cigo-menu-list {
    background-color: $menu-list-color-bg;
    display: flex;
    width: 100%;
    flex-direction: column;

    .menu-container {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    /*****************************************/
    /** 菜单公共 */
    .menu-common {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .item-right {
            display: flex;
            flex: 1;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            height: 100%;

            .item-title {
                display: flex;
                flex: 1;
                padding-right: 5px;
            }

            .item-label {
                border-radius: 11px;
                font-size: 10px;
                color: #fff;
                min-width: 22px;
                height: 22px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .item-more {
                margin: 0px 5px;
                width: 30px;
                height: 30px;
                visibility: hidden;
            }

            .item-more.show {
                visibility: visible;
            }
        }
    }

    /*****************************************/
    /** 菜单分组 */
    .menu-group {
        background-color: $menu-list-color-menu-group;
        padding-left: 11px;
        height: 35px;

        .item-left {
            display: none;
        }

        .item-right {
            display: flex;
            flex: 1;

            .item-title {
                font-size: 13px;
                color: #888;
            }
        }
    }

    .menu-close.first-level>.menu-group {
        .item-right {
            display: none;
        }
    }

    .menu-close.first-level>.menu-group.gone {
        display: none;
    }

    /*****************************************/
    /** 菜单常规属性 */
    .menu-item {
        cursor: pointer;
        height: 40px;
        border-bottom: 1px dashed #444;

        .item-left {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 100%;

            .item-line {
                width: 3px;
                height: 100%;
                background-color: transparent;
                margin-right: 5px;
            }

            .item-icon {
                width: 22px;
                height: 22px;
                margin-right: 5px;
            }
        }

        .item-title {
            font-size: 16px;
            font-weight: 700;
            color: #eee;
        }
    }

    .menu-container:last-of-type>.menu-item {
        border-bottom: 0px;
    }

    /*****************************************/
    /** 一级菜单属性 */

    .first-level>.menu-item {
        height: 45px;
        background-color: $menu-list-color-menu-main;

        .item-icon {
            width: 28px;
            height: 28px;
        }

        .item-right {
            position: relative;

            .item-title {
                width: 137px !important;
                flex: none;
                position: absolute;
                left: 0px;
            }

            .item-title.gone {
                display: none;
            }

            .item-label {
                position: absolute;
                right: 40px;
            }

            .item-more {
                position: absolute;
            }
        }
    }

    /*****************************************/
    /** 二级+菜单属性 */
    .menu-item+.item-sublist {
        width: 240px;
        height: 0px;
        position: absolute;
        top: 0px;
        left: 240px;
        // display: none;
        background-color: $menu-list-color-menu-sub;
        -moz-transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        -ms-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;

        .item-title {
            font-size: 13px;
        }
    }

    .menu-close.first-level>.item-sublist {
        left: 103px;
    }

    .menu-open.first-level>.item-sublist {
        position: relative;
        left: auto;
    }

    .menu-open.first-level>.item-sublist>.menu-container>.menu-common {
        padding-left: 15px;
    }

    /*****************************************/
    /** 动画效果 */
    .menu-item {
        .item-more.show {
            -moz-transition: all 0.8s ease-in-out;
            -webkit-transition: all 0.8s ease-in-out;
            -o-transition: all 0.8s ease-in-out;
            -ms-transition: all 0.8s ease-in-out;
            transition: all 0.8s ease-in-out;

            -moz-transform: rotate(630deg);
            -webkit-transform: rotate(630deg);
            -o-transform: rotate(630deg);
            -ms-transform: rotate(630deg);
            transform: rotate(630deg);
        }
    }

    .menu-container.menu-open.first-level>.menu-item {
        .item-more.show {
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
    }

    .menu-container.menu-open.first-level.expand>.menu-item,
    .menu-container:hover>.menu-item {
        background-color: $menu-list-color-bg-highlight !important;

        .item-line {
            background-color: #3c8dbc;
        }
    }

    .menu-container.menu-open:hover:not(.first-level)>.menu-item,
    .menu-container.menu-close:hover>.menu-item {
        .item-more.show {
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
    }

    .menu-container.menu-open.first-level.expand>.menu-item {
        .item-more.show {
            -moz-transform: rotate(540deg);
            -webkit-transform: rotate(540deg);
            -o-transform: rotate(540deg);
            -ms-transform: rotate(540deg);
            transform: rotate(540deg);
        }
    }

    .menu-container.menu-close:hover>.menu-item+.item-sublist,
    .menu-container.menu-open:not(.first-level):hover>.menu-item+.item-sublist,
    .menu-container.menu-open.first-level.expand>.menu-item+.item-sublist {
        height: var(--subListHeight);
        // display: flex;
    }

    /*****************************************/
}
</style>
