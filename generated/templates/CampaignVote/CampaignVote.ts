// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class VoteCancelled extends ethereum.Event {
  get params(): VoteCancelled__Params {
    return new VoteCancelled__Params(this);
  }
}

export class VoteCancelled__Params {
  _event: VoteCancelled;

  constructor(event: VoteCancelled) {
    this._event = event;
  }

  get voteId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get requestId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get support(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class Voted extends ethereum.Event {
  get params(): Voted__Params {
    return new Voted__Params(this);
  }
}

export class Voted__Params {
  _event: Voted;

  constructor(event: Voted) {
    this._event = event;
  }

  get voteId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get requestId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get support(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get hashedVote(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class CampaignVote__votesResult {
  value0: BigInt;
  value1: i32;
  value2: BigInt;
  value3: string;
  value4: boolean;
  value5: Address;

  constructor(
    value0: BigInt,
    value1: i32,
    value2: BigInt,
    value3: string,
    value4: boolean,
    value5: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1))
    );
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromString(this.value3));
    map.set("value4", ethereum.Value.fromBoolean(this.value4));
    map.set("value5", ethereum.Value.fromAddress(this.value5));
    return map;
  }
}

export class CampaignVote extends ethereum.SmartContract {
  static bind(address: Address): CampaignVote {
    return new CampaignVote("CampaignVote", address);
  }

  campaignFactoryInterface(): Address {
    let result = super.call(
      "campaignFactoryInterface",
      "campaignFactoryInterface():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_campaignFactoryInterface(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "campaignFactoryInterface",
      "campaignFactoryInterface():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  campaignInterface(): Address {
    let result = super.call(
      "campaignInterface",
      "campaignInterface():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_campaignInterface(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "campaignInterface",
      "campaignInterface():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  voteCount(): BigInt {
    let result = super.call("voteCount", "voteCount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_voteCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("voteCount", "voteCount():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  votes(param0: Address, param1: BigInt): CampaignVote__votesResult {
    let result = super.call(
      "votes",
      "votes(address,uint256):(uint256,uint8,uint256,string,bool,address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new CampaignVote__votesResult(
      result[0].toBigInt(),
      result[1].toI32(),
      result[2].toBigInt(),
      result[3].toString(),
      result[4].toBoolean(),
      result[5].toAddress()
    );
  }

  try_votes(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<CampaignVote__votesResult> {
    let result = super.tryCall(
      "votes",
      "votes(address,uint256):(uint256,uint8,uint256,string,bool,address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CampaignVote__votesResult(
        value[0].toBigInt(),
        value[1].toI32(),
        value[2].toBigInt(),
        value[3].toString(),
        value[4].toBoolean(),
        value[5].toAddress()
      )
    );
  }
}

export class __CampaignVote_initCall extends ethereum.Call {
  get inputs(): __CampaignVote_initCall__Inputs {
    return new __CampaignVote_initCall__Inputs(this);
  }

  get outputs(): __CampaignVote_initCall__Outputs {
    return new __CampaignVote_initCall__Outputs(this);
  }
}

export class __CampaignVote_initCall__Inputs {
  _call: __CampaignVote_initCall;

  constructor(call: __CampaignVote_initCall) {
    this._call = call;
  }

  get _campaignFactory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _campaign(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class __CampaignVote_initCall__Outputs {
  _call: __CampaignVote_initCall;

  constructor(call: __CampaignVote_initCall) {
    this._call = call;
  }
}

export class VoteOnRequestCall extends ethereum.Call {
  get inputs(): VoteOnRequestCall__Inputs {
    return new VoteOnRequestCall__Inputs(this);
  }

  get outputs(): VoteOnRequestCall__Outputs {
    return new VoteOnRequestCall__Outputs(this);
  }
}

export class VoteOnRequestCall__Inputs {
  _call: VoteOnRequestCall;

  constructor(call: VoteOnRequestCall) {
    this._call = call;
  }

  get _requestId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _support(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get _hashedVote(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class VoteOnRequestCall__Outputs {
  _call: VoteOnRequestCall;

  constructor(call: VoteOnRequestCall) {
    this._call = call;
  }
}

export class CancelVoteCall extends ethereum.Call {
  get inputs(): CancelVoteCall__Inputs {
    return new CancelVoteCall__Inputs(this);
  }

  get outputs(): CancelVoteCall__Outputs {
    return new CancelVoteCall__Outputs(this);
  }
}

export class CancelVoteCall__Inputs {
  _call: CancelVoteCall;

  constructor(call: CancelVoteCall) {
    this._call = call;
  }

  get _requestId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelVoteCall__Outputs {
  _call: CancelVoteCall;

  constructor(call: CancelVoteCall) {
    this._call = call;
  }
}
