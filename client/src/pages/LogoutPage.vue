<script setup>
import { onBeforeMount } from 'vue';
import { useGlobalStore } from '../stores/global.js';
import { useRouter } from 'vue-router';

const store = useGlobalStore();
const router = useRouter();

onBeforeMount(() => {
  localStorage.clear();

  // update store (safe way)
  store.getUserDetails(null);

  router.push({ path: '/login' });
});
</script>

<template>
  <div class="text-center mt-5">
    <h4>Logging out...</h4>
  </div>
</template>