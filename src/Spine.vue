<script>
import {initSpine} from './spine';

export default {
    name: 'SpineWorld',
    data(){
        return {
            spineBoyController: null
        }
    },
    mounted(){
        const spine_boy_controller = initSpine();
        spine_boy_controller.then((controller)=>{
            this.spineBoyController = controller;
        })
    },
    methods: {
        run(){
            this.spineBoyController.run();
        },
        jump(){
            this.spineBoyController.jump();
        },
        shoot(){
            this.spineBoyController.shoot();
        },
        hoverboard(){
            this.spineBoyController.hoverboard();
        },
        turnLeft(){
            this.spineBoyController.turnLeft();
        },
        turnRight(){
            this.spineBoyController.turnRight();
        },
        stop(){
            this.spineBoyController.stop();
        },
        walk(){
            this.spineBoyController.walk();
        },
        portal(){
            this.spineBoyController.portal();
        },
    }
}
</script>

<template>
    <div class="button_container">
        <button @click="stop">Stop</button>
        <button @click="run">Run</button>
        <button @click="jump">Jump</button>
        <button @click="walk">Walk</button>
        <button @click="hoverboard">Hoverboard</button>
        <button @click="shoot">Shoot</button>
        <button @click="portal">Portal</button>
        <button @click="turnLeft">Turn Left</button>
        <button @click="turnRight">Turn Right</button>
    </div>
</template>

<style scoped>
    .button_container {
        position: absolute;
        display: flex;
        gap: 10px;
        top: 10px;
        left: 10px;
    }
    button {
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
    }
</style>