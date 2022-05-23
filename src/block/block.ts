import sha256 from 'crypto-js/sha256';

class Block {
  public proofOfWork: number;
  public previousHash: string | undefined;
  public timeStampISOString: string;
  public data: any;
  public index: number;
  public hash: string;

  constructor(
    previousHash: string | undefined,
    data: any,
    timeStamp: Date,
    index: number
  ) {
    this.proofOfWork = 0;
    this.previousHash = previousHash;
    this.timeStampISOString = timeStamp.toISOString();
    this.data = data;
    this.index = index;
    this.hash = this.calculateHash();
  }

  private calculateHash(): string {
    return sha256(
      `${this.previousHash}|` +
        `${JSON.stringify(this.data)}|` +
        `${this.timeStampISOString}|` +
        `${this.proofOfWork}|` +
        `${this.index}`
    ).toString();
  }

  public mine(difficulty: number): string {
    if (difficulty < 1) {
      throw `difficulty:${difficulty} must be >= 1`;
    }

    while (!this.isMined(difficulty)) {
      this.proofOfWork++;
      this.hash = this.calculateHash();
    }

    // console.log(`mined: ${this.hash} for ${JSON.stringify(this.data)}`);
    return this.hash;
  }

  public isValid(difficulty: number): boolean {
    return this.isMined(difficulty) && this.hash === this.calculateHash();
  }

  private isMined(difficulty: number): boolean {
    return new RegExp(`^0{${difficulty}}[^0]`).test(this.hash);
  }
}

export { Block };
