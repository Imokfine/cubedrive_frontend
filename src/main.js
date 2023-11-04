import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// Element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 图标
import '@/assets/icon/iconfont.css'
import '@/assets/base.scss'
//引入代码高亮
import HljsVuePlugin from '@highlightjs/vue-plugin'
import "highlight.js/styles/atom-one-light.css";
import 'highlight.js/lib/common'
// cookie
import VueCookies from 'vue-cookies'
// 验证
import verify from '@/utils/verify'
import request from '@/utils/request'
import message from '@/utils/message'

// 自定义组件
import Table from '@/components/Table.vue'
import Navigation from '@/components/Navigation.vue'

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(HljsVuePlugin);

app.component('Table', Table);
app.component('Navigation', Navigation);

//配置全局变量
app.config.globalProperties.$request = request;
app.config.globalProperties.$message = message;
app.config.globalProperties.$verify = verify;

app.mount('#app')
