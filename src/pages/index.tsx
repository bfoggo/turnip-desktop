import Image from 'next/image'
import { Inter } from 'next/font/google'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { useState } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'


// 362A48 (black)
// 905468 (magenta)
// AB9FB0 (grayish)
// 7170A5 (purplish)
// F9F5F6 (background)

const inter = Inter({ subsets: ['latin'] })

interface Campaign {
  name: string
  id: number
}




export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [new_campaign_name, setNewCampaignName] = useState<string>("New Campaign")

  const initialize = () => {
    useEffect(() => {
      invoke('list_campaigns').then((message: any) => { setCampaigns(message as Campaign[]) }).catch(console.error);
      invoke('upsert_character_type_enum').then(console.log).catch(console.error);
    }, [])
  }

  initialize()

  const handle_delete = async (name: string) => {
    try {
      await invoke('delete_campaign', { campaignName: name });
      const message = await invoke('list_campaigns');
      setCampaigns(message as Campaign[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handle_add = async (name: string) => {
    try {
      await invoke('add_campaign', { campaignName: name });
      const message = await invoke('list_campaigns');
      setCampaigns(message as Campaign[]);
      setNewCampaignName("New Campaign"); // Reset the input field after adding a campaign
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      className={`flex min-h-screen p-24 ${inter.className}`}
    >
      <div className="flex flex-col justify-start">
        <li className="flex flex-col">
          {campaigns.map((campaign) => (
            <div className="flex flex-row space-x-2">
              <Link className="text-[#362A48] text-lg font-bold font-serif border-2 border-[#7170A5] rounded-md px-2" href={{
                pathname: '/campaign/[campaign_id]', query: {
                  name: campaign.name,
                  campaign_id: campaign.id
                }
              }}
              > {campaign.name} </Link>
              <button
                onClick={() => handle_delete(campaign.name)}>
                <TrashIcon className="h-5 w-5 text-[#905468]" />
              </button>
            </div>
          ))}
          <div className='flex flex-row justify-start space-x-2 items-center'>
            <input
              className="border-2 border-black rounded-md  text-slate-800"
              type="text"
              value={new_campaign_name}
              onChange={(e) => setNewCampaignName(e.target.value)}
            />
            <button
              onClick={() => handle_add(new_campaign_name)}>
              <PlusIcon className="h-5 w-5 text-[#905468]" />
            </button>
          </div>
        </li>
      </div >



    </main >
  )
}
