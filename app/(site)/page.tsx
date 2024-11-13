import Image from "next/image";
import img from '@/public/Logo.png'
import AuthForm from "./components/AuthForm";
export default function Home() {
    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image alt="logo" width={48} height={48} className="w-auto mx-auto" src={img}/>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tighttext-gray-900">Sign in to your account</h2>
            </div>
            {/* auth */}
            <AuthForm/>
        </div>
    );
}
