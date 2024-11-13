'use client'
import clsx from 'clsx'
import Link from 'next/link'

interface DeskTopItemProps{
    label:string;
    icon:any,
    href:string;
    active?:boolean;
    onClick?:()=>void
}
const DeskTopItem:React.FC<DeskTopItemProps> = ({
    icon:Icon,
    label,
    href,
    onClick,
    active
}) => {
    const handleClick = () => {
        if(onClick){
            return onClick();
        }
    }
  return (
    <div>
        <li onClick={handleClick}>
            <Link href={href} 
            className={clsx(`
                group
                flex
                gap-x-3
                rounded-md
                p-3
                text-sm
                leading-6
                font-semibold
                text-gray-500
                hover:text-black
                hover:bg-gray-100
                `,
                active && "bg-gray-100 text-black"
            )}
            >
            <Icon className="h-6 w-7 shrink-0"/>
                <span className='sr-only'>{label}</span>
            </Link>
        </li>
    </div>
  )
}
    
export default DeskTopItem