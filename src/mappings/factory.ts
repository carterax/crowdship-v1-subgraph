import { FACTORY_ADDRESS } from './../utils/constants';
import { CampaignFactoryDeployed as CampaignFactoryDeployedEvent } from '../../generated/Factory/Factory';
import { Factory } from '../../generated/schema';

import { CampaignFactory } from '../../generated/schema';

export function handleCampaignFactoryDeployed(
  event: CampaignFactoryDeployedEvent
): void {
  let campaignFactory = new CampaignFactory(
    event.params.campaignFactory.toHexString()
  ) as CampaignFactory;
  campaignFactory.origin = event.address.toHexString();
  campaignFactory.factoryWallet = event.params.factoryWallet;
  campaignFactory.owner = event.params.owner.toHexString();

  campaignFactory.save();

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
