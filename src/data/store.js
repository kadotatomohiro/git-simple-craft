import { reactive, watch } from 'vue'

const STORAGE_KEY = 'git-simple-craft-data'

// 初心者にも配慮した初期データ構造
const defaultData = {
  settings: {
    activeProjectId: null, // 現在選択しているプロジェクトのID
    locale: 'ja' // デフォルトのアプリ言語
  },
  projects: [] // 登録されたプロジェクトのリスト
  /*
    project の構造:
    {
      id: "12345",
      name: "初めてのウェブサイト",
      localPath: "C:\\Users\\user\\Desktop\\website",
      remoteUrl: "https://github.com/myaccount/website.git",
      commitTemplate: "feat: [機能名を追加]\n\n[詳細な説明をここに書く]" // コミットメッセージのひな形
    }
  */
}

// 保存されたデータがあればそれを読み込む
const savedData = localStorage.getItem(STORAGE_KEY)
const initialData = savedData ? JSON.parse(savedData) : defaultData

// 変数storeは、アプリ全体で共有されるデータです
export const store = reactive(initialData)

let saveTimeout = null
// stateが変更されたら、自動的にブラウザに保存（localStorage）する
// ※タイピング中のフリーズ（IME干渉など）を防ぐため、保存は少し遅延させる（デバウンス）
watch(store, (newState) => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }, 300)
}, { deep: true })
