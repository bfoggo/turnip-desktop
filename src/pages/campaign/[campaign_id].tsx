import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Header } from '../../components/header';
import { Sidebar } from '@/components/sidebar';
import { PlusIcon } from '@heroicons/react/24/solid';
import { CharacterList } from '@/components/character_list';

interface CharacterData {
    id: number
    name: string
    character_type: string
}

const CampaignPage = () => {
    const router = useRouter();
    const { campaign_name, campaign_id } = router.query;

    const [players, setPlayers] = useState<CharacterData[]>([])


    useEffect(() => {
        invoke('list_players', { campaignId: parseInt(campaign_id as string, 10) }).then((message) => setPlayers(message as CharacterData[])).catch(console.error)
    }, [])

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

    const add_npc = async (name: string) => {
        try {
            await invoke('add_npc', { campaignId: parseInt(campaign_id as string, 10), npcName: name });
            const message = await invoke('list_players', { campaignId: parseInt(campaign_id as string, 10) });
            setPlayers(message as CharacterData[]);
            console.log(players)
        } catch (error) {
            console.error(error);
        }

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
                    <CharacterList characters={players} delete_fn={delete_character} add_fn={add_player} />
                </div>
            </main>
        );
    };

    export default CampaignPage;