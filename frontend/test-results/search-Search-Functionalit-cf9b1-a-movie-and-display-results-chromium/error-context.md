# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - navigation [ref=e6]:
      - link "ホーム" [ref=e7] [cursor=pointer]:
        - /url: /
        - img [ref=e8] [cursor=pointer]
        - generic [ref=e11] [cursor=pointer]: ホーム
      - button "検索" [ref=e12] [cursor=pointer]:
        - img [ref=e13] [cursor=pointer]
        - generic [ref=e16] [cursor=pointer]: 検索
  - main [ref=e17]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - link "ホームに戻る" [ref=e21] [cursor=pointer]:
          - /url: /
          - img [ref=e22] [cursor=pointer]
          - text: ホームに戻る
        - heading "\"Dune\" の検索結果" [level=1] [ref=e24]
        - paragraph [ref=e25]: 検索中...
      - generic [ref=e27]: 読み込み中...
```