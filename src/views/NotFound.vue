<template>
	<div id="error">
		<div class="error-content">
			<div class="img-placeholder"></div>
			<div class="error-text">
				<h2>Sorry, I think we are lost.</h2>
				<p>Page not found.</p>
			</div>
			<el-button @click="goBack()">Back</el-button>
			<el-button type="primary" @click="goHome()">Home</el-button>
		</div>
	</div>
</template>
<script>
export default {
  name: "ERROR",
  data() {
    return {
      indexText: "Go home",
      indexLink: "/"
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      // this.$router.push("/")
      window.location.href =
        window.location.protocol + "//" + window.location.host;
    }
  }
};
</script>
<style scoped>
#error {
  height: 100%;
  width: 100%;
  background-color: #eee;
  position: absolute;
}
.error-content {
  position: absolute;
  width: 441px;
  height: 359px;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #727a73;
  text-align: right;
}
.error-text {
  padding: 8px 0;
}
.img-placeholder {
  width: 441px;
  height: 276px;
  background: url("../assets/images/404.png") no-repeat center center;
  padding: 8px 0;
}
.el-button--primary {
  background-color: #727a73;
}
.el-button--primary:hover,
.el-button--primary:focus {
  background-color: #626a63;
}
.el-button--default:hover,
.el-button--default:focus {
  color: #727a73;
}
</style>
