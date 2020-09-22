<template>
<div class="cigo-avatar">
    <input type="file" ref="vFileRef" style="display:none;width:0;height:0;padding:0;" @change="change" multiple="multiple" accept="image/x-png, image/jpg, image/jpeg, image/gif">
    <div class="avatar">
        <img v-if="avatarUrl" :src="avatarUrl" />
    </div>
    <div class="ctrl-upload" @click.stop="chooseImg">
        <span>{{avatarUrl ? '修改' : '上传'}}</span>
    </div>
</div>
</template>

<script lang="ts">
import cigoLayer from '@/components/cigo-layer';
import {
    defineComponent,
    onMounted,
    onUpdated,
    ref
} from "vue";
import UUID from "uuidjs";
import {
    makeFileExtFilter,
    FileSaved
} from '@/components/cigo-ui/utils/types';

export default defineComponent({
    name: "CigoAvatar",
    props: {
        avatarInfo: {
            type: Object,
            default: () => {
                return {
                    id: 0
                };
            }
        }
    },
    setup(props, ctx) {
        let msg = "请上传png,jpg,gif格式的图片";
        let vFileRefTmp: any = null;
        let vFileRef = ref(vFileRefTmp);
        let avatarUrlTmp: any;
        let avatarUrl = ref(avatarUrlTmp);

        const chooseImg = () => {
            console.log('choose img');
            vFileRef.value.click();
        };

        const change = (event: any) => {
            let file = event.target;
            if (window.FileReader) {
                var filereader = new FileReader();
                if (file.files[0]) {
                    filereader.readAsDataURL(file.files[0]);
                }
                filereader.onload = (event) => {
                    if (!event.target) {
                        return;
                    }
                    var srcpath = event.target.result;
                    if (!validateImg(srcpath)) {
                        cigoLayer.msg(msg);
                    } else {
                        avatarUrl.value = srcpath;
                    }
                };
            } else {
                if (!/\.jpg$|\.png$|\.gif$/i.test(file.value)) {
                    cigoLayer.msg(msg);
                } else {
                    avatarUrl.value = file.value;
                }
            }
        };
        const validateImg = (srcpath: any) => {
            var pos = srcpath.indexOf(",") + 1;
            let fileExtFilter = makeFileExtFilter();
            for (var typeKey of fileExtFilter.keys()) {
                if (srcpath.indexOf(fileExtFilter.get(typeKey)) === pos) {
                    return typeKey;
                }
            }
            return null;
        };

        return {
            vFileRef,
            avatarUrl,
            chooseImg,
            change,
        };
    }
});
</script>

<style lang="scss">
.cigo-avatar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid red;
    width: 100px;
    height: 100px;
}
</style>
