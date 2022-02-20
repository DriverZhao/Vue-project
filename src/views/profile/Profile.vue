<template>
  <div id="profile">
    <nav-bar class="bav-bar"><div slot="center">我的档案</div></nav-bar>
    <user-info></user-info>
    <account-info></account-info>
    <normal-list-view :list-data="orderList"></normal-list-view>
    <normal-list-view :list-data="serviceList"></normal-list-view>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

import UserInfo from './childComps/UserInfo.vue'
import AccountInfo from './childComps/AccountInfo.vue'
import NormalListView from './childComps/NormalListView.vue'

  export default {
    name: "Profile",
    components: {
      NavBar,
      UserInfo,
      AccountInfo,
      NormalListView
    },
    data(){
      return {
        orderList: [
          {icon: 'message.svg',info: '我的消息'},
          {icon: 'pointer.svg',info: '积分商城'},
          {icon: 'vip.svg',info: '会员卡'}
        ],
        serviceList: [
          {icon: 'message.svg',info: '我的消息'},
          {icon: 'shopping.svg',info: '下载App'},
        ]
      }
    }
  }
</script>

<style scoped>
  #profile{
    background-color: #f2f2f2;
  }

  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
