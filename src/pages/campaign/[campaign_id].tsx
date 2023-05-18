import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Header } from '../../components/header';
import { Sidebar } from '@/components/sidebar';
import { PlusIcon } from '@heroicons/react/24/solid';

interface CharacterData {
    id: number
    name: string
    character_type: string
}

const CampaignPage = () => {
    const router = useRouter();
    const { campaign_name, campaign_id } = router.query;

    const [players, setPlayers] = useState<CharacterData[]>([])
    const [new_player_name, setNewPlayerName] = useState<string>("New Character")

    const fill_player_names = () => {
        useEffect(() => {
            invoke('list_players', { campaignId: parseInt(campaign_id as string, 10) }).then((message) => setPlayers(message as CharacterData[])).catch(console.error)
        }, [])
    }

    const add_player = async (name: string) => {
        try {
            await invoke('add_player', { campaignId: parseInt(campaign_id as string, 10), playerName: name });
            const message = await invoke('list_players', { campaignId: parseInt(campaign_id as string, 10) });
            setPlayers(message as CharacterData[]);
            console.log(players)
        } catch (error) {
            console.error(error);
        }
    };

    const delete_character = async (character_id: number) => {
        try {
            await invoke('delete_character', { campaignId: parseInt(campaign_id as string, 10), characterId: character_id });
            const message = await invoke('list_players', { campaignId: parseInt(campaign_id as string, 10) });
            setPlayers(message as CharacterData[]);
            console.log(players)
        } catch (error) {
            console.error(error);
        }
    };

    fill_player_names()

    return (
        <main
            className={`bg-gradient-to-b from-dark to-light min-h-screen" px-5 flex flex-col min-h-screen`}
        >
            <Header crumbs={[{
                name: `${campaign_name}`,
                href: {
                    pathname: '/campaign/[campaign_id]',
                    query: {
                        campaign_name: campaign_name as string,
                        campaign_id: campaign_id as string
                    }
                }
            }]} />
            <div className='flex flex-row space-x-2'>
                <Sidebar />
                <div className='flex flex-col space-y-1'>
                    <h1 className='text-2xl font-serif text-light'>Characters</h1>
                    <ul >
                        {players.map((player) => (
                            <li>
                                <div className=' px-4 flex flex-row space-x-2 text-black text-lg font-serif font-md'>
                                    <h2>{player.name}</h2>
                                    <button onClick={() => delete_character(player.id)}><TrashIcon className="h-4 w-4 text-[#905468]" /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="px-2 flex flex-row space-x-2 text-black text-lg font-serif font-md">
                        <input className="w-32 rounded-lg bg-opacity-100 text-black text-lg font-serif font-md px-2"
                            type='text' placeholder='New Character' onChange={(e) => setNewPlayerName(e.target.value)}
                        />
                        <button onClick={() => add_player(new_player_name)}
                        ><PlusIcon className="w-5 h-5"></PlusIcon></button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CampaignPage;