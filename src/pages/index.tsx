import Image from 'next/image'
import { Inter } from 'next/font/google'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { useState } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import { CampaignCard, NewCampaignCard, NewCampaignModal } from '../components/campaign_card'
import Modal from "react-modal";
import Link from 'next/link'


const inter = Inter({ subsets: ['latin'] })

interface Campaign {
  name: string
  id: number
}


export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showNewCampaignModal, setShowNewCampaignModal] = useState<boolean>(false)

  useEffect(() => {
    invoke('upsert_character_type_enum').then(console.log).catch(console.error);
  }, [])

  useEffect(() => {
    invoke('list_campaigns').then((message: any) => { setCampaigns(message as Campaign[]) }).catch(console.error);
  }, [])

  const addCampaign = async (name: string) => {
    try {
      await invoke('add_campaign', { campaignName: name });
      const message = await invoke('list_campaigns');
      setCampaigns(message as Campaign[]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCampaign = async (name: string) => {
    try {
      await invoke('delete_campaign', { campaignName: name });
      const message = await invoke('list_campaigns');
      setCampaigns(message as Campaign[]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-dark"
    >
      <main
        className={`flex min-h-screen p-20 ${inter.className}`}
      >
        <div className="flex flex-col justify-start w-full">
          <li className="flex flex-col space-y-2">
            {campaigns.map((campaign) => (
              <div className="flex flex-row space-x-2 w-3/4">
                <Link className="px-2 w-full" href={{
                  pathname: '/campaign/[campaign_id]', query: {
                    name: campaign.name,
                    campaign_id: campaign.id
                  }
                }}
                > <CampaignCard campaign={{ campaign_name: campaign.name }} /> </Link>
                <button
                  onClick={() => deleteCampaign(campaign.name)}>
                  <TrashIcon className="h-5 w-5 text-dark-accent hover:text-dark-accent-hover
                  " />
                </button>
              </div>
            ))}
            <div className=' flex flex-row space-x-2 w-3/4'>
              <button className='w-full pr-6' onClick={() => setShowNewCampaignModal(true)}>
                <div className="px-2 w-full">
                  <NewCampaignCard card_title="New Campaign" />
                </div>
              </button>
            </div>
            <Modal isOpen={showNewCampaignModal} onRequestClose={() => setShowNewCampaignModal(false)} style={{
              overlay: {
                backgroundColor: 'rgba(0,0,0,0.3)'
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.0)',
                border: 'none'
              }
            }}>
              <NewCampaignModal add_campaign={(name: string) => addCampaign(name).then(() => setShowNewCampaignModal(false))} />
            </Modal>
          </li>
        </div >
      </main >
    </div>
  )
}
