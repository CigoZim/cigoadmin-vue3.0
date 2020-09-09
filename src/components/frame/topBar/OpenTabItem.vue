<template>
<div class="cigo-open-tab-item">
    <span>flag-</span>
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
export default defineComponent({
    name: "CigoOpenTabItem",
    props: {
        flag: {
            type: String,
            default: ""
        }
    },
    setup() {
        return {};
    }
});
</script>

<style lang="scss">
.cigo-open-tab-item {
    display: flex;
}
</style>
