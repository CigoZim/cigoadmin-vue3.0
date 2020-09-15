<template>
<div class="cigo-button-component">
    <slot></slot>
    <cigo-icon-font class="cigo-button-icon-left" :name="icon"></cigo-icon-font>
    <span class="cigo-button-label">
        <slot></slot>
    </span>
    <cigo-icon-font class="cigo-button-icon-right" :name="icon"></cigo-icon-font>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";

export default defineComponent({
    name: "CigoButton",
    components: {
        CigoIconFont
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
