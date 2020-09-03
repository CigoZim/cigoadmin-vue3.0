<template>
<div class="cigo-menu-list">
    <div class="menu-item" v-for="(item, index) in menuList" :class="[item.group_flag ? 'group' : '']" :key="index" @click.stop="clickMenu(item)">
        <i v-if="level == 0 && !item.group_flag" class="item-line"></i>
        <icon-font v-if="!item.group_flag" class="item-icon" :iconFlag="'cigoadmin-icon-Setting'"></icon-font>
        <span>{{item.title}}</span>
        <label class="item-label" :class="[item.label_class]">2</label>
        <icon-font v-if="!item.group_flag" class="item-more" :iconFlag="'cigoadmin-icon-expand'"></icon-font>
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
    setup(props) {
        onMounted(() => {
            console.log("level:", props.level);
        });
    }
});
</script>

<style lang="scss">
.cigo-menu-list {
    width: 100%;
    background-color: green;

    .menu-list {
        width: 100%;
        display: flex;
        flex-direction: column;

        .menu-item {
            display: flex;
            cursor: pointer;
        }
    }
}
</style>
