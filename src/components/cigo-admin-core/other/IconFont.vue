<template>
<svg class="cigo-icon-font" aria-hidden="true">
    <use :xlink:href="iconName" />
</svg>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: "IconFont",
    props: {
        iconFlag: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const iconName = `#${props.iconFlag}`;

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
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    color: #fff;
}
</style>
