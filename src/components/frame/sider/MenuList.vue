<template>
<div class="cigo-menu-list">
    <div class="menu-container" :class="makeMenuItemContainerClass(item)" v-for="(item, index) in menuList" :key="index" @click.stop="clickMenu(item)" @mouseenter="hoverMenuItem(item, true)" @mouseleave="hoverMenuItem(item, false)">
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
        <menu-list :id="'sub-list-' + item.id" class="item-sublist" v-if="item.subList && item.subList.length" :menuList="item.subList" :level="level+1"></menu-list>
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
    onBeforeMount,
    inject
} from "vue";
import IconFont from "@/components/frame/other/IconFont.vue";
import {
    TweenMax
} from "gsap";
import {
    systemStore
} from "@/store/index";
import {
    ModeFormMenuExpand,
    Menu
} from "@/components/frame/utils/types";
import {
    showPage
} from "../utils/common";

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
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );
        let menuItemExpand: Menu = {
            id: 0,
            title: ""
        };
        let expandMenuItem = ref(menuItemExpand);
        let menuOpenFlag = toRef(
            systemStore.getState().systemState,
            "sideMenuOpen"
        );
        let titleGoneFlag = ref(false);
        let menuBaseMapRef: any = inject("menuBaseMapRef");

        onMounted(() => {
            menuChange(menuOpenFlag.value);
        });

        watch(menuOpenFlag, (openFlag: boolean, preOpenFLag: boolean) => {
            menuChange(openFlag);
        });

        /** 监听菜单变化 */
        const menuChange = (openFlag: boolean) => {
            TweenMax.to(
                ".first-level>.menu-item>.item-right>.item-title",
                0.8, {
                    opacity: openFlag ? 1 : 0,
                    delay: 0
                }
            );
            TweenMax.to(".first-level>.menu-group", 0.8, {
                height: openFlag ? "35px" : "0px",
                opacity: openFlag ? 1 : 0,
                delay: 0,
                onStart: () => {
                    if (openFlag) {
                        titleGoneFlag.value = false;
                    }
                },
                onComplete: () => {
                    if (!openFlag) {
                        titleGoneFlag.value = true;
                    }
                }
            });
            //如果左侧菜单为关闭状态，则闭合当前正展开的一级菜单
            if (!openFlag && expandMenuItem.value.id) {
                recordClickMenu(expandMenuItem.value); // 清空当前菜单
            }
        };

        /** 获取菜单项容器Class */
        const makeMenuItemContainerClass = (item: Menu) => {
            let classes: string[] = [];
            classes.push(menuOpenFlag.value ? "menu-open" : "menu-close");
            classes.push(props.level == 0 ? "first-level" : "");

            //处理一级菜单展开问题
            if (!item.group_flag && props.level == 0) {
                let flag: string = "close";
                //分析是否展开
                switch (systemStore.getState().noCached.modeForMenuExpand) {
                    case ModeFormMenuExpand.CLICK_MENU: //点击菜单为主
                        flag = modeForMenuExpandClickMenu(item);
                        break;
                    case ModeFormMenuExpand.NOW_ROUTER: //跳转路由为主
                        flag = modeForMenuExpandNowRouter(item);
                        break;
                    default:
                        //未知
                        break;
                }
                classes.push(flag);
            }
            return classes;
        };

        /** 点击菜单为主：处理 */
        const modeForMenuExpandClickMenu = (item: Menu) => {
            let flag = "close";
            if (item.subList && item.subList.length > 0) {
                flag = expandMenuItem.value.id == item.id ? "expand" : "close";
            }
            return flag;
        };
        /** 跳转路由为主：处理 */
        const modeForMenuExpandNowRouter = (item: Menu): string => {
            if (
                !menuBaseMapRef.value ||
                !menuBaseMapRef.value.has(currComponent.value)
            ) {
                return "close";
            }
            let routerItem: Menu = menuBaseMapRef.value.get(
                currComponent.value
            );
            if (item.component_name == currComponent.value) {
                expandMenuItem.value = {
                    id: 0,
                    title: ""
                };
                return "close";
            } else if (
                routerItem &&
                routerItem.path &&
                item.path &&
                routerItem.path.indexOf(item.path + item.id + ",") >= 0
            ) {
                expandMenuItem.value = item;
                return "expand";
            }
            return "close";
        };

        /** 获取菜单项Class */
        const makeMenuItemClass = (item: Menu) => {
            let classes: string[] = [];
            if (!item.group_flag) {
                classes.push("menu-item");

                //标记当前(根据菜单项级联路径，保证当前级联菜单项的所有父辈都能够高亮)
                if (
                    menuBaseMapRef.value &&
                    menuBaseMapRef.value.has(currComponent.value)
                ) {
                    let nowItem: Menu = menuBaseMapRef.value.get(
                        currComponent.value
                    );
                    if (item.id == nowItem.id) {
                        classes.push("curr");
                    } else if (
                        nowItem &&
                        nowItem.path &&
                        item.path &&
                        nowItem.path.indexOf(item.path + item.id + ",") >= 0
                    ) {
                        classes.push("curr");
                    }
                }
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
            // 分组项无动作
            if (item.group_flag) {
                return;
            }

            // 一级菜单&左边栏开启状态下记录点击菜单项
            if (props.level == 0 && menuOpenFlag.value) {
                //记录有效点击菜单
                recordClickMenu(item);
            }

            // 无子菜单直接跳转
            if (!item.subList || item.subList.length == 0) {
                showPage(item);
            }
        };

        /** 记录点击菜单项 */
        const recordClickMenu = (item: Menu) => {
            // 记录点击菜单项
            expandMenuItem.value =
                item.id == expandMenuItem.value.id ?
                {
                    id: 0,
                    title: ""
                } :
                item;
            systemStore.setModeForMenuExpand(ModeFormMenuExpand.CLICK_MENU);
        };

        /** 鼠标滑入/滑出菜单项 */
        const hoverMenuItem = (item: Menu, inOutFlag: boolean) => {
            if (props.level == 0 && menuOpenFlag.value) {
                return;
            }
            subMenuListAnimation(item, inOutFlag);
        };
        watch(expandMenuItem, (newMenu: Menu, preMenu: Menu) => {
            subMenuListAnimation(newMenu, true);
            if (
                systemStore.getState().noCached.modeForMenuExpand ==
                ModeFormMenuExpand.CLICK_MENU ||
                newMenu.id != preMenu.id
            ) {
                subMenuListAnimation(preMenu, false);
            }
        });
        const subMenuListAnimation = (item: Menu, openFlag: boolean) => {
            if (!item.subList || !item.subList.length) {
                return;
            }
            let subListHeight = item.subList.length * 40 + "px";
            let animOptions = {};
            if (menuOpenFlag.value && props.level == 0) {
                TweenMax.to("#sub-list-" + item.id, 0.5, {
                    height: openFlag ? subListHeight : "0px",
                    opacity: openFlag ? 1 : 0,
                    display: openFlag ? "flex" : "none"
                });

                TweenMax.to(
                    "#sub-list-" + item.id + ">.menu-container>.menu-common",
                    0.5, {
                        height: openFlag ? "40px" : "0px",
                        opacity: openFlag ? 1 : 0
                    }
                );
                updateLeftMenuListWidth(openFlag);
            } else {
                TweenMax.to("#sub-list-" + item.id, 0.5, {
                    width: openFlag ? "240px" : "0px",
                    height: openFlag ? subListHeight : "0px",
                    opacity: openFlag ? 1 : 0,
                    display: openFlag ? "flex" : "none"
                });

                TweenMax.to(
                    "#sub-list-" + item.id + ">.menu-container>.menu-common",
                    0.5, {
                        width: openFlag ? "240px" : "0px",
                        height: openFlag ? "40px" : "0px",
                        opacity: openFlag ? 1 : 0
                    }
                );
                updateLeftMenuListWidth(openFlag);
            }
        };

        const updateLeftMenuListWidth = (openFLag: boolean) => {
            let newWidth = menuOpenFlag.value ? 250 : 113;
            let num = 0;
            if (menuOpenFlag.value) {
                num = openFLag ? props.level : props.level - 1;
            } else {
                num = openFLag ? props.level + 1 : props.level;
            }
            num = num > 0 ? num : 0;
            newWidth += num * 240;

            systemStore.setLeftMenuContainerWidth(newWidth + "px");
        };

        return {
            makeMenuItemContainerClass,
            makeMenuItemClass,
            clickMenu,
            hoverMenuItem,
            titleGoneFlag,
            currComponent
        };
    }
});
</script>

<style lang="scss">
$menu-list-color-bg-highlight: #000;
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
                white-space: nowrap;
                overflow: hidden;
            }

            .item-label {
                cursor: pointer;
                border-radius: 3px;
                font-size: 10px;
                color: #fff;
                min-width: 18px;
                height: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .item-more {
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
        padding-left: 10px;
        height: 35px;

        .item-left {
            display: none;
        }

        .item-right {
            display: flex;
            flex: 1;

            .item-title {
                font-size: 11px;
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
        border-bottom: 1px dashed #353535;

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
                margin-right: 5px;
                margin-top: -5px;
            }
        }

        .item-title {
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
            width: 25px;
            height: 25px;
        }

        .item-right {
            position: relative;

            .item-title {
                font-size: 14px;
                width: 154px !important;
                flex: none;
                position: absolute;
                left: 0px;
            }

            .item-title.gone {
                display: none;
            }

            .item-label {
                position: absolute;
                right: 30px;
            }

            .item-more {
                position: absolute;
            }
        }
    }

    /*****************************************/
    /** 二级+菜单属性 */
    .menu-item+.item-sublist {
        width: 0px;
        height: 0px;
        opacity: 0;
        display: none;
        position: absolute;
        top: 0px;
        left: 240px;

        .item-icon {
            width: 22px;
            height: 22px;
        }

        .item-title {
            font-size: 12px;
        }
    }

    .menu-item+.item-sublist>.menu-container>.menu-common {
        width: 0px;
        height: 0px;
        opacity: 0px;
    }

    .menu-close.first-level>.item-sublist {
        left: 103px;
    }

    .menu-open.first-level>.item-sublist {
        width: 240px !important;
        position: relative;
        left: auto;
    }

    .menu-open.first-level>.item-sublist>.menu-container>.menu-common {
        width: 240px !important;
    }

    .menu-open.first-level>.item-sublist>.menu-container>.menu-item {
        padding-left: 15px;
    }

    .menu-open.first-level>.item-sublist>.menu-container>.menu-group {
        padding-left: 25px;
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
    .menu-item.curr,
    .menu-container:hover>.menu-item {
        background-color: $menu-list-color-bg-highlight !important;

        .item-line {
            background-color: #3c8dbc;
        }
    }

    .menu-container.menu-open.first-level.expand>.menu-item.curr+.item-sublist>.menu-container>.menu-item.curr,
    .menu-container.menu-open.first-level.expand>.item-sublist>.menu-container:hover>.menu-item {
        background-color: transparent !important;

        .item-left,
        .item-right {
            background-color: $menu-list-color-bg-highlight !important;
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

    /*****************************************/
}
</style>
