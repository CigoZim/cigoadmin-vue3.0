<template>
<div id="editor" ref="ckEditor">This is some sample content.</div>
</template>

<script>
import {
    defineComponent,
    onMounted,
    ref
} from "vue";

export default defineComponent({
    name: "CigoCkEditor5",
    setup() {
        let ckEditor = ref(null);

        onMounted(() => {
            ClassicEditor
                .create(ckEditor.value)
                .then(editor => {
                    console.log(editor);
                })
                .catch(error => {
                    console.error(error);
                });
        })

        return {
            ckEditor,
        }
    }
});
</script>
