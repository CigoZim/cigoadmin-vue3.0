<<template>
<div class="window-content">
    <slot />
</div>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";
export default defineComponent({
    name: "Window",
    setup() {}
});
</script>

<style lang="scss">
.window-content {
    width: 100vw;
    height: 100vh;
}
</style>
