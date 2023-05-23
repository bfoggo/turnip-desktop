import { PlusIcon, TrashIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { CharacterData } from '../types/character'
import { CharacterIcons } from './character_icons'
import { init } from 'next/dist/compiled/@vercel/og/satori'

interface CharacterListProps {
    title: string
    characters: CharacterData[]
    delete_fn: (character_id: number) => void
    add_fn: (name: string) => void
}

export const CharacterList = (props: CharacterListProps) => {
    const [new_character_name, setNewCharacterName] = useState<string>("New Character")

    return (
        <div className='py-1 flex flex-col space-y-2 rounded-md px-6 bg-gray-800'>
            <h1 className='paragraph-heading'>{props.title}</h1>
            <ul className='ml-8 flex flex-col justify-items-center bg-gray-800 rounded-md border-gray-700  divide-y divide-dotted divide-gray-600'>
                {props.characters.map((character) => (
                    <li>
                        <div className='py-1 flex flex-row items-center raw-text '>
                            <p className="w-48">{character.name}</p>
                            <button onClick={() => props.delete_fn(character.id)}><TrashIcon className="h-4 w-4 icon-danger" /></button>
                        </div>
                    </li>
                ))}
                <div className="flex flex-row py-1 items-center">
                    <input className="w-48 input-raw"
                        type='text' placeholder='New' onChange={(e) => setNewCharacterName(e.target.value)}
                    />
                    <button onClick={() => props.add_fn(new_character_name)}
                    ><PlusIcon className="w-5 h-5 icon-normal"></PlusIcon></button>
                </div>
            </ul>

        </div>
    )
}

interface CharacterListFightProps {
    title: string
    characters: CharacterData[]
    locked: boolean
    submit_initiatives: (initiatives: Map<number, number>) => void
    kill_character: (character_id: number) => void
    rez_character: (character_id: number) => void
    unlock_fn: () => void
}

export const CharacterListFight = (props: CharacterListFightProps) => {

    const [initiatives, setInitiatives] = useState<Map<number, number>>(new Map<number, number>());

    const set_all_initiatives = async () => {
        try {
            if (check_for_missing_initiatives()) {
                throw new Error("Initiatives not set for all characters")
            }
            props.submit_initiatives(initiatives);
        }
        catch (error) {
            console.error(error);
        }
    }

    const check_for_missing_initiatives = () => {
        if (initiatives.size == 0) {
            return true;
        }
        for (let cid of props.characters.map(c => c.id)) {
            if (initiatives.get(cid) == undefined) {
                return true;
            }
            if (isNaN(initiatives.get(cid) as number)) {
                return true;
            }
        }
        return false;
    }

    const update_initiative_list = (index: number, new_value: number) => {
        let new_initiatives = new Map<number, number>(initiatives);
        new_initiatives.set(index, new_value);
        setInitiatives(new_initiatives);
    }

    return (
        <div className='py-1 flex flex-col space-y-2 rounded-md px-6 bg-gray-800'>
            <h1 className='paragraph-heading'>{props.title}</h1>
            <ul className='ml-8 flex flex-col justify-items-center card-raw'>
                {props.characters.map(character => (
                    <li>
                        <div className=' py-1 flex flex-row items-center raw-text'>
                            <p className="w-48">{character.name}</p>
                            {props.locked ?
                                <CharacterIcons character={character} kill_fn={() => props.kill_character(character.id)} rez_fn={() => props.rez_character(character.id)} />
                                :
                                <input type="number" className="w-11 h-5 text-center input-bordered" defaultValue={initiatives.get(character.id) ? initiatives.get(character.id) : ""}
                                    onChange={(e) => update_initiative_list(character.id, parseInt(e.target.value))}
                                />
                            }
                        </div>
                    </li>
                ))}
                {props.locked ?
                    <div className="grid pt-1 items-center justify-items-start w-full">
                        <button onClick={() => props.unlock_fn()}> <LockClosedIcon className="w-5 h-8 text-gray-400" /></button>
                    </div>
                    :
                    <div className="grid pt-2 w-full items-center justify-items-start">
                        <div>
                            {!check_for_missing_initiatives() ?
                                <button onClick={set_all_initiatives}><CheckCircleIcon className="h-5 w-5 icon-normal" /> </button> :
                                <button onClick={set_all_initiatives}><CheckCircleIcon className="h-5 w-5 icon-danger" /></button>
                            }
                        </div>
                    </div>

                }
            </ul >

        </div >
    )
}