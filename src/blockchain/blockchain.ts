import { Block } from '../block/block';
import { DateService } from '../dateservice/dateservice';

class Blockchain {
  public chain: Block[] = [];
  private difficulty: number;
  private dateService: DateService;

  constructor(dateService: DateService, difficulty: number = 1) {
    this.dateService = dateService;
    this.difficulty = difficulty;
    this.addBlock({ isGenesis: true });
  }

  public addBlock(data: any): Block {
    const lastBlock =
      this.chain.length > 0 ? this.chain[this.chain.length - 1] : undefined;
    const newBlock = new Block(
      lastBlock?.hash,
      data,
      this.dateService.now(),
      (lastBlock?.index ?? -1) + 1
    );

    newBlock.mine(this.difficulty);
    this.chain.push(newBlock);
    return newBlock;
  }

  public isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.isValid(this.difficulty)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      if (currentBlock.index - 1 !== previousBlock.index) {
        return false;
      }
    }

    return true;
  }
}

export { Blockchain };
