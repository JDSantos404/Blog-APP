<template>
  <div class="post-list">

    <div v-if="loading" class="terminal-line loading">
      <span class="prompt">$</span>
      <span class="cmd">fetching posts<span class="dots"></span></span>
    </div>

    <div v-else>
      <div
        v-for="post in posts"
        :key="post._id"
        class="post-line"
        @click="$emit('view-post', post)"
      >
        <span class="hash">commit</span>

        <span class="title">
          {{ post.title }}
        </span>

        <span class="meta">
          | {{ post.comments?.length || 0 }}c
          | {{ post.likes?.length || 0 }}l
        </span>
      </div>
    </div>

    <div v-if="!loading && posts.length === 0" class="terminal-line muted">
      <span class="prompt">$</span>
      <span class="cmd">no posts found</span>
    </div>

  </div>
</template>

<script setup>
defineProps({
  posts: Array,
  loading: Boolean
})

defineEmits(['view-post'])
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: "Consolas", "Courier New", monospace;
}

/* POST ROW */
.post-line {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px 16px;

  background: #161b22;
  border: 1px solid #30363d;
  border-left: 3px solid transparent;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s ease;
}

/* HOVER */
.post-line:hover {
  border-left-color: #3fb950;
  background: #1c2128;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* COMMIT LABEL */
.hash {
  color: #f85149;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: lowercase;
  min-width: 60px;
}

/* POST TITLE */
.title {
  color: #58a6ff;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* COMMENTS / LIKES */
.meta {
  color: #8b949e;
  font-size: 0.82rem;
  white-space: nowrap;
}

/* LOADING + EMPTY */
.terminal-line {
  display: flex;
  align-items: center;
  gap: 10px;

  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;

  padding: 12px 16px;
}

/* PROMPT */
.prompt {
  color: #3fb950;
  font-weight: bold;
}

/* COMMAND */
.cmd {
  color: #c9d1d9;
}

/* EMPTY STATE */
.muted {
  color: #8b949e;
}

/* ANIMATED DOTS */
.dots::after {
  content: '';
  animation: dots 1.2s infinite;
}

@keyframes dots {
  0% { content: ''; }
  33% { content: '.'; }
  66% { content: '..'; }
  100% { content: '...'; }
}

/* MOBILE */
@media (max-width: 768px) {
  .post-line {
    flex-wrap: wrap;
    gap: 6px;
  }

  .hash {
    min-width: auto;
  }

  .title {
    width: 100%;
    white-space: normal;
  }

  .meta {
    margin-left: 0;
  }
}
</style>