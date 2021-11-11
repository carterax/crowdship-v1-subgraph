import {
  CampaignOwnerSet as CampaignOwnerSetEvent,
  CampaignOwnershipTransferred as CampaignOwnershipTransferredEvent,
  CampaignSettingsUpdated as CampaignSettingsUpdatedEvent,
  CampaignDeadlineExtended as CampaignDeadlineExtendedEvent,
  CampaignUserDataTransferred as CampaignUserDataTransferredEvent,
  ContributionMade as ContributionMadeEvent,
  ContributionWithdrawn as ContributionWithdrawnEvent,
  RequestAdded as RequestAddedEvent,
  RequestVoided as RequestVoidedEvent,
  RequestComplete as RequestCompleteEvent,
  Voted as VotedEvent,
  VoteCancelled as VoteCancelledEvent,
  CampaignReviewed as CampaignReviewedEvent,
  CampaignReported as CampaignReportedEvent,
  CampaignStateChange as CampaignStateChangeEvent,
} from '../../generated/templates/Campaign/Campaign';
import {
  Campaign,
  User,
  Contribution,
  RewardRecipient,
  Request,
  Vote,
} from '../../generated/schema';
import { CampaignFactory as CampaignFactoryContract } from '../../generated/templates/CampaignFactory/CampaignFactory';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';

export function handleCampaignOwnershipTransferred(
  event: CampaignOwnershipTransferredEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let campaignFactoryContract = CampaignFactoryContract.bind(
      Address.fromString(campaign.campaignFactory)
    );
    let userId = campaignFactoryContract.userID(event.params.newOwner);

    campaign.owner = userId.toString();
    campaign.save();
  }
}

export function handleCampaignSettingsUpdated(
  event: CampaignSettingsUpdatedEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    campaign.target = event.params.target;
    campaign.minimumContribution = event.params.minimumContribution;
    campaign.token = event.params.token.toHexString();
    campaign.allowContributionAfterTargetIsMet =
      event.params.allowContributionAfterTargetIsMet;

    let previousDeadline = campaign.deadline;
    if (previousDeadline !== null) {
      campaign.deadline = previousDeadline.plus(event.params.duration);
    }

    campaign.save();
  }
}

export function handleCampaignDeadlineExtended(
  event: CampaignDeadlineExtendedEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let currentDeadline = campaign.deadline;

    campaign.deadline =
      currentDeadline !== null
        ? currentDeadline.plus(event.params.time)
        : campaign.deadline;

    campaign.save();
  }
}

export function handleCampaignUserDataTransferred(
  event: CampaignUserDataTransferredEvent
): void {
  let oldUser = User.load(event.params.oldAddress.toHexString());
  let newUser = User.load(event.params.oldAddress.toHexString());

  if (oldUser !== null && newUser !== null) {
    oldUser.transferredTo = event.params.newAddress;
    newUser.transferredFrom = event.params.oldAddress;
    oldUser.save();
    newUser.save();
  }
}

export function handleContributionMade(event: ContributionMadeEvent): void {
  let user = User.load(event.transaction.from.toHexString());
  let campaign = Campaign.load(event.address.toHexString());

  if (user !== null && campaign !== null) {
    let contribution = new Contribution(event.params.contributionId.toString());

    contribution.owner = event.transaction.from.toHexString();
    contribution.campaign = event.address.toHexString();
    contribution.amount = event.params.amount;
    contribution.withReward = event.params.withReward;
    contribution.withdrawn = false;
    contribution.createdAt = event.block.timestamp;

    if (event.params.withReward) {
      let rewardRecipient = new RewardRecipient(
        event.params.rewardRecipientId.toString()
      );

      rewardRecipient.campaign = event.address.toHexString();
      rewardRecipient.owner = event.transaction.from.toHexString();
      rewardRecipient.createdAt = event.block.timestamp;
      rewardRecipient.updatedAt = new BigInt(0);
      rewardRecipient.reward = event.params.rewardId.toString();
      rewardRecipient.deliveredByCampaign = false;
      rewardRecipient.receivedByUser = false;

      contribution.reward = event.params.rewardRecipientId.toString();

      rewardRecipient.save();
    }

    let previousTotalContribution = user.totalContributions;
    let previousTotalCampaignContribution = campaign.totalCampaignContribution;
    let previousCampaignBalance = campaign.campaignBalance;
    let previousTotalApprovers = campaign.totalApprovers;

    if (
      previousCampaignBalance !== null &&
      previousTotalCampaignContribution !== null &&
      previousTotalApprovers !== null &&
      previousTotalContribution !== null
    ) {
      campaign.campaignBalance = previousCampaignBalance.plus(
        event.params.amount
      );
      campaign.totalCampaignContribution = previousTotalCampaignContribution.plus(
        event.params.amount
      );
      campaign.totalApprovers = previousTotalApprovers.plus(new BigInt(1));
      user.totalContributions = previousTotalContribution.plus(
        event.params.amount
      );
    }

    campaign.save();
    contribution.save();
    user.save();
  }
}

export function handleContributionWithdrawn(
  event: ContributionWithdrawnEvent
): void {
  let contribution = Contribution.load(event.params.contributionId.toString());
  let campaign = Campaign.load(event.address.toHexString());

  if (contribution !== null && campaign !== null) {
    contribution.withdrawn = true;

    contribution.save();
  }
}

export function handleRequestAdded(event: RequestAddedEvent): void {
  let request = new Request(event.params.requestId.toString());

  request.createdAt = event.block.timestamp;
  request.updatedAt = new BigInt(0);
  request.campaign = event.address.toHexString();
  request.recipient = event.params.recipient;
  request.complete = false;
  request.value = event.params.value;
  request.totalApprovals = new BigInt(0);
  request.totalAbstained = new BigInt(0);
  request.totalAgainst = new BigInt(0);
  request.duration = event.params.duration;
  request.void = false;
  request.votes = [];
  request.owner = event.transaction.from.toHexString();

  request.save();
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

export function handleRequestComplete(event: RequestCompleteEvent): void {
  let request = Request.load(event.params.requestId.toString());
  let campaign = Campaign.load(event.address.toHexString());

  if (request !== null && campaign !== null) {
    request.complete = true;
    request.updatedAt = event.block.timestamp;

    let previousTotalFinalizedRequests = campaign.totalFinalizedRequests;
    if (previousTotalFinalizedRequests !== null)
      campaign.totalFinalizedRequests = previousTotalFinalizedRequests.plus(
        new BigInt(1)
      );

    campaign.save();
    request.save();
  }
}

export function handleVoted(event: VotedEvent): void {
  let vote = new Vote(event.params.voteId.toString());

  vote.campaign = event.address.toHexString();
  vote.createdAt = event.block.timestamp;
  vote.updatedAt = new BigInt(0);
  vote.request = event.params.requestId.toString();
  vote.owner = event.transaction.from.toHexString();
  vote.support = new BigInt(event.params.support);
  vote.voted = true;

  vote.save();
}

export function handleVoteCancelled(event: VoteCancelledEvent): void {
  let vote = Vote.load(event.params.voteId.toHexString());
  let request = Request.load(event.params.requestId.toString());

  if (vote !== null && request !== null) {
    vote.voted = false;
    vote.updatedAt = event.block.timestamp;

    if (event.params.support === 0) {
      let previousTotalAgainst = request.totalAgainst;

      if (
        previousTotalAgainst !== null &&
        previousTotalAgainst !== new BigInt(0)
      )
        request.totalAgainst = previousTotalAgainst.minus(new BigInt(1));
    }
  }
}

export function handleCampaignReviewed(event: CampaignReviewedEvent): void {}

export function handleCampaignReported(event: CampaignReportedEvent): void {}

export function handleCampaignStateChange(
  event: CampaignStateChangeEvent
): void {}
