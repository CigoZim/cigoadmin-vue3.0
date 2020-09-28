<template>
<div class="cigo-keywords">
    <div class="keyword-item" v-for="(item,index) in keywords" :key="index">
        <span>{{item}}</span>
        <cigo-icon-font class="close-icon" @click.stop="removeItem(index,item)" :name="'cigoadmin-icon-deleteclosecancel'"></cigo-icon-font>
    </div>
    <cigo-icon-font v-if="keywords.length < max" class="add-icon" @click.stop="addNewItem" :name="'cigoadmin-icon-add'"></cigo-icon-font>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    toRaw
} from "vue";
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import cigoLayer from "@/components/cigo-layer";

export default defineComponent({
    name: "CigoKeywords",
    components: {
        CigoIconFont
    },
    props: {
        keywords: {
            type: Array,
            default: []
        },
        //Remember 此处max设置值，上部代码 v-if="keywords.length = max" ”一个等号“ 导致keywords数组出现多余空值，有趣的手误
        max: {
            type: Number,
            default: 3
        }
    },
    setup(props, ctx) {
        const removeItem = (index: number, keyword: string) => {
            let arr = [...props.keywords];
            arr.splice(index, 1);
            ctx.emit("update:keywords", arr);
        };
        const addNewItem = () => {
            cigoLayer.prompt({
                layerData: {
                    title: '添加关键词'
                },
                ok: (val: string) => {
                    let arr = [...props.keywords];
                    arr.push(val);
                    ctx.emit("update:keywords", arr);
                }
            });
        };

        return {
            removeItem,
            addNewItem
        };
    }
});
</script>

<style lang="scss">
.cigo-keywords {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .keyword-item {
        padding: 0px 8px;
        line-height: 30px;
        border: 1px solid #f0f0f0;
        background-color: #fff;
        font-size: 14px;
        color: #666;
        position: relative;
        margin-right: 10px;

        .close-icon {
            width: 30px;
            height: 30px;
            padding: 7px;
            position: absolute;
            top: -14px;
            right: -14px;
        }
    }

    .keyword-item:last-child {
        margin-right: 0px;
    }

    .add-icon {
        width: 60px;
        height: 32px;
        padding: 5px 10px;
        color: #454545;
        border: 1px solid #f0f0f0;
        line-height: 30px;
    }
}
</style>
