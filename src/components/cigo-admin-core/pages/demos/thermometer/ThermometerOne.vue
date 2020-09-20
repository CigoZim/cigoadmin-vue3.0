<template>
<div class="cigo-thermometer-one" :class="{'grabbing': dragging}" @mousemove="mouseMoving" @mouseUp="stopDrag">
    <div class="upper-container" :style="{'--bgColor': bgColor}">
        <h2 class="temperature-text">{{round(currentTemperature)}}</h2>
        <div class="temperature-graduation">
            <div class="temperature-element" v-for="el in temperatureGrades" :key="el" :style="tempElementStyle(el)">
                <span class="temperature-element-number">{{el}}</span><br>
                <span class="temperature-element-line">|</span>
            </div>
        </div>
    </div>
    <div class="lower-container">
        <div class="slider-container" :style="sliderStyle">
            <svg>
                <path d="M74.3132 0C47.0043 2.44032e-05 50.175 30 7.9179 30H144.27C99.4571 30 101.622 -2.44032e-05 74.3132 0Z" transform="translate(-7.38794 0.5)" fill="#12132C" />
            </svg>
            <div class="slider-button" :class="{'grabbing': dragging}" @mouseDown="startDrag">
                <i class="fas fa-thermometer-empty slider-icon"></i>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    TweenLite
} from 'gsap'
import {
    computed,
    defineComponent,
    reactive,
    ref
} from 'vue'
export default defineComponent({
    name: 'CigoThermometerOne',
    setup(props, ctx) {
        const sliderMinX = 0
        const sliderMaxX = 240

        const coldGradient = {
            start: '#5564C2',
            end: '#3A2E8D'
        }
        const hotGradient = {
            start: '#F0AE4B',
            end: '#9B4D1B'
        }
        let dragging = ref(false);
        let initialMouseX = 0;
        let initialSliderX = 0;
        let sliderX = ref(0);
        let temperatureGrades = [10, 15, 20, 25, 30];
        let bgColorObj = reactive({
            start: coldGradient.start,
            end: coldGradient.end
        });

        const startDrag = (e: any) => {
            dragging.value = true;
            initialMouseX = e.pageX;
            initialSliderX = sliderX.value;

        };
        const stopDrag = () => {
            dragging.value = false;
        };
        const mouseMoving = (e: any) => {
            if (dragging.value) {
                const dragAmount = e.pageX - initialMouseX;
                const targetX = initialSliderX + dragAmount;

                // keep slider inside limits
                sliderX.value = Math.max(Math.min(targetX, sliderMaxX), sliderMinX);

                // set bg color
                let targetGradient = coldGradient
                if (currentTemperature.value >= 25) {
                    targetGradient = hotGradient
                }
                if (bgColorObj.start !== targetGradient.start) {
                    TweenLite.to(bgColorObj, 1, {
                        'start': targetGradient.start,
                        'end': targetGradient.end
                    })
                }
            }
        };
        const tempElementStyle = (tempNumber: number) => {
            const nearDistance = 3
            const liftDistance = 12

            // lifts up the element when the current temperature is near it
            const diff = Math.abs(currentTemperature.value - tempNumber)
            const distY = (diff / nearDistance) - 1

            // constrain the distance so that the element doesn't go to the bottom
            const elementY = Math.min(distY * liftDistance, 0)
            return `transform: translate3d(0, ${elementY}px, 0)`
        };

        let currentTemperature = computed(() => {
            return (sliderX.value / sliderMaxX * 20) + 10;
        });

        const round = (num: number) => {
            return Math.round(num);
        };

        let sliderStyle = computed(() => {
            return `transform: translate3d(${sliderX.value}px,0,0)`
        });
        let bgColor = computed(() => {
            return `linear-gradient(to bottom right, ${bgColorObj.start}, ${bgColorObj.end})`
        });

        return {
            temperatureGrades,
            currentTemperature,
            round,
            bgColor,
            tempElementStyle,
            sliderStyle,
            mouseMoving,
            startDrag,
            stopDrag,
            dragging,
        };
    }
})
</script>

<style lang="scss">
.cigo-thermometer-one {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 1fr;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    color: white;
    font-family: Arial, Helvetica, sans-serif;

    h2 {
        color: white;
    }
}

.upper-container {
    position: relative;
    // background: linear-gradient(to bottom right, #5564C2, #3A2E8D);
    background: var(--bgColor);
}

.temperature-text {
    position: absolute;
    bottom: 150px;
    user-select: none;
    font-size: 100px;
    width: 100%;
    text-align: center;
}

.temperature-graduation {
    left: calc(50% - 150px);
    position: absolute;
    bottom: 25px;
    user-select: none;
}

.temperature-element {
    text-align: center;
    display: inline-block;
    width: 40px;
    margin: 0 10px 0 10px;
    opacity: 0.7;
}

.temperature-element-line {
    font-size: 7px;
}

.lower-container {
    background-color: #12132C;
}

.slider-container {
    width: 150px;
    height: 80px;
    margin-top: -30px;
    margin-left: calc(50% - 187px);
    position: relative;
}

.slider-button {
    position: absolute;
    left: 42px;
    top: 5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #2724A2;

    cursor: grab;
    cursor: -webkit-grab;
    cursor: -moz-grab;
}

.grabbing {
    cursor: grabbing;
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
}

.slider-icon {
    margin-top: 16px;
    margin-left: 21px;
    color: white;
}
</style>
