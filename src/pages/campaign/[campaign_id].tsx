import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

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

    const handle_add_player = async (name: string) => {
        try {
            await invoke('add_player', { campaignId: parseInt(campaign_id as string, 10), playerName: name });
            const message = await invoke('list_players', { campaignId: parseInt(campaign_id as string, 10) });
            setPlayers(message as CharacterData[]);
            console.log(players)
        } catch (error) {
            console.error(error);
        }
    };

    const handle_delete_character = async (character_id: number) => {
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
            className={`flex min-h-screen p-24`}
        >
            <div>
                <h1>Campaign: {campaign_name}</h1>
                <div className='flex flex-col'>
                    <h2>Characters</h2>
                    <ul>
                        {players.map((player) => (
                            <li>
                                <div className='flex flex-row space-x-2'>
                                    {player.name}
                                    <button onClick={() => handle_delete_character(player.id)}><TrashIcon className="h-5 w-5 text-[#905468]" /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <input type='text' placeholder='New Character' onChange={(e) => setNewPlayerName(e.target.value)} />
                    <button onClick={() => handle_add_player(new_player_name)}
                    >Add</button>
                </div>
            </div >
        </main>
    );
};

export default CampaignPage;