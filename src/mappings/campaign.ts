import {
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
  WithdrawalStateUpdated as WithdrawalStateUpdatedEvent,
} from '../../generated/templates/Campaign/Campaign';
import {
  Campaign,
  User,
  Contribution,
  RewardRecipient,
  Request,
  RequestFactory,
  Review,
  Report,
} from '../../generated/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ONE_BI } from '../utils/constants';

export function handleCampaignOwnershipTransferred(
  event: CampaignOwnershipTransferredEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let newOwner = User.load(
      `${Address.fromString(
        campaign.campaignFactory
      )}-user-${event.params.newOwner.toHexString()}`
    );

    if (newOwner !== null) {
      campaign.owner = newOwner.id;
      campaign.save();
    }
  }
}

export function handleCampaignSettingsUpdated(
  event: CampaignSettingsUpdatedEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    campaign.target = event.params.target;
    campaign.minimumContribution = event.params.minimumContribution;
    campaign.token = `${Address.fromString(
      campaign.campaignFactory
    )}-token-${event.params.token.toHexString()}`;
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
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let oldUser = User.load(
      campaign.campaignFactory +
        '-user-' +
        event.params.oldAddress.toHexString()
    );
    let newUser = User.load(
      campaign.campaignFactory +
        '-user-' +
        event.params.oldAddress.toHexString()
    );

    if (oldUser !== null && newUser !== null) {
      oldUser.transferredTo = `${Address.fromString(
        campaign.campaignFactory
      )}-user-${event.params.newAddress.toHexString()}`;
      newUser.transferredFrom = `${Address.fromString(
        campaign.campaignFactory
      )}-user-${event.params.oldAddress.toHexString()}`;

      oldUser.save();
      newUser.save();
    }
  }
}

export function handleContributionMade(event: ContributionMadeEvent): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let user = User.load(
      campaign.campaignFactory + '-user-' + event.transaction.from.toHexString()
    );

    if (user !== null) {
      let contribution = new Contribution(
        `${event.address.toHexString()}-contribution-${event.params.contributionId.toString()}`
      );

      contribution.owner = event.transaction.from.toHexString();
      contribution.campaign = event.address.toHexString();
      contribution.amount = event.params.amount;
      contribution.withReward = event.params.withReward;
      contribution.withdrawn = false;
      contribution.createdAt = event.block.timestamp;

      if (event.params.withReward) {
        let rewardRecipient = new RewardRecipient(
          campaign.rewardFactory +
            'rewardrecipient' +
            event.params.rewardRecipientId.toString()
        );

        rewardRecipient.owner = event.transaction.from.toHexString();
        rewardRecipient.createdAt = event.block.timestamp;
        rewardRecipient.updatedAt = new BigInt(0);
        rewardRecipient.reward = event.params.rewardId.toString();
        rewardRecipient.deliveredByCampaign = false;
        rewardRecipient.receivedByUser = false;

        contribution.reward = event.params.rewardRecipientId.toString();

        user.rewardCount = user.rewardCount.plus(ONE_BI);

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
      campaign.approversCount = campaign.approversCount.plus(ONE_BI);

      user.totalContributions = user.totalContributions.plus(
        event.params.amount
      );
      user.contributionCount = user.contributionCount.plus(ONE_BI);

      campaign.save();
      contribution.save();
      user.save();
    }
  }
}

export function handleContributionWithdrawn(
  event: ContributionWithdrawnEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let contribution = Contribution.load(
      campaign.campaignFactory +
        '-contribution-' +
        event.params.contributionId.toString()
    );

    if (contribution !== null) {
      contribution.withdrawn = true;

      contribution.save();
    }
  }
}

export function handleRequestComplete(event: RequestCompleteEvent): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    let requestFactory = RequestFactory.load(campaign.requestFactory);
    let request = Request.load(
      campaign.requestFactory + '-request-' + event.params.requestId.toString()
    );

    if (request !== null && requestFactory !== null) {
      request.complete = true;
      request.updatedAt = event.block.timestamp;

      requestFactory.finalizedRequestCount =
        requestFactory.finalizedRequestCount.plus(ONE_BI);

      requestFactory.save();
      request.save();
    }
  }
}

export function handleCampaignReviewed(event: CampaignReviewedEvent): void {
  let review = new Review(
    event.transaction.hash.toHex() + '-review-' + event.logIndex.toString()
  );
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    review.createdAt = event.block.timestamp;
    review.owner = event.transaction.from.toHexString();
    review.campaign = event.address.toHexString();

    campaign.reviewCount = campaign.reviewCount.plus(ONE_BI);

    campaign.save();
    review.save();
  }
}

export function handleCampaignReported(event: CampaignReportedEvent): void {
  let report = new Report(
    event.transaction.hash.toHex() + '-report-' + event.logIndex.toString()
  );
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    report.createdAt = event.block.timestamp;
    report.owner = event.transaction.from.toHexString();
    report.campaign = event.address.toHexString();

    campaign.reportCount = campaign.reportCount.plus(ONE_BI);

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

export function WithdrawalStateUpdated(
  event: WithdrawalStateUpdatedEvent
): void {
  let campaign = Campaign.load(event.address.toHexString());

  if (campaign !== null) {
    campaign.withdrawalsPaused = event.params.withdrawalState;

    campaign.save();
  }
}
