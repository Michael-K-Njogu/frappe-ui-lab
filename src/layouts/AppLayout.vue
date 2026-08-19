<script setup>
import { useRouter } from 'vue-router'

import AppSidebarNav from '../components/AppSidebarNav.vue'
import NotificationMenu from '../components/notifications/NotificationMenu.vue'

const router = useRouter()
</script>

<template>
  <div class="layout">
    <AppSidebarNav />
    <main>
      <header class="top-bar-header">
        <div class="top-bar-header-left"></div>
        <div class="top-bar-header-right">
          <NotificationMenu
            @view-all="
              router.push({
                name: 'notifications',
              })
            "
          />
        </div>
      </header>
      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>
