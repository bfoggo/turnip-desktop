import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { CharacterData } from '../types/character'

interface CharacterListProps {
    title: string
    characters: CharacterData[]
    delete_fn: (character_id: number) => void
    add_fn: (name: string) => void
}

export const CharacterList = (props: CharacterListProps) => {
    const [new_player_name, setNewPlayerName] = useState<string>("New Character")

    return (
        <div className='flex flex-col space-y-1'>
            <h1 className='text-2xl font-serif text-light'>{props.title}</h1>
            <ul >
                {props.characters.map((player) => (
                    <li>
                        <div className=' px-4 flex flex-row space-x-2 text-black text-lg font-serif font-md'>
                            <h2 className="w-28">{player.name}</h2>
                            <button onClick={() => props.delete_fn(player.id)}><TrashIcon className="h-4 w-4 text-[#905468]" /></button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="px-2 flex flex-row space-x-4 text-black text-lg font-serif font-md">
                <input className="w-28 rounded-lg bg-opacity-100 text-black text-lg font-serif font-md px-2"
                    type='text' placeholder='New' onChange={(e) => setNewPlayerName(e.target.value)}
                />
                <button onClick={() => props.add_fn(new_player_name)}
                ><PlusIcon className="w-5 h-5"></PlusIcon></button>
            </div>
        </div>
    )
}

export const CharacterListInitiative = (props: CharacterListProps) => {

    const [initiaves, setInitiatives] = useState<number[]>();

    return (
        <div className='flex flex-col space-y-1'>
            <h1 className='text-2xl font-serif text-light'>{props.title}</h1>
            <ul >
                {props.characters.map((player, index) => (
                    <li>
                        <div className=' px-4 flex flex-row space-x-2 text-black text-lg font-serif font-md'>
                            <h2 className="w-28">{player.name}</h2>
                            <input type="number" className="w-28 text-black text-lg font-serif font-md px-2" placeholder="initiative"
                                onChange={(e) => setInitiatives(initiaves?.splice(index, 1, parseInt(e.target.value)))}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}