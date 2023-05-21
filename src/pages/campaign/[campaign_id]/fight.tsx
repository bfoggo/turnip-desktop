import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { Header } from '../../../components/header';
import { Sidebar } from '@/components/sidebar';
import { CharacterListFight } from '@/components/character_list';
import { CharacterData } from '../../../types/character';

const FightPage = () => {
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

    const set_player_initiatives = async (initiatives: number[]) => {
        try {
            for (let i = 0; i < players.length; i++) {
                await invoke('set_initiative', { characterId: players[i].id, initiative: initiatives[i] });
            }
            list_players();
        } catch (error) {
            console.error(error);
        }
    };

    const set_npc_initiatives = async (initiatives: number[]) => {
        try {
            for (let i = 0; i < npcs.length; i++) {
                await invoke('set_initiative', { characterId: npcs[i].id, initiative: initiatives[i] });
            }
            list_npcs();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        list_players();
        list_npcs();
    }, []);

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
                        campaign_id: cid
                    }
                }
            }]} />
            <div className='flex flex-row space-x-2'>
                <Sidebar campaign_id={cid} campaign_name={campaign_name as string} />
                <div className="flex flex-row gap-x-10">
                    <CharacterListFight title="Characters" characters={players} submit_initiatives={set_player_initiatives} />
                    <CharacterListFight title="NPCs" characters={npcs} submit_initiatives={set_npc_initiatives} />
                </div>
            </div>
        </main >
    );
};


export default FightPage;