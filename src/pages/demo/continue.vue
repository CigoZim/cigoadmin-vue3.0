<template>
<div class="page-index">
    <h1>断点续传示例</h1>

    <div class="upload-form">
        <a-upload :action="uploadHost" v-model:filelist="fileListRef">
            <a-button>
                <upload-outlined />Upload
            </a-button>
        </a-upload>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onBeforeMount,
    reactive,
    toRefs
} from "vue";

import {
    UploadOutlined
} from "@ant-design/icons-vue";
import {
    apiRequest,
    apiSign,
    apiErrorCatch
} from "@/common/http";

export default defineComponent({
    name: "DemoContinue",
    components: {
        UploadOutlined
    },
    setup() {
        let qiniuConfig = reactive({
            token: "",
            uploadHost: ""
        });
        let fileListRef = ref([]);

        onBeforeMount(() => {
            initQiniuyunToken();
        });

        const initQiniuyunToken = () => {
            let params = {
                bucket: "img"
            };
            apiRequest.v1
                .post("/qiniu/token", params, {
                    headers: apiSign(params)
                })
                .then(response => {
                    qiniuConfig.token = response.data.data.token;
                    qiniuConfig.uploadHost = response.data.data.upload_host;
                })
                .catch(apiErrorCatch.v1);
        };

        return {
            ...toRefs(qiniuConfig),
            fileListRef
        };
    }
});
</script>

<style lang="scss">
.page-index {
    background-color: aqua;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .upload-form {
        width: 300px;
    }
}
</style>
