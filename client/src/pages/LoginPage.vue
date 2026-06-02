<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useGlobalStore } from '../stores/global'
import { Notyf } from 'notyf'
import api from '../api.js'
import { useRouter } from 'vue-router'

const store = useGlobalStore()
const router = useRouter()
const notyf = new Notyf()

const email = ref('')
const password = ref('')

const isEmailValid = computed(() => email.value.includes('@'))
const isPasswordValid = computed(() => password.value.length >= 1)

const isEnabled = computed(() =>
  isEmailValid.value && isPasswordValid.value
)

onBeforeMount(() => {
  if (store.user?.email) {
    router.push('/posts')
  }
})

async function handleSubmit(e) {
  e.preventDefault()

  if (!isEnabled.value) {
    notyf.error('invalid credentials')
    return
  }

  try {
    const res = await api.post('/users/login', {
      email: email.value,
      password: password.value
    })

    if (res.data) {
      notyf.success('login successful')

      localStorage.setItem('token', res.data.access)
      store.getUserDetails(res.data.access)

      email.value = ''
      password.value = ''

      router.push('/posts')
    }
  } catch (e) {
    const msg = e?.response?.data?.message || 'authentication failed'
    notyf.error(msg)
  }
}
</script>

<template>
  <div class="terminal-bg d-flex align-items-center justify-content-center">

    <div class="terminal-card p-4">

      <!-- TERMINAL HEADER -->
      <div class="terminal-header mb-3">
        <span class="prompt">404@auth:~$</span>
        <span class="cmd">git login</span>
      </div>

      <div class="terminal-title mb-2">
        Welcome back
      </div>

      <div class="terminal-sub mb-4">
        Authenticate to access blog repository
      </div>

      <form @submit.prevent="handleSubmit">

        <!-- EMAIL -->
        <div class="form-group">
          <label class="terminal-label">email</label>

          <input
            v-model="email"
            type="email"
            class="terminal-input"
            placeholder="user@mail.com"
          />

          <small v-if="!email" class="error">
            * required field
          </small>

          <small v-else-if="!isEmailValid" class="error">
            * invalid format
          </small>
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <label class="terminal-label">password</label>

          <input
            v-model="password"
            type="password"
            class="terminal-input"
            placeholder="********"
          />

          <small v-if="!password" class="error">
            * required field
          </small>
        </div>

        <!-- COMMAND BUTTON -->
        <button
          class="terminal-btn"
          type="submit"
          :disabled="!isEnabled"
        >
          $ execute login
        </button>

        <!-- REGISTER -->
        <div class="terminal-footer">
          no account?
          <RouterLink to="/register" class="link">
            create user
          </RouterLink>
        </div>

      </form>

    </div>
  </div>
</template>

<style scoped>
/* BACKGROUND */
.terminal-bg {
  min-height: 100vh;
  background: #0d1117;
  font-family: Consolas, monospace;
  color: #c9d1d9;
  min-height: 90vh;
}

/* CARD */
.terminal-card {
  width: 450px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
}

/* HEADER */
.terminal-header {
  display: flex;
  gap: 10px;
  padding: 8px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
}

.prompt {
  color: #3fb950;
}

.cmd {
  color: #c9d1d9;
}

/* TITLE */
.terminal-title {
  font-size: 20px;
  font-weight: bold;
  color: #58a6ff;
}

.terminal-sub {
  font-size: 13px;
  color: #8b949e;
}

/* FORM */
.form-group {
  margin-bottom: 15px;
}

.terminal-label {
  display: block;
  margin-bottom: 6px;
  color: #8b949e;
  font-size: 13px;
}

/* INPUT */
.terminal-input {
  width: 100%;
  padding: 10px;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #c9d1d9;
  border-radius: 6px;
  outline: none;
}

.terminal-input:focus {
  border-color: #3fb950;
  box-shadow: 0 0 0 2px rgba(63, 185, 80, 0.15);
}

/* ERROR */
.error {
  color: #f85149;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* BUTTON */
.terminal-btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #238636;
  border: 1px solid #2ea043;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.terminal-btn:hover:not(:disabled) {
  background: #2ea043;
}

.terminal-btn:disabled {
  background: #161b22;
  border-color: #30363d;
  color: #8b949e;
  cursor: not-allowed;
}

/* FOOTER */
.terminal-footer {
  margin-top: 15px;
  font-size: 13px;
  color: #8b949e;
}

.link {
  color: #58a6ff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>