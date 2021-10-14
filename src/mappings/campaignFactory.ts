import { FACTORY_ADDRESS } from './../utils/constants';
import {
  CampaignFactoryCreated as CampaignFactoryCreatedEvent,
  FactoryConfigUpdated as FactoryConfigUpdatedEvent,
  CategoryCommissionUpdated as CategoryCommissionUpdatedEvent,
  CampaignDefaultCommissionUpdated as CampaignDefaultCommissionUpdatedEvent,
  CampaignTransactionConfigUpdated as CampaignTransactionConfigUpdatedEvent,
  CampaignActiveToggle as CampaignActiveToggleEvent,
  CampaignApproval as CampaignApprovalEvent,
  CampaignCategoryChange as CampaignCategoryChangeEvent,
  CampaignDeployed as CampaignDeployedEvent,
  CampaignFeaturePaused as CampaignFeaturePausedEvent,
  CampaignFeatureUnpaused as CampaignFeatureUnpausedEvent,
  CampaignFeatured as CampaignFeaturedEvent,
  CategoryAdded as CategoryAddedEvent,
  CategoryModified as CategoryModifiedEvent,
  FeaturePackageAdded as FeaturePackageAddedEvent,
  FeaturePackageDestroyed as FeaturePackageDestroyedEvent,
  FeaturePackageModified as FeaturePackageModifiedEvent,
  Paused as PausedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  TokenAdded as TokenAddedEvent,
  TokenApproval as TokenApprovalEvent,
  TokenRemoved as TokenRemovedEvent,
  Unpaused as UnpausedEvent,
  UserAdded as UserAddedEvent,
  UserApproval as UserApprovalEvent,
  UserRemoved as UserRemovedEvent,
} from '../../generated/templates/CampaignFactory/CampaignFactory';
import { CampaignFactory, Campaign, User } from '../../generated/schema';

export function handleFactoryConfigUpdated(
  event: FactoryConfigUpdatedEvent
): void {
  // let factory = CampaignFactory.load();
}

export function handleCategoryCommissionUpdated(
  event: CategoryCommissionUpdatedEvent
): void {}

export function handleCampaignDefaultCommissionUpdated(
  event: CampaignDefaultCommissionUpdatedEvent
): void {}

export function handleCampaignTransactionConfigUpdated(
  event: CampaignTransactionConfigUpdatedEvent
): void {}

export function handleCampaignActiveToggle(
  event: CampaignActiveToggleEvent
): void {
  let campaign = Campaign.load(event.params.campaignId.toString());
  if (campaign !== null) {
    campaign.active = event.params.active;
    campaign.updatedAt = event.block.timestamp;
    campaign.save();
  }
}

export function handleCampaignApproval(event: CampaignApprovalEvent): void {
  let campaign = Campaign.load(event.params.campaignId.toString());
  if (campaign !== null) {
    campaign.approved = event.params.approval;
    campaign.updatedAt = event.block.timestamp;
    campaign.save();
  }
}

export function handleCampaignCategoryChange(
  event: CampaignCategoryChangeEvent
): void {
  let campaign = Campaign.load(event.params.campaignId.toString());
  if (campaign !== null) {
    campaign.category = event.params.newCategory.toString();
    campaign.updatedAt = event.block.timestamp;
    campaign.save();
  }
}

export function handleCampaignDeployed(event: CampaignDeployedEvent): void {
  let campaign = new Campaign(event.params.campaignId.toString());
  campaign.campaignFactory = event.params.factory.toString();
  campaign.campaignAddress = event.params.campaign;
  campaign.rewardsAddress = event.params.campaignRewards;
  campaign.owner = event.params.userId.toString();
  campaign.createdAt = event.block.timestamp;
  campaign.category = event.params.category.toString();
  campaign.active = false;
  campaign.approved = false;
  campaign.campaignState = 'COLLECTION';
  campaign.exists = true;

  campaign.save();
}

// export function handleCampaignFeaturePaused(
//   event: CampaignFeaturePausedEvent
// ): void {
//   let entity = new CampaignFeaturePaused(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.campaignId = event.params.campaignId;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleCampaignFeatureUnpaused(
//   event: CampaignFeatureUnpausedEvent
// ): void {
//   let entity = new CampaignFeatureUnpaused(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.campaignId = event.params.campaignId;
//   entity.timeLeft = event.params.timeLeft;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleCampaignFeatured(event: CampaignFeaturedEvent): void {
//   let entity = new CampaignFeatured(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.campaignId = event.params.campaignId;
//   entity.featurePackageId = event.params.featurePackageId;
//   entity.amount = event.params.amount;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleCategoryAdded(event: CategoryAddedEvent): void {
//   let entity = new CategoryAdded(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.categoryId = event.params.categoryId;
//   entity.active = event.params.active;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleCategoryModified(event: CategoryModifiedEvent): void {
//   let entity = new CategoryModified(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.categoryId = event.params.categoryId;
//   entity.active = event.params.active;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleFeaturePackageAdded(
//   event: FeaturePackageAddedEvent
// ): void {
//   let entity = new FeaturePackageAdded(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.packageId = event.params.packageId;
//   entity.cost = event.params.cost;
//   entity.time = event.params.time;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleFeaturePackageDestroyed(
//   event: FeaturePackageDestroyedEvent
// ): void {
//   let entity = new FeaturePackageDestroyed(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.packageId = event.params.packageId;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleFeaturePackageModified(
//   event: FeaturePackageModifiedEvent
// ): void {
//   let entity = new FeaturePackageModified(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.packageId = event.params.packageId;
//   entity.cost = event.params.cost;
//   entity.time = event.params.time;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handlePaused(event: PausedEvent): void {
//   let entity = new Paused(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.account = event.params.account;
//   entity.save();
// }

// export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
//   let entity = new RoleAdminChanged(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.role = event.params.role;
//   entity.previousAdminRole = event.params.previousAdminRole;
//   entity.newAdminRole = event.params.newAdminRole;
//   entity.save();
// }

// export function handleRoleGranted(event: RoleGrantedEvent): void {
//   let entity = new RoleGranted(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.role = event.params.role;
//   entity.account = event.params.account;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleRoleRevoked(event: RoleRevokedEvent): void {
//   let entity = new RoleRevoked(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.role = event.params.role;
//   entity.account = event.params.account;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleTokenAdded(event: TokenAddedEvent): void {
//   let entity = new TokenAdded(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.token = event.params.token;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleTokenApproval(event: TokenApprovalEvent): void {
//   let entity = new TokenApproval(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.token = event.params.token;
//   entity.state = event.params.state;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleTokenRemoved(event: TokenRemovedEvent): void {
//   let entity = new TokenRemoved(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.tokenId = event.params.tokenId;
//   entity.token = event.params.token;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleUnpaused(event: UnpausedEvent): void {
//   let entity = new Unpaused(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.account = event.params.account;
//   entity.save();
// }

export function handleUserAdded(event: UserAddedEvent): void {
  let user = new User(event.params.userId.toString());
  user.exists = true;
  user.joined = event.block.timestamp;
  user.verified = false;
  user.userAddress = event.params.sender;

  user.save();
}

// export function handleUserApproval(event: UserApprovalEvent): void {
//   let entity = new UserApproval(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.userId = event.params.userId;
//   entity.approval = event.params.approval;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleUserModified(event: UserModifiedEvent): void {
//   let entity = new UserModified(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.userId = event.params.userId;
//   entity.sender = event.params.sender;
//   entity.save();
// }

// export function handleUserRemoved(event: UserRemovedEvent): void {
//   let entity = new UserRemoved(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );
//   entity.userId = event.params.userId;
//   entity.sender = event.params.sender;
//   entity.save();
// }
