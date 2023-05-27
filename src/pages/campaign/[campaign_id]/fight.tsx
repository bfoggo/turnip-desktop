import { useRouter } from 'next/router';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import { useState } from 'react';
import { Header } from '../../../components/header';
import { Sidebar } from '@/components/sidebar';
import { CharacterListFight } from '@/components/character_list';
import { CharacterData } from '../../../types/character';
import { PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const FightPage = () => {
    const router = useRouter();
    const { campaign_name, campaign_id } = router.query;
    const cid = parseInt(campaign_id as string, 10);

    const [players, setPlayers] = useState<CharacterData[]>([])
    const [npcs, setNpcs] = useState<CharacterData[]>([])
    const [charactersLocked, setCharactersLocked] = useState<boolean>(false);
    const [npcsLocked, setNpcsLocked] = useState<boolean>(false);
    const [whoseTurn, setWhoseTurn] = useState<string | null>(null);
    const [numTurns, setNumTurns] = useState<number>(0);

    const get_num_turns = async () => {
        try {
            const message = await invoke('get_num_turns', { campaignId: cid });
            setNumTurns(message as number);
        } catch (error) {
            console.error(error);
        }
    }

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
            await get_num_turns();
        }
        catch (error) {
            console.error(error);
        }
    }

    const new_round = async () => {
        try {
            await invoke('reset_round', { campaignId: cid });
            await list_both();
            setWhoseTurn('Nobody');
        }
        catch (error) {
            console.error(error);
        }
    }

    const resolve = async () => {
        try {
            await invoke('resolve', { campaignId: cid });
            await list_both();
            setWhoseTurn('Nobody');
            get_num_turns();
        }
        catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        list_both().then(() => { }).catch((error) => { console.error(error) });
        invoke('get_whose_turn').then((message) => {
            message !== null ? setWhoseTurn(message as string) : setWhoseTurn(null);
        }).catch(error => console.error(error));
        get_num_turns().then(() => { }).catch((error) => { console.error(error) });
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
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row w-full justify-between gap-1">
                        <CharacterListFight title="Characters" characters={players} submit_initiatives={set_player_initiatives}
                            kill_character={kill_character} rez_character={rez_character} locked={charactersLocked} unlock_fn={() => setCharactersLocked(false)} />
                        <CharacterListFight title="NPCs" characters={npcs} submit_initiatives={set_npc_initiatives}
                            kill_character={kill_character} rez_character={rez_character} locked={npcsLocked} unlock_fn={() => setNpcsLocked(false)} />
                    </div>
                    <div className="flex flex-row card-undivided items-center">
                        <button onClick={resolve} className="h-10 w-18 pt-1 pl-5 btn btn-primary card-raw ">Resolve</button>
                        {
                            (charactersLocked && npcsLocked) ?
                                (whoseTurn == null) ?
                                    <div className="flex items-center">
                                        <button onClick={new_round}> <ArrowPathIcon className=" pl-2 w-10 h-8 icon-normal" /></button>
                                        <h1 className='ml-48 pl-2 raw-text w-80'> Start a new round!</h1>
                                    </div>
                                    :
                                    <div className="flex items-center">
                                        <button onClick={take_turn}> <PlayIcon className="pl-2 w-10 h-8 icon-normal" /></button>
                                        <h1 className='ml-48 raw-text w-80'> ({numTurns}) : {whoseTurn}'s turn!</h1>
                                    </div>
                                :
                                <h1 className="flex ml-60 items-center justify-center h-10 raw-text-danger ">Waiting for Initiatives...</h1>
                        }
                    </div>

                </div>

            </div>

        </main >
    );
};


export default FightPage;