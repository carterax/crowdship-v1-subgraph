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
  TokenRemoved as TokenRemovedEvent,
  Unpaused as UnpausedEvent,
  UserAdded as UserAddedEvent,
  UserApproval as UserApprovalEvent,
} from '../../generated/templates/CampaignFactory/CampaignFactory';
import {
  CampaignFactory,
  Campaign,
  User,
  Category,
  Token,
} from '../../generated/schema';
import { Campaign as CampaignTemplate } from '../../generated/templates';
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
    campaign.updatedAt = event.block.timestamp;

    campaign.save();
  }
}

export function handleCampaignApproval(event: CampaignApprovalEvent): void {
  let campaign = Campaign.load(event.params.campaign.toHexString());

  if (campaign !== null) {
    campaign.approved = event.params.approval;
    campaign.updatedAt = event.block.timestamp;

    campaign.save();
  }
}

export function handleCampaignCategoryChange(
  event: CampaignCategoryChangeEvent
): void {
  let campaign = Campaign.load(event.params.campaign.toHexString());

  if (campaign !== null) {
    campaign.category = event.params.newCategory.toString();
    campaign.updatedAt = event.block.timestamp;
    campaign.save();
  }
}

export function handleCampaignDeployed(event: CampaignDeployedEvent): void {
  let campaign = new Campaign(event.params.campaign.toHexString()) as Campaign;

  campaign.campaignFactory = event.params.factory.toHexString();
  campaign.campaignAddress = event.params.campaign;
  campaign.rewardsAddress = event.params.campaignRewards;
  campaign.owner = event.params.userId.toString();
  campaign.createdAt = event.block.timestamp;
  campaign.updatedAt = new BigInt(0);
  campaign.category = event.params.category.toString();
  campaign.withdrawalsPaused = false;
  campaign.active = false;
  campaign.approved = false;
  campaign.campaignState = 'COLLECTION';
  campaign.exists = true;

  campaign.save();
  CampaignTemplate.create(event.params.campaign);
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
  category.exists = true;

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
  token.exists = true;

  token.save();
}

export function handleTokenApproval(event: TokenApprovalEvent): void {
  let token = Token.load(event.params.token.toHexString());

  if (token !== null) {
    token.approved = event.params.state;

    token.save();
  }
}

export function handleTokenRemoved(event: TokenRemovedEvent): void {
  let token = Token.load(event.params.token.toHexString());

  if (token !== null) {
    token.approved = false;
    token.exists = false;

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
  let user = new User(event.params.sender.toHexString());

  user.campaignFactory = event.address.toHexString();
  user.exists = true;
  user.joined = event.block.timestamp;
  user.verified = false;
  user.userAddress = event.params.sender;

  user.save();
}

export function handleUserApproval(event: UserApprovalEvent): void {
  let user = User.load(event.params.user.toHexString());

  if (user !== null) {
    user.verified = event.params.approval;
    user.save();
  }
}
