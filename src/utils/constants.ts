import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Factory as FactoryContract } from '../../generated/Factory/Factory';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const FACTORY_ADDRESS = '0x0ACB807f76f7efEf7F89488F3297488dCa51a07c';

export const factoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BI = BigInt.fromI32(0);
