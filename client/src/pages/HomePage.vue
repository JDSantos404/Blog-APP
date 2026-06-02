<script setup>
import '../style.css'
</script>

<template>
  <div class="home-wrapper">

    <div class="terminal-card">

      <!-- HEADER (terminal prompt style) -->
      <div class="terminal-header">
        <span class="prompt">404@blog:~$</span>
        <span class="cmd">run homepage</span>
      </div>

      <!-- TITLE -->
      <h1 class="title">
        <img src="/sign.png" alt="Blog" class="logo" />
        BlogApp
      </h1>

      <!-- DESCRIPTION -->
      <p class="subtitle">
        Discover ideas. Share stories. Connect with creators.
      </p>

      <!-- FEATURES (terminal list style) -->
      <div class="features">

        <div class="feature">
          <span class="bullet">$</span>
          <i class="bi bi-pencil-square"></i>
          <span>write & share posts</span>
        </div>

        <div class="feature">
          <span class="bullet">$</span>
          <i class="bi bi-chat-left-heart"></i>
          <span>comment & engage</span>
        </div>

        <div class="feature">
          <span class="bullet">$</span>
          <i class="bi bi-heart"></i>
          <span>like & discover content</span>
        </div>

      </div>

      <!-- CTA (terminal command style) -->
      <router-link to="/posts" class="cta">
        ./explore-posts
      </router-link>

    </div>

  </div>
</template>

<style scoped>

/* BACKGROUND */
.home-wrapper {
  min-height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d1117;
  font-family: "Consolas", "Courier New", monospace;
}

/* MAIN CARD (terminal window) */
.terminal-card {
  width: 100%;
  max-width: 520px;
  padding: 24px;
  border: 1px solid #30363d;
  background: #161b22;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

/* HEADER */
.terminal-header {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  font-size: 0.85rem;
}

.prompt {
  color: #3fb950;
}

.cmd {
  color: #8b949e;
}

/* TITLE */
.title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  color: #c9d1d9;
  margin-bottom: 10px;
}

.logo {
  width: 28px;
  height: 28px;
}

/* SUBTITLE */
.subtitle {
  color: #8b949e;
  font-size: 0.95rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

/* FEATURES */
.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
}

/* feature line like terminal output */
.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.bullet {
  color: #3fb950;
}

/* icons */
.feature i {
  color: #58a6ff;
}

/* CTA like command */
.cta {
  display: inline-block;
  color: #3fb950;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding-top: 8px;
  border-top: 1px dashed #30363d;
  transition: 0.15s ease;
}

.cta:hover {
  color: #58a6ff;
  transform: translateX(4px);
}

/* MOBILE */
@media (max-width: 600px) {
  .terminal-card {
    margin: 16px;
  }
}
</style>