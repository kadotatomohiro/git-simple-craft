import { createI18n } from 'vue-i18n'
import { store } from '../data/store'

const messages = {
  ja: {
    app: {
      title: `Git Simple Craft`,
      home: `ホーム`,
      settings: `設定`,
      settingsDesc: `プロジェクト設定`
    },
    settings: {
      title: `設定`,
      projectSetup: `プロジェクト管理`,
      language: `アプリの表示言語 / App Language`,
      desc: `あなたがGitを使いたいフォルダ（ローカル）と、GitHub連携先（リモート）を登録します。
      ここに登録しておくことで、生成されるコマンドに必要なパスが自動的に入力されます。`,
      registeredProjects: `登録済みのプロジェクト`,
      active: `選択中`,
      localPath: `ローカルパス`,
      remoteUrl: `リモートURL`,
      notSet: `未設定`,
      commitTemplate: `コミットテンプレート`,
      edit: `編集`,
      delete: `削除`,
      editProject: `プロジェクトを編集`,
      projectName: `プロジェクト名`,
      localDesc: `あなたがGitを使いたいフォルダ（ローカル）`,
      remoteDesc: `GitHubのリポジトリのURL（リモート）`,
      templateDesc: `コミットメッセージ(更新履歴)のテンプレート`,
      save: `保存`,
      cancel: `キャンセル`,
      noProjects: `プロジェクトがまだ登録されていません。`,
      newProjectBtn: `新しいプロジェクトを登録する`,
      newProjectTitle: `新規プロジェクトの登録`,
      newProject1: `1. プロジェクト名（わかりやすい名前） *`,
      newProject1Placeholder: `例: 私のポートフォリオ`,
      newProject2: `2. あなたがGitを使いたいフォルダ（ローカル） *`,
      newProject2Placeholder: `例: C:\\Users\\user\\Desktop\\my-site`,
      newProject3: `3. GitHubレポジトリのURL（リモート）`,
      newProject3Optional: `（あとで登録してもOK）`,
      newProject3Placeholder: `例: https://github.com/account/repo.git`,
      newProject4: `4. コミットメッセージ(更新履歴)のテンプレート`,
      alertRequired: `「プロジェクト名」と「あなたがGitを使いたいフォルダ（ローカル）」は必須です`,
      confirmDelete: `本当にこのプロジェクトを削除しますか？`,
      saved: `保存しました！`,
      defaultCommitTemplate: `変更内容や登録内容を簡潔に書いてください`,
      jsonMenu: `JSONデータの入出力`,
      jsonImport: `データの読み込み (Import)`,
      jsonExport: `データの書き出し (Export)`,
      jsonAbout: `この機能について`,
      jsonAboutDesc: `アプリ全体の設定とプロジェクト情報を、まるごとJSONファイルで保存・復元できます。\n別デバイスへの引き継ぎやバックアップにご利用ください。`,
      importInitBtn: `JSONファイルから復元する`,
      promptExportTitle: `設定を保存しました。\n現在の全データをファイルにバックアップ(書き出し)しますか？`,
      importWarning: `いま登録されている全データが上書きされます！本当によろしいですか？`
    },
    home: {
      needsProject: `まずはプロジェクトを設定しましょう！`,
      gotoSettings: `設定画面へ行く`,
      activeProject: `選択中のプロジェクト`,
      local: `ローカル`,
      remote: `リモート`,
      basicFlow: `基本の流れ（最初はSTEP1から、次回からはSTEP3から行ってください。）`,
      otherActions: `その他の操作`,
      backToHome: `← ホームに戻る`,
      whatHappens: `起きる事:`,
      commitInputTitle: `コミットメッセージ(更新履歴)の入力`,
      commitPlaceholder: `コミットメッセージ(更新履歴)を入力...`,
      applyComment: `コメントを反映`,
      saveTemplate: `テンプレート保存`,
      goodExamplesTitle: `💡 良い書き方の例`,
      featTitle: `feat: 新機能追加`,
      featEx: `「feat: ログイン画面を追加」`,
      fixTitle: `fix: バグ修正`,
      fixEx: `「fix: スマホでボタンのはみ出しを修正」`,
      docsTitle: `docs: 文書の変更`,
      docsEx: `「docs: READMEに使い方を追記」`,
      commandsTitle: `実行するコマンド`,
      plsApply: `↑ 「コメントを反映」を押してください`,
      copied: `コピー済`,
      copy: `コピー`,
      copyFail: `コピーに失敗しました。`,
      templateSaved: `現在のテキストをテンプレートとして保存しました！`,
      commitPls: `【コメントを反映してください】`
    },
    stages: {
      init: {
        title: `ローカルの初期化をする`,
        desc: `Gitを始める準備（基本は最初だけ必要です！ ）`,
        reason: `このフォルダをgit管理下に置きます。
「.git」という見えないフォルダが作られ、履歴の追跡がスタートします。
「.git」は大切なものなので削除しないようにしてください！ 
※特定のフォルダやファイルを管理対象から外したい場合「.gitignore」に追加します。`,
      },
      remote: {
        title: `紐付けをする`,
        desc: `アップロード先の登録（基本は最初だけ必要です！ ）`,
        reason: `あなたのパソコンのフォルダと、GitHub（リモート）の箱をワイヤーで繋ぐイメージです。「origin」という名前で登録します。`
      },
      add: {
        title: `準備する`,
        desc: `作業中の変更をまとめて “Git に渡すための箱” に入れる操作`,
        reason: `変更をいきなりセーブするのではなく、一度「ステージング」と呼ばれる準備エリアに乗せます。
        「.（ドット）」は全部、という意味です。`
      },
      commit: {
        title: `記録する`,
        desc: `メッセージ(変更履歴)を付けて変更をセーブする`,
        reason: `準備した変更を、あなたのパソコンの中に正式な歴史（コミット）として保存します。
        まだGitHubには上がりません。`
      },
      push: {
        title: `アップロード`,
        desc: `GitHubへ最新の履歴を送る`,
        reason: `PCにあるあなたの最新の作業履歴を、紐付けたGitHub（リモート）へアップロードして同期します。`
      },
      clone: {
        title: `パソコンにコピー (clone)`,
        desc: `GitHubから丸ごとダウンロード`,
        reason: `すでにGitHubにあるものを、自分のパソコンに丸ごとコピーします。これで作業を始められます。`
      },
      pull: {
        title: `最新を取り込む (pull)`,
        desc: `他の人やPCなどで行ったGitHub(リモート)の変更などを手元に反映する`,
        reason: `GitHub上で何か変わったものを、手元のパソコン（ローカル）に持ってきて合体させます。`
      }
    },
    commands: {
      cd: `1. 作業フォルダに移動します（必須）`,
      noLocalPath: `【設定で「Gitで管理するフォルダのパス」を登録してください】`,
      init: `2. フォルダをGitで管理できるように初期化します`,
      remote: `2. GitHubのURLを「origin」という名前で紐付けます`,
      noRemoteUrl: `【リモートURLが未設定です】`,
      add: `2. すべての変更を記録する準備（ステージング）をします`,
      commit: `2. 準備した変更にメッセージ(更新履歴)を付けてセーブ（記録）します`,
      branch: `[基本は初回のみ実行]\n2. デフォルトのブランチ名を「main」に設定します（エラー防止）`,
      push: `3. パソコン上のセーブ記録をGitHubへアップロードします`,
      clonedir: `1. フォルダを保管する親ディレクトリに移動します`,
      clone: `2. GitHubから丸ごとダウンロードします`,
      pull: `2. GitHubの最新状態をパソコンに取り込みます`
    }
  },
  en: {
    app: {
      title: `Git Simple Craft`,
      home: `Home`,
      settings: `Settings`,
      settingsDesc: `Project Settings`
    },
    settings: {
      title: 'Settings',
      projectSetup: 'Project Management',
      language: 'App Language',
      desc: 'Register the local folder you want to use with Git and the remote GitHub repository link.\nBy registering here, the required paths for the generated commands will be automatically filled in.',
      registeredProjects: `Registered Projects`,
      active: `Active`,
      localPath: `Local Path`,
      remoteUrl: `Remote URL`,
      notSet: `Not Set`,
      commitTemplate: `Commit Template`,
      edit: `Edit`,
      delete: `Delete`,
      editProject: `Edit Project`,
      projectName: `Project Name`,
      localDesc: `PC Folder Path (Local)`,
      remoteDesc: `GitHub URL (Remote)`,
      templateDesc: `Commit Message Template`,
      save: `Save`,
      cancel: `Cancel`,
      noProjects: `No projects registered yet.`,
      newProjectBtn: `Register a New Project`,
      newProjectTitle: `Register New Project`,
      newProject1: `1. Project Name (Easy to understand) *`,
      newProject1Placeholder: `e.g., My Portfolio`,
      newProject2: `2. PC Folder Path (Local Directory) *`,
      newProject2Placeholder: `e.g., C:\\Users\\user\\Desktop\\my-site`,
      newProject3: `3. GitHub Repository URL (Remote)`,
      newProject3Optional: `(You can register this later)`,
      newProject3Placeholder: `e.g., https://github.com/account/repo.git`,
      newProject4: `4. Commit Message Template`,
      alertRequired: `Project Name and Local Folder Path are required`,
      confirmDelete: `Are you sure you want to delete this project?`,
      saved: `Saved!`,
      defaultCommitTemplate: `Write a brief description of the changes and contents`,
      jsonMenu: 'JSON I/O',
      jsonImport: 'Import Data',
      jsonExport: 'Export Data',
      jsonAbout: 'About this feature',
      jsonAboutDesc: 'You can export all settings and project information as a JSON file, or import to restore them.\nUse this for backups or moving to another device.',
      importInitBtn: 'Restore from JSON file',
      promptExportTitle: 'Settings saved.\nWould you like to backup (export) the current whole data to a file now?',
      importWarning: 'This will overwrite ALL currently registered data! Are you sure?'
    },
    home: {
      needsProject: 'Let\'s setup a project first!',
      gotoSettings: `Go to Settings`,
      activeProject: `Active Project`,
      local: `Local`,
      remote: `Remote`,
      basicFlow: `Basic Flow (Start from STEP 1 the first time, and from STEP 3 onwards.)`,
      otherActions: `Other Actions`,
      backToHome: `← Back to Home`,
      whatHappens: `What Happens:`,
      commitInputTitle: `Enter Commit Message`,
      commitPlaceholder: `Enter commit message...`,
      applyComment: `Apply Comment`,
      saveTemplate: `Save Template`,
      goodExamplesTitle: `💡 Good Examples`,
      featTitle: `feat: Add new feature`,
      featEx: `"feat: Added login screen"`,
      fixTitle: `fix: Bug fix`,
      fixEx: `"fix: Fixed button overflow on mobile"`,
      docsTitle: `docs: Documentation changes`,
      docsEx: `"docs: Added usage to README"`,
      commandsTitle: `Commands to Execute`,
      plsApply: `↑ Please click "Apply Comment"`,
      copied: `Copied`,
      copy: `Copy`,
      copyFail: `Failed to copy.`,
      templateSaved: `Saved current text as a template!`,
      commitPls: `[Please apply comment]`
    },
    stages: {
      init: {
        title: `Initialize`,
        desc: `Required only once: prepare to start Git`,
        reason: `Places this folder under Git control. An invisible ".git" folder is created, and history tracking starts.`
      },
      remote: {
        title: `Link Remote`,
        desc: `Required only once: register the upload destination`,
        reason: `Links your PC folder with the GitHub (remote) repository. Registers under the name "origin".`
      },
      add: {
        title: `Prepare (Add)`,
        desc: `Add changed files to the "record candidates"`,
        reason: `Instead of saving changes immediately, place them in the "staging area". The "." (dot) means everything.`
      },
      commit: {
        title: `Record (Commit)`,
        desc: `Save changes with a message`,
        reason: `Saves the prepared changes as official history (commit) on your PC. It is not yet uploaded to GitHub.`
      },
      push: {
        title: `Upload (Push)`,
        desc: `Send the latest history to GitHub`,
        reason: `Uploads and syncs your latest work history from your PC to the linked GitHub (remote) repository.`
      },
      clone: {
        title: `Copy to PC (clone)`,
        desc: `Download everything from GitHub`,
        reason: `Copies everything from GitHub directly to your PC. This allows you to start working.`
      },
      pull: {
        title: `Fetch Latest (pull)`,
        desc: 'Apply others\' changes locally',
        reason: `Bring down any changes made on GitHub and merge them into your local PC.`
      }
    },
    commands: {
      cd: `1. Move to the working folder (Required)`,
      noLocalPath: `[Please register local path in settings]`,
      init: `2. Initialize the folder to be managed by Git`,
      remote: `2. Link the GitHub URL under the name "origin"`,
      noRemoteUrl: `[Remote URL is not set]`,
      add: `2. Prepare (stage) all changes to be recorded`,
      commit: `2. Save (record) the prepared changes with a message`,
      branch: `[This is generally only done the first time] 2. Set the default branch name to "main" (prevents errors)`,
      push: `3. Upload the locally saved records to GitHub`,
      clonedir: `1. Move to the parent directory where the folder will be kept`,
      clone: `2. Download exactly from GitHub`,
      pull: `2. Fetch the latest state from GitHub onto your PC`
    }
  }
}

/*---
legacy: false, Composition APIを使うための設定
locale: デフォルト言語（'en' に変えると英語になります！）
fallbackLocale: 選択原語の辞書が無いときに使う予備の言語（英語）
messages 翻訳データ（別ファイルで定義したもの）
---*/

export const i18n = createI18n({
  legacy: false,
  locale: store.settings.locale || 'ja',
  fallbackLocale: 'en',
  messages
})
