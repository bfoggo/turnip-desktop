import Link from 'next/link';

export const Header = () => {
    return (
        <header>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row justify-between">
                <Link href="/">
                    <h1 className='text-sm text-brand font-bold font-mono pt-5 hover:text-brand-hover'>Turnip</h1>
                </Link>
                </div>
                <hr className=" w-full h-0.5 mx-auto my-4 bg-dark-lighter border-0 rounded md:my-10"></hr>
            </div>
        </header>
    )
}