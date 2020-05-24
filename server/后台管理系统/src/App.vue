<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css'; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
.cell {
    overflow: hidden;
    text-overflow: ellipsis;
    /* background: greenyellow; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
</style>
