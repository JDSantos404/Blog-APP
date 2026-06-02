<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { Notyf } from 'notyf'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global.js'
import api from '../api.js'

const notyf = new Notyf()
const router = useRouter()
const store = useGlobalStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const isPasswordValid = computed(() => password.value.length >= 8)

const doPasswordsMatch = computed(() =>
  password.value === confirmPassword.value
)

const isFormValid = computed(() =>
  firstName.value &&
  lastName.value &&
  email.value &&
  isPasswordValid.value &&
  doPasswordsMatch.value
)

onBeforeMount(() => {
  if (store.user?.email) {
    router.push('/posts')
  }
})

async function handleSubmit() {
  if (!isFormValid.value) {
    notyf.error('invalid input detected')
    return
  }

  try {
    await api.post('/users/check-email', {
      email: email.value
    })

    const res = await api.post('/users/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    })

    if (res.status === 201) {
      notyf.success('user created')

      firstName.value = ''
      lastName.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''

      router.push('/login')
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'registration failed'
    notyf.error(msg)
  }
}
</script>

<template>
  <div class="terminal-bg d-flex align-items-center justify-content-center">

    <div class="terminal-card p-4">

      <!-- HEADER -->
      <div class="terminal-header mb-3">
        <span class="prompt">404@auth:~$</span>
        <span class="cmd">git register</span>
      </div>

      <div class="terminal-title mb-1">
        create account
      </div>

      <div class="terminal-sub mb-4">
        initialize new user in blog system
      </div>

      <form @submit.prevent="handleSubmit">

        <!-- FIRST + LAST NAME -->
        <div class="row g-2">

          <div class="col">
            <label class="terminal-label">first_name</label>
            <input v-model="firstName" class="terminal-input" placeholder="firstName" />
            <small v-if="!firstName" class="error">* required</small>
          </div>

          <div class="col">
            <label class="terminal-label">last_name</label>
            <input v-model="lastName" class="terminal-input" placeholder="lastName" />
            <small v-if="!lastName" class="error">* required</small>
          </div>

        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label class="terminal-label">email</label>
          <input v-model="email" class="terminal-input" placeholder="user@mail.com" />
          <small v-if="!email" class="error">* required</small>
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <label class="terminal-label">password</label>
          <input v-model="password" type="password" class="terminal-input" placeholder="min 8 chars" />

          <small v-if="password && !isPasswordValid" class="error">
            * weak password
          </small>

          <small v-else-if="isPasswordValid && password" class="ok">
            ✔ secure
          </small>
        </div>

        <!-- CONFIRM -->
        <div class="form-group">
          <label class="terminal-label">confirm_password</label>
          <input v-model="confirmPassword" type="password" class="terminal-input" placeholder="repeat password" />

          <small v-if="confirmPassword && !doPasswordsMatch" class="error">
            * mismatch detected
          </small>

          <small v-else-if="doPasswordsMatch && confirmPassword" class="ok">
            ✔ match confirmed
          </small>
        </div>

        <!-- BUTTON -->
        <button
          class="terminal-btn"
          type="submit"
          :disabled="!isFormValid"
        >
          $ execute register
        </button>

        <!-- LOGIN LINK -->
        <div class="terminal-footer">
          already exists?
          <RouterLink to="/login" class="link">
            login instead
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
  width: 520px;
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

.prompt { color: #3fb950; }
.cmd { color: #c9d1d9; }

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
  margin-bottom: 14px;
}

.terminal-label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #8b949e;
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
  box-shadow: 0 0 0 2px rgba(63,185,80,0.15);
}

/* STATUS */
.error {
  color: #f85149;
  font-size: 12px;
}

.ok {
  color: #3fb950;
  font-size: 12px;
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
  font-weight: bold;
  cursor: pointer;
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