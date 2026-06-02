<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';

const router = useRouter();
const notyf = new Notyf();

const title = ref('');
const content = ref('');
const loading = ref(false);

async function createPost() {
  if (!title.value.trim()) {
    return notyf.error('Title is required');
  }

  if (title.value.trim().length < 3) {
    return notyf.error('Title must be at least 3 characters');
  }

  if (!content.value.trim()) {
    return notyf.error('Content is required');
  }

  if (content.value.trim().length < 10) {
    return notyf.error('Content must be at least 10 characters');
  }

  loading.value = true;

  try {
    await api.post('/posts/addPost', {
      title: title.value,
      content: content.value
    });

    notyf.success('Post created successfully!');
    router.push('/posts');
  } catch (err) {
    notyf.error(
      err?.response?.data?.error || 'Failed to create post'
    );
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="create-page container py-5">

    <!-- TERMINAL HEADER -->
    <div class="terminal-header mb-4">
      <span class="prompt">blog@repo:~$</span>
      <span class="cmd">git commit -m "new post"</span>
    </div>

    <div class="form-wrapper">

      <!-- TITLE -->
      <div class="form-group">
        <label class="form-label">commit title</label>
        <input
          v-model="title"
          type="text"
          class="form-control"
          placeholder="Enter post title..."
          maxlength="200"
        />
        <small>{{ title.length }}/200</small>
      </div>

      <!-- CONTENT -->
      <div class="form-group">
        <label class="form-label">commit body</label>
        <textarea
          v-model="content"
          class="form-control"
          rows="10"
          placeholder="Write your post..."
          maxlength="5000"
        ></textarea>
        <small>{{ content.length }}/5000</small>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button
          class="btn btn-commit"
          @click="createPost"
          :disabled="loading"
        >
          {{ loading ? 'committing...' : 'git commit' }}
        </button>

        <button
          class="btn btn-cancel"
          @click="router.push('/posts')"
        >
          discard
        </button>
      </div>

    </div>

  </div>
</template>

<style scoped>
.create-page {
  max-width: 900px;
  font-family: Consolas, monospace;
  color: #c9d1d9;
}

/* TERMINAL HEADER */
.terminal-header {
  background: #161b22;
  border: 1px solid #30363d;
  padding: 12px 16px;
  border-radius: 10px;

  display: flex;
  gap: 10px;
}

.prompt {
  color: #3fb950;
}

.cmd {
  color: #c9d1d9;
}

/* FORM CONTAINER */
.form-wrapper {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 12px;

  padding: 24px;
}

/* INPUT GROUPS */
.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  margin-bottom: 8px;

  color: #8b949e;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: lowercase;
}

/* INPUTS */
.form-control {
  width: 100%;
  background: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;

  border-radius: 8px;
  padding: 10px 12px;

  transition: 0.2s;
}

.form-control:focus {
  border-color: #58a6ff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(88,166,255,0.15);
}

/* TEXTAREA */
textarea.form-control {
  resize: vertical;
  line-height: 1.6;
}

/* COUNTER */
small {
  color: #6e7681;
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* BUTTONS */
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.2s;
  font-family: Consolas, monospace;
}

/* COMMIT BUTTON */
.btn-commit {
  background: #238636;
  color: white;
  border-color: #238636;
}

.btn-commit:hover:not(:disabled) {
  background: #2ea043;
  transform: translateY(-2px);
}

/* CANCEL BUTTON */
.btn-cancel {
  background: transparent;
  color: #c9d1d9;
  border: 1px solid #30363d;
}

.btn-cancel:hover {
  background: #161b22;
  border-color: #58a6ff;
}

/* MOBILE */
@media (max-width: 768px) {
  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>