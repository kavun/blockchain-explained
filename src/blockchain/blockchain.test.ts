import { Blockchain } from './blockchain';
import { DateService } from '../dateservice/dateservice';

describe('blockchain', () => {
  const dateService = new DateService();
  const expectedTimeStamp = new Date();
  jest.spyOn(dateService, 'now').mockImplementation(() => {
    return expectedTimeStamp;
  });

  test('blockchain starts with single block', () => {
    const blockchain = new Blockchain(dateService);
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0].previousHash).toBeUndefined();
  });

  test('addBlock creates and mines block', () => {
    const difficulty = 2;
    const blockchain = new Blockchain(dateService, difficulty);
    const newBlock = blockchain.addBlock({ testData: true });
    expect(newBlock.hash).toMatch(new RegExp(`^0{${difficulty}}[^0]`));
    expect(blockchain.chain.length).toBe(2);
    expect(newBlock.timeStampISOString).toBe(expectedTimeStamp.toISOString());
  });

  test('addBlock updates index', () => {
    const difficulty = 1;
    const blockchain = new Blockchain(dateService, difficulty);
    expect(blockchain.chain[0].index).toBe(0);
    const newBlock = blockchain.addBlock({ testData: true });
    expect(newBlock.index).toBe(1);
    const newBlock2 = blockchain.addBlock({ testData: true });
    expect(newBlock2.index).toBe(2);
  });

  test('valid when untampered', () => {
    const difficulty = 2;
    const blockchain = new Blockchain(dateService, difficulty);
    blockchain.addBlock({ testData: true });
    expect(blockchain.isValid()).toBe(true);
  });

  test('invalid when tampered', () => {
    const difficulty = 2;
    const blockchain = new Blockchain(dateService, difficulty);
    const newBlock = blockchain.addBlock({ money: 1 });
    (newBlock.data as any).money = 1000;
    expect(blockchain.isValid()).toBe(false);
  });

  test('invalid when out of order', () => {
    const difficulty = 2;
    const blockchain = new Blockchain(dateService, difficulty);
    blockchain.addBlock({ money: 1 });
    blockchain.addBlock({ money: 2 });
    blockchain.chain = [
      blockchain.chain[1],
      blockchain.chain[2],
      blockchain.chain[0],
    ];
    expect(blockchain.isValid()).toBe(false);
  });

  test('invalid when bad index', () => {
    const difficulty = 2;
    const blockchain = new Blockchain(dateService, difficulty);
    blockchain.addBlock({ money: 1 });
    const lastBlock = blockchain.addBlock({ money: 2 });
    lastBlock.index = 6;
    expect(blockchain.isValid()).toBe(false);
  });
});
