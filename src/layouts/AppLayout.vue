<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <main class="app-main">
      <AppHeader />
      <div id="page-toolbar-root" class="page-toolbar-region"></div>
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>
