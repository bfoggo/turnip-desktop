import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { Header } from '../../../components/header';
import { Sidebar } from '@/components/sidebar';
import { CharacterList } from '@/components/character_list';
import { CharacterData } from '../../../types/character';

const DashboardPage = () => {
    const router = useRouter();
    const { campaign_name, campaign_id } = router.query;
    const cid = parseInt(campaign_id as string, 10);

    const [players, setPlayers] = useState<CharacterData[]>([])
    const [npcs, setNpcs] = useState<CharacterData[]>([])


    const list_players = async () => {
        try {
            const message = await invoke('list_players', { campaignId: cid });
            setPlayers(message as CharacterData[]);
        } catch (error) {
            console.error(error);
        }
    };

    const list_npcs = async () => {
        try {
            const message = await invoke('list_npcs', { campaignId: cid });
            setNpcs(message as CharacterData[]);
        } catch (error) {
            console.error(error);
        }
    };

    const list_both = async () => {
        await list_players();
        await list_npcs();
    }

    const add_player = async (name: string) => {
        try {
            await invoke('add_player', { campaignId: cid, playerName: name });
            await list_players();
        } catch (error) {
            console.error(error);
        }
    };

    const add_npc = async (name: string) => {
        try {
            await invoke('add_npc', { campaignId: cid, npcName: name });
            await list_npcs();
        } catch (error) {
            console.error(error);
        }
    }

    const delete_character = async (character_id: number) => {
        try {
            await invoke('delete_character', { characterId: character_id });
            await list_both();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        list_both().then(() => { }).catch((error) => { console.error(error) });
    }, []);

    return (
        <main
            className={` px-5 flex flex-col min-h-screen`}
        >
            <Header crumbs={[{
                name: `${campaign_name}:Dashboard`,
                href: {
                    pathname: '/campaign/[campaign_id]/dashboard',
                    query: {
                        campaign_name: campaign_name as string,
                        campaign_id: cid
                    }
                }
            }]} />
            <div className='flex flex-row space-x-2'>
                <Sidebar campaign_id={cid} campaign_name={campaign_name as string} />
                <div className="flex flex-row gap-x-32">
                    <CharacterList title="Characters" characters={players} delete_fn={delete_character} add_fn={add_player} />
                    <CharacterList title="NPCs" characters={npcs} delete_fn={delete_character} add_fn={add_npc} />
                </div>
            </div>
        </main >
    );
};


export default DashboardPage;