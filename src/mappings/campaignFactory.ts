import {
  CampaignImplementationUpdated as CampaignImplementationUpdatedEvent,
  CampaignRewardImplementationUpdated as CampaignRewardImplementationUpdatedEvent,
  CampaignRequestImplementationUpdated as CampaignRequestImplementationUpdatedEvent,
  CampaignVoteImplementationUpdated as CampaignVoteImplementationUpdatedEvent,
  CategoryCommissionUpdated as CategoryCommissionUpdatedEvent,
  CampaignDefaultCommissionUpdated as CampaignDefaultCommissionUpdatedEvent,
  CampaignTransactionConfigUpdated as CampaignTransactionConfigUpdatedEvent,
  CampaignApproval as CampaignApprovalEvent,
  CampaignActivation as CampaignActivationEvent,
  CampaignCategoryChange as CampaignCategoryChangeEvent,
  CampaignDeployed as CampaignDeployedEvent,
  CategoryAdded as CategoryAddedEvent,
  CategoryModified as CategoryModifiedEvent,
  Paused as PausedEvent,
  TokenAdded as TokenAddedEvent,
  TokenApproval as TokenApprovalEvent,
  Unpaused as UnpausedEvent,
  UserAdded as UserAddedEvent,
  UserApproval as UserApprovalEvent,
} from '../../generated/templates/CampaignFactory/CampaignFactory';
import {
  CampaignFactory,
  Campaign,
  RewardFactory,
  RequestFactory,
  VoteFactory,
  User,
  Category,
  Token,
} from '../../generated/schema';
import { CampaignFactory as CampaignFactoryContract } from '../../generated/templates/CampaignFactory/CampaignFactory';
import { Campaign as CampaignContract } from '../../generated/templates/Campaign/Campaign';
import {
  Campaign as CampaignTemplate,
  CampaignReward as CampaignRewardTemplate,
  CampaignRequest as CampaignRequestTemplate,
  CampaignVote as CampaignVoteTemplate,
} from '../../generated/templates';

import { ONE_BI, ZERO_BI } from '../utils/constants';

export function handleCampaignImplementationUpdated(
  event: CampaignImplementationUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.campaignImplementation =
      event.params.campaignImplementation;

    campaignFactory.save();
  }
}

export function handleCampaignRewardImplementationUpdated(
  event: CampaignRewardImplementationUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.campaignRewardImplementation =
      event.params.campaignRewardImplementation;

    campaignFactory.save();
  }
}

export function handleCampaignRequestImplementationUpdated(
  event: CampaignRequestImplementationUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.campaignRequestImplementation =
      event.params.campaignRequestImplementation;

    campaignFactory.save();
  }
}

export function handleCampaignVoteImplementationUpdated(
  event: CampaignVoteImplementationUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.campaignVoteImplementation =
      event.params.campaignVoteImplementation;

    campaignFactory.save();
  }
}

export function handleCategoryCommissionUpdated(
  event: CategoryCommissionUpdatedEvent
): void {
  let category = Category.load(
    `${event.address}-category-${event.params.categoryId.toHexString()}`
  );

  if (category !== null) {
    category.commission = event.params.commission;
    category.updatedAt = event.block.timestamp;
    category.save();
  }
}

export function handleCampaignDefaultCommissionUpdated(
  event: CampaignDefaultCommissionUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.defaultCommission = event.params.commission;
    campaignFactory.save();
  }
}

export function handleCampaignTransactionConfigUpdated(
  event: CampaignTransactionConfigUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    if (event.params.prop === 'deadlineStrikesAllowed')
      campaignFactory.deadlineStrikesAllowed = event.params.value;

    if (event.params.prop === 'minimumContributionAllowed')
      campaignFactory.minimumContributionAllowed = event.params.value;

    if (event.params.prop === 'maximumContributionAllowed')
      campaignFactory.maximumContributionAllowed = event.params.value;

    if (event.params.prop === 'minimumRequestAmountAllowed')
      campaignFactory.minimumRequestAmountAllowed = event.params.value;

    if (event.params.prop === 'maximumRequestAmountAllowed')
      campaignFactory.maximumRequestAmountAllowed = event.params.value;

    if (event.params.prop === 'minimumCampaignTarget')
      campaignFactory.minimumCampaignTarget = event.params.value;

    if (event.params.prop === 'maximumCampaignTarget')
      campaignFactory.maximumCampaignTarget = event.params.value;

    if (event.params.prop === 'maxDeadlineExtension')
      campaignFactory.maxDeadlineExtension = event.params.value;

    if (event.params.prop === 'minDeadlineExtension')
      campaignFactory.minDeadlineExtension = event.params.value;

    if (event.params.prop === 'minRequestDuration')
      campaignFactory.minRequestDuration = event.params.value;

    if (event.params.prop === 'maxRequestDuration')
      campaignFactory.maxRequestDuration = event.params.value;

    if (event.params.prop === 'reviewThresholdMark')
      campaignFactory.reviewThresholdMark = event.params.value;

    if (event.params.prop === 'requestFinalizationThreshold')
      campaignFactory.requestFinalizationThreshold = event.params.value;

    if (event.params.prop === 'reportThresholdMark')
      campaignFactory.reportThresholdMark = event.params.value;

    campaignFactory.save();
  }
}

export function handleCampaignApproval(event: CampaignApprovalEvent): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    let campaignFactoryContract = CampaignFactoryContract.bind(event.address);
    let campaignContract = CampaignContract.bind(event.params.campaign);

    let campaignInfo = campaignFactoryContract.campaigns(event.address);

    let campaignRewards = campaignContract.campaignRewardContract(),
      campaignRequests = campaignContract.campaignRequestContract(),
      campaignVotes = campaignContract.campaignVoteContract();

    let campaign = new Campaign(
      event.params.campaign.toHexString()
    ) as Campaign;
    let rewardFactory = new RewardFactory(campaignRewards.toHexString());
    let campaignRequestFactory = new RequestFactory(
      campaignRequests.toHexString()
    );
    let campaignVoteFactory = new VoteFactory(campaignVotes.toHexString());

    campaign.campaignFactory = campaignContract
      .campaignFactoryContract()
      .toHexString();
    campaign.owner = event.transaction.from.toHexString();
    campaign.createdAt = event.block.timestamp;
    campaign.category = campaignInfo.value4.toString();
    campaign.approved = true;
    campaign.withdrawalsPaused = campaignContract.withdrawalsPaused();
    campaign.deadline = campaignContract.deadline();

    if (campaignContract.campaignState() === 0) {
      campaign.campaignState = 'COLLECTION';
    } else if (campaignContract.campaignState() === 1) {
      campaign.campaignState = 'LIVE';
    } else if (campaignContract.campaignState() === 2) {
      campaign.campaignState = 'REVIEW';
    } else if (campaignContract.campaignState() === 3) {
      campaign.campaignState = 'COMPLETE';
    } else {
      campaign.campaignState = 'UNSUCCESSFUL';
    }

    campaign.totalCampaignContribution =
      campaignContract.totalCampaignContribution();
    campaign.campaignBalance = campaignContract.campaignBalance();
    campaign.deadlineExtensionThreshold = campaignContract.deadlineSetTimes();
    campaign.deadlineExtensionThresholdCount = ZERO_BI;
    campaign.approversCount = campaignContract.approversCount();
    campaign.reportCount = campaignContract.reportCount();
    campaign.reviewCount = campaignContract.reviewCount();

    campaign.rewardFactory = campaignRewards.toHexString();
    campaign.requestFactory = campaignRequests.toHexString();
    campaign.voteFactory = campaignVotes.toHexString();

    rewardFactory.campaign = event.params.campaign.toHexString();
    rewardFactory.createdAt = event.block.timestamp;
    rewardFactory.rewardCount = ZERO_BI;

    campaignRequestFactory.campaign = event.params.campaign.toHexString();
    campaignRequestFactory.createdAt = event.block.timestamp;
    campaignRequestFactory.requestCount = ZERO_BI;
    campaignRequestFactory.finalizedRequestCount = ZERO_BI;

    campaignVoteFactory.campaign = event.params.campaign.toHexString();
    campaignVoteFactory.createdAt = event.block.timestamp;

    campaignFactory.campaignCount = campaignFactory.campaignCount.plus(ONE_BI);

    rewardFactory.save();
    campaignRequestFactory.save();
    campaignVoteFactory.save();
    campaign.save();
    campaignFactory.save();

    CampaignTemplate.create(event.params.campaign);
    CampaignRewardTemplate.create(campaignRewards);
    CampaignRequestTemplate.create(campaignRequests);
    CampaignVoteTemplate.create(campaignVotes);
  }
}

export function handlehandleCampaignActivation(
  event: CampaignActivationEvent
): void {
  let campaign = Campaign.load(event.params.campaign.toHexString());

  if (campaign !== null) {
    campaign.active = true;

    campaign.save();
  }
}

export function handleCampaignCategoryChange(
  event: CampaignCategoryChangeEvent
): void {
  let campaign = Campaign.load(event.params.campaign.toHexString());

  if (campaign !== null) {
    campaign.category = event.params.newCategory.toString();

    campaign.save();
  }
}

export function handleCampaignDeployed(event: CampaignDeployedEvent): void {
  if (event.params.approved) {
    let campaignFactory = CampaignFactory.load(event.address.toHexString());

    if (campaignFactory !== null) {
      let campaign = new Campaign(
        event.params.campaign.toHexString()
      ) as Campaign;
      let rewardFactory = new RewardFactory(
        event.params.campaignRewards.toHexString()
      );
      let campaignRequestFactory = new RequestFactory(
        event.params.campaignRequests.toHexString()
      );
      let campaignVoteFactory = new VoteFactory(
        event.params.campaignVotes.toHexString()
      );

      campaign.campaignFactory = event.params.factory.toHexString();
      campaign.owner = event.transaction.from.toHexString();
      campaign.createdAt = event.block.timestamp;
      campaign.category = event.params.category.toString();
      campaign.approved = event.params.approved;
      campaign.withdrawalsPaused = false;
      campaign.deadline = ZERO_BI;
      campaign.campaignState = 'COLLECTION';
      campaign.totalCampaignContribution = ZERO_BI;
      campaign.campaignBalance = ZERO_BI;
      campaign.deadlineExtensionThreshold = ZERO_BI;
      campaign.deadlineExtensionThresholdCount = ZERO_BI;
      campaign.approversCount = ZERO_BI;
      campaign.reportCount = ZERO_BI;
      campaign.reviewCount = ZERO_BI;
      campaign.rewardFactory = event.params.campaignRewards.toHexString();
      campaign.requestFactory = event.params.campaignRequests.toHexString();
      campaign.voteFactory = event.params.campaignVotes.toHexString();

      rewardFactory.campaign = event.params.campaign.toHexString();
      rewardFactory.createdAt = event.block.timestamp;
      rewardFactory.rewardCount = ZERO_BI;

      campaignRequestFactory.campaign = event.params.campaign.toHexString();
      campaignRequestFactory.createdAt = event.block.timestamp;
      campaignRequestFactory.requestCount = ZERO_BI;
      campaignRequestFactory.finalizedRequestCount = ZERO_BI;

      campaignVoteFactory.campaign = event.params.campaign.toHexString();
      campaignVoteFactory.createdAt = event.block.timestamp;

      campaignFactory.campaignCount =
        campaignFactory.campaignCount.plus(ONE_BI);

      rewardFactory.save();
      campaignRequestFactory.save();
      campaignVoteFactory.save();
      campaign.save();
      campaignFactory.save();

      CampaignTemplate.create(event.params.campaign);
      CampaignRewardTemplate.create(event.params.campaignRewards);
      CampaignRequestTemplate.create(event.params.campaignRequests);
      CampaignVoteTemplate.create(event.params.campaignVotes);
    }
  }
}

export function handleCategoryAdded(event: CategoryAddedEvent): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    let category = new Category(
      `${event.address.toHexString()}-category-${event.params.categoryId.toString()}`
    );
    category.title = event.params.title;
    category.campaignFactory = event.address.toHexString();
    category.totalCampaign = ZERO_BI;
    category.commission = ZERO_BI;
    category.createdAt = event.block.timestamp;
    category.updatedAt = ZERO_BI;
    category.active = event.params.active;

    campaignFactory.categoriesCount =
      campaignFactory.categoriesCount.plus(ONE_BI);

    category.save();
    campaignFactory.save();
  }
}

export function handleCategoryModified(event: CategoryModifiedEvent): void {
  let category = Category.load(
    `${event.address.toHexString()}-category-${event.params.categoryId.toString()}`
  );

  if (category !== null) {
    category.updatedAt = event.block.timestamp;
    category.active = event.params.active;
    category.title = event.params.title;

    category.save();
  }
}

export function handlePaused(event: PausedEvent): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.paused = true;

    campaignFactory.save();
  }
}

export function handleTokenAdded(event: TokenAddedEvent): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    let token = new Token(
      `${event.address.toHexString()}-token-${event.params.token.toHexString()}`
    );

    token.campaignFactory = event.address.toHexString();
    token.createdAt = event.block.timestamp;
    token.approved = event.params.approval;

    campaignFactory.tokenCount = campaignFactory.tokenCount.plus(ONE_BI);

    token.save();
    campaignFactory.save();
  }
}

export function handleTokenApproval(event: TokenApprovalEvent): void {
  let token = Token.load(
    `${event.address.toHexString()}-token-${event.params.token.toHexString()}`
  );

  if (token !== null) {
    token.approved = event.params.state;

    token.save();
  }
}

export function handleUnpaused(event: UnpausedEvent): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.paused = false;

    campaignFactory.save();
  }
}

export function handleUserAdded(event: UserAddedEvent): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    let user = new User(
      `${event.address.toHexString()}-user-${event.transaction.from.toHexString()}`
    );

    user.campaignFactory = event.address.toHexString();
    user.joined = event.block.timestamp;
    user.verified = false;
    user.userAddress = event.transaction.from;
    user.totalContributions = ZERO_BI;
    user.totalWithdrawals = ZERO_BI;
    user.contributionCount = ZERO_BI;

    campaignFactory.userCount = campaignFactory.userCount.plus(ONE_BI);

    user.save();
    campaignFactory.save();
  }
}

export function handleUserApproval(event: UserApprovalEvent): void {
  let user = User.load(
    `${event.address.toHexString()}-user-${event.params.user.toHexString()}`
  );

  if (user !== null) {
    user.verified = event.params.approval;
    user.save();
  }
}
