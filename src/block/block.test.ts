import { Block } from './block';

describe('block', () => {
  const timeStamp = new Date();
  const staticBlock = new Block(undefined, {}, timeStamp, 1);

  test('new block should have proof 0', () => {
    expect(staticBlock.proofOfWork).toBe(0);
  });

  test('new block should set props', () => {
    const expectedPreviousHash = '123';
    const expectedData = '456';
    const expectedIndex = 1;
    const block = new Block(
      expectedPreviousHash,
      expectedData,
      timeStamp,
      expectedIndex
    );
    expect(block.previousHash).toBe(expectedPreviousHash);
    expect(block.data).toBe(expectedData);
    expect(block.hash).toBeDefined();
    expect(block.timeStampISOString).toBe(timeStamp.toISOString());
    expect(block.index).toBe(expectedIndex);
  });

  test('given a block, it can mine a hash', () => {
    const block = new Block(undefined, {}, timeStamp, 1);
    const hash = block.mine(1);
    expect(hash).toMatch(/^0[^0]/);
  });

  test.each([1, 2, 3])(
    'given a block, can mine given a difficulty %i',
    (difficulty: number) => {
      const block = new Block(undefined, {}, timeStamp, 1);
      const hash = block.mine(difficulty);
      expect(hash).toMatch(new RegExp(`^0{${difficulty}}[^0]`));
    }
  );

  test('can mine twice', () => {
    const block = new Block(undefined, {}, timeStamp, 1);
    const hash = block.mine(2);
    const secondHash = block.mine(2);
    expect(hash).toBe(secondHash);
  });

  test('different index, different hash', () => {
    const block = new Block(undefined, {}, timeStamp, 1);
    const block2 = new Block(undefined, {}, timeStamp, 2);
    const hash = block.mine(1);
    const hash2 = block2.mine(1);
    expect(hash === hash2).toBeFalsy();
  });

  test('different time, different hash', () => {
    const block = new Block(undefined, {}, timeStamp, 1);
    const block2 = new Block(undefined, {}, new Date(), 1);
    const hash = block.mine(1);
    const hash2 = block2.mine(1);
    expect(hash === hash2).toBeFalsy();
  });

  test('previous hash, different hash', () => {
    const block = new Block(undefined, {}, timeStamp, 1);
    const hash = block.mine(1);
    const block2 = new Block(hash, {}, timeStamp, 1);
    const hash2 = block2.mine(1);
    expect(hash === hash2).toBeFalsy();
  });

  test('valid when untampered', () => {
    const block = new Block(undefined, { money: 1 }, timeStamp, 1);
    const difficulty = 2;
    block.mine(difficulty);
    expect(block.isValid(difficulty)).toBe(true);
  });

  test('invalid when tampered', () => {
    const block = new Block(undefined, { money: 1 }, timeStamp, 1);
    const difficulty = 2;
    block.mine(difficulty);
    (block.data as any).money = 1000;
    expect(block.isValid(difficulty)).toBe(false);
  });

  test('invalid when unmined', () => {
    const block = new Block(undefined, { money: 1 }, timeStamp, 1);
    expect(block.isValid(2)).toBe(false);
  });
});
