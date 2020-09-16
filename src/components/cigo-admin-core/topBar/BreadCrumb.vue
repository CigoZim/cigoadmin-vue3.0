<template>
<div class="cigo-bread-crumb">
    <div class="bread-crumb-item" v-for="(item, index) in breadCrumbList" :key="index">
        <span v-if="index" class="divider">/</span>
        <span class="title">{{item.title}}</span>
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
        let menuBaseListIdMapRef: any = inject("menuBaseListIdMapRef");
        let menuBaseListNameMapRef: any = inject("menuBaseListNameMapRef");
        let currComponent = toRef(
            systemStore.getState().systemState,
            "currComponent"
        );
        let breadCrumbList = computed(() => {
            let list: Menu[] = [];
            if (
                menuBaseListNameMapRef.value &&
                menuBaseListNameMapRef.value.has(currComponent.value)
            ) {
                let currRuterItem = menuBaseListNameMapRef.value.get(
                    currComponent.value
                );
                let ids = currRuterItem.path.split(",");
                //编辑级联父级
                ids.every((id: string, index: number) => {
                    if (
                        id != "" &&
                        id != "0" &&
                        menuBaseListIdMapRef.value &&
                        menuBaseListIdMapRef.value.has("id_" + id)
                    ) {
                        let menuItem = menuBaseListIdMapRef.value.get(
                            "id_" + id
                        );
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
        font-size: 13px;
        color: #555;
        margin-right: 5px;

        .divider {
            margin-right: 5px;
        }
    }
}
</style>
