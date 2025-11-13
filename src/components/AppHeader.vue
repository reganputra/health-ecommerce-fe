<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">❤️</span>
        Health Store
      </router-link>

      <nav class="main-nav">
        <router-link to="/products" class="nav-link">Products</router-link>
        <router-link to="/shops" class="nav-link">Shops</router-link>
        <router-link to="/guestbook" class="nav-link">Guestbook</router-link>
        <router-link to="/about" class="nav-link">About</router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link v-if="!authStore.isAdmin" to="/orders" class="nav-link">
            My Orders
          </router-link>

          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link">
            Admin Dashboard
          </router-link>

          <router-link v-if="!authStore.isAdmin" to="/cart" class="nav-link cart-link">
            Cart
            <span v-if="cartStore.itemCount > 0" class="cart-badge">
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <div class="user-menu">
            <span class="username">{{ authStore.user.username }}</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="btn-register">Register</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.isAdmin) {
    try {
      await cartStore.fetchCart()
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }
})

function handleLogout() {
  authStore.logout()
  cartStore.clearCart()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.logo:hover {
  color: #764ba2;
}

.logo-icon {
  font-size: 28px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-badge {
  background: #667eea;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 12px;
  border-left: 1px solid #eee;
}

.username {
  color: #333;
  font-weight: 600;
}

.btn-logout {
  padding: 8px 16px;
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #ffcdd2;
}

.btn-register {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .username {
    display: none;
  }
}
</style>
