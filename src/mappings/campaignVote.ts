import {
  Voted as VotedEvent,
  VoteCancelled as VoteCancelledEvent,
} from '../../generated/templates/CampaignVote/CampaignVote';
import { VoteFactory, Vote, Request } from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleVoted(event: VotedEvent): void {
  let voteFactory = VoteFactory.load(event.address.toHexString());
  let vote = new Vote(event.params.voteId.toString());
  let request = Request.load(event.params.requestId.toString());

  if (voteFactory !== null && request !== null) {
    vote.voteFactory = event.address.toHexString();
    vote.createdAt = event.block.timestamp;
    vote.updatedAt = new BigInt(0);
    vote.request = event.params.requestId.toString();
    vote.owner = event.transaction.from.toHexString();
    vote.support = new BigInt(event.params.support);
    vote.voted = true;

    let allRequestVotes = request.votes;
    allRequestVotes.push(event.params.requestId.toString());
    request.votes = allRequestVotes;

    if (vote.support === new BigInt(0)) {
      request.againstCount = request.againstCount.plus(new BigInt(1));
    } else if (vote.support === new BigInt(1)) {
      request.approvalCount = request.approvalCount.plus(new BigInt(1));
    } else {
      request.abstainedCount = request.abstainedCount.plus(new BigInt(1));
    }

    let allFactoryVotes = voteFactory.votes;
    allFactoryVotes.push(event.params.voteId.toString());
    voteFactory.votes = allFactoryVotes;

    vote.save();
    request.save();
    voteFactory.save();
  }
}

export function handleVoteCancelled(event: VoteCancelledEvent): void {
  let vote = Vote.load(event.params.voteId.toString());
  let request = Request.load(event.params.requestId.toString());

  if (vote !== null && request !== null) {
    vote.voted = false;
    vote.updatedAt = event.block.timestamp;

    if (event.params.support === 0) {
      request.againstCount = request.againstCount.minus(new BigInt(1));
    } else if (event.params.support === 1) {
      request.approvalCount = request.approvalCount.minus(new BigInt(1));
    } else {
      request.abstainedCount = request.abstainedCount.minus(new BigInt(1));
    }

    vote.save();
    request.save();
  }
}
