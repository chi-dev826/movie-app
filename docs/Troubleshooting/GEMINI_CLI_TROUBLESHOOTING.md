# Gemini CLI トラブルシューティングガイド

## 概要
このドキュメントは、Gemini CLIで発生したMCPサーバー関連のエラーとその解決策を記録したものです。

## 発生した問題

### エラーメッセージ
```
Error during discovery for server '0': Invalid configuration: missing httpUrl (for Streamable HTTP), url (for SSE), and command (for stdio).
MCP ERROR (serena): Error: spawn uvx ENOENT
Error during discovery for server 'serena': spawn uvx ENOENT
MCP ERROR (playwright-mcp): Error: spawn cmd ENOENT
Error during discovery for server 'playwright-mcp': spawn cmd ENOENT
MCP ERROR (context7-mcp): Error: spawn cmd ENOENT
Error during discovery for server 'context7-mcp': spawn cmd ENOENT
MCP ERROR (mcp-server-calculator): Error: spawn cmd ENOENT
Error during discovery for server 'mcp-server-calculator': spawn cmd ENOENT
MCP ERROR (time-mcp): Error: spawn cmd ENOENT
Error during discovery for server 'time-mcp': spawn cmd ENOENT
```

### 問題の原因（初期調査）
1. **コマンドパスの解決問題**: Gemini CLIが相対パスで指定されたコマンド（`uvx`、`cmd`、`npx`）を正しく解決できていませんでした
2. **不完全なサーバー設定**: サーバー '0'の設定が不完全で、必要なパラメータが不足していました
3. **PowerShellスクリプトの実行問題**: `npx.ps1`スクリプトの実行に問題がありました

**注意**: これらの修正は一時的な解決策でした。真の原因は後述の「設定ファイルの優先順位システム」にありました。

## 解決策

### 1. 設定ファイルの場所と優先順位
- **グローバル設定**: `C:\Users\[ユーザー名]\.gemini\settings.json`
- **ローカル設定**: `[実行ディレクトリ]\.gemini\settings.json` ← **最優先**
- **バックアップ**: 修正前に必ずバックアップを作成

**重要**: gemini CLIは実行ディレクトリの`.gemini\settings.json`を最優先で読み込みます。

### 2. コマンドパスの確認方法
```powershell
# 各コマンドの絶対パスを確認
Get-Command uvx | Select-Object -ExpandProperty Source
Get-Command cmd | Select-Object -ExpandProperty Source
Get-Command npx | Select-Object -ExpandProperty Source
```

### 3. 修正内容

#### 修正前の設定例
```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [...]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [...]
    }
  }
}
```

#### 修正後の設定例
```json
{
  "mcpServers": {
    "serena": {
      "command": "C:\\Users\\tenma\\.local\\bin\\uvx.exe",
      "args": [...]
    },
    "sequential-thinking": {
      "command": "C:\\WINDOWS\\system32\\cmd.exe",
      "args": ["/c", "npx", ...]
    }
  }
}
```

### 4. 具体的な修正手順

1. **バックアップの作成**
   ```powershell
   Copy-Item ".gemini\settings.json" ".gemini\settings.json.backup"
   ```

2. **各MCPサーバーのコマンドパスを絶対パスに変更**
   - `uvx` → `C:\Users\tenma\.local\bin\uvx.exe`
   - `cmd` → `C:\WINDOWS\system32\cmd.exe`
   - `npx` → `C:\WINDOWS\system32\cmd.exe /c npx` (PowerShellスクリプトの問題回避)

3. **設定ファイルの検証**
   ```powershell
   gemini mcp list
   ```

## 修正後のMCPサーバー一覧

| サーバー名 | 機能 | 状態 |
|-----------|------|------|
| serena | IDEアシスタント機能 | ✅ 接続済み |
| sequential-thinking | 順次思考機能 | ✅ 接続済み |
| playwright-mcp | Web自動化機能 | ✅ 接続済み |
| context7-mcp | コンテキスト管理機能 | ✅ 接続済み |
| mcp-server-calculator | 計算機能 | ✅ 接続済み |
| time-mcp | 時間管理機能 | ✅ 接続済み |

## トラブルシューティング手順

### 1. 基本的な確認
```powershell
# Gemini CLIのバージョン確認
gemini --version

# MCPサーバーの状態確認
gemini mcp list

# ヘルプの表示
gemini --help
```

### 2. 環境変数の確認
```powershell
# PATHの確認
$env:PATH -split ';' | Where-Object {$_ -like "*nvm4w*" -or $_ -like "*uvx*" -or $_ -like "*local*"}
```

### 3. 実行ポリシーの確認（PowerShellスクリプト関連）
```powershell
Get-ExecutionPolicy
```

## 体系的なテストアプローチ

### テスト戦略
複雑な問題を効率的に解決するために、以下の段階的なテストアプローチを推奨します。

### 1. 初期状態の確認テスト
```powershell
# エラーメッセージの詳細確認
gemini
# 結果を記録: どのサーバーがエラーを起こしているか
```

### 2. コマンドパスの存在確認テスト
```powershell
# 各コマンドの存在とパスを確認
Get-Command uvx | Select-Object -ExpandProperty Source
Get-Command cmd | Select-Object -ExpandProperty Source  
Get-Command npx | Select-Object -ExpandProperty Source
# 結果: コマンドが存在するか、パスが正しいかを確認
```

### 3. 設定ファイルの内容確認テスト
```powershell
# 設定ファイルの存在と内容を確認
Test-Path ".gemini\settings.json"
Get-Content ".gemini\settings.json" | ConvertFrom-Json
# 結果: 設定ファイルの形式と内容を確認
```

### 4. ディレクトリ依存性のテスト
```powershell
# 異なるディレクトリからの実行テスト
cd C:\Users\tenma
gemini mcp list

cd C:\Users\tenma\documents\obsidian  # または他のディレクトリ
gemini mcp list
# 結果: ディレクトリによって動作が異なるかを確認
```

### 5. 設定ファイルの比較テスト
```powershell
# 複数の設定ファイルの存在確認
Get-ChildItem -Path "C:\Users\tenma" -Recurse -Name ".gemini\settings.json"
Get-ChildItem -Path "C:\Users\tenma\documents\obsidian" -Recurse -Name ".gemini\settings.json"

# 各設定ファイルの内容比較
Get-Content "C:\Users\tenma\.gemini\settings.json"
Get-Content "C:\Users\tenma\documents\obsidian\.gemini\settings.json"
# 結果: 設定ファイルの不整合を特定
```

### 6. 段階的な修正テスト
```powershell
# 最小限の設定から開始
# 1つずつサーバーを追加して動作確認
gemini mcp list  # 各修正後に実行
# 結果: どの修正が効果的かを特定
```

### 7. 修正後の検証テスト
```powershell
# 修正後の動作確認
gemini mcp list
echo "test" | gemini -p "Hello, test message"
# 結果: 修正が正しく適用されているかを確認
```

### テスト結果の分析
| テスト | 結果 | 原因の特定 |
|--------|------|------------|
| コマンド存在確認 | ✅ 存在 | パスの問題ではない |
| 絶対パス修正 | ⚠️ 部分的改善 | パスの問題は一部解決 |
| ディレクトリ依存性 | ❌ 動作が異なる | 設定ファイルの不整合が原因 |
| 設定ファイル比較 | ❌ 形式が異なる | 根本原因を特定 |

### テスト戦略の効果
1. **段階的アプローチ**: 問題を小さく分割してテスト
2. **対照実験**: 異なるディレクトリでの動作比較
3. **設定の分離**: パスの問題と設定ファイルの問題を分離
4. **再現性の確認**: 修正後の動作を複数回確認

## 予防策

1. **定期的なバックアップ**: 設定ファイルの変更前に必ずバックアップを作成
2. **絶対パスの使用**: 相対パスではなく絶対パスを使用してコマンドを指定
3. **段階的なテスト**: 設定変更後は必ず動作確認を行う
4. **ログの確認**: エラーが発生した場合は詳細なログを確認

## 参考情報

- **設定ファイル**: `C:\Users\[ユーザー名]\.gemini\settings.json`
- **ログファイル**: `C:\Users\[ユーザー名]\.gemini\tmp\[セッションID]\logs.json`
- **バックアップファイル**: `C:\Users\[ユーザー名]\.gemini\settings.json.backup`

## 追加の解決策（2025年1月8日更新）

### 問題：ディレクトリによってMCPサーバーの動作が異なる
**症状**: 
- ホームディレクトリ（`C:\Users\tenma`）では正常動作
- obsidianディレクトリ（`C:\Users\tenma\documents\obsidian`）ではすべてのMCPサーバーが切断

**根本原因**: 
- **gemini CLIの設定ファイル優先順位システム**
- 実行ディレクトリの`.gemini\settings.json`が最優先で読み込まれる
- 異なるディレクトリに異なる形式の設定ファイルが存在

**設定ファイルの不整合**:
```
C:\Users\tenma\.gemini\settings.json                    ← グローバル設定（正しいMCP設定）
C:\Users\tenma\documents\obsidian\.gemini\settings.json  ← ローカル設定（古い形式）
```

**古いローカル設定の問題**:
```json
{
  "mcpServers": [  // ← 配列形式（古い形式）
    {
      "alias": "movie-app-issues",
      "type": "github",
      // ... 古い設定
    }
  ]
}
```

**正しい設定形式**:
```json
{
  "mcpServers": {  // ← オブジェクト形式（新しい形式）
    "sequential-thinking": { ... },
    "mcp-server-calculator": { ... },
    // ... 正しいMCP設定
  }
}
```

**解決策**:
1. **ローカル設定ファイルの確認**:
   ```powershell
   # 各ディレクトリで設定ファイルの存在確認
   Test-Path ".gemini\settings.json"
   Get-ChildItem -Force | Where-Object {$_.Name -like "*gemini*"}
   ```

2. **古い設定ファイルのバックアップ**:
   ```powershell
   Copy-Item ".gemini\settings.json" ".gemini\settings.json.old"
   ```

3. **正しい設定ファイルのコピー**:
   ```powershell
   # グローバル設定をローカルにコピー
   Copy-Item "C:\Users\tenma\.gemini\settings.json" ".gemini\settings.json"
   ```

4. **設定ファイルの統一**:
   - すべてのディレクトリで同じ設定ファイルを使用
   - または、ローカル設定を削除してグローバル設定のみを使用

### 最終的な動作確認結果
**obsidianディレクトリ**:
- ✅ **sequential-thinking**: 正常動作
- ✅ **mcp-server-calculator**: 正常動作  
- ✅ **time-mcp**: 正常動作
- ✅ **context7-mcp**: 正常動作
- ✅ **serena**: 正常動作
- ✅ **playwright-mcp**: 正常動作

**ホームディレクトリ**:
- ✅ 同様にすべてのMCPサーバーが正常動作

### 今後の対策
1. **設定ファイルの同期**: グローバル設定を変更した際は、ローカル設定も更新
2. **設定の一元管理**: 可能であれば、ローカル設定を削除してグローバル設定のみを使用
3. **定期的な確認**: 異なるディレクトリでの動作確認

## 作成日時
2025年9月8日

## 最終更新
2025年9月8日

## 作成者
AI Assistant (Claude)

---
*このドキュメントは、Gemini CLIのMCPサーバー関連の問題解決のために作成されました。*
