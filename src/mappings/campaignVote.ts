import {
  Voted as VotedEvent,
  VoteCancelled as VoteCancelledEvent,
} from '../../generated/templates/CampaignVote/CampaignVote';
import { Campaign, VoteFactory, Vote, Request } from '../../generated/schema';
import { BigInt, Address } from '@graphprotocol/graph-ts';
import { ONE_BI, ZERO_BI } from '../utils/constants';

export function handleVoted(event: VotedEvent): void {
  let voteFactory = VoteFactory.load(event.address.toHexString());
  let vote = new Vote(
    `${event.address.toHexString()}-vote-${event.params.voteId.toString()}`
  );

  if (voteFactory !== null) {
    let campaign = Campaign.load(voteFactory.campaign);

    if (campaign !== null) {
      let request = Request.load(
        `${
          campaign.requestFactory
        }-request-${event.params.requestId.toString()}`
      );

      if (request !== null) {
        vote.voteFactory = event.address.toHexString();
        vote.createdAt = event.block.timestamp;
        vote.updatedAt = ZERO_BI;
        vote.request = event.params.requestId.toString();
        vote.owner = `${Address.fromString(
          voteFactory.campaign
        )}-user-${event.transaction.from.toHexString()}`;
        vote.support = new BigInt(event.params.support);
        vote.voted = true;

        if (vote.support === ZERO_BI) {
          request.againstCount = request.againstCount.plus(ONE_BI);
        } else if (vote.support === ONE_BI) {
          request.approvalCount = request.approvalCount.plus(ONE_BI);
        } else {
          request.abstainedCount = request.abstainedCount.plus(ONE_BI);
        }

        vote.save();
        request.save();
        voteFactory.save();
      }
    }
  }
}

export function handleVoteCancelled(event: VoteCancelledEvent): void {
  let voteFactory = VoteFactory.load(event.address.toHexString());
  let vote = Vote.load(
    `${event.address.toHexString()}-vote-${event.params.voteId.toString()}`
  );

  if (voteFactory !== null) {
    let campaign = Campaign.load(voteFactory.campaign);

    if (campaign !== null) {
      let request = Request.load(
        `${
          campaign.requestFactory
        }-request-${event.params.requestId.toString()}`
      );

      if (vote !== null && request !== null) {
        vote.voted = false;
        vote.updatedAt = event.block.timestamp;

        if (event.params.support === 0) {
          request.againstCount = request.againstCount.minus(ONE_BI);
        } else if (event.params.support === 1) {
          request.approvalCount = request.approvalCount.minus(ONE_BI);
        } else {
          request.abstainedCount = request.abstainedCount.minus(ONE_BI);
        }

        vote.save();
        request.save();
      }
    }
  }
}
