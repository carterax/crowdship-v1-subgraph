import {
  CampaignOwnerSet as CampaignOwnerSetEvent,
  CampaignOwnershipTransferred as CampaignOwnershipTransferredEvent,
  CampaignSettingsUpdated as CampaignSettingsUpdatedEvent,
  CampaignDeadlineExtended as CampaignDeadlineExtendedEvent,
  CampaignUserDataTransferred as CampaignUserDataTransferredEvent,
  ContributionMade as ContributionMadeEvent,
  ContributionWithdrawn as ContributionWithdrawnEvent,
  RequestComplete as RequestCompleteEvent,
  CampaignReviewed as CampaignReviewedEvent,
  CampaignReported as CampaignReportedEvent,
  CampaignStateChange as CampaignStateChangeEvent,
} from '../../generated/templates/Campaign/Campaign';
import {
  Campaign,
  Token,
  User,
  Contribution,
  RewardRecipient,
  Request,
  Vote,
  Review,
  Report,
} from '../../generated/schema';
import { CampaignFactory as CampaignFactoryContract } from '../../generated/templates/CampaignFactory/CampaignFactory';
import { Address, BigInt } from '@graphprotocol/graph-ts';

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
    campaign.deadline = campaign.deadline.plus(event.params.duration);

    campaign.save();
  }
}

export function handleCampaignDeadlineExtended(
  event: CampaignDeadlineExtendedEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    campaign.deadline = campaign.deadline.plus(event.params.time);

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

      rewardRecipient.owner = event.transaction.from.toHexString();
      rewardRecipient.createdAt = event.block.timestamp;
      rewardRecipient.updatedAt = new BigInt(0);
      rewardRecipient.reward = event.params.rewardId.toString();
      rewardRecipient.deliveredByCampaign = false;
      rewardRecipient.receivedByUser = false;

      contribution.reward = event.params.rewardRecipientId.toString();

      let allUserRewards = user.rewards;
      allUserRewards.push(event.params.rewardRecipientId.toString());
      user.rewards = allUserRewards;
      user.rewardCount = user.rewardCount.plus(new BigInt(1));

      rewardRecipient.save();
    }

    let allCampaignContributions = campaign.contributions;
    allCampaignContributions.push(event.params.contributionId.toString());
    campaign.contributions = allCampaignContributions;

    campaign.campaignBalance = campaign.campaignBalance.plus(
      event.params.amount
    );
    campaign.totalCampaignContribution =
      campaign.totalCampaignContribution.plus(event.params.amount);
    campaign.approversCount = campaign.approversCount.plus(new BigInt(1));

    let allUserContributions = user.contributions;
    allUserContributions.push(event.params.contributionId.toString());
    user.contributions = allUserContributions;
    user.totalContributions = user.totalContributions.plus(event.params.amount);
    user.contributionCount = user.contributionCount.plus(new BigInt(1));

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

export function handleRequestComplete(event: RequestCompleteEvent): void {
  let request = Request.load(event.params.requestId.toString());
  let campaign = Campaign.load(event.address.toHexString());

  if (request !== null && campaign !== null) {
    request.complete = true;
    request.updatedAt = event.block.timestamp;

    campaign.save();
    request.save();
  }
}

export function handleCampaignReviewed(event: CampaignReviewedEvent): void {
  let review = new Review(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    review.createdAt = event.block.timestamp;
    review.owner = event.transaction.from.toHexString();
    review.campaign = event.address.toHexString();

    let allCampaignReviews = campaign.reviews;
    allCampaignReviews.push(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );

    campaign.reviews = allCampaignReviews;
    campaign.reviewCount = campaign.reviewCount.plus(new BigInt(1));

    campaign.save();
    review.save();
  }
}

export function handleCampaignReported(event: CampaignReportedEvent): void {
  let report = new Report(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );
  let campaign = new Campaign(event.address.toHexString());

  if (campaign !== null) {
    report.createdAt = event.block.timestamp;
    report.owner = event.transaction.from.toHexString();
    report.campaign = event.address.toHexString();

    let allCampaignReports = campaign.reports;
    allCampaignReports.push(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
    campaign.reports = allCampaignReports;
    campaign.reportCount = campaign.reportCount.plus(new BigInt(1));

    campaign.save();
    report.save();
  }
}

export function handleCampaignStateChange(
  event: CampaignStateChangeEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    if (event.params.state == 0) {
      campaign.campaignState = 'COLLECTION';
    }

    if (event.params.state == 1) {
      campaign.campaignState = 'LIVE';
    }

    if (event.params.state == 2) {
      campaign.campaignState = 'REVIEW';
    }

    if (event.params.state == 3) {
      campaign.campaignState = 'COMPLETE';
    }

    if (event.params.state == 4) {
      campaign.campaignState = 'UNSUCCESSFUL';
    }

    campaign.save();
  }
}
