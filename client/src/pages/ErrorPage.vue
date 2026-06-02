<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="error-page">

    <!-- TERMINAL HEADER -->
    <div class="terminal-header mb-4">
      <span class="prompt">404@blog:~$</span>
      <span class="cmd">error --not-found</span>
    </div>

    <!-- MAIN ERROR CARD -->
    <div class="error-card">

      <div class="error-code">
        404
      </div>

      <div class="error-title">
        Page Not Found
      </div>

      <div class="error-text">
        The page you’re looking for does not exist or may have been moved.
      </div>

      <div class="error-actions mt-4 d-flex gap-2 justify-content-center flex-wrap">

        <button class="btn btn-primary btn-sm" @click="goHome">
          <i class="bi bi-house"></i> Go Home
        </button>

        <button class="btn btn-outline-light btn-sm" @click="goBack">
          <i class="bi bi-arrow-left"></i> Go Back
        </button>

      </div>

      <div class="hint mt-4">
        tip: check the URL or return to your repository
      </div>

    </div>

  </div>
</template>

<style scoped>
.error-page {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #0d1117;
  color: #c9d1d9;
  font-family: Consolas, monospace;
  padding: 20px;
}

/* TERMINAL HEADER */
.terminal-header {
  width: 100%;
  max-width: 600px;
  background: #161b22;
  padding: 10px 14px;
  border: 1px solid #30363d;
  border-radius: 10px;
  display: flex;
  gap: 10px;
}

.prompt { color: #3fb950; }
.cmd { color: #c9d1d9; }

/* CARD */
.error-card {
  width: 100%;
  max-width: 600px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 14px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

/* 404 BIG TEXT */
.error-code {
  font-size: 5rem;
  font-weight: 800;
  color: #f85149;
  letter-spacing: 2px;
}

/* TITLE */
.error-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 10px;
  color: #58a6ff;
}

/* TEXT */
.error-text {
  margin-top: 10px;
  color: #8b949e;
  font-size: 0.95rem;
}

/* HINT */
.hint {
  font-size: 0.8rem;
  color: #6e7681;
}

/* BUTTONS */
.btn-primary {
  background: #3fb950;
  border: none;
}

.btn-primary:hover {
  background: #2ea043;
}

.btn-outline-light {
  border: 1px solid #30363d;
  color: #c9d1d9;
}

.btn-outline-light:hover {
  background: #21262d;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .error-code {
    font-size: 3.5rem;
  }

  .error-card {
    padding: 30px 16px;
  }
}
</style>