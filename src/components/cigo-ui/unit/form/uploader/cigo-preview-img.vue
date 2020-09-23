<template>
<div class="cigo-preview-img">
    <img :src="layerData.imgList[currImgIndex]" />
    <div v-if="layerData.imgList.length>1" class="ctrl-bar">
        <cigo-icon-font class="icon left" @click.stop="changeImg(-1)" :name="'cigoadmin-icon-zuo'"></cigo-icon-font>
        <cigo-icon-font class="icon right" @click.stop="changeImg(1)" :name="'cigoadmin-icon-zuo'"></cigo-icon-font>
    </div>
    <cigo-icon-font class="icon-close" @click.stop="close" :name="'cigoadmin-icon-window-close'"></cigo-icon-font>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref
} from 'vue'
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
export default defineComponent({
    name: 'CigoPreviewImg',
    components: {
        CigoIconFont
    },
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        console.log(props.layerData.imgList);

        let currImgIndex = ref(0);

        const changeImg = (step: number) => {
            let index = currImgIndex.value + step;
            currImgIndex.value = index >= 0 ? index % props.layerData.imgList.length : props.layerData.imgList.length + index;
            console.log('currImgIndex:', currImgIndex.value);
        };

        const close = () => {
            ctx.emit('close');
        };

        return {
            currImgIndex,
            changeImg,
            close
        };
    }
})
</script>

<style lang="scss">
.cigo-preview-img {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    img {
        max-width: 95%;
        max-height: 95%;
        border-radius: 5px;
    }

    .ctrl-bar {
        position: absolute;
        width: 90%;
        height: 50px;
        top: 50%;
        align-self: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .icon {
            width: 50px;
            height: 50px;
            padding: 10px;
            background-color: #cccccc55;
            border-radius: 50%;
            cursor: pointer;
        }

        .icon.right {
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            transform: rotate(180deg);
        }
    }

    .icon-close {
        position: absolute;
        width: 35px;
        height: 35px;
        padding: 2px;
        top: 15px;
        right: 15px;
        cursor: pointer;
        border-radius: 50%;
        background-color: #f0f0f0;
    }
}
</style>
