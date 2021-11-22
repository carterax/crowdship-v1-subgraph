import {
  RewardCreated as RewardCreatedEvent,
  RewardModified as RewardModifiedEvent,
  RewardStockIncreased as RewardStockIncreasedEvent,
  RewardDestroyed as RewardDestroyedEvent,
  RewardRecipientAdded as RewardRecipientAddedEvent,
  RewarderApproval as RewarderApprovalEvent,
  RewardRecipientApproval as RewardRecipientApprovalEvent,
} from '../../generated/templates/CampaignReward/CampaignReward';
import { Reward, RewardFactory, RewardRecipient } from '../../generated/schema';

import { ONE_BI, ZERO_BI } from '../utils/constants';

export function handleRewardCreated(event: RewardCreatedEvent): void {
  let reward = new Reward(
    `${event.address.toHexString()}-reward-${event.params.rewardId.toString()}`
  );
  let rewardFactory = RewardFactory.load(event.address.toHexString());

  if (rewardFactory !== null) {
    reward.createdAt = event.block.timestamp;
    reward.amount = event.params.value;
    reward.stock = event.params.stock;
    reward.deliveryDate = event.params.deliveryDate;
    reward.active = event.params.active;
    reward.rewardFactory = event.address.toHexString();
    reward.exists = true;

    let currentRewardCount = rewardFactory.rewardCount;
    if (rewardFactory.rewardCount !== null) {
      currentRewardCount = rewardFactory.rewardCount.plus(ONE_BI);
      rewardFactory.rewardCount = currentRewardCount;
    }

    reward.save();
    rewardFactory.save();
  }
}

export function handleRewardModified(event: RewardModifiedEvent): void {
  let reward = Reward.load(
    `${event.address.toHexString()}-reward-${event.params.rewardId.toString()}`
  );

  if (reward !== null) {
    reward.amount = event.params.value;
    reward.stock = event.params.stock;
    reward.deliveryDate = event.params.deliveryDate;
    reward.active = event.params.active;

    reward.save();
  }
}

export function handleRewardStockIncreased(
  event: RewardStockIncreasedEvent
): void {
  let reward = Reward.load(
    `${event.address.toHexString()}-reward-${event.params.rewardId.toString()}`
  );

  if (reward !== null) {
    reward.stock = reward.stock.plus(event.params.count);

    reward.save();
  }
}

export function handleRewardDestroyed(event: RewardDestroyedEvent): void {
  let rewardFactory = RewardFactory.load(event.address.toHexString());
  let reward = Reward.load(
    `${event.address.toHexString()}-reward-${event.params.rewardId.toString()}`
  );

  if (reward !== null && rewardFactory !== null) {
    reward.exists = false;

    rewardFactory.rewardCount = rewardFactory.rewardCount.minus(ONE_BI);

    reward.save();
    rewardFactory.save();
  }
}

export function handleRewardRecipientAdded(
  event: RewardRecipientAddedEvent
): void {
  let rewardRecipient = new RewardRecipient(
    event.params.rewardRecipientId.toString()
  );
  let reward = Reward.load(
    `${event.address.toHexString()}-reward-${event.params.rewardId.toString()}`
  );

  if (reward !== null) {
    rewardRecipient.owner = event.transaction.from.toHexString();
    rewardRecipient.createdAt = event.block.timestamp;
    rewardRecipient.updatedAt = ZERO_BI;
    rewardRecipient.reward = event.params.rewardId.toString();
    rewardRecipient.deliveredByCampaign = false;
    rewardRecipient.receivedByUser = false;

    rewardRecipient.save();
    reward.save();
  }
}

export function handleRewarderApproval(event: RewarderApprovalEvent): void {
  let rewardRecipient = RewardRecipient.load(
    `${event.address.toHexString()}-rewardRecipient-${event.params.rewardRecipientId.toString()}`
  );

  if (rewardRecipient !== null) {
    rewardRecipient.deliveredByCampaign = true;

    rewardRecipient.save();
  }
}

export function handleRewardRecipientApproval(
  event: RewardRecipientApprovalEvent
): void {
  let rewardRecipient = RewardRecipient.load(
    `${event.address.toHexString()}-rewardRecipient-${event.params.rewardRecipientId.toString()}`
  );

  if (rewardRecipient !== null) {
    rewardRecipient.receivedByUser = true;

    rewardRecipient.save();
  }
}
