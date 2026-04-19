<script setup>
import { ref } from 'vue'
import { store } from '../data/store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Plus, Trash2, Folder, Globe, Check, FileText, Save, Edit3, PlusCircle, Link, CheckSquare, Database, UploadCloud, DownloadCloud } from '@lucide/vue'

const router = useRouter()
const { t, locale } = useI18n()

// This references the store's static or we can just pull it dynamically. Wait, keeping it ref allows dynamic edit.
const newProject = ref({
  name: '',
  localPath: '',
  remoteUrl: '',
  commitTemplate: t('settings.defaultCommitTemplate')
})

const isAdding = ref(false)
const editingId = ref(null)

const basicStages = [
  { id: 'init', icon: PlusCircle },
  { id: 'remote', icon: Link },
  { id: 'add', icon: CheckSquare },
  { id: 'commit', icon: Database },
  { id: 'push', icon: UploadCloud }
]

// 言語の切り替えを反映する
const changeLanguage = () => {
  locale.value = store.settings.locale
}

const saveProject = () => {
  if (!newProject.value.name || !newProject.value.localPath) {
    alert(t('settings.alertRequired'))
    return
  }
  
  const project = {
    id: Date.now().toString(),
    name: newProject.value.name,
    localPath: newProject.value.localPath,
    remoteUrl: newProject.value.remoteUrl,
    commitTemplate: newProject.value.commitTemplate || ""
  }
  
  store.projects.push(project)
  if (store.projects.length === 1) {
    store.settings.activeProjectId = project.id
  }
  
  newProject.value = { name: '', localPath: '', remoteUrl: '', commitTemplate: t('settings.defaultCommitTemplate') }
  isAdding.value = false
  if (confirm(t('settings.promptExportTitle'))) {
    exportFullData()
  }
}

const deleteProject = (id) => {
  if (confirm(t('settings.confirmDelete'))) {
    store.projects = store.projects.filter(p => p.id !== id)
    if (store.settings.activeProjectId === id) {
      store.settings.activeProjectId = store.projects.length > 0 ? store.projects[0].id : null
    }
  }
}

const selectProject = (id) => {
  store.settings.activeProjectId = id
}

const startEdit = (id) => {
  editingId.value = id
}

const saveEdit = () => {
  editingId.value = null
  if (confirm(t('settings.promptExportTitle'))) {
    exportFullData()
  }
}

const cancelEdit = () => {
  editingId.value = null
}

// =======================
// JSON Data I/O
// =======================
const handleJsonAction = (e) => {
  const action = e.target.value
  e.target.value = "" // reset select
  if (action === 'export') {
    exportFullData()
  } else if (action === 'import') {
    triggerImport()
  } else if (action === 'about') {
    alert(t('settings.jsonAboutDesc'))
  }
}

const exportFullData = () => {
  const dataStr = JSON.stringify({
    settings: store.settings,
    projects: store.projects
  }, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `git-simple-craft-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!confirm(t('settings.importWarning'))) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result)
        if (json && json.settings && Array.isArray(json.projects)) {
          Object.assign(store.settings, json.settings) // update reactively
          store.projects.splice(0, store.projects.length, ...json.projects) // replace array reactively
          alert(t('settings.saved'))
        } else {
          alert('Invalid JSON format.')
        }
      } catch (err) {
        alert('Failed to parse JSON.')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- 設定画面上部のナビゲーション -->
    <div class="border-b py-2 sm:py-0 sm:border-none overflow-x-auto">
      <div class="flex flex-nowrap gap-2 items-center border border-slate-300 p-2 rounded-xl text-xs sm:text-sm font-medium min-w-max w-full">
        <RouterLink to="/" class="flex-shrink-0 flex items-center justify-center gap-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-700">
          <span>🏠</span>
          <span class="hidden sm:inline">{{ $t('app.home') }}</span>
        </RouterLink>
        <span class="text-slate-300 flex-shrink-0">|</span>
        <RouterLink 
          v-for="(stage, idx) in basicStages" :key="stage.id"
          :to="`/?stage=${stage.id}`" 
          class="flex-shrink-0 flex items-center justify-center gap-1 px-3 py-2 text-slate-700 border border-slate-300 rounded-lg"
        >
          <component :is="stage.icon" class="w-4 h-4" />
          <span class="text-center">{{ idx + 1 }} {{ $t(`stages.${stage.id}.title`) }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- ヘッダー：設定と入出力とアプリ言語 -->
    <div class="flex justify-between items-center px-1">
      <h1 class="text-2xl sm:text-3xl font-bold">{{ $t('settings.title') }}</h1>
      <div class="flex items-center gap-2">
        <select 
          @change="handleJsonAction"
          class="px-2 sm:px-3 py-1.5 border border-slate-300 shadow-sm bg-white rounded-lg text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="" disabled selected>{{ $t('settings.jsonMenu') }}</option>
          <option value="import">{{ $t('settings.jsonImport') }}</option>
          <option value="export">{{ $t('settings.jsonExport') }}</option>
          <option value="about">{{ $t('settings.jsonAbout') }}</option>
        </select>

        <select 
          v-model="store.settings.locale" 
          @change="changeLanguage"
          class="px-2 sm:px-3 py-1.5 border border-slate-300 shadow-sm bg-white rounded-lg text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>

    <!-- プロジェクトごとの設定枠 -->
    <div class="p-6 rounded-xl border border-slate-300 bg-white">
      <h2 class="text-lg font-bold mb-2">{{ $t('settings.projectSetup') }}</h2>
      <p class="text-slate-600 mb-6 whitespace-pre-line">{{ $t('settings.desc') }}</p>

      <div v-if="store.projects.length > 0" class="space-y-4 mb-8">
        <h2 class="text-lg font-bold">{{ $t('settings.registeredProjects') }}</h2>
        <div 
          v-for="project in store.projects" 
          :key="project.id"
          class="border-2 rounded-lg p-4"
          :class="store.settings.activeProjectId === project.id ? 'border-slate-800' : 'border-slate-300'"
        >
          <!-- 表示モード -->
          <div v-if="editingId !== project.id" class="flex flex-col gap-4">
            
            <!-- 上部: 操作ボタンとバッジ -->
            <div class="flex justify-between items-start gap-2">
              <div class="flex items-center gap-2">
                <button @click.stop="startEdit(project.id)" class="border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1 text-xs font-bold text-slate-700" :title="$t('settings.edit')">
                  <Edit3 :size="14" /> {{ $t('settings.edit') }}
                </button>
                <button @click.stop="deleteProject(project.id)" class="border border-slate-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 text-xs font-bold" :title="$t('settings.delete')">
                  <Trash2 :size="14" /> {{ $t('settings.delete') }}
                </button>
              </div>
              <div v-if="store.settings.activeProjectId === project.id">
                <span class="border border-slate-800 text-slate-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 bg-white">
                  <Check :size="12" /> {{ $t('settings.active') }}
                </span>
              </div>
            </div>

            <!-- プロジェクト情報（クリックで選択） -->
            <div class="cursor-pointer space-y-3" @click="selectProject(project.id)">
              
              <!-- タイトル -->
              <div>
                <div class="font-bold text-xl break-words leading-tight">{{ project.name }}</div>
              </div>
              
              <!-- パス類 (ラベルと値をdivで縦積みにして100%幅を確保) -->
              <div class="space-y-3 md:space-y-2">
                <div class="text-sm">
                  <div class="flex items-center gap-1 font-bold mb-1 text-slate-700">
                    <Folder :size="16" /> {{ $t('settings.localPath') }}
                  </div>
                  <div class="bg-gray-100 px-3 py-2 rounded-lg break-all border border-slate-200">
                    {{ project.localPath }}
                  </div>
                </div>
                
                <div class="text-sm">
                  <div class="flex items-center gap-1 font-bold mb-1 text-slate-700">
                    <Globe :size="16" /> {{ $t('settings.remoteUrl') }}
                  </div>
                  <div class="bg-gray-100 px-3 py-2 rounded-lg break-all border border-slate-200">
                    {{ project.remoteUrl || $t('settings.notSet') }}
                  </div>
                </div>

                <div class="text-sm mt-3 pt-3 border-t border-slate-200">
                  <div class="flex items-center gap-1 font-bold mb-2 text-slate-700">
                    <FileText :size="16" /> {{ $t('settings.commitTemplate') }}
                  </div>
                  <pre class="bg-gray-100 border border-slate-200 p-3 rounded-lg text-xs whitespace-pre-wrap font-mono break-words">{{ project.commitTemplate }}</pre>
                </div>
              </div>

            </div>
          </div>

          <!-- 編集モード -->
          <div v-else class="space-y-4 p-4 rounded-lg border border-slate-300 bg-gray-50">
            <h3 class="font-bold flex items-center gap-2 mb-3"><Edit3 :size="18"/> {{ $t('settings.editProject') }}</h3>
            
            <div>
              <label class="block text-xs font-bold mb-1">{{ $t('settings.projectName') }}</label>
              <input v-model="project.name" type="text" spellcheck="false" autocomplete="off" class="w-full px-3 py-1.5 border-2 border-slate-300 rounded-lg focus:border-slate-800 focus:outline-none leading-relaxed">
            </div>
            
            <div>
              <label class="block text-xs font-bold mb-1">{{ $t('settings.localDesc') }}</label>
              <input v-model="project.localPath" type="text" spellcheck="false" autocomplete="off" class="w-full px-3 py-1.5 border-2 border-slate-300 rounded-lg font-mono focus:border-slate-800 focus:outline-none leading-relaxed">
            </div>
            
            <div>
              <label class="block text-xs font-bold mb-1">{{ $t('settings.remoteDesc') }}</label>
              <input v-model="project.remoteUrl" type="text" spellcheck="false" autocomplete="off" class="w-full px-3 py-1.5 border-2 border-slate-300 rounded-lg font-mono focus:border-slate-800 focus:outline-none leading-relaxed">
            </div>
            
            <div>
              <label class="block text-xs font-bold mb-1">{{ $t('settings.templateDesc') }}</label>
              <textarea v-model="project.commitTemplate" rows="4" spellcheck="false" autocomplete="off" class="w-full px-3 py-1.5 border-2 border-slate-300 rounded-lg font-mono focus:border-slate-800 focus:outline-none leading-relaxed"></textarea>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="saveEdit" class="flex-1 bg-slate-800 text-white font-bold py-2 px-4 rounded-lg">
                {{ $t('settings.save') }}
              </button>
              <button @click="cancelEdit" class="flex-1 border-2 border-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg">
                {{ $t('settings.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500 mb-6">
        <p class="mb-4">{{ $t('settings.noProjects') }}</p>
        <div v-if="!isAdding" class="flex flex-col sm:flex-row justify-center gap-3">
          <button 
            @click="isAdding = true" 
            class="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold sm:w-auto justify-center"
          >
            <Plus :size="20" /> {{ $t('settings.newProjectBtn') }}
          </button>
          
          <button 
            @click="triggerImport"
            class="flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-300 px-4 py-2 rounded-lg font-bold sm:w-auto justify-center"
          >
            <DownloadCloud :size="20" /> {{ $t('settings.importInitBtn') }}
          </button>
        </div>
      </div>

      <!-- プロジェクトが1件以上ある時の「追加」ボタン -->
      <button 
        v-if="store.projects.length > 0 && !isAdding" 
        @click="isAdding = true" 
        class="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold w-full sm:w-auto justify-center mb-6"
      >
        <Plus :size="20" /> {{ $t('settings.newProjectBtn') }}
      </button>

      <div v-if="isAdding" class="p-6 rounded-lg border-2 border-slate-300 bg-gray-50">
        <h2 class="text-lg font-bold mb-4">{{ $t('settings.newProjectTitle') }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-1">{{ $t('settings.newProject1') }}</label>
            <input 
              v-model="newProject.name" 
              type="text" 
              spellcheck="false" autocomplete="off"
              :placeholder="$t('settings.newProject1Placeholder')"
              class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-800 focus:outline-none leading-relaxed"
            >
          </div>

          <div>
            <label class="block text-sm font-bold mb-1 flex items-center gap-2">
              <Folder :size="16" />
              {{ $t('settings.newProject2') }}
            </label>
            <input 
              v-model="newProject.localPath" 
              type="text" 
              spellcheck="false" autocomplete="off"
              :placeholder="$t('settings.newProject2Placeholder')"
              class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-800 focus:outline-none font-mono text-sm leading-relaxed"
            >
          </div>

          <div>
            <label class="block text-sm font-bold mb-1 flex items-center gap-2">
              <Globe :size="16" />
              {{ $t('settings.newProject3') }} <span class="text-xs font-normal">{{ $t('settings.newProject3Optional') }}</span>
            </label>
            <input 
              v-model="newProject.remoteUrl" 
              type="text" 
              spellcheck="false" autocomplete="off"
              :placeholder="$t('settings.newProject3Placeholder')"
              class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-800 focus:outline-none font-mono text-sm leading-relaxed"
            >
          </div>

          <div>
            <label class="block text-sm font-bold mb-1 flex items-center gap-2">
              <FileText :size="16" />
              {{ $t('settings.newProject4') }}
            </label>
            <textarea 
              v-model="newProject.commitTemplate" 
              rows="4"
              spellcheck="false" autocomplete="off"
              class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-800 focus:outline-none font-mono text-sm leading-relaxed"
            ></textarea>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button @click="saveProject" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-sm">
              {{ $t('settings.save') }}
            </button>
            <button @click="isAdding = false" class="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-2 px-4 rounded-lg transition">
              {{ $t('settings.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; padding-top: 10px; }
  to { opacity: 1; padding-top: 0; }
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
