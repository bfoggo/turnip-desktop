import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { PlusIcon } from "@heroicons/react/24/solid"

interface CampaignProps {
    campaign_name: string
}

export const CampaignCard = ({ campaign }: { campaign: CampaignProps }) => {
    return (
        <div className="flex flex-col items-center rounded-lg shadow md:flex-row md:max-w-xl
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
        <div className="flex flex-col items-center rounded-lg shadow md:flex-row md:max-w-xl
        bg-light-accent w-full
        ">
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-0 text-md font-serif tracking-tight text-black">{card_title}</h5>
            </div>
        </div>
    )
}

export const NewCampaignModal = () => {
    let [newCampaignName, setNewCampaignName] = useState<string>("");

    const handle_add = async (name: string) => {
        try {
            await invoke('add_campaign', { campaignName: name });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center rounded-lg shadow md:flex-row md:max-w-xl
        bg-light w-full h-full
        ">
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-0 text-md font-serif tracking-tight text-black">New Campaign</h5>
                <div className="flex flex-row space-x-2">
                    <input
                        className="px-3 py-2 mb-1 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                        placeholder="New Campaign Name"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                    />
                    <button
                        onClick={() => handle_add(newCampaignName)}>
                        <PlusIcon className="h-5 w-5 text-dark-accent hover:text-dark-accent-hover" />
                    </button>
                </div>
            </div>
        </div>
    )
}