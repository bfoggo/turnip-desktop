import { PlusIcon, TrashIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { CharacterData } from '../types/character'
import { invoke } from '@tauri-apps/api/tauri'

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

export const CharacterListInitiative = (props: CharacterListProps) => {

    const [initiatives, setInitiatives] = useState<number[]>();
    const [locked, setLocked] = useState<boolean>(false);

    const set_all_initiatives = async () => {
        try {
            console.log(initiatives)
            if (initiatives?.length != props.characters.length) {
                throw new Error("Initiatives not set for all characters")
            }
            for (let i = 0; i < initiatives.length; i++) {
                await invoke('set_initiative', { characterId: props.characters[i].id, initiative: initiatives[i] }).then((response) => {
                    console.log(response)
                }
                )
            }
            setLocked(true);
            console.log(initiatives)
        }
        catch (error) {
            console.log(props.characters)
            console.log(initiatives)
            console.error(error);
        }
    }

    const push_or_update_initiative = (index: number, new_value: number) => {
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
                            {locked ?
                                <h2 className="w-28">{initiatives ? initiatives[index] : 0}</h2>
                                :
                                <input type="number" className="w-28 h-5 text-black text-sm font-serif font-md px-2" placeholder="initiative"
                                    onChange={(e) => push_or_update_initiative(index, parseInt(e.target.value))}
                                />
                            }

                        </div>
                    </li>
                ))}
                <hr className=" w-full mx-4 h-0.5  my-4 bg-light opacity-10 border-0 rounded"></hr>
                {locked ?
                    <div className="flex flex-row items-center">
                        <LockClosedIcon className="w-5 h-5 mx-4" />
                        <button className="mx-4 border border-rounded bg-dark w-28" onClick={() => setLocked(false)}> Unlock</button>
                    </div>
                    :
                    <button className="mx-4 border border-rounded bg-dark w-28" onClick={set_all_initiatives}> Submit</button>

                }
            </ul>
        </div>
    )
}