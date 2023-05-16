import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { PlusIcon } from "@heroicons/react/24/solid"

interface CampaignProps {
    campaign_name: string
}

export const CampaignCard = ({ campaign }: { campaign: CampaignProps }) => {
    return (
        <div className="flex flex-col items-center rounded-lg shadow
        bg-light hover:bg-lighter w-full
        ">
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-0 text-md font-serif tracking-tight text-black">{campaign.campaign_name}</h5>
            </div>
        </div>
    )
}

export const NewCampaignCard = ({ card_title }: { card_title: string }) => {
    return (
        <div className="flex flex-col items-center rounded-lg shadow
        bg-light-accent w-full
        ">
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-0 text-md font-serif tracking-tight text-black">{card_title}</h5>
            </div>
        </div>
    )
}

export const NewCampaignModal = ({ add_campaign }: { add_campaign: (name: string) => void }) => {
    let [newCampaignName, setNewCampaignName] = useState<string>("");

    return (
        <div className="flex flex-col items-center rounded-lg shadow md:flex-row md:max-w-xl
        bg-light w-full h-full
        ">
                <div className="flex px-2 py-2 flex-row space-x-2 items-center">
                    <input
                        className="font-serif place-items-center px-3 text-base text-dark placeholder-gray-600 bg-light rounded-lg focus:shadow-outline"
                        placeholder="New Campaign Name"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                    />
                    <button
                        onClick={() => { add_campaign(newCampaignName) }}>
                        <PlusIcon className="h-5 w-5 text-dark-accent hover:text-dark-accent-hover" />
                    </button>
                </div>
            </div>
    )
}