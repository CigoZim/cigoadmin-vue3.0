<template>
<div class="page-index">
    <h1>上传示例</h1>

    <div class="upload-form">
        <a-upload :multiple="multiple" :fileList="fileListRef" :remove="removeFile" :beforeUpload="beforeUpload">
            <a-button>
                <upload-outlined />选择文件
            </a-button>
        </a-upload>
        <a-button type="primary" :disabled="fileListRef.length === 0" :loading="uploadingNum > 0" style="margin-top: 16px" @click="startUpload">{{ uploadingNum > 0 ? '上传中...' : '开始上传' }}</a-button>
        <!-- 进度条 -->
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
        let multiple = ref(true);
        let fileList: File[] = [];
        let fileListRef = reactive(fileList);
        let uploadingNum = ref(0);

        const removeFile = (file: File) => {
            // const index = fileListRef.value.indexOf(file);
            // const newFileList = fileListRef.value.slice();
            // newFileList.splice(index, 1);
            // fileListRef.value = newFileList;
        };

        const beforeUpload = (file: any) => {
            file.status = "uploading";
            fileListRef = [...fileListRef, reactive(file)];
            return false;
        };

        const startUpload = () => {
            //标记上传开始
            uploadingNum.value = 0;

            console.log("*********************");
            console.log(fileListRef);
            console.log(fileListRef.value);
            console.log(fileListRef.value[0]);

            fileListRef.value.every((file: any, index: number, arr) => {
                if (!file.status || file.status === "uploading") {
                    //标记上传开始
                    // recordStatus(file, true, "uploading");
                    setTimeout(() => {
                        console.log(file);
                        file.status = "done";

                        // doUpload(file);
                    }, 1500); // 延迟查看进度
                }
                return true;
            });
        };

        const recordStatus = (
            file: any,
            numFlag: boolean,
            statusFlag: string
        ) => {
            file.status = statusFlag;
            numFlag ? uploadingNum.value++ : uploadingNum.value--;

            console.log(file.name, file.status, uploadingNum.value);
        };

        const doUpload = (file: File) => {
            console.log("file:", file);
            console.log("fileList", fileListRef);

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
                            // result.total.percent * 100
                        },
                        error: errResult => {
                            cigoLayer.msg(
                                file.name +
                                "(上传失败，失败原因：" +
                                errResult +
                                ")"
                            );

                            //标记上传失败
                            recordStatus(file, false, "error");
                        },
                        complete: result => {
                            console.log(result);
                            cigoLayer.msg(file.name + ":" + result.msg);

                            //标记上传成功
                            recordStatus(file, false, "done");
                            // previewImage.value = result.data.signed_url;
                        }
                    });

                    /************************************************* */
                })
                .catch(apiErrorCatch.v1);
        };

        return {
            multiple,
            fileListRef,
            uploadingNum,

            removeFile,
            beforeUpload,
            startUpload
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
    }
}
</style>
