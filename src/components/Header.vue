<template>
    <div class="bs-header">
        <div class="left">
            <!-- home logo -->
            <img @click="jumpHome" class="logo" :src="require('@/assets/images/logo.png')">
            <!-- search -->
            <el-input prefix-icon="el-icon-search" class="search"> </el-input>
        </div>
        <div class="right">
            <!-- profile show by clicking avatar -->
            <el-popover
                popper-class="avatar-popover"
                visible-arrow
                ref="popover"
                v-model="itemVisible"
                width="248"
                placement="bottom"
                trigger="click"
                >
                <div class="info-header-body">
                <div class="info-img">
                    <div v-if="profile.token && !profile.avatar" :style="`background-color: ${ avatarBgColor }`" class="avatar-no-img">{{ nameFirstLetter }}</div>
                    <img v-if="profile.token && profile.avatar" class="avatar" :src="profile.avatar" alt="Your Avatar">
                </div>
                <div class="info-header-right">
                    <div class="info-name">{{profile.name}} </div>
                    <div class="info-email">{{ profile.email || profile.phone }} </div>
                </div>
                </div>
                <el-menu class="info-menu">
                <el-menu-item class="info-footer" @click="itemVisible = false;jumpAccount();" index="1">
                    <!-- <i class="iconfont el-icon-setting"></i> -->
                    <div class="info-footer-right">Edit Profile</div>
                </el-menu-item>
                <el-menu-item class="info-footer" @click="itemVisible = false;jumpWallet();" index="2">
                    <!-- <i class="iconfont el-icon-setting"></i> -->
                    <div class="info-footer-right">My Wallet</div>
                </el-menu-item>
                <el-menu-item class="info-footer"  @click="itemVisible = false;onLogout();" index="3">
                    <!-- <i class="iconfont el-icon-setting" ></i> -->
                    <div class="info-footer-right">Log Out</div>
                </el-menu-item>
                </el-menu>
            </el-popover>
            
            <!-- avatar -->
            <div class="avatar-w"  v-popover:popover @click="itemVisible = true">
                 <img v-show="profile.token && profile.avatar" class="avatar" :src="profile.avatar">
                <!-- no avatar content -->
                <div v-show="profile.token && !profile.avatar" :style="`background-color: ${ avatarBgColor }`" class="avatar-no-img">{{ nameFirstLetter }}</div>
            </div>
           
            <!-- help -->
            <el-button type="text" class="btn-tool" @click="jumpAbout">About</el-button>
            <!-- shopping cart -->
            <div v-if="profile.token" class="cart-w">
                <img class="cart-icon" :src="require('@/assets/images/cart.svg')">
                Cart(<span class="product-count">{{ productCount }}</span>)
            </div>
            <!-- login  -->
            <el-button v-if="!profile.token" @click="onLoginClick('signIn')" type="text" class="btn-tool">Login</el-button>
            <!-- sign up -->
            <el-button v-if="!profile.token" @click="onLoginClick('signUp')" type="text" class="btn-tool">Sign up</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: "BsHeader",
  data() {
    return {
      isLogin: false,
      itemVisible: false
    };
  },
  computed: {
    profile: function() {
      return this.$store.getters.userInfo;
    },
    avatarBgColor() {
      console.log("header computed avatarBgColor");
      return this.$store.getters.avatarBgColor;
    },
    nameFirstLetter() {
      console.log("header computed nameFirstLetter");
      return this.$store.getters.nameFirstLetter;
    },
    productCount() {
      return this.$store.state.productCount;
    }
  },
  mounted() {
    console.log("header mounted");
  },
  methods: {
    jumpHome() {
      this.$router.push("/");
    },
    jumpAccount() {
      this.$router.push("/account");
    },
    jumpWallet() {},
    onLogout() {
      this.$store.dispatch("logout");
    },
    onLoginClick(activeTag) {
      this.$store.commit("saveLoginActiveTag", activeTag);
      this.$router.push("/login");
    },
    jumpAbout() {
      this.$router.push("/about");
    }
  }
};
</script>

<style lang="scss">
.el-popover.avatar-popover {
  padding: 0px;
}
</style>


<style lang="scss" scoped>
.bs-header {
  display: flex;
  flex-direction: row;
  flex: 64px 0 0;
  width: 100%;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.16);
  .left {
    flex: 50% 1 1;
    display: flex;
    flex-direction: row;
    align-items: center;

    .logo {
      height: 32px;
      width: 32px;
      margin-right: 24px;
      cursor: pointer;
    }
    .search {
      max-width: 440px;
    }
  }
  .right {
    flex: 50% 1 1;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    color: #333;
    font-size: 1.4rem;

    .btn-tool {
      margin-left: 20px;
      color: #333;
      box-shadow: none;
      padding: 0;
      text-transform: none;
    }
    .avatar {
      margin-left: 20px;
    }
    .avatar-no-img {
      margin-left: 20px;
    }
    .cart-w {
      margin-left: 20px;
      cursor: pointer;
    }
    .cart-icon {
      height: 20px;
      width: 20px;
    }
    .product-count {
      color: #30b44e;
    }
  }
}
.avatar-w {
  height: auto;
  width: auto;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eee;
  line-height: 36px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
}
.avatar-no-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eee;
  line-height: 36px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  color: #fff;
  font-size: 2.4rem;
}
.info-header-body {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.info-img {
  display: flex;
  align-items: center;
  margin: 8px 0;
}
.info-header-right {
  margin-left: 6px;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
}
.info-header-body {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.info-name {
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-email {
  color: rgba(0, 0, 0, 0.54);
}
.info-menu {
  margin: 8px 0;
}
.info-menu .el-menu-item {
  height: 45px;
  line-height: 45px;
}

.info-footer {
  display: flex;
  align-items: center;
}
.info-footer-left {
  font-family: "Helvetica";
}
.iconfont {
  color: #333;
  font-size: 2.4rem;
}
.info-footer-right {
  margin-left: 10%;
  line-height: 39px;
}
</style>
