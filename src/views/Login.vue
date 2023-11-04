<!--
 * Login, Register and Reset Password page
 * @author: Xueni Fu
 * @since: 2023-10-16
 * Login.vue
-->
<template>
    <div class="login-body">
        <div class="bg"></div>
        <!-- 登录/注册/忘记密码表单 -->
        <div class="login-panel">
            <el-form
                class="login-register"
                :model="formData"
                :rules="rules"
                ref="formDataRef"
                @submit.prevent
                @keyup.native.enter="doSubmit"
            >
                <div class="login-title">CubeDrive</div>
                <!-- 登录/注册账号（邮箱） -->
                <el-form-item prop="email">
                    <el-input
                        size="large"
                        clearable
                        placeholder="请输入邮箱"
                        v-model.trim="formData.email"
                        maxLength="150"
                    >
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 登录密码 -->
                <el-form-item
                    prop="password"
                    v-if="opType == 1"
                >
                    <el-input
                        size="large"
                        placeholder="请输入密码"
                        v-model.trim="formData.password"
                        show-password
                    >
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- 注册/重置密码 -->
                <div v-if="opType == 0 || opType == 2">
                    <!-- 邮箱验证码 TODO：连接后端，设置验证码发送时间间隔、验证码有效期-->
                    <el-form-item prop="emailCode">
                        <div class="send-email-panel">
                            <el-input
                                size="large"
                                placeholder="请输入邮箱验证码"
                                v-model.trim="formData.emailCode"
                            >
                                <template #prefix>
                                    <span class="iconfont icon-checkcode"></span>
                                </template>
                            </el-input>
                            <el-button
                                class="send-email-btn"
                                type="primary"
                                size="large"
                            >获取验证码</el-button>
                        </div>
                    </el-form-item>
                    <!-- 用户名 -->
                    <el-form-item
                        prop="username"
                        v-if="opType == 0"
                    >
                        <el-input
                            size="large"
                            placeholder="请输入用户名"
                            v-model.trim="formData.username"
                            maxLength="20"
                        >
                            <template #prefix>
                                <span class="iconfont icon-account"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <!-- 注册密码/找回密码 -->
                    <el-form-item prop="registerPassword">
                        <el-input
                            size="large"
                            placeholder="请输入密码"
                            v-model.trim="formData.registerPassword"
                            show-password
                        >
                            <template #prefix>
                                <span class="iconfont icon-password"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <!-- 重复密码 -->
                    <el-form-item prop="reRegisterPassword">
                        <el-input
                            size="large"
                            placeholder="请再次输入密码"
                            v-model.trim="formData.reRegisterPassword"
                            show-password
                        >
                            <template #prefix>
                                <span class="iconfont icon-password"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>
                <!-- 验证码 -->
                <el-form-item prop="checkCode">
                    <div class="check-code-panel">
                        <el-input
                            size="large"
                            placeholder="请输入验证码"
                            v-model.trim="formData.checkCode"
                        >
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                    </div>
                    <img
                        src=""
                        class="check-code"
                    />
                </el-form-item>
                <!-- 记住我、忘记密码、没有账号 -->
                <el-form-item>
                    <div
                        class="rememberme-panel"
                        v-if="opType == 1"
                    >
                        <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                    </div>
                    <div class="no-account">
                        <a
                            v-if="opType == 1"
                            href="javascipt:void(0)"
                            class="a-link"
                            @click="showPanel(2)"
                        >忘记密码？</a>
                        <a
                            v-if="opType == 1"
                            href="javascipt:void(0)"
                            class="a-link"
                            @click="showPanel(0)"
                        >注册</a>
                        <a
                            v-if="opType == 0 || opType == 2"
                            href="javascipt:void(0)"
                            class="a-link"
                            @click="showPanel(1)"
                        >去登录</a>
                    </div>
                </el-form-item>
                <!-- 注册/登录/重置密码按钮 -->
                <el-form-item>
                    <el-button
                        type="primary"
                        class="op-btn"
                        size="large"
                        @click="doSubmit"
                    >
                        <span v-if="opType == 0">注册</span>
                        <span v-if="opType == 1">登录</span>
                        <span v-if="opType == 2">重置密码</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue"
import api from "@/utils/api"

const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();

// 表单内容验证规则
const rules = { // TODO: validator实现
    email: [
        { required: true, message: "请输入邮箱" },
        { validator: proxy.$verify.email , message: "请输入正确的邮箱" }
    ],
    password: [
        { required: true, message: "请输入密码" },
        {
            validator: proxy.$verify.password,
            message: "密码只能是数字，字母，特殊字符 8-18位",
        },
    ],
    emailCode: [{ required: true, message: "请输入邮箱验证码" }],
    username: [{ required: true, message: "请输入用户名" }],
    registerPassword: [
        { required: true, message: "请输入密码" },
    ],
    reRegisterPassword: [
        { required: true, message: "请再次输入密码" },
    ],
    checkCode: [{ required: true, message: "请输入图片验证码" }],
};

// 操作类型 0：注册 1：登录 2：重置密码
const opType = ref(1);
const showPanel = (type) => {
    opType.value = type;
    resetForm(); // 重置表单
}
// 重置表单
const resetForm = () => {
    // TODO: changeCheckCode(0)
    formDataRef.value.resetFields();
    formData.value = {};
    // 登录 TODO: 取cookie
    if (opType.value == 1) { }
}
// 点击注册/登录/重置密码按钮操作
const doSubmit = () => {
    formDataRef.value.validate((valid) => {
        if (!valid) {
            return;
        }
    });
    if (opType.value == 0) { // 注册
        register();
    }
    if (opType.value == 1) { // 登录
        login();
    }
    if (opType.value == 2) { // 重置密码
        resetPassword();
    }
}
// 注册提交表单
const register = () => {
    if (formData.value.registerPassword == formData.value.reRegisterPassword) { // 注册/重置密码时两次密码输入一致
        formData.value.password = formData.value.registerPassword;
        proxy.$request.post(api.register, formData.value).then(res => {
            if (res.code === 200) { // 注册成功
                proxy.$message.success("注册成功"); // 注册成功消息
                resetForm(); // 重置表单
                showPanel(1); // 转到登录页面
            } else { // 注册失败
                proxy.$message.error(res.message); // 注册失败消息            
            }
        })
    } else {
        proxy.$message.error("两次输入密码不一致"); // 两次密码不一致消息
    }

}
// 登录提交表单
const login = () => {
    proxy.$request.post(api.login, formData.value).then(res => {
        if (res.code === 200) { // 登录成功
            // TODO:
            // 1. cookie存储登录状态
            // 2. router跳转网盘主页或上一个页面
            localStorage.setItem("token", res.data.token);
            proxy.$message.success("登录成功"); // 登录成功消息
            resetForm(); // 重置表单
            proxy.$router.push('/');
        } else { // 登录失败
            proxy.$message.error(res.message); // 登录失败消息            
        }
    })
}
// TODO: 重置密码提交表单
const resetPassword = () => {
    proxy.$request.post(api.resetPassword, formData.value).then(res => {
        if (res.code === 200) { // 重置密码成功
            proxy.$message.success("重置密码成功"); // 重置密码成功消息
            resetForm(); // 重置表单
            proxy.$router.push('/user/login');
        } else { // 重置密码失败
            proxy.$message.error(res.message); // 重置密码失败消息            
        }
    })
}

const getEmailCode = () => {
    formDataRef.value.validateField("email", (valid) => {
        if (!valid) return;
    });
}

</script>

<style lang="scss" scoped>
.login-body {
    height: calc(100vh);
    background-size: cover;
    background: url("../assets/login_bg.jpg");
    display: flex;

    .bg {
        flex: 1;
        background-size: cover;
        background-position: center;
        background-size: 800px;
        background-repeat: no-repeat;
        background-image: url("../assets/login_img.png");
    }

    .login-panel {
        width: 430px;
        margin-right: 15%;
        margin-top: calc((100vh - 500px) / 2);

        .login-register {
            padding: 25px;
            background: #fff;
            border-radius: 5px;

            .login-title {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .send-email-panel {
                display: flex;
                width: 100%;
                justify-content: space-between;

                .send-email-btn {
                    margin-left: 5px;
                }
            }

            .rememberme-panel {
                width: 100%;
            }

            .no-account {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }

            .op-btn {
                width: 100%;
            }
        }
    }

    .check-code-panel {
        width: 100%;
        display: flex;

        .check-code {
            margin-left: 5px;
            cursor: pointer;
        }
    }

    .login-btn-qq {
        margin-top: 20px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            cursor: pointer;
            margin-left: 10px;
            width: 20px;
        }
    }
}
</style>