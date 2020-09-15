<template>
<svg class="cigo-icon-font" aria-hidden="true" :style="{'--iconColor': color}">
    <use :xlink:href="iconName" />
</svg>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    isRef,
    onMounted,
    ref,
    toRef,
    watch
} from "vue";

export default defineComponent({
    name: "CigoIconFont",
    props: {
        name: {
            type: String,
            default: ""
        },
        bindIcon: {
            type: Function
        },
        color: {
            type: String,
            default: "#ffffff"
        }
    },
    setup(props) {
        let iconName = ref("");
        let iconRef: any;
        onMounted(() => {
            if (props.bindIcon) {
                iconRef = props.bindIcon(); //Tips_FLAG 父变子变示例2/3：props绑定函数传入ref响应式对象 注：还剩一种父级主动调用子级函数式
                iconName.value = `#${iconRef.value}`;
                watch(iconRef, (newVal, preVal) => {
                    iconName.value = `#${iconRef.value}`;
                });
                //TODO 此处computed不好使
                // computed(() => {
                //     console.log("1111");
                //     return iconRef.value;
                // });
            } else {
                iconName.value = `#${props.name}`;
            }
        });

        return {
            iconName
        };
    }
});
</script>

<style lang="scss">
.cigo-icon-font {
    width: 1em;
    height: 1em;
    vertical-align: -0.16em;
    fill: currentColor;
    overflow: hidden;
    color: var(--iconColor);
}
</style>
