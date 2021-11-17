import {
  FactoryConfigUpdated as FactoryConfigUpdatedEvent,
  CategoryCommissionUpdated as CategoryCommissionUpdatedEvent,
  CampaignDefaultCommissionUpdated as CampaignDefaultCommissionUpdatedEvent,
  CampaignTransactionConfigUpdated as CampaignTransactionConfigUpdatedEvent,
  CampaignActiveToggle as CampaignActiveToggleEvent,
  CampaignApproval as CampaignApprovalEvent,
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
  Request,
  Vote,
} from '../../generated/schema';
import {
  Campaign as CampaignTemplate,
  CampaignReward as CampaignRewardTemplate,
  CampaignRequest as CampaignRequestTemplate,
  CampaignVote as CampaignVoteTemplate,
} from '../../generated/templates';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleFactoryConfigUpdated(
  event: FactoryConfigUpdatedEvent
): void {
  let campaignFactory = CampaignFactory.load(event.address.toHexString());

  if (campaignFactory !== null) {
    campaignFactory.campaignImplementation =
      event.params.campaignImplementation;
    campaignFactory.campaignRewardsImplementation =
      event.params.campaignRewardsImplementation;
    campaignFactory.factoryWallet = event.params.factoryWallet;

    campaignFactory.save();
  }
}

export function handleCategoryCommissionUpdated(
  event: CategoryCommissionUpdatedEvent
): void {
  let category = Category.load(event.params.categoryId.toHexString());

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

export function handleCampaignActiveToggle(
  event: CampaignActiveToggleEvent
): void {
  let campaign = Campaign.load(event.params.campaign.toHexString());

  if (campaign !== null) {
    campaign.active = event.params.active;

    campaign.save();
  }
}

export function handleCampaignApproval(event: CampaignApprovalEvent): void {
  let campaign = Campaign.load(event.params.campaign.toHexString());

  if (campaign !== null) {
    campaign.approved = event.params.approval;

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
    campaign.active = false;
    campaign.approved = false;
    campaign.withdrawalsPaused = false;
    campaign.deadline = new BigInt(0);
    campaign.campaignState = 'COLLECTION';
    campaign.totalCampaignContribution = new BigInt(0);
    campaign.campaignBalance = new BigInt(0);
    campaign.deadlineExtensionThreshold = new BigInt(0);
    campaign.deadlineExtensionThresholdCount = new BigInt(0);
    campaign.approversCount = new BigInt(0);
    campaign.reportCount = new BigInt(0);
    campaign.reviewCount = new BigInt(0);
    campaign.reports = [];
    campaign.reviews = [];
    campaign.contributions = [];

    campaign.rewardFactory = event.params.campaignRewards.toHexString();
    campaign.requestFactory = event.params.campaignRequests.toHexString();
    campaign.voteFactory = event.params.campaignVotes.toHexString();

    rewardFactory.campaign = event.params.campaign.toHexString();
    rewardFactory.createdAt = event.block.timestamp;
    rewardFactory.rewardCount = new BigInt(0);
    rewardFactory.rewards = [];

    campaignRequestFactory.campaign = event.params.campaign.toHexString();
    campaignRequestFactory.createdAt = event.block.timestamp;
    campaignRequestFactory.requestCount = new BigInt(0);
    campaignRequestFactory.finalizedRequestCount = new BigInt(0);
    campaignRequestFactory.requests = [];

    campaignVoteFactory.campaign = event.params.campaign.toHexString();
    campaignVoteFactory.createdAt = event.block.timestamp;
    campaignVoteFactory.votes = [];

    rewardFactory.save();
    campaignRequestFactory.save();
    campaignVoteFactory.save();
    campaign.save();

    CampaignTemplate.create(event.params.campaign);
    CampaignRewardTemplate.create(event.params.campaignRewards);
    CampaignRequestTemplate.create(event.params.campaignRequests);
    CampaignVoteTemplate.create(event.params.campaignVotes);
  }
}

export function handleCategoryAdded(event: CategoryAddedEvent): void {
  let category = new Category(event.params.categoryId.toString());

  category.campaignFactory = event.address.toHexString();
  category.campaigns = [];
  category.totalCampaign = new BigInt(0);
  category.commission = new BigInt(0);
  category.createdAt = event.block.timestamp;
  category.updatedAt = new BigInt(0);
  category.active = event.params.active;

  category.save();
}

export function handleCategoryModified(event: CategoryModifiedEvent): void {
  let category = Category.load(event.params.categoryId.toString());

  if (category !== null) {
    category.updatedAt = event.block.timestamp;
    category.active = event.params.active;

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
  let token = new Token(event.params.token.toHexString());

  token.campaignFactory = event.address.toHexString();
  token.createdAt = event.block.timestamp;
  token.approved = false;

  token.save();
}

export function handleTokenApproval(event: TokenApprovalEvent): void {
  let token = Token.load(event.params.token.toHexString());

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
  let user = new User(event.transaction.from.toHexString());

  user.campaignFactory = event.address.toHexString();
  user.joined = event.block.timestamp;
  user.verified = false;
  user.userAddress = event.transaction.from;
  user.totalContributions = new BigInt(0);
  user.totalWithdrawals = new BigInt(0);
  user.contributions = [];
  user.contributionCount = new BigInt(0);
  user.rewards = [];
  user.votes = [];
  user.requests = [];
  user.reports = [];
  user.reviews = [];

  user.save();
}

export function handleUserApproval(event: UserApprovalEvent): void {
  let user = User.load(event.params.user.toHexString());

  if (user !== null) {
    user.verified = event.params.approval;
    user.save();
  }
}
