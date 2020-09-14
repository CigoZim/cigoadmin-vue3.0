<template>
<div class="edit-rule">
    <div class="title-area">
        <span>{{mode}}</span>
    </div>
    <div class="content-area">
        <span>我是编辑页面</span>
    </div>
    <div class="btn-area">
        <a-button-group>
            <a-button type="primary" @click.stop="doAdd">添加</a-button>
            <a-button type="default" @click.stop="cancel">取消</a-button>
        </a-button-group>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    toRefs
} from "vue";
export default defineComponent({
    name: "EditRule",
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    setup(props, ctx) {
        let dataRef = reactive(props.data);

        const doAdd = () => {
            console.log("执行添加：");
            ctx.emit("notify", "doAdd", {
                bb: "cc"
            });
        };
        const cancel = () => {
            console.log("取消");
            ctx.emit("close");
        };

        return {
            ...toRefs(dataRef),
            doAdd,
            cancel
        };
    }
});
</script>

<style lang="scss">
.edit-rule {
    width: 100%;
    display: flex;
    overflow-x: hidden;
    overflow-y: scroll;
    flex-direction: column;

    .title-area {
        border-bottom: 1px solid #f0f0f0;
        padding: 8px 12px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .content-area {
        padding: 8px 12px;
    }

    .btn-area {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 8px 12px;
        border-top: 1px solid #f0f0f0;
    }
}

.edit-rule::-webkit-scrollbar {
    width: 0;
}
</style>
