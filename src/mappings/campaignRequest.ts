import {
  RequestAdded as RequestAddedEvent,
  RequestVoided as RequestVoidedEvent,
} from '../../generated/templates/CampaignRequest/CampaignRequest';
import { RequestFactory, Request, Campaign } from '../../generated/schema';
import { Address } from '@graphprotocol/graph-ts';

import { ONE_BI, ZERO_BI } from '../utils/constants';

export function handleRequestAdded(event: RequestAddedEvent): void {
  let requestFactory = RequestFactory.load(event.address.toHexString());
  let request = new Request(
    `${event.address.toHexString()}-request-${event.params.requestId.toString()}`
  );

  if (requestFactory !== null) {
    let campaign = Campaign.load(
      Address.fromString(requestFactory.campaign).toHexString()
    );

    if (campaign !== null) {
      request.createdAt = event.block.timestamp;
      request.updatedAt = ZERO_BI;
      request.requestFactory = event.address.toHexString();
      request.recipient = event.params.recipient;
      request.complete = false;
      request.value = event.params.value;
      request.approvalCount = ZERO_BI;
      request.againstCount = ZERO_BI;
      request.abstainedCount = ZERO_BI;
      request.duration = event.params.duration;
      request.void = false;
      request.owner = `${Address.fromString(
        campaign.campaignFactory
      )}-user-${event.transaction.from.toHexString()}`;
      request.hash = event.params.hashedRequest;

      requestFactory.requestCount = requestFactory.requestCount.plus(ONE_BI);

      request.save();
      requestFactory.save();
    }
  }
}

export function handleRequestVoided(event: RequestVoidedEvent): void {
  let request = Request.load(
    `${event.address.toHexString()}-request-${event.params.requestId.toString()}`
  );
  let requestFactory = RequestFactory.load(event.address.toHexString());

  if (requestFactory !== null) {
    let campaign = Campaign.load(
      Address.fromString(requestFactory.campaign).toHexString()
    );

    if (request !== null && campaign !== null) {
      request.void = true;
      request.voidedBy = `${Address.fromString(
        campaign.campaignFactory
      )}-user-${event.transaction.from.toHexString()}`;
      request.updatedAt = event.block.timestamp;

      request.save();
    }
  }
}
