<template>
<div class="page-upload">
    <h1>普通上传</h1>

    <div class="upload-form">
        <a-upload list-type="picture" :multiple="true" :fileList="fileListRef" :remove="removeFile" :beforeUpload="beforeUpload" @preview="showPreview">
            <a-button>
                <upload-outlined />选择文件
            </a-button>
        </a-upload>
        <a-button type="primary" :disabled="fileListRef.length === 0" :loading="uploadingNum > 0" style="margin-top: 16px" @click="startUpload">{{ uploadingNum > 0 ? '上传中...' : '开始上传' }}</a-button>
        <!-- 进度条 -->
    </div>

    <a-modal :visible="previewShowFlag" :footer="null" @cancel="closePreview">
        <img alt="example" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref
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
        let fileList: any[] = [];
        let fileListRef = ref(fileList);
        let uploadingNum = ref(0);
        let previewShowFlag = ref(false);
        let previewImageUrl = ref("");

        const removeFile = (file: any) => {
            const tmpList = fileListRef.value.slice();
            tmpList.splice(tmpList.indexOf(file), 1);
            fileListRef.value = tmpList;
        };

        const beforeUpload = (file: any) => {
            fileListRef.value = [...fileListRef.value, file];
            return false;
        };

        const startUpload = () => {
            //标记上传开始
            uploadingNum.value = 0;
            fileListRef.value.every((file: any, index: number, arr) => {
                if (!file.status || file.status === "error") {
                    //标记上传开始
                    recordStatus(index, true, "uploading");
                    setTimeout(() => {
                        file.status = "done";

                        doUpload(index);
                    }, 1000 * index); // 延迟查看进度
                }
                return true;
            });

            //判断是否存在待上传文件
            if (uploadingNum.value == 0) {
                cigoLayer.msg("当前无待上传文件！");
            }
        };

        const recordStatus = (
            fileIndex: number,
            numFlag: boolean,
            statusFlag: string
        ) => {
            fileListRef.value[fileIndex].status = statusFlag;
            fileListRef.value = [...fileListRef.value]; // 为解决vue3.0 数组内部元素响应式无效的问题
            numFlag ? uploadingNum.value++ : uploadingNum.value--;
        };

        const doUpload = (fileIndex: number) => {
            let file = fileListRef.value[fileIndex];
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
                            recordStatus(fileIndex, false, "error");
                        },
                        complete: result => {
                            cigoLayer.msg(file.name + ":" + result.msg);

                            //TODO 记录文件编号，用于后续表单上传
                            fileListRef.value[fileIndex].id = result.data.id;

                            //TODO url和preview字段都可以预览
                            fileListRef.value[fileIndex].url =
                                result.data.signed_url;
                            fileListRef.value[fileIndex].preview =
                                result.data.signed_url;

                            //标记上传成功
                            recordStatus(fileIndex, false, "done");
                        }
                    });

                    /************************************************* */
                })
                .catch(apiErrorCatch.v1);
        };

        const showPreview = (file: any) => {
            previewImageUrl.value = file.preview || file.url;
            previewShowFlag.value = true;
        };
        const closePreview = (file: any) => {
            previewShowFlag.value = false;
        };

        return {
            fileListRef,
            uploadingNum,

            removeFile,
            beforeUpload,
            startUpload,
            previewShowFlag,
            previewImageUrl,
            showPreview,
            closePreview
        };
    }
});
</script>

<style lang="scss">
.page-upload {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .upload-form {
        width: 500px;
        display: flex;
        flex-direction: column;
    }
}
</style>
