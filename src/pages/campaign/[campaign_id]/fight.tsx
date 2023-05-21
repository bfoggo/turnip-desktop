import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { Header } from '../../../components/header';
import { Sidebar } from '@/components/sidebar';
import { CharacterListFight } from '@/components/character_list';
import { CharacterData } from '../../../types/character';
import { PlayIcon } from '@heroicons/react/24/solid';

const FightPage = () => {
    const router = useRouter();
    const { campaign_name, campaign_id } = router.query;
    const cid = parseInt(campaign_id as string, 10);

    const [players, setPlayers] = useState<CharacterData[]>([])
    const [npcs, setNpcs] = useState<CharacterData[]>([])
    const [charactersLocked, setCharactersLocked] = useState<boolean>(false);
    const [npcsLocked, setNpcsLocked] = useState<boolean>(false);


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

    const set_player_initiatives = async (initiatives: number[]) => {
        try {
            for (let i = 0; i < players.length; i++) {
                await invoke('set_initiative', { characterId: players[i].id, initiative: initiatives[i] });
            }
            list_players();
            setCharactersLocked(true);
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
            setNpcsLocked(true);
        } catch (error) {
            console.error(error);
        }
    };

    const kill_character = async (character_id: number) => {
        try {
            await invoke('deactivate_character', { characterId: character_id });
            await list_both();
        } catch (error) {
            console.error(error);
        }
    };

    const rez_character = async (character_id: number) => {
        try {
            await invoke('activate_character', { characterId: character_id });
            await list_both();
        } catch (error) {
            console.error(error);
        }
    };

    const take_turn = async () => {
        {/* do nothing */ }
    }


    useEffect(() => {
        list_both().then(() => { }).catch((error) => { console.error(error) });
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
                    <CharacterListFight title="Characters" characters={players} submit_initiatives={set_player_initiatives}
                        kill_character={kill_character} rez_character={rez_character} locked={charactersLocked} unlock_fn={() => setCharactersLocked(false)} />
                    <CharacterListFight title="NPCs" characters={npcs} submit_initiatives={set_npc_initiatives}
                        kill_character={kill_character} rez_character={rez_character} locked={npcsLocked} unlock_fn={() => setNpcsLocked(false)} />
                </div>
                <div className="absolute mx-auto inset-x-0 bottom-10 text-center">
                    {charactersLocked && npcsLocked ? <button onClick={take_turn}> <PlayIcon className="w-10 h-10 text-primary" /></button> : <h1 className="text-primary">Waiting for Initiatives...</h1>}
                </div>
            </div>

        </main >
    );
};


export default FightPage;