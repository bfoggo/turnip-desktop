import { PlusIcon, TrashIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { CharacterData } from '../types/character'
import { CharacterIcons } from './character_icons'

interface CharacterListProps {
    title: string
    characters: CharacterData[]
    delete_fn: (character_id: number) => void
    add_fn: (name: string) => void
}

export const CharacterList = (props: CharacterListProps) => {
    const [new_character_name, setNewCharacterName] = useState<string>("New Character")

    return (
        <div className='flex flex-col space-y-1'>
            <h1 className='text-2xl font-serif text-light'>{props.title}</h1>
            <ul >
                {props.characters.map((character) => (
                    <li>
                        <div className=' px-4 flex flex-row space-x-2 text-black text-lg font-serif font-md'>
                            <h2 className="w-28">{character.name}</h2>
                            <button onClick={() => props.delete_fn(character.id)}><TrashIcon className="h-4 w-4 text-[#905468]" /></button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="px-2 flex flex-row space-x-4 text-black text-lg font-serif font-md">
                <input className="w-28 rounded-lg bg-opacity-100 text-black text-lg font-serif font-md px-2"
                    type='text' placeholder='New' onChange={(e) => setNewCharacterName(e.target.value)}
                />
                <button onClick={() => props.add_fn(new_character_name)}
                ><PlusIcon className="w-5 h-5"></PlusIcon></button>
            </div>
        </div>
    )
}

interface CharacterListFightProps {
    title: string
    characters: CharacterData[]
    locked: boolean
    submit_initiatives: (initiatives: number[]) => void
    kill_character: (character_id: number) => void
    rez_character: (character_id: number) => void
    unlock_fn: () => void
}

export const CharacterListFight = (props: CharacterListFightProps) => {

    const [initiatives, setInitiatives] = useState<number[]>();

    const set_all_initiatives = async () => {
        try {
            if (initiatives?.length != props.characters.length) {
                throw new Error("Initiatives not set for all characters")
            }
            props.submit_initiatives(initiatives);
        }
        catch (error) {
            console.error(error);
        }
    }

    const push_or_update_initiative_list = (index: number, new_value: number) => {
        if (initiatives && initiatives.length > index) {
            initiatives[index] = new_value;
            return;
        }
        if (initiatives) {
            initiatives.push(new_value);
            return;
        }
        else {
            setInitiatives([new_value]);
            return;
        }
    }

    return (
        <div className='flex flex-col space-y-1'>
            <h1 className='text-2xl font-serif text-light'>{props.title}</h1>
            <ul >
                {props.characters.map((character, index) => (
                    <li>
                        <div className=' px-4 flex flex-row space-x-2 text-black items-center text-lg font-serif font-md'>
                            <h2 className="w-28">{character.name}</h2>
                            {props.locked ?
                                <h2 className="pl-4 w-28">
                                    <CharacterIcons character={character} kill_fn={() => props.kill_character(character.id)} rez_fn={() => props.rez_character(character.id)} /></h2>
                                :
                                <input type="number" className="w-28 h-5 text-black text-sm font-serif font-md px-2" placeholder="initiative" defaultValue={initiatives ? initiatives[index] : 0}
                                    onChange={(e) => push_or_update_initiative_list(index, parseInt(e.target.value))}
                                />
                            }

                        </div>
                    </li>
                ))}
                <hr className=" w-full mx-4 h-0.5  my-4 bg-light opacity-10 border-0 rounded"></hr>
                {props.locked ?
                    <div className="flex flex-row items-center">
                        <LockClosedIcon className="w-5 h-5 mx-4" />
                        <button className="mx-4 border border-rounded bg-dark w-28" onClick={() => props.unlock_fn()}> Unlock</button>
                    </div>
                    :
                    <button className="mx-4 border border-rounded bg-dark w-28" onClick={set_all_initiatives}> Submit</button>

                }
            </ul>
        </div>
    )
}