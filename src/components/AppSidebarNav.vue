<script setup>
import { navigation } from '../config/navigation.js'

import SidebarNavItem from '../components/SidebarNavItem.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { LogOut } from '@lucide/vue'
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <!--<img :src="appLogo" alt="App Logo" class="app-logo" />-->
      Mikey's Mini-ERP
    </div>
    <nav class="sidebar-nav">
      <SidebarNavItem v-for="item in navigation" :key="item.to" v-bind="item" />
    </nav>

    <div class="sidebar-footer">
      <small>Version 1.0.0</small>
    </div>
  </aside>
</template>
