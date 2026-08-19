<script setup>
import AppSidebarNav from '../components/AppSidebarNav.vue'
</script>

<template>
  <div class="layout">
    <AppSidebarNav />
    <main>
      <header class="top-bar-header">DDS Enterprise Application</header>
      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>
