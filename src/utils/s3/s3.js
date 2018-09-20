/*
 * @Author: zhenqi.li
 * @Date: 2018-09-19 10:37:08
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 10:43:27
 * @Description: 上传文件到亚马逊 S3的基类
 * @Email: 1045875816@qq.com
 */

import AWS from 'aws-sdk'

/**
 *    API Doc :  http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
 *
 * Frequently used API:
 * １.delete Object: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
 * ２.get Object: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
 * ３.get all object of a path Object: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 * ４.upload bject: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
 *
 * tips: upload.vue component implemented 1. and 4. (handleDelete, handleUpload), go take a look.
 */

// the S3 Object in the official document is S3API.S3.
class S3API_Class {

    constructor() {
        /**
         * S3的一些参数定义
         */
        this.BUCKET_NAME = "your bucket name"
        this.BUCKET_REGION = "your bucket region"
        this.IDENTITY_POOL_ID = "your idetity pool id"


        // AWS is import from 'aws-sdk'
        AWS.config.update({
            region: this.BUCKET_REGION,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: this.IDENTITY_POOL_ID
            })
        })

        this.S3 = new AWS.S3({
            apiVersion: "2006-03-01",
            params: {
                Bucket: this.BUCKET_NAME
            }
        })
    }

    /**
     * 生成头像key
     */
    generateAvatarKey(userId, suffix) {
        return `users/profile/${userId}/` + Date.now() + suffix;
    }
}
let S3API = new S3API_Class();
export default S3API;