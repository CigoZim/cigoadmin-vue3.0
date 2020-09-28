<template>
<div class="cigo-layer-prompt">
    <div class="title-area">
        <span>{{layerData.title}}</span>
    </div>
    <div class="content-layer">
        <input class="prompt-val" v-model="value" :placeholder="layerData.placeholder ? layerData.placeholder : '请输入内容'" />
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="ok">确定</a-button>
            <a-button type="default" @click.stop="cancel">取消</a-button>
        </a-button-group>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref
} from "vue";
import cigoLayer from "./layer";

export default defineComponent({
    name: "CigoLayerPrompt",
    props: {
        layerData: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let value = ref("");

        const ok = () => {
            if (value.value === "") {
                cigoLayer.msg(
                    props.layerData.placeholder ?
                    props.layerData.placeholder :
                    "请输入内容"
                );
                return;
            }
            //Tips_Flag 探秘Promise的用法：答疑antdesign的点击不同结果事件
            new Promise((resolve, reject) => {
                    ctx.emit("notify", "ok", resolve, reject, value.value);
                })
                .then(() => {
                    ctx.emit("close");
                })
                .catch(() => {
                    console.log("hold on");
                });
        };

        const cancel = () => {
            new Promise((resolve, reject) => {
                    ctx.emit("notify", "cancel", resolve, reject);
                })
                .then(() => {
                    ctx.emit("close");
                })
                .catch(() => {
                    console.log("hold on");
                });
        };

        return {
            value,
            ok,
            cancel
        };
    }
});
</script>

<style lang="scss">
.cigo-layer-prompt {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .title-area {
        background-color: #f5f5f5;
        border-bottom: 1px solid #f0f0f0;
        padding: 15px 12px;
        display: flex;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        flex-direction: row;
        justify-content: center;
        font-size: 16px;
    }

    .content-layer {
        display: flex;
        flex-direction: column;
        width: 100%;
        flex: 1;
        padding: 12px 10px;
        overflow-x: hidden;
        overflow-y: scroll;

        .prompt-val {
            width: 100%;
            height: 40px;
            line-height: 30px;
            color: #666;
            font-size: 14px;
            border-radius: 5px;
            padding: 0px 8px;
            border: 1px solid #ddd;
        }
    }

    .btn-area {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 8px 12px;
        border-top: 1px solid #f0f0f0;
    }
}
</style>
