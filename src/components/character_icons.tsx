import { CharacterData } from '../types/character';
import { PowerIcon } from '@heroicons/react/24/solid';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';

interface CharacterIconsProps {
    character: CharacterData
}

export const CharacterIcons = (props: CharacterIconsProps) => {

    return (
        <div className="flex flex-row items-center space-x-2">
            <h1>{props.character.name} </h1>
            <h1>{props.character.initiative}</h1>
            {props.character.isActive ? <PowerIcon className="w-5 h-5 text-success" /> : <PowerIcon className="w-5 h-5 text-danger" />}
        </div>
    )
}