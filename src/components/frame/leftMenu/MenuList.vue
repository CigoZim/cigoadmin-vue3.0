<template>
<div class="cigo-menu-list">
    <div class="menu-item" v-for="(item, index) in menuList" :class="[item.group_flag ? 'group' : '']" :key="index" @click.stop="clickMenu(item)">
        <span>{{item.title}}</span>
        <label :class="[item.label_class]">2</label>
        <span v-if="item.subList && item.subList.length">more</span>
        <menu-list v-if="item.subList && item.subList.length" :menuList="item.subList"></menu-list>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
import {
    Menu
} from "@/components/frame/types";

export default defineComponent({
    name: "MenuList",
    props: {
        menuList: {
            type: Array as() => Menu[],
            require: true,
            default: () => {
                return [];
            }
        }
    },
    setup(props) {}
});
</script>

<style lang="scss">
.cigo-menu-list {
    width: 100%;
}
</style>
