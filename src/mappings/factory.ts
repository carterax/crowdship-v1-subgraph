import { BigInt } from '@graphprotocol/graph-ts';
import { CampaignFactoryDeployed as CampaignFactoryDeployedEvent } from '../../generated/Factory/Factory';
import { Factory } from '../../generated/schema';
import { CampaignFactory as CampaignFactoryContract } from '../../generated/templates/CampaignFactory/CampaignFactory';

import { CampaignFactory } from '../../generated/schema';
import { CampaignFactory as CampaignFactoryTemplate } from '../../generated/templates';

export function handleCampaignFactoryDeployed(
  event: CampaignFactoryDeployedEvent
): void {
  let campaignFactory = new CampaignFactory(
      event.params.campaignFactory.toHexString()
    ) as CampaignFactory,
    campaignFactoryContract = CampaignFactoryContract.bind(
      event.params.campaignFactory
    );
  campaignFactory.origin = event.address.toHexString();
  campaignFactory.factoryWallet = event.params.factoryWallet;
  campaignFactory.owner = event.params.owner.toHexString();
  campaignFactory.createdAt = event.block.timestamp;
  campaignFactory.paused = false;
  campaignFactory.campaignCount = campaignFactory.campaignCount.plus(
    new BigInt(1)
  );

  campaignFactory.deadlineStrikesAllowed = campaignFactoryContract.campaignTransactionConfig(
    'deadlineStrikesAllowed'
  );
  campaignFactory.maximumContributionAllowed = campaignFactoryContract.campaignTransactionConfig(
    'maximumContributionAllowed'
  );
  campaignFactory.minimumRequestAmountAllowed = campaignFactoryContract.campaignTransactionConfig(
    'minimumRequestAmountAllowed'
  );
  campaignFactory.maximumRequestAmountAllowed = campaignFactoryContract.campaignTransactionConfig(
    'maximumRequestAmountAllowed'
  );
  campaignFactory.minimumCampaignTarget = campaignFactoryContract.campaignTransactionConfig(
    'minimumCampaignTarget'
  );
  campaignFactory.maximumCampaignTarget = campaignFactoryContract.campaignTransactionConfig(
    'maximumCampaignTarget'
  );
  campaignFactory.maxDeadlineExtension = campaignFactoryContract.campaignTransactionConfig(
    'maxDeadlineExtension'
  );
  campaignFactory.minDeadlineExtension = campaignFactoryContract.campaignTransactionConfig(
    'minDeadlineExtension'
  );
  campaignFactory.minRequestDuration = campaignFactoryContract.campaignTransactionConfig(
    'minRequestDuration'
  );
  campaignFactory.maxRequestDuration = campaignFactoryContract.campaignTransactionConfig(
    'maxRequestDuration'
  );
  campaignFactory.reviewThresholdMark = campaignFactoryContract.campaignTransactionConfig(
    'reviewThresholdMark'
  );
  campaignFactory.requestFinalizationThreshold = campaignFactoryContract.campaignTransactionConfig(
    'requestFinalizationThreshold'
  );
  campaignFactory.reportThresholdMark = campaignFactoryContract.campaignTransactionConfig(
    'reportThresholdMark'
  );

  campaignFactory.save();
  CampaignFactoryTemplate.create(event.params.campaignFactory);

  let factory = Factory.load(event.address.toHexString());

  if (event.params.campaignIndex.toHexString() == '1' || factory == null) {
    factory = new Factory(event.address.toHexString());
    factory.totalCampaignFactories = event.params.campaignIndex;
    let allCampaignFactories = factory.campaignFactories;
    allCampaignFactories.push(event.params.campaignFactory.toHexString());
    factory.campaignFactories = allCampaignFactories;
  } else {
    factory.totalCampaignFactories = event.params.campaignIndex;
    let allCampaignFactories = factory.campaignFactories;
    allCampaignFactories.push(event.params.campaignFactory.toHexString());
    factory.campaignFactories = allCampaignFactories;
  }

  factory.save();
}
