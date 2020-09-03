<template>
<div class="cigo-menu-list">
    <div class="menu-item" v-for="(item, index) in menuList" :class="[level==0 && !item.group_flag  ? 'first-level' : '', item.id == openMenuId ? 'expand' : 'close', item.group_flag ? 'group' : '']" :key="index" @click.stop="clickMenu(item)">
        <div class="item-header">
            <i v-if="level == 0 && !item.group_flag" class="item-line"></i>
            <icon-font v-if="!item.group_flag" class="item-icon" :iconFlag="item.icon"></icon-font>
            <span class="item-title">{{item.title}}</span>
            <label class="item-label" :class="[item.label_class]">2</label>
            <icon-font class="item-more" :class="[!item.group_flag && item.subList && item.subList.length ? 'show' : 'hide']" :iconFlag="'cigoadmin-icon-expand'"></icon-font>
        </div>
        <menu-list class="item-sublist" :style="[item.subList && item.subList.length ? {height: item.subList.length * 35 + 'px'} : {}]" v-if="item.subList && item.subList.length" :menuList="item.subList" :level="level+1"></menu-list>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    ref
} from "vue";
import IconFont from "@/components/frame/other/IconFont.vue";
import {
    Menu
} from "@/components/frame/types";

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
            clickMenu
        };
    }
});
</script>

<style lang="scss">
.cigo-menu-list {
    width: 100%;
    background-color: #424d52;

    display: flex;
    flex-direction: column;

    .menu-item {
        position: relative;
        border-bottom: 1px solid #1d272b;

        .item-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            height: 45px;
            background-color: #2c363a;

            .item-line {
                width: 3px;
                height: 100%;
                background-color: transparent;
                margin-right: 5px;
            }

            .item-icon {
                width: 16px;
                height: 18px;
                font-size: 16px;
                margin-right: 5px;
            }

            .item-title {
                color: #b8c7ce;
                display: flex;
                font-size: 16px;
                flex: 1;
                font-weight: 700;
            }

            .item-more {
                margin: 0px 5px;
                width: 30px;
                height: 30px;
                font-weight: 400;
                visibility: hidden;

                -moz-transition: all 0.8s ease-in-out;
                -webkit-transition: all 0.8s ease-in-out;
                -o-transition: all 0.8s ease-in-out;
                -ms-transition: all 0.8s ease-in-out;
                transition: all 0.8s ease-in-out;
            }

            .item-more.show {
                visibility: visible;
            }
        }

        .item-header:hover {
            background-color: #1d272b !important;

            .item-line {
                background-color: #3c8dbc;
            }
        }
    }

    .menu-item.first-level.expand>.item-header>.item-more {
        -moz-transform: rotate(-540deg);
        -webkit-transform: rotate(-540deg);
        -o-transform: rotate(-540deg);
        -ms-transform: rotate(-540deg);
        transform: rotate(-540deg);
    }

    .menu-item.first-level>.item-sublist {
        display: flex;
        -moz-transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        -ms-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
    }

    .menu-item.first-level.close>.item-sublist {
        height: 0px !important;
    }

    .menu-item.group {
        .item-header {
            background-color: #1a2419;
            padding-left: 11px;
            height: 30px;

            .item-title {
                color: #5f7c83;
                font-size: 12px;
            }
        }
    }

    .menu-item>.item-sublist {
        .item-header {
            background-color: transparent;
            padding-left: 20px;
            height: 35px;

            .item-title {
                font-size: 14px;
                font-weight: 400;
            }

            .item-more {
                -moz-transform: rotate(-90deg);
                -webkit-transform: rotate(-90deg);
                -o-transform: rotate(-90deg);
                -ms-transform: rotate(-90deg);
                transform: rotate(-90deg);
            }
        }
    }

    .menu-item>.item-sublist>.menu-item>.item-sublist {
        display: none;
        position: absolute;
        left: 200px;
        top: 0px;
        background-color: #625d62;

        .item-header {
            padding-left: 5px;
            padding-right: 5px;

            .item-title {
                color: #fff;
            }
        }
    }

    .menu-item>.item-sublist>.menu-item:hover>.item-header>.item-more {
        -moz-transform: rotate(-630deg);
        -webkit-transform: rotate(-630deg);
        -o-transform: rotate(-630deg);
        -ms-transform: rotate(-630deg);
        transform: rotate(-630deg);
    }

    .menu-item>.item-sublist>.menu-item:hover>.item-sublist {
        display: block;
    }
}
</style>
