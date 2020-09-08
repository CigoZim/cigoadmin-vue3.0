<template>
<div class="page-index">
    <h1>上传示例</h1>

    <div class="upload-form">
        <a-upload :fileList="fileListRef" :remove="removeFile" :beforeUpload="beforeUpload">
            <a-button>
                <upload-outlined />选择文件
            </a-button>
        </a-upload>
        <a-button type="primary" :disabled="fileListRef.length === 0" :loading="uploading" style="margin-top: 16px" @click="doUpload">{{ uploading ? '上传中...' : '开始上传' }}</a-button>
        <!-- 进度条 -->
        <a-progress :percent="uploadPhotoPercent" size="small" status="active" v-if="isShowProgress" />
        <img class="preview-img" v-if="previewImage" alt="example" style="width: 100px" :src="previewImage" />
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    toRaw
} from "vue";
import * as qiniu from "qiniu-js";
import {
    UploadOutlined
} from "@ant-design/icons-vue";
import {
    apiRequest,
    apiSign,
    apiErrorCatch,
    bucket
} from "@/common/http";
import cigoLayer from "@/components/cigo-layer";
import UUID from "uuidjs";

export default defineComponent({
    name: "DemoUpload",
    components: {
        UploadOutlined
    },
    setup(props, context) {
        let uploading = ref(false);
        let fileList: any[] = [];
        let fileListRef = ref(fileList);
        let uploadPhotoPercent = ref(0);
        let isShowProgress = ref(false);
        let previewImage = ref("");

        const removeFile = (file: object) => {
            const index = fileListRef.value.indexOf(file);
            const newFileList = fileListRef.value.slice();
            newFileList.splice(index, 1);
            fileListRef.value = newFileList;
        };

        const beforeUpload = (file: object, list: object[]) => {
            fileListRef.value = [...fileList, file];
            return false;
        };

        const doUpload = () => {
            uploading.value = true;

            let paramsToken = {
                bucket: bucket.img
            };
            //1. 获取上传凭证Token
            apiRequest.v1
                .post("/qiniu/token", paramsToken, {
                    headers: apiSign(paramsToken)
                })
                .then(response => {
                    let uploadHost = response.data.data.upload_host;
                    let token = response.data.data.token;
                    console.log("new token:", uploadHost, token);
                    let file = fileListRef.value[0];

                    /*********************= //2. 执行上传 =**************************** */
                    let config = {
                        uphost: uploadHost,
                        useCdnDomain: true //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                        // region: qiniu.region.z2 // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                    };
                    let putExtra = {
                        params: {}, //用来放置自定义变量
                        mimeType: '"image/jpeg", "image/png", "image/gif"' //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                    };
                    var observable = qiniu.upload(
                        file,
                        UUID.generate(),
                        token,
                        putExtra,
                        config
                    );
                    observable.subscribe({
                        next: result => {
                            isShowProgress.value = true;
                            uploadPhotoPercent.value = Math.ceil(
                                result.total.percent * 100
                            );
                        },
                        error: errResult => {
                            cigoLayer.msg("上传失败，失败原因：" + errResult);
                            isShowProgress.value = false;
                        },
                        complete: result => {
                            console.log("upload res:", result);

                            cigoLayer.msg(result.msg);
                            uploading.value = false;
                            isShowProgress.value = false;
                            previewImage.value = result.data.signed_url;
                        }
                    });

                    /************************************************* */
                })
                .catch(apiErrorCatch.v1);
        };

        return {
            uploading,
            fileListRef,
            uploadPhotoPercent,
            isShowProgress,
            previewImage,

            removeFile,
            beforeUpload,
            doUpload
        };
    }
});
</script>

<style lang="scss">
.page-index {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .upload-form {
        width: 300px;
        display: flex;
        flex-direction: column;

        .preview-img {
            margin-top: 10px;
        }
    }
}
</style>
