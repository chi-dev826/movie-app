export class MovieImages {
  constructor(
    public readonly backdrops: readonly string[],
    public readonly posters: readonly string[],
    public readonly logos: readonly string[],
  ) {
    Object.freeze(this);
  }

  public getMainLogo(): string | null {
    return this.logos[0] || null;
  }
}