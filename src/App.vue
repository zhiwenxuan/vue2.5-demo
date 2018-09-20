<template>
  <div id="app">
    <BsHeader/>
    <!-- 使路由切换有过渡的效果 -->
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import BsHeader from "@/components/Header.vue";
export default {
  name: "app",
  components: {
    BsHeader
  }
};
</script>

<style lang="scss">
@import "@/assets/css/common.scss";
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>