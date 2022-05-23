import { Blockchain } from './blockchain/blockchain';
import { DateService } from './dateservice/dateservice';

const blockchain = new Blockchain(new DateService(), 3);

blockchain.addBlock({ hey: 2 });
blockchain.addBlock('kevin');
blockchain.addBlock([1, 23423, 'test']);

console.table(blockchain.chain);
console.log(`isValid: ${blockchain.isValid()}`);
