import { FaceFrownIcon } from '@heroicons/react/24/outline'

export const Sidebar = () => {
    return (
        <aside className='-ml-5 w-1/5 h-screen'>
            <div className='h-full flex flex-col items-center space-y-2 bg-gradient-to-b from-primary to-light'>
                <ul className='text-md font-serif  text-dark text-opacity-50 pt-2 pr-5'>
                    <li> <a className='hover:text-white' href='#'>
                        <div className="flex flex-row items-center space-x-2"><h1>Fight </h1> <FaceFrownIcon className="w-5 h-5" /></div>
                    </a></li>
                </ul>
            </div>
        </aside>
    )
}