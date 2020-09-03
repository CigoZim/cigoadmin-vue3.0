<template>
<div class="cigo-menu-list">
    <div class="menu-item" v-for="(item, index) in menuList" :class="[item.group_flag ? 'group' : '']" :key="index" @click.stop="clickMenu(item)">
        <div class="item-header">
            <i v-if="level == 0 && !item.group_flag" class="item-line"></i>
            <icon-font v-if="!item.group_flag" class="item-icon" :iconFlag="item.icon"></icon-font>
            <span class="item-title">{{item.title}}</span>
            <label class="item-label" :class="[item.label_class]">2</label>
            <icon-font v-if="!item.group_flag && item.subList && item.subList.length" class="item-more" :iconFlag="'cigoadmin-icon-expand'"></icon-font>
        </div>
        <menu-list class="item-sublist" v-if="item.subList && item.subList.length" :menuList="item.subList" :level="level+1"></menu-list>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted
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
    setup(props) {}
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
        }

        .item-header:hover {
            background-color: #1d272b;

            .item-line {
                background-color: #3c8dbc;
            }
        }
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
        }

        .item-header:hover {
            background-color: #1d272b;
        }

        .item-header:hover~.item-sublist {
            display: block;
        }
    }

    .menu-item>.item-sublist>.menu-item>.item-sublist {
        display: none;
        position: absolute;
        left: 200px;
        top: 0px;
        background-color: #a29da2;

        .item-header {
            padding-left: 5px;
            padding-right: 5px;

            .item-title {
                color: #fff;
            }
        }
    }

    .menu-item>.item-sublist>.menu-item>.item-sublist:hover {
        display: block;
    }
}
</style>
