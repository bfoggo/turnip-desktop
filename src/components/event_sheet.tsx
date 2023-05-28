import { useState } from "react";

interface Action {
    id: number
    turn: number
    message: string
}
interface EventSheetProps {
    eventMessages: Action[]
}


export const EventSheet = (props: EventSheetProps) => {

    return (
        <div className="flex flex-col w-full gap-1">
            {
                props.eventMessages.map((action) => {
                    return (<div key={action.id} className="pl-5 flex h-10 items-center card-undivided space-x-1 text-royal-blue-500">
                        <p>Turn {action.turn}:</p>
                        <p>{action.message}</p>
                    </div>
                    )
                }
                )
            }
        </div>
    )
}