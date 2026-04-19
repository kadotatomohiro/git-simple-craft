<script setup>
import { ref, computed, watch } from 'vue'
import { store } from '../data/store'
import { useRouter, useRoute } from 'vue-router'
import { 
  Folder, Globe, Monitor, Cloud, Copy, CheckCircle2, 
  ArrowRight, AlertTriangle, PlusCircle, UploadCloud, DownloadCloud,
  FileText, Link, Database, CheckSquare, ListTodo, Info, Save
} from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// ==========================================
// 状態の定義（変数は上部にまとめる）
// ==========================================
const selectedActionId = ref(null)
const copiedCommand = ref(null)
const commitMessage = ref("")
const appliedCommitMessage = ref("")

const activeProject = computed(() => {
  if (!store.settings.activeProjectId) return null;
  return store.projects.find(p => p.id === store.settings.activeProjectId) || null;
})

// ==========================================
// 監視イベント（watch）
// ==========================================

import { nextTick } from 'vue'

// URLのクエリパラメータにstageがあれば表示する（設定画面からのナビゲーション対応）
watch(() => route.query.stage, (newStage) => {
  if (newStage) {
    selectedActionId.value = newStage
    router.replace({ path: '/' }) // クエリを消す
  }
}, { immediate: true })

// IMEのバグを回避するため、v-model標準を使いつつ代入のタイミングを制限
watch([() => store.settings.activeProjectId, () => selectedActionId.value], ([newProjectId, newActionId]) => {
  if (newActionId === 'commit') {
    const proj = store.projects.find(p => p.id === newProjectId)
    appliedCommitMessage.value = ""
    commitMessage.value = proj?.commitTemplate || ""
  }
}, { immediate: true })

// ==========================================
// デスクリプション・メソッド
// ==========================================

const copyToClipboard = async (command, targetId) => {
  try {
    await navigator.clipboard.writeText(command)
    copiedCommand.value = targetId
    setTimeout(() => {
      copiedCommand.value = null
    }, 2000)
  } catch (err) {
    alert(t('home.copyFail'))
  }
}

const applyCommitMessage = () => {
  appliedCommitMessage.value = commitMessage.value
}

const saveAsTemplate = () => {
  if (activeProject.value) {
    activeProject.value.commitTemplate = commitMessage.value
    alert(t('home.templateSaved'))
  }
}

const formatCommitCommand = (message) => {
  if (!message) return `git commit -m "${t('home.commitPls')}"`
  const lines = message.split('\n').filter(line => line.trim() !== '')
  const formattedArgs = lines.map(line => `-m "${line.replace(/"/g, '\\"')}"`).join(' ')
  return `git commit ${formattedArgs}`
}

const generateCommands = (p, actionId) => {
  const cdCmd = { desc: t('commands.cd'), cmd: `cd ${p.localPath || t('commands.noLocalPath')}` }
  
  switch(actionId) {
    case 'init':
      return [cdCmd, { desc: t('commands.init'), cmd: "git init" }]
    case 'remote':
      return [cdCmd, { desc: t('commands.remote'), cmd: `git remote add origin ${p.remoteUrl || t('commands.noRemoteUrl')}` }]
    case 'add':
      return [cdCmd, { desc: t('commands.add'), cmd: "git add ." }]
    case 'commit':
      return [cdCmd, { desc: t('commands.commit'), cmd: formatCommitCommand(appliedCommitMessage.value) }]
    case 'push':
      return [
        cdCmd,
        { desc: t('commands.branch'), cmd: "git branch -M main" },
        { desc: t('commands.push'), cmd: "git push -u origin main" }
      ]
    case 'clone':
      return [
        { desc: t('commands.clonedir'), cmd: `cd ${p.localPath ? p.localPath.split('\\').slice(0, -1).join('\\') || p.localPath : t('commands.noLocalPath')}` },
        { desc: t('commands.clone'), cmd: `git clone ${p.remoteUrl || t('commands.noRemoteUrl')}` }
      ]
    case 'pull':
      return [cdCmd, { desc: t('commands.pull'), cmd: "git pull origin main" }]
    default:
      return []
  }
}

const basicStages = [
  { id: 'init', icon: PlusCircle, color: 'blue', localRemote: 'local' },
  { id: 'remote', icon: Link, color: 'blue', localRemote: 'both' },
  { id: 'add', icon: CheckSquare, color: 'blue', localRemote: 'local' },
  { id: 'commit', icon: Database, color: 'blue', localRemote: 'local' },
  { id: 'push', icon: UploadCloud, color: 'green', localRemote: 'both' }
]

const otherActions = [
  { id: 'clone', icon: DownloadCloud, color: 'teal', localRemote: 'both' },
  { id: 'pull', icon: DownloadCloud, color: 'teal', localRemote: 'both' }
]

const actions = [...basicStages, ...otherActions]

const selectedAction = computed(() => actions.find(a => a.id === selectedActionId.value))
const currentStageIndex = computed(() => {
  if (!selectedActionId.value) return -1
  return basicStages.findIndex(s => s.id === selectedActionId.value)
})

const selectStage = (stageId) => {
  selectedActionId.value = stageId
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-12">
    
    <div v-if="!activeProject" class="border border-slate-300 rounded-xl p-8 text-center bg-gray-50">
      <AlertTriangle class="mx-auto text-slate-500 mb-4" :size="48" />
      <h2 class="text-xl font-bold mb-4">{{ $t('home.needsProject') }}</h2>
      <button @click="router.push('/settings')" class="bg-slate-800 text-white font-bold py-2 px-6 rounded-lg">
        {{ $t('home.gotoSettings') }}
      </button>
    </div>

    <div v-else class="space-y-8">
      
      <div class="border border-slate-300 rounded-xl p-5 flex flex-col gap-4 bg-white shadow-sm">
        <div>
          <span class="text-xs font-bold px-3 py-1 bg-gray-200 text-slate-700 rounded-full mb-3 inline-block">{{ $t('home.activeProject') }}</span>
          <div class="text-xl sm:text-2xl font-bold break-words">{{ activeProject.name }}</div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="border border-slate-200 bg-gray-50 p-3 rounded-lg flex-1">
            <div class="text-xs font-bold flex items-center gap-1 mb-2 text-slate-600"><Monitor :size="14" />{{ $t('home.local') }}</div>
            <div class="text-sm font-mono break-all p-1.5 bg-white border border-slate-200 rounded">{{ activeProject.localPath }}</div>
          </div>
          <div class="border border-slate-200 bg-gray-50 p-3 rounded-lg flex-1">
            <div class="text-xs font-bold flex items-center gap-1 mb-2 text-slate-600"><Cloud :size="14" />{{ $t('home.remote') }}</div>
            <div class="text-sm font-mono break-all p-1.5 bg-white border border-slate-200 rounded">{{ activeProject.remoteUrl || $t('settings.notSet') }}</div>
          </div>
        </div>
      </div>

      <div v-if="!selectedActionId">
        <h2 class="text-lg font-bold mb-4 border-b pb-2">{{ $t('home.basicFlow') }}</h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <button 
            v-for="(stage, index) in basicStages" 
            :key="stage.id"
            @click="selectedActionId = stage.id"
            class="flex flex-col items-center p-4 rounded-xl border border-slate-300 text-center hover:bg-gray-50"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center mb-2 border border-slate-300 bg-white">
              <component :is="stage.icon" :size="20" />
            </div>
            <h3 class="font-bold text-sm mb-1 whitespace-pre-line">{{ index + 1 }}. 
{{ $t(`stages.${stage.id}.title`) }}</h3>
            <p class="text-xs text-slate-500 whitespace-pre-line">{{ $t(`stages.${stage.id}.desc`) }}</p>
          </button>
        </div>

        <h2 class="text-lg font-bold mb-4 border-b pb-2 mt-8">{{ $t('home.otherActions') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            v-for="action in otherActions" 
            :key="action.id"
            @click="selectedActionId = action.id"
            class="flex items-center gap-4 text-left p-4 rounded-xl border border-slate-300 hover:bg-gray-50"
          >
            <div class="p-2 border border-slate-300 rounded-lg bg-white">
              <component :is="action.icon" :size="24" />
            </div>
            <div>
              <h3 class="font-bold whitespace-pre-line">{{ $t(`stages.${action.id}.title`) }}</h3>
              <p class="text-xs text-slate-500 whitespace-pre-line">{{ $t(`stages.${action.id}.desc`) }}</p>
            </div>
          </button>
        </div>
      </div>

      <div v-else>
        <button @click="selectedActionId = null" class="mb-4 text-sm font-bold flex items-center gap-2 px-3 py-1 border border-slate-300 rounded-lg hover:bg-gray-50">
           {{ $t('home.backToHome') }}
        </button>

        <div class="border border-slate-300 rounded-xl overflow-hidden">
          
          <div v-if="currentStageIndex >= 0" class="border-b border-slate-300 p-2 flex gap-2 overflow-x-auto items-center bg-gray-50">
            <div v-for="(stage, idx) in basicStages" :key="stage.id" 
                 class="flex-shrink-0 flex items-center text-xs whitespace-nowrap cursor-pointer px-2 py-1 rounded-md"
                 :class="idx === currentStageIndex ? 'font-bold bg-gray-200' : 'hover:bg-gray-100'"
                 @click="selectStage(stage.id)"
            >
              <span class="w-5 h-5 rounded-full flex items-center justify-center mr-1 border border-slate-300 text-slate-700 bg-white">
                {{ idx + 1 }}
              </span>
              <span :class="{'underline': idx === currentStageIndex}">{{ $t(`stages.${stage.id}.title`) }}</span>
              <ArrowRight v-if="idx < basicStages.length - 1" :size="12" class="ml-3 text-slate-400" />
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-start gap-4 mb-6">
              <div class="border border-slate-300 p-2 rounded-lg mt-1 bg-white">
                <component :is="selectedAction.icon" :size="28" />
              </div>
              <div>
                <h2 class="text-xl font-bold mb-2 whitespace-pre-line">{{ $t(`stages.${selectedAction.id}.title`) }}</h2>
                <div class="p-3 border border-slate-300 bg-gray-50 rounded-lg text-sm whitespace-pre-line">
                  <strong>{{ $t('home.whatHappens') }}</strong> {{ $t(`stages.${selectedAction.id}.reason`) }}
                </div>
              </div>
            </div>

            <!-- コミット入力フォーム -->
            <div v-if="selectedAction.id === 'commit'" class="mb-8 p-4 border border-slate-300 bg-gray-50 rounded-xl">
              <h3 class="font-bold mb-4 flex items-center gap-2">
                <ListTodo :size="18" />
                {{ $t('home.commitInputTitle') }}
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-2">
                  <textarea 
                    v-model="commitMessage"
                    spellcheck="false" autocomplete="off"
                    rows="5"
                    class="w-full p-2 border-2 border-slate-300 rounded-lg focus:border-slate-800 focus:outline-none font-sans text-sm leading-relaxed"
                    :placeholder="$t('home.commitPlaceholder')"
                  ></textarea>
                  
                  <div class="flex flex-col sm:flex-row gap-2 mt-3">
                    <button 
                      @click="applyCommitMessage" 
                      class="bg-slate-800 text-white font-bold py-2 px-3 text-sm rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <CheckCircle2 :size="16" /> {{ $t('home.applyComment') }}
                    </button>
                    <button 
                      @click="saveAsTemplate" 
                      class="border-2 border-slate-300 font-bold py-2 px-3 text-sm rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Save :size="16" /> {{ $t('home.saveTemplate') }}
                    </button>
                  </div>
                </div>
                
                <div class="p-3 border border-slate-300 rounded-lg text-sm bg-white">
                  <h4 class="font-bold border-b pb-2 mb-2">{{ $t('home.goodExamplesTitle') }}</h4>
                  <ul class="space-y-3 text-xs">
                    <li><strong>{{ $t('home.featTitle') }}</strong><br>{{ $t('home.featEx') }}</li>
                    <li><strong>{{ $t('home.fixTitle') }}</strong><br>{{ $t('home.fixEx') }}</li>
                    <li><strong>{{ $t('home.docsTitle') }}</strong><br>{{ $t('home.docsEx') }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- コマンドの出力 -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-slate-300 pb-2">
                <h3 class="font-bold">{{ $t('home.commandsTitle') }}</h3>
                <span v-if="selectedAction.id === 'commit' && !appliedCommitMessage" class="text-rose-600 text-sm font-bold">
                  {{ $t('home.plsApply') }}
                </span>
              </div>
              
              <div v-for="(cmdObj, index) in generateCommands(activeProject, selectedAction.id)" :key="index" class="mb-4">
                <p class="text-sm font-bold mb-1">{{ cmdObj.desc }}</p>
                
                <div class="border border-slate-300 bg-gray-50 rounded-lg p-3 font-mono text-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <pre class="whitespace-pre-wrap flex-grow leading-relaxed overflow-x-auto w-full">{{ cmdObj.cmd }}</pre>
                  
                  <button 
                    @click="copyToClipboard(cmdObj.cmd, `cmd-${index}`)"
                    class="flex-shrink-0 border border-slate-300 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs font-bold w-full sm:w-auto"
                    :disabled="selectedAction.id === 'commit' && index === 1 && !appliedCommitMessage"
                    :class="{ 'opacity-50 cursor-not-allowed': selectedAction.id === 'commit' && index === 1 && !appliedCommitMessage }"
                  >
                    <template v-if="copiedCommand === `cmd-${index}`">
                      <CheckCircle2 :size="14" /> {{ $t('home.copied') }}
                    </template>
                    <template v-else>
                      <Copy :size="14" /> {{ $t('home.copy') }}
                    </template>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeInUp {
  from { opacity: 0; padding-top: 15px; }
  to { opacity: 1; padding-top: 0; }
}
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent; 
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
</style>
