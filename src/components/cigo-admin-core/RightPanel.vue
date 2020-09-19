<template>
<div class="cigo-right-panel" :class="[openClass]">
    <div class="right-panel-bg" @click.stop="systemStore.closeRightPanel()"></div>
    <div class="right-panel">
        <div class="right-panel-content">
            <span>我是右侧面板</span>
        </div>
        <div class="right-panel-toggle" :class="[openClass]" @click.stop="systemStore.toggleRightPanel()" @mouseenter="hover(true)" @mouseleave="hover(false)">
            <cigo-icon-font class="right-panel-toggle-icon" :class="[panelOpenFlag ? 'open' : 'close']" :name="'cigoadmin-icon-185094settingsstreamline'"></cigo-icon-font>
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
import CigoIconFont from "@/components/cigo-ui/unit/basic/cigo-icon-font.vue";
import {
    systemStore
} from "@/store/index";
import {
    TweenMax
} from "gsap";

export default defineComponent({
    name: "RightPanel",
    components: {
        CigoIconFont
    },
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
            tipPanelExist();
            panelChange(panelOpenFlag.value);
        });

        const hover = (flag: boolean) => {
            TweenMax.to(".right-panel-toggle", 0.5, {
                left: flag ? "-30px" : "-9px",
                opacity: flag ? 1 : 0.5
            });
        };

        const tipPanelExist = () => {
            setTimeout(() => {
                if (!panelOpenFlag.value) {
                    TweenMax.to(".right-panel-toggle", 0.8, {
                        left: "-30px",
                        opacity: 1,
                        onComplete: () => {
                            TweenMax.to(".right-panel-toggle", 0.8, {
                                left: "-9px",
                                opacity: 0.5,
                                delay: 2
                            });
                        }
                    });
                }
            }, 3000);
        };

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
                opacity: openFlag ? 0.8 : 0
            });
            TweenMax.to(".right-panel-toggle", 0.8, {
                opacity: openFlag ? 1 : 0.5
            });
            if (openFlag) {
                TweenMax.to(".right-panel-content", 0.4, {
                    width: "200px",
                    onStart: () => {
                        TweenMax.to(".right-panel-content", 0.5, {
                            opacity: 1
                        });
                    }
                });
            } else {
                TweenMax.to(".right-panel-content", 0.4, {
                    opacity: 0,
                    onStart: () => {
                        TweenMax.to(".right-panel-content", 0.5, {
                            width: "0px"
                        });
                    }
                });
            }
        };

        return {
            systemStore,
            hover,
            openClass,
            panelOpenFlag
        };
    }
});
</script>

<style lang="scss">
.cigo-right-panel {
    width: auto;
    height: 100vh;
    display: flex;
    position: fixed;
    z-index: 10000;
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
        width: auto;
        height: 100%;
        display: flex;
        position: absolute;
        background-color: #fff;
        right: 0px;

        .right-panel-content {
            width: 0px;
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .right-panel-toggle {
            cursor: pointer;
            width: 30px;
            height: 40px;
            position: absolute;
            align-self: center;
            display: flex;
            left: -9px;
            background: #6b9afa;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;

            .right-panel-toggle-icon {
                width: 17px;
                height: 17px;
                align-self: center;
                margin-left: 9px;
                color: #6b9afa;
            }

            .right-panel-toggle-icon.close {
                color: #fff;
            }
        }

        .right-panel-toggle.open {
            background-color: #fff;
            left: -30px !important;
        }
    }
}

.cigo-right-panel.open {
    width: 100vw;
}
</style>
