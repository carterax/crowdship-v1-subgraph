import {
  RequestAdded as RequestAddedEvent,
  RequestVoided as RequestVoidedEvent,
} from '../../generated/templates/CampaignRequest/CampaignRequest';
import { RequestFactory, Request } from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleRequestAdded(event: RequestAddedEvent): void {
  let requestFactory = RequestFactory.load(event.address.toHexString());
  let request = new Request(event.params.requestId.toString());

  if (requestFactory !== null) {
    request.createdAt = event.block.timestamp;
    request.updatedAt = new BigInt(0);
    request.requestFactory = event.address.toHexString();
    request.recipient = event.params.recipient;
    request.complete = false;
    request.value = event.params.value;
    request.approvalCount = new BigInt(0);
    request.againstCount = new BigInt(0);
    request.abstainedCount = new BigInt(0);
    request.duration = event.params.duration;
    request.void = false;
    request.votes = [];
    request.owner = event.transaction.from.toHexString();

    let allRequestFactoryRequests = requestFactory.requests;
    allRequestFactoryRequests.push(event.params.requestId.toString());
    requestFactory.requests = allRequestFactoryRequests;
    requestFactory.requestCount = requestFactory.requestCount.plus(
      new BigInt(1)
    );

    request.save();
    requestFactory.save();
  }
}

export function handleRequestVoided(event: RequestVoidedEvent): void {
  let request = Request.load(event.params.requestId.toString());

  if (request !== null) {
    request.void = true;
    request.voidedBy = event.transaction.from.toHexString();
    request.updatedAt = event.block.timestamp;

    request.save();
  }
}
