# モバイル表示の最適化

## 概要

Tailwind CSSへの移行後、PC（モニター）ではレイアウトが概ね正常に表示されているが、モバイル端末で確認した際に以下の2つの表示上の問題が確認された。

1.  ヒーロースライダーの表示が大きすぎる。
2.  「人気映画」セクションのカードサイズが大きすぎる。

本文書は、これらの問題の原因と具体的な解決策を記述する。

---

## 課題1: ヒーロースライダーの表示が大きすぎる

### 問題点

- **スライド数:** モバイル画面でもスライドが2つ表示される設定になっており、個々の映画の情報が小さく視認しづらい。
- **高さ:** 画面の高さに対してスライダーが70% (`h-[70vh]`) を占有しており、モバイル画面では圧迫感が強い。

### 解決策

- **ファイル:** `frontend/src/components/HeroSwiper.tsx`
- **具体策:**
    1.  **スライド数の調整:** Swiperの設定に `breakpoints` を追加。画面幅`768px`未満ではスライドを**1つ**、それ以上で**2つ**表示するように変更する。
    2.  **高さの調整:** `className` を変更し、モバイルでの高さを `h-[60vh]` に抑え、PC (`md`以上) では `h-[70vh]` に戻す。

#### コード変更案

```diff
--- a/frontend/src/components/HeroSwiper.tsx
+++ b/frontend/src/components/HeroSwiper.tsx
@@ -16,25 +16,30 @@
   const SwiperSettings = {
     modules: [EffectCoverflow, Autoplay],
     effect: 'coverflow',
     grabCursor: true,
     centeredSlides: true,
-    slidesPerView: 2,
     loop: true,
     autoplay: { delay: 10000, disableOnInteraction: false },
     coverflowEffect: {
       rotate: 0,
       stretch: 30,
       depth: 100,
       modifier: 1.5,
       slideShadows: false,
     },
+    slidesPerView: 1, // モバイルでのデフォルト
+    breakpoints: {
+      // 768px以上で適用
+      768: {
+        slidesPerView: 2,
+      },
+    },
   };
 
   return (
-    <Swiper {...SwiperSettings} className="w-full h-[70vh]">
+    <Swiper {...SwiperSettings} className="w-full h-[60vh] md:h-[70vh]">
       {movies.map((movie) => (
         <SwiperSlide key={movie.id} className="flex w-full h-full">
           <HeroSectionComponents movie={movie} />

```

---

## 課題2: 「人気映画」のカードサイズが大きすぎる

### 問題点

カードに `min-w-[200px]` という固定の最小幅が設定されている。そのため、モバイルの2列グリッド表示において、カードが親要素のグリッド幅に追従できず、レイアウトが窮屈になっている。

### 解決策

- **ファイル:** `frontend/src/components/MovieCard.tsx`
- **具体策:**
    1.  固定幅の指定 (`min-w-[200px]`) を削除する。
    2.  代わりに `aspect-[2/3]` を追加し、ポスターの標準的な縦横比（2:3）を維持する。これにより、カードの幅は親グリッドに追従し、高さは縦横比に基づいて自動調整されるようになる。

#### コード変更案

```diff
--- a/frontend/src/components/MovieCard.tsx
+++ b/frontend/src/components/MovieCard.tsx
@@ -14,7 +14,7 @@
     <Link
       to={`/movie/${movie.id}`}
       key={movie.id}
-      className="group relative min-w-[200px] h-[300px] rounded-2xl overflow-hidden bg-gray-800 shadow-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-red-900/50"
+      className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-800 shadow-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-red-900/50"
     >
       <img
         src={movieImageUrl}

```
