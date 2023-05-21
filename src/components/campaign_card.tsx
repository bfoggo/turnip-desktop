import { useState } from "react"
import { PlusIcon } from "@heroicons/react/24/solid"

interface CampaignProps {
    campaign_name: string
}

export const CampaignCard = ({ campaign }: { campaign: CampaignProps }) => {
    return (
        <div className="grid align-items-center justify-start  w-full card
        ">
            <div className="flex items-center py-4 pl-3">
                <h5 className="card-text ">{campaign.campaign_name}</h5>
            </div>
        </div>
    )
}

export const NewCampaignCard = () => {
    return (
        <div className="grid justify-start card
        ">
            <div className="flex items-center py-4 pl-3 justify-start">
                <h5 className="card-text-new">New Campaign</h5>
            </div>
        </div>
    )
}

export const NewCampaignModal = ({ add_campaign }: { add_campaign: (name: string) => void }) => {
    let [newCampaignName, setNewCampaignName] = useState<string>("");

    return (
        <div className="flex flex-col items-center card-modal
        ">
            <div className="flex pl-3 py-4 flex-row space-x-3 place-items-center">
                <input
                    className="flex pl-3 card-modal-input"
                    placeholder="New Campaign Name"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                />
                <button
                    onClick={() => { add_campaign(newCampaignName) }}>
                    <PlusIcon className="h-8 w-8 pr-3 icon-normal" />
                </button>
            </div>
        </div>
    )
}