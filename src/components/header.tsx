import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { UrlObject } from 'url';

interface BreadCrumb {
    name: string
    href: UrlObject | string
}

interface BreadCrumbProps {
    crumbs: BreadCrumb[]
}

export const Header = (props: BreadCrumbProps) => {
    return (
        <header>
            <div className="pl-32 pt-1 flex flex-col space-y-1">
                <div className="flex flex-row pt-1">
                    <Link href="/">
                        <h1 className='header-text'>Turnip</h1>
                    </Link> 
                    {
                        props.crumbs.map((crumb) => (
                            <div key={crumb.name} className="flex flex-row items-center ">
                                <h1 className='w-4 h-4 header-text'><ChevronRightIcon /></h1>
                                <Link href={crumb.href} >
                                    <h1 className='header-text'>{crumb.name}</h1>
                                </Link>
                            </div>
                        ))
                    }

                </div>
                <hr className=" w-full h-0.5 mx-auto my-4 bg-white opacity-5 border-0 rounded md:my-10"></hr>
            </div>
        </header >
    )
}