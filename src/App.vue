<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { FolderGit2, Settings } from '@lucide/vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- ナビゲーションバー（ヘッダー） -->
    <header class="bg-zinc-700 text-white">
      <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl">
          <FolderGit2 :size="28" />
          {{ $t('app.title') }}
        </RouterLink>
        <nav class="flex gap-4">
          <RouterLink to="/settings" class="flex items-center gap-1" :title="$t('app.settingsDesc')">
            <Settings :size="20" />
            <span class="hidden sm:inline">{{ $t('app.settings') }}</span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- メインコンテンツ領域 -->
    <main class="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
      <RouterView />
    </main>

    <!-- フッター -->
    <footer class="bg-slate-700 py-6 text-center text-white text-sm">
      <p>{{ $t('app.title') }}</p>
    </footer>
  </div>
</template>
