import { FaceFrownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import * as HIcons from '@heroicons/react/24/outline'

interface SidebarProps {
    campaign_id: number
    campaign_name: string
}

export const Sidebar = (props: SidebarProps) => {

    return (
        <aside className='-ml-5 w-1/5 h-screen'>
            <div className='h-full flex flex-col items-center space-y-2 bg-gradient-to-b from-primary to-light'>
                <ul className='text-md font-serif  text-dark text-opacity-50 pt-2 pr-1'>
                    <li>
                        <CampaignLinkedTitle campaign_name={props.campaign_name} campaign_id={props.campaign_id} title='Dashboard' icon="IdentificationIcon" />
                        <CampaignLinkedTitle campaign_name={props.campaign_name} campaign_id={props.campaign_id} title='Fight' icon="FaceFrownIcon" />
                    </li>
                </ul>
            </div>
        </aside >
    )
}

const CampaignLinkedTitle = (props: { campaign_name: string, campaign_id: number, title: string, icon: string }) => {
    const { ...icons } = HIcons
    {/* @ts-ignore */ }
    const Icon: JSX.Element = icons[props.icon]

    return (
        <div className="flex flex-row items-center w-full space-x-2">
            <Link className="w-full" href={{
                pathname: `/campaign/[campaign_id]/${props.title.toLowerCase()}`, query: {
                    campaign_name: props.campaign_name,
                    campaign_id: props.campaign_id
                }
            }}>
                <div className="flex flex-row items-center space-x-2"><h1>{props.title} </h1>
                    {/* @ts-ignore */}
                    <Icon className="w-5 h-5" /></div>
            </Link>
        </div>
    )
}