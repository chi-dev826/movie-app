export interface IOgpImageProvider {
  getOgpImage(url: string): Promise<string | null>;
}
