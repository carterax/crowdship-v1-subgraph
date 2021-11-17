// Voted as VotedEvent,
//   VoteCancelled as VoteCancelledEvent,

//   RequestAdded as RequestAddedEvent,
//   RequestVoided as RequestVoidedEvent,

//   export function handleRequestAdded(event: RequestAddedEvent): void {
//     let campaign = Campaign.load(event.address.toHexString());

//     if (campaign !== null) {
//       let request = new Request(event.params.requestId.toString());

//       request.createdAt = event.block.timestamp;
//       request.updatedAt = new BigInt(0);
//       request.campaign = event.address.toHexString();
//       request.recipient = event.params.recipient;
//       request.complete = false;
//       request.value = event.params.value;
//       request.approvalCount = new BigInt(0);
//       request.abstainedCount = new BigInt(0);
//       request.againstCount = new BigInt(0);
//       request.duration = event.params.duration;
//       request.void = false;
//       request.votes = [];
//       request.owner = event.transaction.from.toHexString();

//       let allCampaignRequests = campaign.requests;
//       allCampaignRequests.push(event.params.requestId.toString());
//       campaign.requests = allCampaignRequests;
//       campaign.requestCount = campaign.requestCount.plus(new BigInt(1));

//       campaign.save();
//       request.save();
//     }
//   }

//   export function handleRequestVoided(event: RequestVoidedEvent): void {
//   let request = Request.load(event.params.requestId.toString());

//   if (request !== null) {
//     request.void = true;
//     request.voidedBy = event.transaction.from.toHexString();
//     request.updatedAt = event.block.timestamp;

//     request.save();
//   }
// }

// export function handleVoted(event: VotedEvent): void {
//   let vote = new Vote(event.params.voteId.toString());
//   let request = Request.load(event.params.requestId.toString());

//   if (request !== null) {
//     vote.campaign = event.address.toHexString();
//     vote.createdAt = event.block.timestamp;
//     vote.updatedAt = new BigInt(0);
//     vote.request = event.params.requestId.toString();
//     vote.owner = event.transaction.from.toHexString();
//     vote.support = new BigInt(event.params.support);
//     vote.voted = true;

//     let allRequestVotes = request.votes;
//     allRequestVotes.push(event.params.requestId.toString());
//     request.votes = allRequestVotes;

//     if (vote.support === new BigInt(0)) {
//       request.againstCount = request.againstCount.plus(new BigInt(1));
//     } else if (vote.support === new BigInt(1)) {
//       request.approvalCount = request.approvalCount.plus(new BigInt(1));
//     } else {
//       request.abstainedCount = request.abstainedCount.plus(new BigInt(1));
//     }

//     request.save();
//     vote.save();
//   }
// }

// export function handleVoteCancelled(event: VoteCancelledEvent): void {
//   let vote = Vote.load(event.params.voteId.toHexString());
//   let request = Request.load(event.params.requestId.toString());

//   if (vote !== null && request !== null) {
//     vote.voted = false;
//     vote.updatedAt = event.block.timestamp;

//     if (event.params.support === 0) {
//       request.againstCount = request.againstCount.minus(new BigInt(1));
//     } else if (event.params.support === 1) {
//       request.approvalCount = request.approvalCount.minus(new BigInt(1));
//     } else {
//       request.abstainedCount = request.abstainedCount.minus(new BigInt(1));
//     }

//     vote.save();
//     request.save();
//   }
// }
