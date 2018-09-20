  <template>
  <div id="account-setting" @click="onClickBackHome">
    <div class="card-collector">
      <div class="card tri-row-layout">
        <div class="card-header">
          <div class="card-header-title">Account</div>
        </div>
        <el-form class="card-body"
          ref="profile"
          :model="profile"
          label-width="96px"
          :rules="profileRules"
          :loading="loadingProfile">
          <div class="part">
            <div class="part-title">Basic Profile</div>
            <div class="basic-profile">
              <div id="avatarContainer" class="basic-profile-left" :loading="loadingAvatar">
                <div style="width:100%;height:100%;" @click="toggleShow">
                  <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.name" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <my-upload field="img"
                  @crop-success="cropSuccess"
                  v-model="avatarModal"
                  :width="128"
                  :height="128"
                  langType="en"
                  img-format="png"></my-upload>
              </div>
              <el-form class="basic-profile-right"
                label-width="64px">
                <el-form-item label="Name" prop="name">
                    <el-input v-model.trim="profile.name" maxlength="25" placeholder="Your name"></el-input>
                </el-form-item>
    
                <el-form-item>
                  <i class="iconfont icon-phone" slot="label"></i>
                  <div class="flex-form-item">
                    <span>{{profile.phone}}</span>
                    <el-button class="flat flex-form-button"
                      size="small"
                      @click="editNewPhone">
                      {{newPhone.isEdit?'Cancel':(profile.phone?'Edit':'Add')}}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form ref="newPhoneForm"
                  v-if="newPhone.isEdit"
                  :rules="newPhoneRule"
                  :model="newPhone"
                  label-width="64px">
                    <el-form-item prop="phone" label=" ">
                      <el-input v-model.trim="newPhone.phone" placeholder="New phone number">
                        <el-select v-model="nationCode" class="nation-code" slot="prepend">
                          <el-option v-for="item in NATION_CODES" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                        <template slot="append">| {{newPhone.phone.length}}</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="rePhone" label=" ">
                      <el-input v-model.trim="newPhone.rePhone" placeholder="Repeat the number">
                        <el-select v-model="nationCode" class="nation-code" slot="prepend">
                          <el-option v-for="item in NATION_CODES" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                        <template slot="append">| {{newPhone.rePhone.length}}</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword" label=" ">
                      <div class="flex-form-item">
                        <el-input placeholder="Please input your password" type="password" v-model="newPhone.confirmPassword"></el-input>
                        <el-button class="flat flex-form-button"
                          size="small"
                          type="primary"
                          :loading="newPhone.isLoading"
                          @click="saveNewPhone">Save</el-button>
                      </div>
                    </el-form-item>
                </el-form>

                <el-form-item>
                  <i class="iconfont icon-email" slot="label"></i>
                  <div class="flex-form-item">
                    <span>{{profile.email}}</span>
                    <el-button class="flat flex-form-button"
                      size="small"
                      @click="editNewEmail">
                      {{newEmail.isEdit?'Cancel':(profile.email?'Edit':'Add')}}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form ref="newEmailForm" 
                  v-if="newEmail.isEdit"
                  :rules="newEmailRule"
                  :model="newEmail"
                  label-width="64px">
                  <el-form-item prop="email" label=" ">
                    <el-input v-model.trim="newEmail.email" placeholder="New email address"></el-input>
                  </el-form-item>
                  <el-form-item prop="reEmail" label=" ">
                    <el-input v-model.trim="newEmail.reEmail" placeholder="Repeat your email"></el-input>
                  </el-form-item>
                  <el-form-item prop="confirmPassword" label=" ">
                    <div class="flex-form-item">
                      <el-input placeholder="Please input your password" type="password" v-model="newEmail.confirmPassword"></el-input>
                      <el-button class="flat flex-form-button"
                        size="small"
                        type="primary"
                        :loading="newEmail.isLoading"
                        @click="saveNewEmail">Save</el-button>
                    </div>
                  </el-form-item>
                </el-form>

              </el-form>
            </div>
          </div>
        </el-form>
        <div class="card-footer">
          <div class="card-footer-left"></div>
          <div class="card-footer-right">
            <el-button type="primary" @click="submitForm()">UPDATE</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import validator from "@/utils/validation";
import Msg from "@/utils/message";
import myUpload from "vue-image-crop-upload";
let S3API = {};
import {
  bindPhone,
  bindEmail,
  getUserInfo,
  updateUserInfo,
  uploadAvatar
} from "@/api/index";

export default {
  data() {
    return {
      // About profile.
      avatarModal: false,
      userId: this.$store.getters.userId,
      loadingProfile: false,

      profileRules: {
        name: [
          {
            required: true,
            trigger: "submit",
            message: "User name is required."
          }
          // { min: 1, max: 25 }
        ],
        email: [
          { required: true, trigger: "submit", message: "Email is required." },
          { type: "email", trigger: "submit", message: "Email is unavailable." }
        ]
      },
      newPhoneRule: {
        phone: [
          {
            validator: this.phoneValidator,
            trigger: "blur"
          }
        ],
        rePhone: [
          {
            validator: this.verifyConfirmPhone,
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your password."
          }
        ]
      },
      newEmailRule: {
        email: [
          {
            validator: this.emailValidator,
            trigger: "blur"
          }
        ],
        reEmail: [
          {
            validator: this.verifyConfirmEmail,
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            message: "Please input your password."
          }
        ]
      },
      profile: {
        name: "",
        email: "",
        phone: "",
        avatar: ""
      },
      nationCode: 1,
      NATION_CODES: [{ id: 1, name: "USA +1" }, { id: 86, name: "China +86" }],
      newPhone: this.initNewPhone(),
      newEmail: this.initNewEmail(),

      // About avatar uploading
      s3: {},
      loadingAvatar: false
    };
  },
  components: {
    "my-upload": myUpload
  },
  computed: {},
  created() {
    this.getUserProfile();
  },
  mounted() {
    let dThis = this;
    require.ensure(
      [],
      function() {
        S3API = require("@/utils/s3/s3").default;
        dThis.s3 = S3API.S3;
      },
      "s3"
    );
  },
  methods: {
    onClickBackHome() {
      let e = window.event;
      console.log(e.target);
      if (e.target.id !== "account-setting") {
        return;
      }
      this.jumpHome();
    },
    jumpHome() {
      this.$router.push("/");
    },
    // 一些格式验证
    phoneValidator(rule, value, callback) {
      if (this.nationCode == 1)
        if (!validator.verifyPhone(value)) {
          callback(new Error("Wrong USA phone number."));
        } else {
          callback();
        }
      else if (this.nationCode == 86)
        if (!validator.verifyChineseCellPhone(value)) {
          callback(new Error("Wrong Chinese phone number."));
        } else {
          callback();
        }
    },
    verifyConfirmPhone(rule, value, callback) {
      if (value != this.newPhone.phone) {
        callback(new Error("Can not match your Phone."));
      } else {
        callback();
      }
    },
    emailValidator(rule, value, callback) {
      if (!validator.verifyEmail(value)) {
        callback(new Error("Email format error."));
      } else {
        callback();
      }
    },
    verifyConfirmEmail(rule, value, callback) {
      if (value != this.newEmail.email) {
        callback(new Error("Can not match your Email."));
      } else {
        callback();
      }
    }, // 格式验证结束

    editNewPhone() {
      this.newPhone.isEdit = !this.newPhone.isEdit;
      if (!this.newPhone.isEdit) {
        this.nationCode = 1;
        this.newPhone = this.initNewPhone();
      }
    },
    editNewEmail() {
      this.newEmail.isEdit = !this.newEmail.isEdit;
      if (!this.newEmail.isEdit) {
        this.newEmail = this.initNewEmail();
      }
    },
    initNewPhone() {
      return {
        phone: "",
        rePhone: "",
        confirmPassword: "",
        isEdit: false,
        isLoading: false
      };
    },
    initNewEmail() {
      return {
        email: "",
        re_email: "",
        confirmPassword: "",
        isEdit: false,
        isLoading: false
      };
    },
    //向后台保存电话
    async saveNewPhone() {
      if (this.newPhone.isLoading) return;
      this.$refs["newPhoneForm"].validate(async valid => {
        if (!valid) {
          return;
        }
        this.newPhone.isLoading = true;
        let params = {
          phone:
            "+" + this.nationCode + " " + this.newPhone.phone.replace(/-/g, ""),
          password: this.newPhone.confirmPassword
        };
        let data = await bindPhone(params);
        this.newPhone.isLoading = false;
        if (!data) {
          return;
        }

        Msg.showSuccess(
          (this.profile.phone ? "Edit" : "Add") + " phone successfully."
        );
        this.$store.commit("saveUserInfo", { phone: params.phone });
        this.profile.phone = params.phone;
        this.editNewPhone();
      });
    },
    //向后台保存邮件
    saveNewEmail() {
      if (this.newEmail.isLoading) return;
      this.$refs["newEmailForm"].validate(async valid => {
        if (!valid) {
          return;
        }
        this.newEmail.isLoading = true;
        let params = {
          email: this.newEmail.email,
          password: this.newEmail.confirmPassword
        };
        let data = await bindEmail(params);
        this.newEmail.isLoading = false;
        if (!data) {
          return;
        }
        Msg.showSuccess(
          (this.profile.phone ? "Edit" : "Add") + " email successfully."
        );
        this.$store.commit("saveUserInfo", { email: this.newEmail.email });
        this.profile.email = this.newEmail.email;
        this.editNewEmail();
      });
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },
    toggleShow() {
      this.avatarModal = !this.avatarModal;
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl) {
      let canvasEle = document.querySelector("#avatarContainer canvas");
      //   let canvasEle = $("#avatarContainer canvas").get(0);
      if (canvasEle.toDataURL) {
        this.profile.avatar = canvasEle.toDataURL("image/jpeg", 1);
      } else {
        this.profile.avatar = imgDataUrl;
      }
      var fileObj = {
        file: this.dataURItoBlob(this.profile.avatar)
      };
      this.handleAvatarUpload(fileObj);
      document.querySelector(".vicp-step2 .vicp-operate a").click();
    },
    async getUserProfile() {
      let data = await getUserInfo();
      if (!data) {
        return;
      }
      this.profile = data;
    },
    submitForm() {
      this.$refs["profile"].validate(valid => {
        if (valid) {
          this.handleUpdateProfile();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async handleUpdateProfile() {
      this.loadingProfile = true;
      let profile = this.profile;
      let params = {
        name: profile.name
      };
      let res = await updateUserInfo(params);
      this.loadingProfile = false;
      if (!res) {
        return;
      }
      Msg.showSuccess("Update profile successfully.");
      this.$store.commit("saveUserInfo", profile);
      this.$router.push("/");
    },

    // About avatar uploading
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";
      const isAccessibel = isJPG || isPNG || isGIF;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isAccessibel) {
        Msg.showError("Avatar picture must be JPG / PNG / GIF format!");
      }
      if (!isLt2M) {
        Msg.showError("Avatar picture size can not exceed 2MB!");
      }
      return isAccessibel && isLt2M;
    },
    handleAvatarUpload(avatarFile) {
      let file = avatarFile.file;
      let fileName = file.name;
      Msg.showInfo("Your avatar is uploading");
      this.loadingAvatar = true;

      //保存到数据库
      this.saveAvatarToServer(fileName);

      //上传到S3，需要提供配置S3才能使用
      // let $this = this;
      // const suffix = ".png";
      // const avatarKey = S3API.generateAvatarKey(this.userId, suffix);
      // let request = this.s3.upload(
      //   {
      //     Key: avatarKey,
      //     Body: file,
      //     ACL: "public-read"
      //   },
      //   async (err, res) => {
      //     this.loadingAvatar = false;

      //     //临时去掉错误处理
      //     if (err) {
      //       return Msg.showError(
      //         "Failed to upload avatat, please check your network and try again later."
      //       );
      //     }
      //     $this.saveAvatarToServer(avatarKey);

      //   }
      // );
      //进度条控制
      // request.on("httpUploadProgress", function(progress) {
      //   progress.percent = progress.loaded / progress.total * 100;
      //   avatarFile.onProgress(progress);

      // });
    },
    async saveAvatarToServer(avatarUrl) {
      let data = await uploadAvatar({ avatar: avatarUrl });
      this.loadingAvatar = false;
      if (!data) {
        return;
      }
      this.profile.avatar = data.avatar;
      this.$store.commit("saveUserInfo", this.profile);
      Msg.showSuccess("Upload avatar successfully");
    }
  }
};
</script>

<style  lang="scss" scoped>
#account-setting {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12) inset,
    0 2px 6px rgba(0, 0, 0, 0.16) inset;
}
</style>


<style lang="scss">
#account-setting .el-collapse-item__header {
  font-size: 16px;
  height: 56px;
  line-height: 56px;
  padding: 0 16px;
  color: #333;
  font-weight: 500;
}

#account-setting .el-collapse-item__header__arrow {
  margin-right: 16px;
}

#account-setting .el-collapse-item__content {
  padding: 0;
}

#account-setting .el-upload__input {
  display: none !important;
}

#account-setting .el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.card .el-collapse-item__arrow {
  margin-right: 8px;
}
.card .el-collapse-item__arrow.is-active {
  transform: rotate(90deg);
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#account-setting {
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

.card-collector {
  flex: 0 0 auto;
  width: 540px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.12);
}

.card-collector .card + .card {
  margin-top: 8px;
}

#account-setting .card-body {
  padding: 8px 24px;
}
.flex-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-form-button {
  flex: 0 0 auto;
  margin: 0 8px;
}
.phone-format {
  color: rgb(191, 217, 204);
  font-size: 13px;
}

.part-title {
  font-size: 14px;
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.54);
}

.part {
  padding-bottom: 8px;
  width: 100%;
}
.part + .part {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 8px;
}

.basic-profile {
  display: flex;
}

.basic-profile-left {
  width: 160px;
  height: 160px;
  flex: 0 0 160px;
  overflow: hidden;
  padding: 16px;
}
.basic-profile-right {
  flex: 1 1 auto;
}

.avatar-uploader {
  width: 160px;
  height: 160px;
  display: inline-block;
  position: relative;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #888;
  width: 100%;
  height: 100%;
  line-height: 128px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
}
.nation-code {
  width: 96px;
}

.location-form-row .el-col .el-form-item:first-of-type {
  margin-top: 0;
}
.icon-label {
  padding: 0 16px 0 0;
  color: rgb(191, 217, 204);
  font-size: 24px;
  line-height: 24px;
}

.icon-label ~ span {
  line-height: 25px;
}
</style>
