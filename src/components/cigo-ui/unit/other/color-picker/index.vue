<template>
<div class="cigo-color-picker"></div>
</template>

<script lang="ts">
import cigoLayer from '@/components/cigo-layer';
import element from '@/components/cigo-ui/unit/other/color-picker/element.vue';
import {
    defineComponent,
    onMounted,
    ref,
    toRef,
    watch
} from 'vue'
export default defineComponent({
    name: 'CigoColorPicker',
    props: {
        type: {
            type: String,
            default: 'element'
        },
        targetElem: {
            type: Object,
            default: {}
        },
        color: { //TODO 处理默认颜色值显示
            type: String,
            default: "#000000"
        },
        showOpacity: {
            type: Boolean,
            default: true,
        },
        modelSwitch: {
            type: Boolean,
            default: true,
        }
    },
    setup(props, ctx) {
        let targetElemRef = toRef(props, 'targetElem');

        let layerIndex = -1;
        let showX = 0;
        let showY = 0;
        const show = (evt: any) => {
            showX = evt.clientX + 10;
            showY = evt.clientY + 10;
            let cmpInfo = getComponentInfo();
            layerIndex = cigoLayer.component({
                component: cmpInfo.component,
                width: cmpInfo.width,
                height: cmpInfo.height,
                canDragFlag: false,
                showX: showX,
                showY: showY,
                maskClose: true,
                showMask: false,
                showCtrlBar: false,
                layerData: {
                    showOpacity: props.showOpacity,
                    modelSwitch: props.modelSwitch,
                },
                notify: notify
            });

            console.log('layerIndex:', layerIndex);

        };
        const getComponentInfo = () => {
            let info = null;
            switch (props.type) {
                case 'element':
                default:
                    info = {
                        component: element,
                        width: '325px',
                        height: props.showOpacity ? '268px' : '244px'
                    };
                    break;
            }
            return info;
        };
        const notify = (flag: string, data: any) => {
            console.log('flag:', flag, data);
            switch (flag) {
                case 'change':
                    ctx.emit('update:color', data);
                    ctx.emit('change', data);
                    break;
            }
        };
        const close = (evt: any) => {
            cigoLayer.close(layerIndex);
        };

        return {
            show,
            close
        };
    }
});
</script>

<style lang="scss">
.cigo-color-picker {
    display: none;
}
</style>
