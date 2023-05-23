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
    const [whoseTurn, setWhoseTurn] = useState<string>('Nobody');


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

    const set_player_initiatives = async (initiatives: Map<number, number>) => {
        try {
            for (let pid of initiatives.keys()) {
                await invoke('set_initiative', { characterId: pid, initiative: initiatives.get(pid) });
            }
            list_players();
            setCharactersLocked(true);
        } catch (error) {
            console.error(error);
        }
    };

    const set_npc_initiatives = async (initiatives: Map<number, number>) => {
        try {
            for (let npcid of initiatives.keys()) {
                await invoke('set_initiative', { characterId: npcid, initiative: initiatives.get(npcid) });
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
        try {

            let messsage = await invoke('take_turn', { campaignId: cid });
            await list_both();
            setWhoseTurn(messsage as string);
        }
        catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        list_both().then(() => { }).catch((error) => { console.error(error) });
    }, []);

    return (
        <main
            className={`px-5 flex flex-col min-h-screen`}
        >
            <Header crumbs={[{
                name: `${campaign_name}: Fight`,
                href: {
                    pathname: '/campaign/[campaign_id]/fight',
                    query: {
                        campaign_name: campaign_name as string,
                        campaign_id: cid
                    }
                }
            }]} />

            <div className='pl-32 pt-1 flex flex-row'>
                <Sidebar campaign_id={cid} campaign_name={campaign_name as string} />
                <div className="flex flex-row w-full justify-between gap-1">
                    <CharacterListFight title="Characters" characters={players} submit_initiatives={set_player_initiatives}
                        kill_character={kill_character} rez_character={rez_character} locked={charactersLocked} unlock_fn={() => setCharactersLocked(false)} />
                    <CharacterListFight title="NPCs" characters={npcs} submit_initiatives={set_npc_initiatives}
                        kill_character={kill_character} rez_character={rez_character} locked={npcsLocked} unlock_fn={() => setNpcsLocked(false)} />
                </div>
                <div className="absolute mx-auto inset-x-0 bottom-10 text-center">
                    {charactersLocked && npcsLocked ?
                        <div>
                            <button onClick={take_turn}> <PlayIcon className="w-10 h-10 text-primary" /></button>
                            <h1> It's {whoseTurn}'s turn!</h1>
                        </div>
                        : <h1 className="text-primary">Waiting for Initiatives...</h1>}
                </div>
            </div>

        </main >
    );
};


export default FightPage;