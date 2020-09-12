<template>
    <div class="cigo-button-component">
        <slot></slot>
        <icon-font class="cigo-button-icon-left" :iconFlag="icon"></icon-font>
        <span class="cigo-button-label">
            <slot></slot>
        </span>
        <icon-font class="cigo-button-icon-right" :iconFlag="icon"></icon-font>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconFont from "@/components/cigo-admin-core/other/IconFont.vue";

export default defineComponent({
    name: "CigoButton",
    components: {
        IconFont
    },
    props: {
        icon: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        return {};
    }
});
</script>

<style lang="scss">
.cigo-button-component {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
