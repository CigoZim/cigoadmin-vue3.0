<template>
<div class="cigo-right-panel" :class="[openClass]">
    <div class="right-panel-bg"></div>
    <div class="right-panel">
        <span>我是右侧面板</span>
        <div class="right-panel-toggle" @click="systemStore.toggleRightPanel()">
            <img class="right-panel-toggle-icon" :src="cdnOpenIcon + '/setting.png'" />
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    toRef,
    watchEffect,
    onMounted,
    watch,
    ref
} from "vue";

import {
    Domain
} from "@/common/http";
import {
    systemStore
} from "@/store/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "RightPanel",
    setup(props) {
        let openClass = ref("close");
        let panelOpenFlag = toRef(
            systemStore.getState().systemState,
            "rightPanelOpen"
        );
        watch(panelOpenFlag, (openFlag: boolean, preOpenFLag: boolean) => {
            panelChange(openFlag);
        });

        onMounted(() => {
            panelChange(panelOpenFlag.value);
        });

        const panelChange = (openFlag: boolean) => {
            if (openFlag) {
                openClass.value = "open";
            } else {
                //TIPS 延迟标记，防止过早关闭导致背景半透明动画无效
                setTimeout(() => {
                    openClass.value = "close";
                }, 800);
            }
            TweenMax.to(".right-panel-bg", 0.8, {
                opacity: openFlag ? 0.8 : 0,
                delay: 0
            });
            TweenMax.to(".right-panel-toggle", 0.8, {
                opacity: openFlag ? 1 : 0.5,
                delay: 0
            });
            TweenMax.to(".right-panel", 0.5, {
                right: openFlag ? "0px" : "-200px",
                delay: 0
            });
        };

        return {
            cdnOpenIcon: Domain.cdnOpenIcon,
            systemStore,
            openClass
        };
    }
});
</script>

<style lang="scss">
.cigo-right-panel {
    width: auto;
    height: 100vh;
    display: flex;
    position: absolute;
    z-index: 9999;
    right: 0px;

    .right-panel-bg {
        background-color: #666;
        position: absolute;
        width: 100%;
        opacity: 0;
        height: 100%;
        right: 0px;
    }

    .right-panel {
        width: 200px;
        height: 100%;
        display: flex;
        position: absolute;
        background-color: #fff;
        right: -200px;

        .right-panel-toggle {
            cursor: pointer;
            width: 40px;
            height: 40px;
            position: absolute;
            align-self: center;
            display: flex;
            left: -25px;
            background: #fff;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;

            .right-panel-toggle-icon {
                width: 20px;
                height: 20px;
                align-self: center;
                margin-left: 5px;
            }
        }

        .right-panel-toggle:hover {
            opacity: 1 !important;
        }
    }
}

.cigo-right-panel.open {
    width: 100vw;
}
</style>
