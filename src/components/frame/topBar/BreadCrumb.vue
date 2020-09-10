<template>
<div class="cigo-bread-crumb">
    <div class="bread-crumb-item">
        <span>首页</span>
    </div>
    <div class="bread-crumb-item" v-for="(item, index) in breadCrumbList" :key="index">
        <span>>> {{item.title}}</span>
    </div>
</div>
</template>

<script lang="ts">
import {
    systemStore
} from "@/store";
import {
    string
} from "locutus/python";
import {
    computed,
    defineComponent,
    inject,
    onMounted,
    toRef
} from "vue";
import {
    Menu
} from "../utils/types";

export default defineComponent({
    name: "CigoBreadCrumb",
    setup() {
        let menuIdBaseMapRef: any = inject("menuIdBaseMapRef");
        let menuNameBaseMapRef: any = inject("menuNameBaseMapRef");
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );
        let breadCrumbList = computed(() => {
            let list: Menu[] = [];
            if (
                menuNameBaseMapRef.value &&
                menuNameBaseMapRef.value.has(currComponent.value)
            ) {
                let currRuterItem = menuNameBaseMapRef.value.get(
                    currComponent.value
                );
                let ids = currRuterItem.path.split(",");
                //编辑级联父级
                ids.every((id: string, index: number) => {
                    if (
                        id != "" &&
                        id != "0" &&
                        menuIdBaseMapRef.value &&
                        menuIdBaseMapRef.value.has("id_" + id)
                    ) {
                        let menuItem = menuIdBaseMapRef.value.get("id_" + id);
                        if (menuItem) {
                            list = [...list, menuItem];
                        }
                    }
                    return true;
                });

                //追加当前页面
                list = [...list, currRuterItem];
            }

            return list;
        });
        return {
            breadCrumbList
        };
    }
});
</script>

<style lang="scss">
.cigo-bread-crumb {
    display: flex;
    flex-direction: row;

    .bread-crumb-item {
        margin-right: 5px;
    }
}
</style>
