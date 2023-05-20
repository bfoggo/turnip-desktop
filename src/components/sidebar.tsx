import { FaceFrownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';

interface SidebarProps {
    campaign_id: number
    campaign_name: string
}

export const Sidebar = (props: SidebarProps) => {
    return (
        <aside className='-ml-5 w-1/5 h-screen'>
            <div className='h-full flex flex-col items-center space-y-2 bg-gradient-to-b from-primary to-light'>
                <ul className='text-md font-serif  text-dark text-opacity-50 pt-2 pr-5'>
                    <li>
                        <CampaignLinkedTitle campaign_name={props.campaign_name} campaign_id={props.campaign_id} title='Dashboard' />
                        <CampaignLinkedTitle campaign_name={props.campaign_name} campaign_id={props.campaign_id} title='Fight' />
                    </li>
                </ul>
            </div>
        </aside >
    )
}

const CampaignLinkedTitle = (props: { campaign_name: string, campaign_id: number, title: string }) => {
    return (
        <Link className="px-2 w-full" href={{
            pathname: `/campaign/[campaign_id]/${props.title.toLowerCase()}`, query: {
                campaign_name: props.campaign_name,
                campaign_id: props.campaign_id
            }
        }}>
            <div className="flex flex-row items-center space-x-2"><h1>{props.title} </h1> <FaceFrownIcon className="w-5 h-5" /></div>
        </Link>
    )
}