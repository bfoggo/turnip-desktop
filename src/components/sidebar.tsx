import Link from 'next/link';
import * as HIcons from '@heroicons/react/24/outline'

interface SidebarProps {
    campaign_id: number
    campaign_name: string
}

export const Sidebar = (props: SidebarProps) => {

    return (
        <aside className='fixed top-0 left-0 w-32 h-screen sidebar'>
            <div className='h-full flex flex-col items-center'>
                <ul className='pt-9 items-center space-y-2 justify-center'>
                    <li className="sidebar-text">
                        <CampaignLinkedTitle campaign_name={props.campaign_name} campaign_id={props.campaign_id} title='Dashboard' icon="IdentificationIcon" />
                    </li>
                    <li className="sidebar-text">
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
        <div className="flex w-full">
            <Link className="w-full" href={{
                pathname: `/campaign/[campaign_id]/${props.title.toLowerCase()}`, query: {
                    campaign_name: props.campaign_name,
                    campaign_id: props.campaign_id
                }
            }}>
                <div className="flex flex-row items-center space-x-2">
                    <p className="pt-1">
                        {props.title}
                    </p>
                    {/* @ts-ignore */}
                    <Icon className="w-4 h-4 items-center" />
                </div>
            </Link>
        </div>
    )
}