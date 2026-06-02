<script setup>
import { Collapse } from 'bootstrap'
import { computed } from 'vue'
import { useGlobalStore } from '../stores/global.js'

const store = useGlobalStore()
const user = computed(() => store.user)

const closeNavbar = () => {
  const navbar = document.getElementById('navbarNavAltMarkup')

  if (!navbar) return

  const bsCollapse =
    Collapse.getInstance(navbar) ||
    new Collapse(navbar, { toggle: false })

  bsCollapse.hide()
}
</script>

<template>
  <nav class="navbar navbar-expand-lg git-navbar sticky-top">
    <div class="container">

      <!-- LEFT: Terminal-style brand -->
      <router-link :to="{ name: 'Home' }" class="navbar-brand git-brand">
        <span class="prompt">404@blog:~$</span>
        <span class="brand-text">BlogAPP</span>
      </router-link>

      <!-- toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- NAV -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto git-links">

          <router-link to="/" class="git-link" @click="closeNavbar">
            <i class="bi bi-house"></i> home
          </router-link>

          <router-link to="/posts" class="git-link" @click="closeNavbar">
            <i class="bi bi-pencil-square"></i> posts
          </router-link>

          <!-- <router-link
            v-if="user?.email"
            to="/create-post"
            class="git-link"
            @click="closeNavbar"
          >
            write
          </router-link> -->

          <router-link
            v-if="user?.email"
            to="/profile"
            class="git-link"
            @click="closeNavbar"
          >
            <i class="bi bi-person"></i> profile
          </router-link>


          <!-- AUTH -->
          <div class="git-auth">

            <template v-if="!user?.email">
              <router-link
                to="/login"
                class="git-link"
                @click="closeNavbar"
              >
                <i class="bi bi-box-arrow-left"></i> login
              </router-link>

              <router-link
                to="/register"
                class="git-link highlight"
                @click="closeNavbar"
              >
                <i class="bi bi-person-plus"></i> register
              </router-link>
            </template>

            <template v-else>
              <router-link
                to="/logout"
                class="git-link danger"
                @click="closeNavbar"
              >
                <i class="bi bi-box-arrow-right"></i> logout
              </router-link>
            </template>

          </div>

        </div>
      </div>

    </div>
  </nav>
</template>

<style scoped>

/* TERMINAL NAVBAR */
.git-navbar {
  background: #0d1117;
  border-bottom: 1px solid #30363d;
  padding: 8px 0;
  font-family: "Consolas", "Courier New", monospace;
}

/* CONTAINER */
.container {
  max-width: 900px;
  margin: auto;
  padding: 0 16px;
}

/* BRAND (terminal prompt style) */
.git-brand {
  display: flex;
  gap: 8px;
  align-items: center;
  text-decoration: none;
}

.prompt {
  color: #3fb950;
  font-size: 0.9rem;
}

.brand-text {
  color: #f2cc60;
  font-weight: 600;
  font-size: 0.95rem;
}

/* LINKS */
.git-links {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* base link */
.git-link {
  color: #8b949e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.15s ease;
  position: relative;
}

/* hover like terminal highlight */
.git-link:hover {
  color: #58a6ff;
}

/* active route */
.router-link-active {
  color: #3fb950 !important;
}

/* special states */
.highlight {
  color: #3fb950 !important;
}

.warn {
  color: #d29922 !important;
}

.danger {
  color: #f85149 !important;
}

/* AUTH GROUP (inline like terminal commands) */
.git-auth {
  display: flex;
  gap: 12px;
  margin-left: 10px;
}

/* MOBILE */
@media (max-width: 992px) {
  .git-links {
    flex-direction: column;
    align-items: flex-start;
    padding-top: 10px;
    gap: 10px;
  }

  .git-auth {
    flex-direction: column;
    margin-left: 0;
  }
}
</style>