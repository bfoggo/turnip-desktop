import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Header } from '../../../components/header';
import { Sidebar } from '@/components/sidebar';
import { PlusIcon } from '@heroicons/react/24/solid';
import { CharacterListFight } from '@/components/character_list';
import { CharacterData } from '../../../types/character';

const FightPage = () => {
    const router = useRouter();
    const { campaign_name, campaign_id_str } = router.query;
    const campaign_id = parseInt(campaign_id_str as string, 10);

    const [players, setPlayers] = useState<CharacterData[]>([])
    const [npcs, setNpcs] = useState<CharacterData[]>([])


    const list_players = async () => {
        try {
            const message = await invoke('list_players', { campaignId: campaign_id });
            setPlayers(message as CharacterData[]);
        } catch (error) {
            console.error(error);
        }
    };

    const list_npcs = async () => {
        try {
            const message = await invoke('list_npcs', { campaignId: campaign_id });
            setNpcs(message as CharacterData[]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main
            className={`bg-gradient-to-b from-dark to-light min-h-screen" px-5 flex flex-col min-h-screen`}
        >
            <Header crumbs={[{
                name: `${campaign_name} : Dashboard`,
                href: {
                    pathname: '/campaign/[campaign_id]/dashboard',
                    query: {
                        campaign_name: campaign_name as string,
                        campaign_id: campaign_id
                    }
                }
            }]} />
            <div className='flex flex-row space-x-2'>
                <Sidebar campaign_id={campaign_id} campaign_name={campaign_name as string} />
                <div className="flex flex-row gap-x-10">
                    <CharacterListFight title="Characters" characters={players} />
                    <CharacterListFight title="NPCs" characters={npcs} />
                </div>
            </div>
        </main >
    );
};


export default FightPage;