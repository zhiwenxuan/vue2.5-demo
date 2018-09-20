<template>
  <div id="bees-sign" @click="onClickBackHome" v-loading.body="loading">
    <div class="card sign-card tri-row-layout" id="sign-card">
      <el-tabs v-model="activeName" @tab-click="handleTagClick" style="overflow:hidden;" class="card-body card-tab">
          <!-- Sign In -->
        <el-tab-pane label="Sign In" name="signIn">
          <div class="main vue-demo_signIn">
            <h4 class="login-title">Sign In</h4>
            <el-form class="login-form" :model="loginForm" label-width="136px" label-position="left" :rules="loginRules"
                     ref="loginForm">
              <el-form-item label="Email or Phone" prop="account">
                <el-input type="text" v-model.lazy.trim="loginForm.account" name="account"></el-input>
              </el-form-item>
              <div style="display: flex;position:relative;">
                <el-form-item label="Password" prop="password" style="flex: 1 1 auto;">
                  <el-input :type="loginForm.ischecking?'text':'password'" v-model.lazy="loginForm.password"
                            name="password" @keydown.native.enter="onLoginByKey">
                  </el-input>
                </el-form-item>
              </div>
              <router-link class="login-pwd-forget" :to="{path: forgetPwdLink}">Forget password?</router-link>
            </el-form>
          </div>
        </el-tab-pane>
        <!-- Sign UP -->
        <el-tab-pane label="Sign Up" name="signUp">
          <div class="main vue-demo_signUp">
            <h4 class="login-title">Create Account</h4>
            <el-form class="login-form" :model="registerForm" label-width="136px" label-position="left"
                     :rules="registerRules" ref="registerForm">
              <el-form-item label="User Name" prop="name">
                <el-input type="text" v-model.lazy.trim="registerForm.name" placeholder="Your name" name="name"></el-input>
              </el-form-item>
              <el-form-item label="Email or Phone" prop="account">
                <el-input type="text" v-model.lazy.trim="registerForm.account" name="account"></el-input>
              </el-form-item>
              <div style="display: flex;position:relative;">
                <el-form-item label="Verification Code" prop="securityCode" style="flex: 1 1 auto">
                  <el-input type="text" v-model.lazy.trim="registerForm.securityCode" name="securityCode">
                    <el-button type="primary" class="flat" @click="onGetSecurityCode('registerForm')" slot="suffix"
                              v-bind:disabled="!securityCodeSendable('registerForm')"
                              :loading="registerForm.securityCodeSending">
                      {{ registerForm.sendVCodeBtnText }}
                    </el-button>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item label="Password" prop="password">
                <el-input @blur="passwordTips" @input="passwordTips" type="password"
                          v-model.lazy="registerForm.password" name="password"></el-input>
                <!-- <div class="tipsPanel"><i class="iconfont icon-information-outline" style="font-size: 14px"></i> Contains 8-30 letters with numbers.</div> -->
              </el-form-item>
              <el-form-item label="Confirm password" prop="rePassword">
                <el-input type="password" v-model.lazy="registerForm.rePassword" name="password"
                          @keydown.native.enter="onRegisterByKey"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div v-if="this.activeName === 'signIn'" class="card-footer card-veriant-footer">
        <el-button @click="jumpHome" class="btn-cancel" type="text">Cancel</el-button>
        <el-button @click="onLogin" type="primary">Sign in</el-button>
      </div>
      <div style="position:relative;" v-else class="card-footer card-veriant-footer">
        <div class="agreementBox">By signing up, I agree to <span class="agreementLink" @click="openAgreement">vue-demo Terms & Conditions</span></div>
        <el-button @click="jumpHome" class="btn-cancel" type="text">Cancel</el-button>
        <el-button @click="onRegister" type="primary">Sign Up</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import verify from "@/utils/validation";
import {
  getSecurityCode,
  checkUserExistence,
  login,
  register
} from "@/api/index";
import Msg from "@/utils/message";

export default {
  data() {
    return {
      forgetPwdLink: "/password-reset",
      loading: false,
      loginForm: {
        account: "",
        password: "",
        ischecking: false
      },
      registerForm: {
        sendVCodeBtnText: "Send",
        securityCodeTimer: 0,
        securityCodeSending: false,
        securityCodeInterval: null,
        name: "",
        account: "",
        securityCode: "",
        password: "",
        rePassword: ""
      },
      activeName: "signIn",

      loginRules: {
        account: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your phone or email."
          },
          {
            validator: this.verifyAccountName,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your password."
          }
        ]
      },
      registerRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your name."
          }
        ],
        account: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your phone or email."
          },
          {
            validator: this.verifyAccountName,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your password."
          },
          {
            validator: this.verifyPassword,
            trigger: "blur"
          }
        ],
        rePassword: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your password."
          },
          {
            validator: this.verifyRegisterConfirmPassword,
            trigger: "blur"
          }
        ],
        securityCode: [
          {
            required: true,
            trigger: "submit",
            message: "Please input your verification code."
          },
          {
            validator: this.verifySecurityCode,
            trigger: "submit"
          }
        ]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initActiveName();
  },
  methods: {
    onClickBackHome() {
      let e = window.event;
      console.log(e.target);
      if (e.target.id !== "bees-sign") {
        return;
      }
      this.jumpHome();
    },
    jumpHome() {
      this.$router.push("/");
    },
    initActiveName() {
      this.activeName = this.$store.getters.loginActiveTag;
      if (this.activeName !== "signIn") {
        document.getElementById("sign-card").style.height = "520px";
      }
    },
    openAgreement() {},
    handleTagClick(tab) {
      let panelHeight = 0;
      switch (tab.paneName) {
        case "signIn":
          panelHeight = 342;
          break;
        case "signUp":
          panelHeight = 520;
          break;
      }
      //   $(".sign-card").height(panelHeight);
      document.getElementById("sign-card").style.height = panelHeight + "px";
      this.$store.commit("saveLoginActiveTag", tab.paneName);
    },
    securityCodeSendable(formName) {
      return (
        this[formName].securityCodeTimer <= 0 &&
        !this[formName].securityCodeSending
      );
    },
    passwordTips() {},
    /************* verify part  begin ************* */
    verifyAccountName(rule, value, callback) {
      if (!verify.verifyEmail(value) && !verify.verifyChineseCellPhone(value)) {
        callback(new Error("Account name format error."));
      } else {
        callback();
      }
    },
    verifyPassword(rule, value, callback) {
      if (!verify.verifyPassword(value)) {
        callback(new Error("Contains 8-30 letters with numbers."));
      } else {
        callback();
      }
    },
    verifyRegisterConfirmPassword(rule, value, callback) {
      if (value != this.registerForm.password) {
        callback(new Error("These passwords do not match"));
      } else {
        callback();
      }
    },
    verifySecurityCode(rule, value, callback) {
      if (!verify.verifySecurityCode(value)) {
        callback(new Error("length should be 6."));
      } else {
        callback();
      }
    },
    /************* verify part  end ************* */
    onLoginByKey() {
      this.onLogin();
    },
    onRegisterByKey() {
      this.onRegister();
    },
    onLogin() {
      this.loading = true;
      //judge account name format
      this.$refs["loginForm"].validate(async valid => {
        if (!valid) {
          this.loading = false;
          return;
        }
        let verifyCheck = this.execVerifyCheck("loginForm");
        let res = await login({
          account: verifyCheck.account,
          password: this.loginForm.password
        });
        this.loading = false;
        if (!res) {
          return;
        }
        this.loginSuccess(res);
        return;
      });
    }, //end of onLogin
    onRegister() {
      this.loading = true;
      //judge format
      this.$refs["registerForm"].validate(async valid => {
        if (!valid) {
          this.loading = false;
          return;
        }
        let verifyCheck = this.execVerifyCheck("registerForm");
        let res = await register({
          name: this.registerForm.name,
          lastName: this.registerForm.lastName,
          account: verifyCheck.account,
          password: this.registerForm.password,
          securityCode: this.registerForm.securityCode
        });
        this.loading = false;
        if (!res) {
          return;
        }
        Msg.showSuccess("Sign up success.");
        this.registerSuccess(res);
      });
    }, //end of onRegister
    loginSuccess(userInfo) {
      this.$store.commit("saveUserInfo", userInfo);
      if (this.$router.history.current.query.redirect) {
        this.$router.push(this.$router.history.current.query.redirect);
      } else {
        this.jumpHome();
      }
    },
    registerSuccess(userInfo) {
      this.$store.commit("saveUserInfo", userInfo);
      this.jumpHome();
    }, //end of registerSuccess
    async onGetSecurityCode(formName) {
      this.callCheckUserExistence(formName, async verifyCheck => {
        if (!verifyCheck) {
          return;
        }

        this[formName].sendVCodeBtnText = "";
        this[formName].securityCodeSending = true;

        let res = await getSecurityCode({ account: verifyCheck.account });
        if (!res) {
          return;
        }
        this.startTimer(formName);
        this[formName].securityCodeSending = false;
        if (verifyCheck.isPhone) {
          return Msg.showMotionless(
            "Sent",
            "Verification code has been sent. Please check your phone, and check your message spam if you didn't receive verification code in a minute."
          );
        } else if (verifyCheck.isEmail) {
          return Msg.showMotionless(
            "Sent",
            "Verification code has been sent. Please check your email, and check your email spam if you didn't receive verification code in a minute."
          );
        }
      });

      //judge account name format
    }, //end of onGetSecurityCode
    async callCheckUserExistence(formName, callback) {
      this.$refs[formName].validateField("account", async err => {
        if (err) {
          callback(false);
          return false;
        }
        let verifyCheck = this.execVerifyCheck(formName, true);
        let res = await checkUserExistence({ account: verifyCheck.account });
        if (!res) {
          callback(false);
          return;
        }
        if (res.existence) {
          Msg.showWarning("That account is taken. Please try another.");
          callback(false);
          return;
        }
        callback(verifyCheck);
        return verifyCheck;
      });
    },
    execVerifyCheck(form, encode) {
      let account = this[form].account;
      let verifyCheck = {
        isPhone: verify.verifyChineseCellPhone(account),
        isEmail: verify.verifyEmail(account),
        account: account
      };
      if (verifyCheck.isPhone) {
        verifyCheck.account = "+86 " + account;
        if (encode) {
          verifyCheck.account = encodeURIComponent(verifyCheck.account);
        }
      }
      return verifyCheck;
    },
    updateTimer(form) {
      form.securityCodeTimer--;
      form.sendVCodeBtnText = form.securityCodeTimer + "s";
      if (form.securityCodeTimer <= 0) {
        clearInterval(form.securityCodeInterval);
        form.sendVCodeBtnText = "send";
        form.securityCodeSending = false;
      }
    },
    startTimer(formName) {
      this[formName].securityCodeTimer = 180;
      this[formName].securityCodeInterval = setInterval(() => {
        this.updateTimer(this[formName]);
      }, 1000);
    },
    toggleLoginChecking() {
      this.loginForm.ischecking = !this.loginForm.ischecking;
    }
  }
};
</script>

<style lang="scss">
.sign-card .el-tabs__header {
  margin: 0;
  border-color: #eee;
  width: 100%;
  height: 48px;
}

.sign-card .el-tabs__header *:not(.el-tabs__active-bar) {
  height: 100%;
}

.sign-card .el-tabs__item {
  width: 50%;
  text-align: center;
}

.sign-card .el-tabs__nav,
.sign-card .el-tabs__content {
  width: 100%;
}
.sign-card .el-form-item__error {
  width: 200%;
  /*its 2 short 4 the verification code*/
}

.sign-card .el-form-item label:before {
  display: none;
}

.sign-card .vue-demo_signIn .el-input__inner[name="password"] {
  padding-right: 30px;
}

.sign-card .vue-demo_signUp .el-input__inner[name="securityCode"] {
  padding-right: 60px;
}

.sign-card .vue-demo_signUp .el-form .el-button {
  height: 25px;
  color: #30b44e;
  border: none;
  padding: 0 8px;
  background-color: transparent;
  box-shadow: none;
  &:hover {
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
}
.sign-card .vue-demo_resetPassword .el-form .el-button {
  height: 25px;
}

.sign-card .vue-demo_resetPassword .el-input__inner[name="securityCode"] {
  padding-right: 60px;
}

.sign-card .el-input__inner {
  height: 28px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.rowContainer {
  display: flex;
}
.tipsPanel {
  width: 100%;
  color: #999;
  font-size: 12px;
  line-height: 1;
  margin-top: 2px;
}

#bees-sign {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
}

.sign-card {
  width: 440px;
  height: 342px;
  transition: height 0.25s linear;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.12);
  /* margin-top: -40px; */
}

.card-tab {
  margin: 0;
  padding: 0;
}

.card-veriant-footer {
  display: flex;
  border: none;
  justify-content: flex-end;

  button {
    margin: 12px 12px 0 0;
  }
  .btn-cancel {
    box-shadow: none;
    color: #30b44e;
  }
}

.main {
  padding: 24px;
  height: 100%;
}

.login-title {
  font-size: 26px;
  height: 26px;
  line-height: 1;
  font-weight: 500;
  transform: scaleX(0.92) translateX(-20px);
  letter-spacing: -1px;
}

.login-form {
  margin-top: 32px;
}

.login-pwd-forget {
  display: inline-block;
  float: right;
  text-align: right;
  color: #30b44e;
  font-size: 13px;
  cursor: pointer;
}

.login-pwd-forget:hover {
  text-decoration: none;
  color: #5c6;
}

.full-width-btn {
  width: 100%;
}

.icon-eye-outline {
  color: #30b44e;
}

.icon-eye-off-outline {
  color: rgba(0, 0, 0, 0.54);
}

.agreementBox {
  position: absolute;
  left: 24px;
  top: -20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.agreementLink {
  color: #30b44e;
  text-decoration: underline;
  cursor: pointer;
}

.agreementLink:hover {
  color: #5c6;
}
</style>
