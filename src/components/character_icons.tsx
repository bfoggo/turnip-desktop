import { CharacterData } from '../types/character';
import { HeartIcon, CheckIcon } from '@heroicons/react/24/solid';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';

interface CharacterIconsProps {
    character: CharacterData
    kill_fn: () => void
    rez_fn: () => void
}

export const CharacterIcons = (props: CharacterIconsProps) => {

    return (
        <div className="flex flex-row items-center space-x-2">
            <h1 className="text-sm w-5">{props.character.initiative}</h1>
            {props.character.isActive ?
                <button onClick={props.kill_fn}>
                    <HeartIcon className="w-3 h-3 text-green" /> </button>
                :
                <button onClick={props.rez_fn}>
                    <HeartIcon className="w-3 h-3 text-red" />
                </button>
            }
            {props.character.isActive && !props.character.turnAvailable ? <CheckIcon className="w-3 h-3 text-green" /> : <></>}
        </div >
    )
}