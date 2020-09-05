<template>
<div class="cigo-menu-list">
    <div class="menu-container" v-for="(item, index) in menuList" :key="index" @click.stop="clickMenu(item)">
        <div class="menu-common" :class="makeMenuItemClass(item)">
            <div class="item-left">
                <i class="item-line" v-if="!item.group_flag"></i>
                <icon-font class="item-icon" v-if="!item.group_flag" :style="{'--itemIconColor':makeRandomColor(1)}" :iconFlag="item.icon"></icon-font>
            </div>
            <div class="item-right">
                <span class="item-title" :class="[level==0 && !item.group_flag && titleGoneFlag ? 'gone' : '']">{{item.title}}</span>
                <label class="item-label" :class="[item.label_class]" :style="{'--itemLabelColor':makeRandomColor(0.5)}">22</label>
                <icon-font class="item-more" :class="[!item.group_flag && item.subList && item.subList.length ? 'show' : 'hide']" :iconFlag="'cigoadmin-icon-expand'"></icon-font>
            </div>
        </div>
        <menu-list class="item-sublist" v-if="item.subList && item.subList.length" :style="level == 0 ? makeSecondLevelListHeight(item) : []" :menuList="item.subList" :level="level+1"></menu-list>
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
    watch
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
            require: true
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

        watch(menuOpenFlag, (openFlag: boolean, preOpenFLag: boolean) => {
            menuChange(openFlag);
        });

        onMounted(() => {
            menuChange(menuOpenFlag.value);
        });

        /** 监听菜单变化 */
        const menuChange = (openFlag: boolean) => {
            TweenMax.to(".menu-item.first-level>.item-right>.item-title", 0.8, {
                opacity: openFlag ? 1 : 0,
                delay: 0
            });
            TweenMax.to(".menu-group.first-level", 0.8, {
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

        /** 获取菜单项Class */
        const makeMenuItemClass = (item: Menu) => {
            let classes: string[] = [];
            classes.push(menuOpenFlag.value ? "menu-open" : "menu-close");
            classes.push(props.level == 0 ? "first-level" : "");
            if (item.group_flag) {
                classes.push("menu-group");
                classes.push(
                    props.level == 0 && titleGoneFlag.value ? "gone" : ""
                );
            } else {
                classes.push("menu-item");
                classes.push(item.id == openMenuId.value ? "expand" : "close");
            }
            return classes;
        };

        /** 获取子列表项样式 */
        const makeSecondLevelListHeight = (item: Menu) => {
            let style = [];
            if (item.subList && item.subList.length) {
                style.push({
                    height1: item.subList.length * 35 + "px"
                });
            }
            return style;
        };

        /** 创建标签随机颜色 */
        const makeRandomColor = (opacity: number) => {
            return (
                "rgba(" +
                Math.ceil(Math.random() * 255) +
                "," +
                Math.ceil(Math.random() * 255) +
                "," +
                Math.ceil(Math.random() * 255) +
                "," +
                opacity +
                ")"
            );
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
            makeMenuItemClass,
            makeSecondLevelListHeight,
            makeRandomColor,
            clickMenu,
            titleGoneFlag
        };
    }
});
</script>

<style lang="scss">
$menu-list-color-bg: #424d52;
$menu-list-color-bg-group: #1a2419;
$menu-list-color-bg-firstlevel: #2c363a;
$menu-list-color-bg-sublist: #625d62;
$menu-list-color-item-highlight: #1d272b;
$menu-list-color-item-line: #3c8dbc;
$menu-list-color-item-title-common: #b8c7ce;
$menu-list-color-item-title-group: #5f7c83;
$menu-list-color-item-title-highlight: #fff;
$menu-list-dimen-width-open: 240px;
$menu-list-dimen-width-close: 103px;

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
        border-bottom: 1px solid $menu-list-color-item-highlight;

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
                background-color: var(--itemLabelColor);
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
        background-color: $menu-list-color-bg-group;
        padding-left: 11px;
        height: 35px;

        .item-left {
            display: none;
        }

        .item-right {
            display: flex;
            flex: 1;

            .item-title {
                font-size: 12px;
                color: $menu-list-color-item-title-group;
            }
        }
    }

    .menu-close.menu-group.first-level {
        border-bottom: 0px;

        .item-right {
            display: none;
        }
    }

    .menu-close.menu-group.first-level.gone {
        display: none;
    }

    /*****************************************/
    /** 菜单常规属性 */
    .menu-item {
        cursor: pointer;
        height: 40px;

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
                width: 25px;
                height: 25px;
                color: var(--itemIconColor);
                margin-right: 5px;
            }
        }

        .item-title {
            font-size: 16px;
            font-weight: 700;
            color: $menu-list-color-item-title-common;
        }
    }

    .menu-container:last-of-type>.menu-item {
        border-bottom: 0px;
    }

    /*****************************************/
    /** 一级菜单属性 */

    .menu-item.first-level {
        height: 45px;
        background-color: $menu-list-color-bg-firstlevel;

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

            .item-label {
                position: absolute;
                right: 40px;
            }

            .item-more {
                position: absolute;
            }
        }
    }

    .menu-item.first-level>.item-right>.item-title.gone {
        display: none;
    }

    /*****************************************/
    /** 二级菜单悬浮属性 */
    .menu-item+.item-sublist {
        width: $menu-list-dimen-width-open;
        position: absolute;
        top: 0px;
        left: $menu-list-dimen-width-open;
        // display: none;
    }

    .menu-close.menu-item.first-level+.item-sublist {
        left: $menu-list-dimen-width-close;
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

    .menu-item:hover {
        background-color: $menu-list-color-item-highlight !important;

        .item-line {
            background-color: $menu-list-color-item-line;
        }

        .item-more.show {
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
    }

    /*****************************************/
}
</style>
