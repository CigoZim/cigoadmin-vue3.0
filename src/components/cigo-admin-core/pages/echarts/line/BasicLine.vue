<template>
<div class="cigo-echarts-basic-line">
    <div class="title-area">
        <span>基础折线图</span>
    </div>
    <div id="basicLine" class="chart-win"></div>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted
} from 'vue'
import echarts from 'echarts';

export default defineComponent({
    name: 'CigoEchartsBasicLine',
    setup(props, ctx) {
        let option: any = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
        };

        onMounted(() => {
            drawChart();
        });

        const drawChart = () => {
            let elementById: any = document.getElementById("basicLine");
            let lineChart = echarts.init(elementById);
            lineChart.setOption(option);
        };

        return {};
    }
})
</script>

<style lang="scss">
.cigo-echarts-basic-line {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .chart-win {
        width: 500px;
        height: 500px;
    }
}
</style>
