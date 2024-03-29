import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdOutlineHelp } from 'react-icons/md'
import {
    HomeIcon,
    MenuIcon,
    XIcon,
} from '@heroicons/react/outline'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Domain, apiKey } from './domain'
import { useRouter } from 'next/router'

const cookies = new Cookies();

const user = cookies.get('userAuth');

const dataset_id = cookies.get('datasetId');

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ datasetExamples }) {

    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon, current: router.pathname === '/' ? true : false },
        { name: 'Upload', href: '/upload', icon: AiOutlineCloudUpload, current: router.pathname === '/upload' ? true : false },
        { name: 'Support', href: 'mailto:withBranchHelp@gmail.com?', icon: MdOutlineHelp, current: false },
    ]

    const sendUnlabeledExamples = (datasetExamples: any) => {
        for ( const example of datasetExamples) {
            let body = [
            {
                "id": example.id,
            }
        ]

        let config = {
            headers: {
                "Api-Key": apiKey,
                "Authorization": cookies.get('userAuth').token
            },
        }

        try {
            axios.post(`${Domain}content/${dataset_id}`,
                JSON.stringify(body), config
            ).then(response => { console.log("sent unlabeled exaples", response); }
            ).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    {
                        error.response.status === 401 ? (
                            window.location.replace('/login')
                        ) : (console.log(error.response.message))
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log(error.message);
                }
                console.log(error.config);
            });
            console.log(datasetExamples)
        } catch (err) {
            console.log(err);
        }
        }
        
    }

    const handleLogout = () => {
        try {
            console.log(user.token)
            console.log(apiKey)
            sendUnlabeledExamples(datasetExamples)
            let config = {
                headers: {
                    "Api-Key": apiKey,
                    "Authorization": user.token
                }
            }
            let body = {
                "email": user.email
            }
            axios.post(`${Domain}user/logout/${user.email}`, JSON.stringify(body),
                config
            ).then(response => { console.log(response); window.location.replace('/login') }).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    {
                        error.response.status === 400 ? (console.log('missing something from request'), window.location.replace('/login')) : error.response.status === 401 ? (console.log('invalid auth token')) : (console.log(error.response.message))
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log(error.message);
                }
                console.log(error.config);
            });
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => { setSidebarOpen(false) }}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="flex-shrink-0 flex items-center px-4">
                                        <img
                                            className="h-16 w-auto"
                                            src="/NotifAILogo.png"
                                            alt="NotifAI"
                                        />
                                    </div>
                                    <nav className="mt-5 px-2 space-y-1">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => { sendUnlabeledExamples(datasetExamples) }}
                                                className={classNames(
                                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                                )}
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                                        'mr-4 flex-shrink-0 h-6 w-6'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                                <div className="flex-shrink-0 flex bg-gray-700 p-4">
                                    <button onClick={handleLogout} className="flex-shrink-0 group block">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                {user ? (
                                                    <>
                                                        <p className="text-base font-medium text-white">{user.email}</p>
                                                    </>
                                                ) : null}
                                                <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Logout</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
                    </Dialog>
                </Transition.Root>
                <div className=" flex flex-col col-2 flex-1">
                    <div className="sticky flex items-center justify-between top-0 z-11 pt-1 sm:pl-3 sm:pt-3 bg-gray-900 border-b-2 border-b-gray-800">
                        <img
                            className="block lg:hidden h-16 w-auto"
                            src="/NotifAIicon.png"
                            alt="NotifAI"
                        />
                        <img
                            className="hidden lg:block h-20 w-auto"
                            src="/NotifAILogo.png"
                            alt="NotifAI"
                        />
                        <button
                            type="button"
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center float-right rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
