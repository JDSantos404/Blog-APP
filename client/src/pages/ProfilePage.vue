<template>
  <div id="profile-page" class="container my-5">

    <!-- HEADER -->
    <div class="terminal-header mb-4">
      <span class="prompt">user@blog:~$</span>
      <span class="cmd">profile --view</span>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border"></div>
      <div class="text-muted mt-2">loading profile...</div>
    </div>

    <!-- MAIN LAYOUT -->
    <div v-else-if="user" class="layout">

      <!-- LEFT: PROFILE CARD -->
      <div class="left">
        <div class="card profile-card p-4">

          <h5 class="name">
            <i class="bi bi-person"></i>
            {{ user.firstName }} {{ user.lastName }}

            <span class="badge" :class="user.isAdmin ? 'admin' : 'user'">
              {{ user.isAdmin ? 'ADMIN' : 'USER' }}
            </span>
          </h5>

          <hr class="divider" />

          <div class="info">
            <div><span>firstName:</span> {{ user.firstName }}</div>
            <div><span>lastName:</span> {{ user.lastName }}</div>
            <div><span>email:</span> {{ user.email }}</div>
            <div>
              <span>type:</span>
              {{ user.isAdmin ? 'Administrator' : 'User' }}
            </div>
          </div>

          <!-- UPDATE PASSWORD BUTTON -->
          <button class="btn btn-sm btn-outline-warning mt-3" @click="openPasswordModal">
            Update Password
          </button>

        </div>
      </div>

      <!-- RIGHT: POSTS -->
      <div class="right">

        <div class="section-header mb-3">
          <h3>My Posts</h3>
        </div>

        <div v-if="postsLoading" class="text-center py-3">
          <div class="spinner-border spinner-border-sm"></div>
          <div class="text-muted mt-2">loading posts...</div>
        </div>

        <div v-else-if="posts.length === 0" class="empty">
          You haven’t created any posts yet.
        </div>

        <div v-else class="posts">

          <div
            v-for="post in posts"
            :key="post._id"
            class="post"
            @click="openPost(post)"
          >
            <h5>{{ post.title }}</h5>

            <p class="text-light">
              {{ post.content?.slice(0, 120) }}...
            </p>

            <div class="meta">
              <i class="bi bi-heart"></i> {{ post.likes?.length || 0 }}
              <i class="bi bi-chat"></i> {{ post.comments?.length || 0 }}
              <i class="bi bi-calendar"></i>
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </div>

          </div>

        </div>

      </div>
    </div>

    <!-- VIEW POST MODAL -->
    <div
        v-if="showPostModal"
        class="modal-backdrop"
        @click.self="closePostModal"
    >
        <div class="modal-box">

            <button
                class="btn-close float-end"
                @click="closePostModal"
            ></button>

            <div v-if="selectedPost" class="post-modal-content">
                <h3 class="mb-2">{{ selectedPost.title }}</h3>
                
                <div class="post-meta mb-3">
                    <small class="text-muted">
                        By <strong>{{ selectedPost.userId?.firstName }} {{ selectedPost.userId?.lastName }}</strong>
                    </small>
                    <span class="text-muted"> | </span>
                    <small class="text-muted">
                        {{ new Date(selectedPost.createdAt).toLocaleDateString() }}
                    </small>
                </div>



                <p class="post-content mb-3">
                    {{ selectedPost.content }}
                </p>

                <div class="post-actions mb-3">
                    <button
                        class="btn btn-sm"
                        :class="isPostLiked ? 'btn-danger' : 'btn-outline-danger'"
                        @click="toggleLike(selectedPost)"
                        :disabled="!userEmail"
                        :title="!userEmail ? 'Log in to like posts' : ''"
                    >
                        <i class="bi bi-heart-fill"></i>
                        {{ selectedPost.likes?.length || 0 }}
                    </button>

                    <button
                        v-if="isPostOwner(selectedPost)"
                        class="btn btn-sm btn-outline-warning"
                        @click="editPost(selectedPost)"
                    >
                        <i class="bi bi-pencil"></i> Edit
                    </button>

                    <button
                        v-if="isAdmin() || isPostOwner(selectedPost)"
                        class="btn btn-sm btn-outline-danger"
                        @click="deletePost(selectedPost._id)"
                    >
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>

                <h5>Comments ({{ selectedPost.comments?.length || 0 }})</h5>

                <div v-if="selectedPost.comments?.length" class="comments-section mb-3">
                    <div
                        v-for="(comment, index) in selectedPost.comments"
                        :key="comment._id || index"
                        class="comment-item border rounded p-3 mb-2"
                    >
                        <div class="d-flex justify-content-between align-items-start">

                            <div class="w-100">

                                <strong>
                                    {{ comment.userId?.firstName }} {{ comment.userId?.lastName }}
                                </strong>

                                <!-- EDIT MODE -->
                                <div v-if="editingCommentId === comment._id" class="mt-2">

                                    <textarea
                                        v-model="editingCommentText"
                                        class="form-control form-control-sm"
                                        rows="2"
                                    ></textarea>

                                    <div class="mt-2 d-flex gap-2">
                                        <button
                                            class="btn btn-sm btn-success"
                                            @click="updateComment(comment)"
                                        >
                                            Save
                                        </button>

                                        <button
                                            class="btn btn-sm btn-secondary"
                                            @click="cancelEditComment"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                <!-- VIEW MODE -->
                                <small v-else class="text-muted d-block mt-1">
                                    {{ comment.comment }}
                                </small>

                                <!-- ACTIONS -->
                                <div class="mt-2 d-flex gap-2 align-items-center flex-wrap">

                                    <!-- LIKE COMMENT -->
                                    <button
                                        class="btn btn-sm"
                                        :class="isCommentLiked(comment) ? 'btn-danger' : 'btn-outline-danger'"
                                        @click="toggleCommentLike(comment)"
                                        :disabled="!userEmail"
                                    >
                                        ❤️ {{ comment.likes?.length || 0 }}
                                    </button>

                                    <!-- EDIT (AUTHOR ONLY) -->
                                    <button
                                        v-if="isCommentOwner(comment)"
                                        class="btn btn-sm btn-outline-warning"
                                        @click="startEditComment(comment)"
                                    >
                                        <i class="bi bi-pencil"></i>
                                    </button>

                                    <!-- DELETE (AUTHOR + ADMIN) -->
                                    <button
                                        v-if="isCommentOwner(comment) || isAdmin()"
                                        class="btn btn-sm btn-outline-danger"
                                        @click="deleteComment(comment._id)"
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>

                                </div>

                            </div>

                            <small class="text-muted">
                                {{ new Date(comment.createdAt).toLocaleDateString() }}
                            </small>

                        </div>
                    </div>
                </div>

                <div v-else class="text-muted mb-3">
                    No comments yet.
                </div>

                <div v-if="userEmail" class="mt-4">
                    <label for="commentTextarea" class="form-label">Add a Comment</label>
                    <textarea
                        id="commentTextarea"
                        v-model="commentText"
                        class="form-control mb-2"
                        placeholder="Write a comment..."
                        rows="3"
                    ></textarea>

                    <button
                        class="btn btn-success btn-sm"
                        @click="addComment"
                        :disabled="commentLoading || !commentText.trim()"
                    >
                        <i class="bi bi-chat-left-text"></i>
                        {{ commentLoading ? 'Posting...' : 'Add Comment' }}
                    </button>
                </div>
                
                <div v-else class="alert alert-info mt-4">
                    <RouterLink to="/login">Log in</RouterLink> to comment on this post
                </div>
            </div>

        </div>
    </div>

    <!-- CREATE POST MODAL -->
    <div
        v-if="showCreateModal"
        class="modal-backdrop"
        @click.self="closeCreateModal"
    >
        <div class="modal-box">

            <button
                class="btn-close float-end"
                @click="closeCreateModal"
            ></button>

            <h4 class="mb-4 modal-title">{{ editingPostId ? 'Edit Post' : 'Create New Post' }}</h4>

            <div class="form-group">
              <label for="modalPostTitle" class="form-label">Post Title</label>
              <input
                id="modalPostTitle"
                v-model="newTitle"
                class="form-control"
                placeholder="Enter post title"
                type="text"
              />
            </div>

            <div class="form-group">
              <label for="modalPostContent" class="form-label">Post Content</label>
              <textarea
                id="modalPostContent"
                v-model="newContent"
                class="form-control"
                placeholder="Enter post content"
                rows="6"
              ></textarea>
            </div>

            <div class="d-flex gap-2">
                <button
                    class="btn btn-primary"
                    @click="editingPostId ? updatePost() : createPost()"
                    :disabled="createLoading"
                >
                    {{ createLoading ? 'Saving...' : (editingPostId ? 'Update Post' : 'Create Post') }}
                </button>
                <button
                    class="btn btn-secondary"
                    @click="closeCreateModal"
                >
                    Cancel
                </button>
            </div>

        </div>
    </div>

    <!-- ================= UPDATE PASSWORD MODAL ================= -->
    <div v-if="showPasswordModal" class="modal-backdrop" @click.self="closePasswordModal">
      <div class="modal-box">

        <h4>Update Password</h4>

        <input
          v-model="oldPassword"
          type="password"
          class="form-control mb-2"
          placeholder="Current Password"
        />

        <input
          v-model="newPassword"
          type="password"
          class="form-control mb-2"
          placeholder="New Password"
        />

        <button class="btn btn-warning me-2" @click="updatePassword">
          Update
        </button>

        <button class="btn btn-secondary" @click="closePasswordModal">
          Cancel
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api.js'
import { Notyf } from 'notyf'

const notyf = new Notyf()

const userEmail = computed(() => user.value?.email)

const isAdmin = () => {
  return user.value?.isAdmin === true
}

const isPostOwner = (post) => {
  if (!post || !user.value?._id) return false

  // supports both populated and non-populated userId
  return (
    post.userId === user.value._id ||
    post.userId?._id === user.value._id
  )
}

const isPostLiked = computed(() => {
  if (!selectedPost.value || !user.value?._id) return false

  return selectedPost.value.likes?.some(like =>
    like === user.value._id || like?._id === user.value._id
  )
})

/* DATA */
const user = ref(null)
const posts = ref([])

const loading = ref(false)
const postsLoading = ref(false)

const showPostModal = ref(false);
const selectedPost = ref(null);

const showCreateModal = ref(false);
const editingPostId = ref(null);

const newTitle = ref('');
const newContent = ref('');

const commentText = ref('');
const commentLoading = ref(false);
const createLoading = ref(false);

// Comment editing state
const editingCommentId = ref(null);
const editingCommentText = ref('');

// COMMENT HELPERS
const isCommentOwner = (comment) => {
    return user.value?._id === comment.userId?._id;
};

const isCommentLiked = (comment) => {
    return comment.likes?.some(
        id => id === user.value?._id || id?._id === user.value?._id
    );
};

// LIKE COMMENT
const toggleCommentLike = async (comment) => {
    try {
        const isLiked = comment.likes?.some(
            id => id === user.value?._id || id?._id === user.value?._id
        );

        const endpoint = isLiked ? 'unlikeComment' : 'likeComment';

        const res = await api.post(
            `/posts/${endpoint}/${selectedPost.value._id}/${comment._id}`
        );

        selectedPost.value = res.data.post;

        const index = posts.value.findIndex(
            p => p._id === selectedPost.value._id
        );

        if (index !== -1) {
            posts.value[index] = res.data.post;
        }

    } catch (err) {
        notyf.error('Failed to update comment like');
    }
};

// EDIT COMMENT
const startEditComment = (comment) => {
    editingCommentId.value = comment._id;
    editingCommentText.value = comment.comment;
};

const cancelEditComment = () => {
    editingCommentId.value = null;
    editingCommentText.value = '';
};

const updateComment = async (comment) => {
    try {
        const res = await api.patch(
            `/posts/updateComment/${selectedPost.value._id}/${comment._id}`,
            {
                comment: editingCommentText.value
            }
        );

        selectedPost.value = res.data.post;

        const index = posts.value.findIndex(
            p => p._id === selectedPost.value._id
        );

        if (index !== -1) {
            posts.value[index] = res.data.post;
        }

        cancelEditComment();
        notyf.success('Comment updated');

    } catch (err) {
        notyf.error('Failed to update comment');
    }
};

// DELETE COMMENT
const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
        const res = await api.delete(
            `/posts/deleteComment/${selectedPost.value._id}/${commentId}`
        );

        selectedPost.value = res.data.post;

        const index = posts.value.findIndex(
            p => p._id === selectedPost.value._id
        );

        if (index !== -1) {
            posts.value[index] = res.data.post;
        }

        notyf.success('Comment deleted');

    } catch (err) {
        notyf.error('Failed to delete comment');
    }
};

/* PASSWORD */
const showPasswordModal = ref(false)
const oldPassword = ref('')
const newPassword = ref('')


/* FETCH PROFILE */
const fetchProfile = async () => {
  loading.value = true
  try {
    const res = await api.get('/users/details')
    user.value = res.data
  } finally {
    loading.value = false
  }
}

const addComment = async () => {
    if (!commentText.value.trim()) return;

    commentLoading.value = true;

    try {
        const res = await api.post(
            `/posts/addComment/${selectedPost.value._id}`,
            {
                comment: commentText.value
            }
        );

        selectedPost.value.comments = res.data.post.comments || [];

        // Update in posts list
        const index = posts.value.findIndex(p => p._id === selectedPost.value._id);
        if (index !== -1) {
            posts.value[index] = res.data.post;
        }

        commentText.value = '';
        notyf.success('Comment added');
    } catch (err) {
        notyf.error(
            err?.response?.data?.error || 'Failed to add comment'
        );
    } finally {
        commentLoading.value = false;
    }
};

/* FETCH POSTS */
const fetchMyPosts = async () => {
  postsLoading.value = true
  try {
    const res = await api.get('/posts/my-posts')
    posts.value = res.data
  } finally {
    postsLoading.value = false
  }
}

const openPost = (post) => {
    selectedPost.value = post;
    commentText.value = '';
    showPostModal.value = true;
};

const closePostModal = () => {
    showPostModal.value = false;
    selectedPost.value = null;
};

const openCreateModal = () => {
    editingPostId.value = null;
    newTitle.value = '';
    newContent.value = '';
    showCreateModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    editingPostId.value = null;
};

const editPost = (post) => {
    editingPostId.value = post._id;
    newTitle.value = post.title;
    newContent.value = post.content;
    showCreateModal.value = true;
};

/* DELETE */
const deletePost = async (id) => {
  await api.delete(`/posts/deletePost/${id}`)
  notyf.success('Post deleted')
  await fetchMyPosts()
  showPostModal.value = false
}

/* PASSWORD UPDATE */
const openPasswordModal = () => {
  oldPassword.value = ''
  newPassword.value = ''
  showPasswordModal.value = true
}

const closePasswordModal = () => {
  showPasswordModal.value = false
}

const updatePassword = async () => {
  if (!oldPassword.value || !newPassword.value) {
    notyf.error('Please fill all fields')
    return
  }

  try {
    await api.patch('/users/update-password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })

    notyf.success('Password updated successfully')
    showPasswordModal.value = false

  } catch (err) {
    notyf.error('Failed to update password')
  }
}

/* INIT */
onMounted(async () => {
  await fetchProfile()
  await fetchMyPosts()
})
</script>

<style scoped>
/* GLOBAL TERMINAL LOOK */
#profile-page {
  font-family: 'Source Code Pro', monospace;
  color: #c9d1d9;
  min-height: 79vh;
}

.terminal-header {
  background: #0d1117;
  border: 1px solid #30363d;
  padding: 12px;
  border-radius: 6px;
  max-width: 900px;
  margin: auto;
}

.prompt { color: #3fb950; }
.cmd { color: #58a6ff; }

.layout {
  display: flex;
  gap: 18px;
  max-width: 900px;
  margin: auto;
}

.left { flex: 1; }
.right { flex: 2; }

.profile-card {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 16px;
  font-size: 13px;
}

.name {
  color: #58a6ff;
  font-size: 16px;
}

.badge {
  font-size: 8px;
  padding: 2px 3px;
  border-radius: 3px;
  margin-left: 1px;
  margin-top: -10px!important;
}

.admin { background: #da3633; color: #fff; }
.user { background: #238636; color: #fff; }

.info div {
  padding: 3px 0;
  color: #8b949e;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post {
  background: #0d1117;
  border: 1px solid #30363d;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.post:hover {
  border-color: #3fb950;
}

.meta {
  font-size: 11px;
  color: #8b949e;
  display: flex;
  gap: 10px;
}

/* MODAL */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
    overflow-y: auto;
    padding: 20px;
}

.modal-box {
    background: white;
    width: 520px;
    max-width: 100%;
    padding: 24px;
    border-radius: 12px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
}

/* FORM GROUP */
#posts-page {
    max-width: 1200px;
}

/*  
   MODAL BACKDROP
  */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(1, 4, 9, 0.82);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
}

/*  
   MODAL
  */
.modal-box {
    width: 760px;
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;

    background: #0d1117;
    color: #c9d1d9;

    border: 1px solid #30363d;
    border-radius: 12px;

    box-shadow:
        0 0 0 1px rgba(255,255,255,0.03),
        0 25px 60px rgba(0,0,0,.55);

    padding: 24px;
}

/*  
   HEADER
  */
.modal-title {
    color: #58a6ff;
    font-weight: 700;
    margin: 0;
}

.modal-box::before {
    content: "git commit";
    display: block;

    background: #161b22;
    border-bottom: 1px solid #30363d;

    padding: 14px 20px;

    color: #3fb950;
    font-family: Consolas, monospace;
    font-size: .9rem;
}

/*  
   CONTENT
  */
.post-modal-content,
.modal-box > h4,
.modal-box > .form-group,
.modal-box > .d-flex {
    padding-left: 24px;
    padding-right: 24px;
}

.post-modal-content {
    padding-top: 24px;
    padding-bottom: 24px;
}

/*  
   CLOSE BUTTON
  */
.btn-close {
    margin: 14px;
    filter: invert(1);
    opacity: .7;
}

.btn-close:hover {
    opacity: 1;
}

/*  
   POST TITLE
  */
.post-modal-content h3 {
    color: #58a6ff;
    font-weight: 700;
    border-left: 4px solid #3fb950;
    padding-left: 12px;
}

/*  
   META
  */
.post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    padding-bottom: 12px;
    margin-bottom: 18px;

    border-bottom: 1px solid #30363d;
}

.post-meta small {
    color: #8b949e !important;
}

/*  
   ACTION BUTTONS
  */
.post-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    padding-bottom: 18px;
    margin-bottom: 18px;

    border-bottom: 1px solid #30363d;
}

/*  
   POST CONTENT
  */
.post-content {
    white-space: pre-wrap;
    line-height: 1.8;
    color: #c9d1d9;

    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;

    padding: 18px;
}

/*  
   COMMENTS
  */
.comments-section {
    max-height: 320px;
    overflow-y: auto;
}

.comment-item {
    background: #161b22;
    border: 1px solid #30363d !important;
    border-radius: 8px;

    transition: all .2s ease;
}

.comment-item:hover {
    border-color: #58a6ff !important;
    transform: translateX(4px);
}

.comment-item strong {
    color: #58a6ff;
}

.comment-item small {
    color: #8b949e !important;
}

/*  
   INPUTS
  */
.form-label {
    color: #8b949e;
    font-size: .9rem;
    font-weight: 600;
}

.form-control {
    background: #161b22;
    border: 1px solid #30363d;
    color: #c9d1d9;
    border-radius: 8px;
}

.form-control::placeholder {
    color: #6e7681;
}

.form-control:focus {
    background: #161b22;
    color: #fff;

    border-color: #58a6ff;

    box-shadow:
        0 0 0 3px rgba(88,166,255,.15);

    outline: none;
}

/*  
   CREATE POST FORM
  */
.modal-box .form-group {
    margin-bottom: 20px;
}

.modal-box .d-flex.gap-2 {
    padding-bottom: 24px;
}

/*  
   SCROLLBAR
  */
.modal-box::-webkit-scrollbar,
.comments-section::-webkit-scrollbar {
    width: 8px;
}

.modal-box::-webkit-scrollbar-thumb,
.comments-section::-webkit-scrollbar-thumb {
    background: #30363d;
    border-radius: 10px;
}

/*  
   BUTTONS
  */
.btn-primary {
    background: #238636;
    border-color: #238636;
}

.btn-primary:hover {
    background: #2ea043;
    border-color: #2ea043;
}

.btn-success {
    background: #238636;
    border-color: #238636;
}

.btn-outline-warning {
    color: #d29922;
    border-color: #d29922;
}

.btn-outline-danger {
    color: #f85149;
    border-color: #f85149;
}

/*  
   MOBILE
  */
@media (max-width: 768px) {

    .modal-box {
        width: 100%;
        max-height: 95vh;
    }

    .post-actions {
        flex-direction: column;
    }

    .post-actions .btn {
        width: 100%;
    }
}

.btn-close {
    margin: 14px;
    filter: invert(1);
    opacity: .7;
}

.btn-close:hover {
    opacity: 1;
}
</style>