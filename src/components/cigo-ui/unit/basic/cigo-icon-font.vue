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
        color: {
            type: String,
            default: "#ffffff"
        }
    },
    setup(props) {
        let iconName = computed(() => {
            return `#${props.name}`;
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
