<script setup>
import SidebarNavItem from '../components/SidebarNavItem.vue'
import { navigation } from '../config/navigation.js'
import appLogo from '../assets/dds-logo.png'
</script>

<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <img :src="appLogo" alt="App Logo" class="app-logo" />
        </div>
        <nav class="sidebar-nav">
            <SidebarNavItem
                v-for="item in navigation"
                :key="item.to"
                v-bind="item"
            />
        </nav>
    </aside>
</template>
