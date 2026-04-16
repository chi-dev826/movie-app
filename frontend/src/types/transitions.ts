/**
 * 画面遷移のパターン定義。
 * Route の handle プロパティで使用する。
 */
export type TransitionType = 'horizontal' | 'vertical';

export interface RouteHandle {
  transition?: TransitionType;
}
