import {
  CampaignOwnerSet as CampaignOwnerSetEvent,
  CampaignOwnershipTransferred as CampaignOwnershipTransferredEvent,
  CampaignSettingsUpdated as CampaignSettingsUpdatedEvent,
  CampaignDeadlineExtended as CampaignDeadlineExtendedEvent,
  CampaignUserDataTransferred as CampaignUserDataTransferredEvent,
  ContributionMade as ContributionMadeEvent,
  ContributionWithdrawn as ContributionWithdrawnEvent,
  TargetMet as TargetMetEvent,
  RequestAdded as RequestAddedEvent,
  RequestVoided as RequestVoidedEvent,
  RequestComplete as RequestCompleteEvent,
  Voted as VotedEvent,
  VoteCancelled as VoteCancelledEvent,
  CampaignReviewed as CampaignReviewedEvent,
  CampaignReported as CampaignReportedEvent,
  CampaignStateChange as CampaignStateChangeEvent,
} from '../../generated/templates/Campaign/Campaign';
import { Campaign } from '../../generated/schema';
import { CampaignFactory as CampaignFactoryContract } from '../../generated/templates/CampaignFactory/CampaignFactory';
import { Campaign as CampaignContract } from '../../generated/templates/Campaign/Campaign';
import { Address } from '@graphprotocol/graph-ts';

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
