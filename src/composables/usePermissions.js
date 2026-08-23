import { computed } from 'vue'

import { useAuth } from './useAuth'
import { ROLE_PERMISSIONS } from '../constants/rolePermissions'

export function usePermissions() {
  const { profile } = useAuth()

  const role = computed(() => {
    return profile.value?.role ?? null
  })

  const permissions = computed(() => {
    if (!role.value) {
      return []
    }

    return ROLE_PERMISSIONS[role.value] ?? []
  })

  function hasPermission(permission) {
    return permissions.value.includes(permission)
  }

  function hasAnyPermission(permissionList = []) {
    return permissionList.some((permission) => hasPermission(permission))
  }

  function hasAllPermissions(permissionList = []) {
    return permissionList.every((permission) => hasPermission(permission))
  }

  return {
    role,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}
