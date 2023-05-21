import { Inter } from 'next/font/google'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { CampaignCard, NewCampaignCard, NewCampaignModal } from '../components/campaign_card'
import Modal from "react-modal";
import Link from 'next/link'
import { Header } from '../components/header'


const inter = Inter({ subsets: ['latin'] })

interface Campaign {
  name: string
  id: number
}


export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showNewCampaignModal, setShowNewCampaignModal] = useState<boolean>(false)


  const list_campaigns = async () => {
    try {
      const message = await invoke('list_campaigns');
      setCampaigns(message as Campaign[]);
    } catch (error) {
      console.error(error);
    }
  };

  const addCampaign = async (name: string) => {
    try {
      await invoke('add_campaign', { campaignName: name });
      await list_campaigns();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCampaign = async (name: string) => {
    try {
      await invoke('delete_campaign', { campaignName: name });
      await list_campaigns();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    list_campaigns().then(() => { }).catch((error) => { console.error(error) });
  }, [])

  return (
    <main
      className={`pl-5 flex flex-col min-h-screen space-y-4 ${inter.className}`}
    >
      <Header crumbs={[]} />

      <div className='pl-32 pt-10 w-full h-full'>
        <h1 className='paragraph-heading'>Campaigns</h1>
        <div className="pt-2 flex flex-col justify-start w-full">
          <li className="flex flex-col space-y-4 pb-3">
            {campaigns.map((campaign) => (
              <div className="flex flex-row space-x-2 w-3/4">
                <Link className="w-full" href={{
                  pathname: '/campaign/[campaign_id]/dashboard', query: {
                    campaign_name: campaign.name,
                    campaign_id: campaign.id
                  }
                }}
                > <CampaignCard campaign={{ campaign_name: campaign.name }} /> </Link>
                <button
                  onClick={() => deleteCampaign(campaign.name)}>
                  <TrashIcon className="h-5 w-5 icon-danger
                  " />
                </button>
              </div>
            ))}
            <div className=' flex flex-row space-x-2 w-3/4'>
              <button className='w-full pr-7' onClick={() => setShowNewCampaignModal(true)}>
                <div className="w-full">
                  <NewCampaignCard />
                </div>
              </button>
            </div>
            <Modal isOpen={showNewCampaignModal} onRequestClose={() => setShowNewCampaignModal(false)} style={{
              overlay: {
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(0,0,0,0.5)'
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(255,255,255,0)',
                border: 'none',
              }
            }}>
              <NewCampaignModal add_campaign={(name: string) => addCampaign(name).then(() => setShowNewCampaignModal(false))} />
            </Modal>
          </li>
        </div >
      </div>
    </main >
  )
}
