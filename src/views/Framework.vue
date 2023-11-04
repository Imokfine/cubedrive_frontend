<!--
 * Homepage
 * @author: Xueni Fu
 * @since: 2023-10-17
 * Home.vue
-->
<template>
    <div class="home">
        <div class="header">
            <div class="logo">
                <span class="iconfont icon-pan"></span>
                <div class="name">CubeDrive</div>
            </div>
            <div class="right-panel">
                <el-popover
                    :width="800"
                    trigger="click"
                    v-model:visible="showUploader"
                    :offset="20"
                    transition="none"
                    :hide-after="0"
                    :popper-style="{ padding: '0px' }"
                >
                    <template #reference>
                        <span class="iconfont icon-transfer"></span>
                    </template>
                    <template #default>
                        <Uploader></Uploader>
                    </template>
                </el-popover>
                <el-dropdown>
                    <div class="user-info">
                        <div class="avatar"></div>
                        <span class="user-name">{{ userInfo.username }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>修改头像</el-dropdown-item>
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="body">
            <div class="left-sider">
                <div class="menu-list">
                    <div
                        @click="jump(item)"
                        :class="[
                            'menu-item',
                            item.menuCode == currentMenu.menuCode ? 'active' : '',
                        ]"
                        v-for="item in menus"
                    >
                        <div :class="['iconfont', 'icon-' + item.icon]"></div>
                        <div class="text">{{ item.name }}</div>
                    </div>
                </div>
                <div class="menu-sub-list">
                    <div
                        @click="jump(sub)"
                        :class="['menu-item-sub', sub.path == currentPath ? 'active' : '']"
                        v-for="sub in currentMenu.children"
                    >
                        <span
                            :class="['iconfont', 'icon-' + sub.icon]"
                            v-if="sub.icon"
                        ></span>
                        <span class="text">{{ sub.name }}</span>
                    </div>
                    <div
                        class="tips"
                        v-if="currentMenu && currentMenu.tips"
                    >
                        {{ currentMenu.tips }}
                    </div>
                    <div class="space-info">
                        <div>空间使用</div>
                        <div class="percent"></div>
                    </div>
                </div>
            </div>
            <div class="body-content">
                <router-view>

                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance, nextTick } from "vue"
import { useRouter, useRoute } from "vue-router"
import { menus } from "../utils/lists"
import Uploader from '@/views/main/Uploader.vue'

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const userInfo = ref({
    username: "ponponpon",
});

const currentMenu = ref({});
const currentPath = ref();
// 菜单跳转
const jump = (data) => {
    // 如果路径不存在或者选中的菜单是当前菜单，不做任何动作
    if (!data.path || data.menuCode == currentMenu.value.menuCode) {
        return;
    }
    router.push(data.path) // 路由跳转
};
// 设置菜单路径
const setMenu = (menuCode, path) => {
    const menu = menus.find((item) => {
        return item.menuCode === menuCode;
    });
    currentMenu.value = menu;
    currentPath.value = path;
};
// 监听路由
watch(
    () => route, // 如果路由发生了变化
    (newVal, oldVal) => {
        if (newVal.meta.menuCode) { // 如果新路由存在
            setMenu(newVal.meta.menuCode, newVal.path);
        }
    },
    { immediate: true, deep: true }
);


</script>

<style lang = "scss" scoped>
.header {
    box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
    height: 56px;
    padding-left: 24px;
    padding-right: 24px;
    position: relative;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
        display: flex;
        align-items: center;

        .icon-pan {
            font-size: 40px;
            color: #1296db;
        }

        .name {
            font-weight: bold;
            margin-left: 5px;
            font-size: 25px;
            color: #05a1f5;
        }
    }

    .right-panel {
        display: flex;
        align-items: center;

        .icon-transfer {
            cursor: pointer;
        }

        .user-info {
            margin-right: 10px;
            display: flex;
            align-items: center;
            cursor: pointer;

            .avatar {
                margin: 0px 5px 0px 15px;
            }

            .user-name {
                color: #05a1f5;
            }
        }
    }
}

.body {
    display: flex;

    .left-sider {
        border-right: 1px solid #f1f2f4;
        display: flex;

        .menu-list {
            height: calc(100vh - 56px);
            width: 80px;
            box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
            border-right: 1px solid #f1f2f4;

            .menu-item {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                padding: 20px 0px;
                cursor: pointer;

                &:hover {
                    background: #f3f3f3;
                }

                .iconfont {
                    font-weight: normal;
                    font-size: 28px;
                }
            }

            .active {
                .iconfont {
                    color: #06a7ff;
                }

                .text {
                    color: #06a7ff;
                }
            }
        }

        .menu-sub-list {
            width: 200px;
            padding: 20px 10px 0px;
            position: relative;

            .menu-item-sub {
                text-align: center;
                line-height: 40px;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background: #f3f3f3;
                }

                .iconfont {
                    font-size: 14px;
                    margin-right: 20px;
                }

                .text {
                    font-size: 13px;
                }
            }

            .active {
                background: #eef9fe;

                .iconfont {
                    color: #05a1f5;
                }

                .text {
                    color: #05a1f5;
                }
            }

            .tips {
                margin-top: 10px;
                color: #888888;
                font-size: 13px;
            }

            .space-info {
                position: absolute;
                bottom: 10px;
                width: 100%;
                padding: 0px 5px;

                .percent {
                    padding-right: 10px;
                }

                .space-use {
                    margin-top: 5px;
                    color: #7e7e7e;
                    display: flex;
                    justify-content: space-around;

                    .use {
                        flex: 1;
                    }

                    .iconfont {
                        cursor: pointer;
                        margin-right: 20px;
                        color: #05a1f5;
                    }
                }
            }
        }
    }

    .body-content {
        flex: 1;
        width: 0;
        padding-left: 20px;
    }
}
</style>

