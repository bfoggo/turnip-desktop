import Image from 'next/image'
import { Inter } from 'next/font/google'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'


// 362A48 (black)
// 905468 (magenta)
// AB9FB0 (grayish)
// 7170A5 (purplish)
// F9F5F6 (background)

const inter = Inter({ subsets: ['latin'] })

const Greet = () => {
  useEffect(() => {
    invoke('say_hello').then(console.log).catch(console.error)
  }, [])
}

const fill_campaign_names = (setNames: React.Dispatch<React.SetStateAction<string[]>>) => {
  useEffect(() => {
    invoke('list_campaigns').then((message: any) => { setNames(message as string[]) }).catch(console.error)
  }, [])
}



export default function Home() {
  const [campaign_names, setCampaignNames] = useState<string[]>([])
  const [new_campaign_name, setNewCampaignName] = useState<string>("New Campaign")

  Greet()
  fill_campaign_names(setCampaignNames)
  useEffect(() => console.log(campaign_names), [campaign_names])

  const handle_delete = async (name: string) => {
    try {
      await invoke('delete_campaign', { campaignName: name });
      const message = await invoke('list_campaigns');
      setCampaignNames(message as string[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handle_add = async (name: string) => {
    try {
      await invoke('add_campaign', { campaignName: name });
      const message = await invoke('list_campaigns');
      setCampaignNames(message as string[]);
      setNewCampaignName("New Campaign"); // Reset the input field after adding a campaign
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col justify-between p-24 ${inter.className}`}
    >
      <li className="flex flex-col">
        {campaign_names.map((name) => (
          <div className="flex flex-row justify-start space-x-2 items-center">
            <text className="text-[#362A48] text-lg font-bold font-serif"
            > {name} </text>
            <button
              onClick={() => handle_delete(name)}>
              <TrashIcon className="h-5 w-5 text-[#905468]" />
            </button>
          </div>
        ))}
      </li>
      <input
        className="border-2 border-black rounded-md bg-slate-200 text-slate-800"
        type="text"
        value={new_campaign_name}
        onChange={(e) => setNewCampaignName(e.target.value)}
      />
      <button className="border-2 border-black rounded-md bg-slate-400"
        onClick={() => handle_add(new_campaign_name)}>
        Add Campaign
      </button>


    </main >
  )
}
