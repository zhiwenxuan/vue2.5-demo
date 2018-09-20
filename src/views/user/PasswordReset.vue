<template>
  <div id="bees-sign" v-loading.body="loading" @click="onClickBackHome">
    <div class="card sign-card tri-row-layout">
      <router-link :to="{path: '/login'}" class="card-header dense">
        <div class="card-header-left">
          <el-button icon="el-icon-back" class="content-left-btn tool"></el-button>
          <div class="back-text">
            known already? Back to sign in.
          </div>
        </div>
      </router-link>

      <div class="card-body vue-demo_resetPassword">
        <h4 class="login-title">Reset Password</h4>
        <el-form class="login-form" :model="resetPasswordForm" label-width="136px" label-position="left" :rules="resetPasswordRules"
          ref="resetPasswordForm">
          <el-form-item label="Email or Phone" prop="account">
            <el-input type="text" v-model.lazy.trim="resetPasswordForm.account" name="account"></el-input>
          </el-form-item>
          <div style="display: flex;position:relative;">
            <el-form-item label="Verification Code" prop="securityCode" style="flex: 1 1 auto">
              <el-input type="text" v-model.lazy.trim="resetPasswordForm.securityCode" name="securityCode">
                <el-button type="primary" class="flat" slot="suffix"
                  @click="onGetSecurityCode" v-bind:disabled="!securityCodeSendable"
                  :loading="securityCodeSending">
                  {{ sendVCodeBtnText }}
                </el-button>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="Password" prop="password">
            <el-input @blur="passwordTips" @input="passwordTips" type="password" v-model.lazy="resetPasswordForm.password" name="password"></el-input>
          </el-form-item>
          <el-form-item label="Confirm password" prop="rePassword">
            <el-input type="password" v-model.lazy="resetPasswordForm.rePassword" name="password" @keydown.native.enter="onRegisterByKey"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-footer card-veriant-footer">
        <el-button @click="onReset" type="primary" style="float: right" :disabled="!isResetable">Reset</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import verify from "@/utils/validation";
import Msg from "@/utils/message.js";
import {
  getSecurityCode,
  checkUserExistence,
  resetPassword
} from "@/api/index";
export default {
  data() {
    return {
      loading: false,
      sendVCodeBtnText: "Send",
      securityCodeTimer: 0,
      securityCodeSending: false,
      securityCodeInterval: null,
      resetPasswordForm: {
        account: "",
        securityCode: "",
        password: "",
        rePassword: ""
      },
      resetPasswordRules: {
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
            validator: this.verifyConfirmPassword,
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
  computed: {
    isResetable() {
      return this.resetPasswordForm.account;
    },
    securityCodeSendable() {
      return this.securityCodeTimer <= 0 && !this.securityCodeSending;
    }
  },
  methods: {
    onClickBackHome() {
      let e = window.event;
      if (e.target.id !== "bees-sign") {
        return;
      }
      this.jumpHome();
    },
    jumpHome() {
      this.$router.push("/");
    },
    passwordTips() {},
    verifyAccountName(rule, value, callback) {
      if (
        !verify.verifyEmail(value) &&
        !verify.verifyPhone(value) &&
        !verify.verifyChineseCellPhone(value)
      ) {
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
    verifyConfirmPassword(rule, value, callback) {
      if (value != this.resetPasswordForm.password) {
        callback(new Error("These passwords do not match."));
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
    onGetSecurityCode() {
      //copy this object for use in ajax callback function
      this.checkUserExistence(async verifyCheck => {
        this.sendVCodeBtnText = "";
        this.securityCodeSending = true;
        if (!verifyCheck) {
          this.securityCodeSending = false;
          return;
        }

        let res = await getSecurityCode({ account: verifyCheck.account });
        if (!res) {
          return;
        }

        this.registerResultText = "180";
        this.startTimer();
        this.securityCodeSending = false;

        if (verifyCheck.isPhone) {
          Msg.showMotionless(
            "Sent",
            "Verification code has been sent. Please check your phone, and please check your message spam if you didn't receive verification code in a minute."
          );
        } else if (verifyCheck.isEmail) {
          Msg.showMotionless(
            "Sent",
            "Verification code has been sent. Please check your email, and please check your email spam if you didn't receive verification code in a minute."
          );
        }
      });
      //judge account name format
    }, //end of onGetSecurityCode
    checkUserExistence(callback) {
      this.$refs["resetPasswordForm"].validateField("account", async err => {
        if (err) {
          return callback(false);
        }
        let verifyCheck = this.execVerifyCheck("resetPasswordForm", true);

        let res = await checkUserExistence({ account: verifyCheck.account });
        if (!res) {
          return callback(false);
        }
        if (!res.existence) {
          Msg.showWarning("That account does not exist.(只是测试，不支持更改)");
          return callback(false);
        }
        return callback(verifyCheck);
      });
    },
    //
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
    updateTimer() {
      this.securityCodeTimer--;
      this.sendVCodeBtnText = this.securityCodeTimer + "s";
      if (this.securityCodeTimer <= 0) {
        clearInterval(this.securityCodeInterval);
        this.sendVCodeBtnText = "send";
        this.securityCodeSending = false;
      }
    },
    startTimer() {
      this.securityCodeTimer = 180;
      this.securityCodeInterval = setInterval(this.updateTimer, 1000);
    },
    onReset() {
      this.loading = true;
      let verifyCheck = this.execVerifyCheck("resetPasswordForm");
      //judge format
      this.$refs["resetPasswordForm"].validate(async valid => {
        if (!valid) {
          this.loading = false;
          return;
        }

        let userInfo = await resetPassword({
          account: verifyCheck.account,
          password: this.resetPasswordForm.password,
          rePassword: this.resetPasswordForm.rePassword,
          securityCode: this.resetPasswordForm.securityCode
        });
        if (!userInfo) {
          return;
        }
        this.loading = false;
        this.resetSuccess();
      });
    },
    resetSuccess() {
      Msg.showSuccess("Reset password success. Please login.");
      this.$router.push("/login");
    } //end of resetSuccess
  }
};
</script>
<style lang="scss">
.sign-card .el-input__inner {
  height: 28px;
}
.sign-card .vue-demo_resetPassword .el-form .el-button {
  height: 25px;
  color: #30b44e;
  border: none;
  padding: 0 8px;
  background-color: transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.sign-card .el-form-item label:before {
  display: none;
}

.sign-card .vue-demo_resetPassword .el-input__inner[name="securityCode"] {
  padding-right: 60px;
}
.sign-card {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 0;
    padding: 2px 4px;
    transition: all 0.3s ease-in-out;
    height: 24px;
    line-height: 1;
    background: transparent;
  }
}
</style>
<style lang="scss" scoped>
.tipsPanel {
  width: 100%;
  color: #999;
  font-size: 12px;
  line-height: 1;
  /*position: absolute;*/
  /*top: 100%;*/
  /*left: 0;*/
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
  height: 480px;
  margin-top: -40px;
  max-height: calc(100% - 52px);
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.12);
}

.card-header.dense {
  height: 48px;
}
.sign-card .card-body {
  padding: 24px;
}

.back-text {
  font-size: 13px;
  line-height: 48px;
  display: inline-block;
  vertical-align: top;
  color: rgba(0, 0, 0, 0.87);
}

.back-text a {
  text-decoration: none;
}

.card-body {
  display: block;
}

.login-logo {
  height: 80px;
  width: 80px;
  display: block;
  margin: auto;
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
  margin-top: 40px;
}

.full-width-btn {
  width: 100%;
}

#bees-sign .card-veriant-footer {
  border: none;
  justify-content: flex-end;
}
.card-veriant-footer button {
  margin: 12px 12px 0 0;
}
.content-left-btn {
  border: none;
  font-size: 1.6rem;
  border-radius: 50%;
  color: rgba(0, 0, 0, 0.54);
  background-color: transparent;
  box-shadow: none;
  margin: 6px 0;
}
.tri-row-layout .card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  height: 48px;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 0 0 auto;
}
.el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
