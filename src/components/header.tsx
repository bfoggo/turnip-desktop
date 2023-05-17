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
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row pt-5">
                    <Link href="/">
                        <h1 className='text-sm text-primary font-bold font-mono  hover:text-secondary'>Turnip</h1>
                    </Link>
                    {
                        props.crumbs.map((crumb) => (
                            <div className="flex flex-row items-center ">
                                <h1 className='w-4 h-4 text-sm text-primary opacity-30 font-bold font-mono'><ChevronRightIcon /></h1>
                                <Link href={crumb.href} >
                                    <h1 className='text-sm text-primary font-bold font-mono hover:text-secondary'>{crumb.name}</h1>
                                </Link>
                            </div>
                        ))
                    }

                </div>
                <hr className=" w-full h-0.5 mx-auto my-4 bg-light opacity-5 border-0 rounded md:my-10"></hr>
            </div>
        </header >
    )
}