<script>
import NavbarComponent from './components/NavbarComponent.vue';
import { useGlobalStore } from './stores/global.js';
import { onBeforeMount } from 'vue';


export default {
  components: {
    NavbarComponent
  },
  setup() {
    const { getUserDetails } = useGlobalStore();

    onBeforeMount(() =>
      getUserDetails(localStorage.getItem("token"))
    );
  }
}
</script>

<template>
  <div class="app-wrapper">

    <NavbarComponent />


    <main class="content">
      <router-view />
    </main>

    <!-- GLOBAL FOOTER -->
    <footer class="git-footer text-center py-2">

      <span class="prompt">404@blog:~$</span>
      <span class="cmd">exit</span>

      <span class="output">
        © 2026 <span class="brand">BlogAPP</span> | All rights reserved.
      </span>

    </footer>

  </div>
</template>

<style>
.git-footer {
  background: #0d1117;
  border-top: 1px solid #30363d;
  font-family: "Consolas", "Courier New", monospace;
  font-size: 0.85rem;
  color: #8b949e;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  flex-wrap: wrap;
}

/* terminal prompt */
.prompt {
  color: #3fb950;
}

/* command text */
.cmd {
  color: #c9d1d9;
}

/* output text */
.output {
  color: #8b949e;
}

/* brand highlight */
.brand {
  color: #f2cc60;
  font-weight: 600;
}

/* hover effect like terminal glow */
.git-footer:hover {
  border-top: 1px solid #58a6ff;
}
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0d1117;
}
</style>