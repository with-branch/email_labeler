import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import UploadEmail from '../dashboard/upload_email';
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Domain, apiKey } from '../domain'
import { FaTimesCircle } from 'react-icons/fa';

const cookies = new Cookies();

const user = cookies.get('user');

cookies.set('userAuth', user);

const dataset_types = [
    { type: 'Email', format: '.mbox' },
    // { type: 'Image', format: '.png or .jpg' },
    // { type: 'Text', format: '.txt or .pdf or .docx' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}



export default function Upload() {

    const [datasets, setDatasets] = useState([]);

    // request the user's datasets
    const getDatasets = () => {
        try {
            console.log(user.token)
            axios.get(`${Domain}dataset`, {
                headers: {
                    "Api-Key": apiKey,
                    "Authorization": user.token
                }
            }).then(response => { console.log(response); setDatasets(response.data); }).catch(function (error) {
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
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDatasets()
    }, [])


    const [open, setOpen] = useState(true)
    const [selected, setSelected] = useState(dataset_types[0])
    const [uploadInProgress, setUploadInProgress] = useState(false);


    const [email, setEmail] = useState(false)

    // Deleting datasets that weren't processed correctly
    const deleteDataset = (dataset_id: any) => {
        try {
            console.log(dataset_id)
            axios.delete(`${Domain}dataset/${dataset_id}`, {
                headers: {
                    "Api-Key": apiKey,
                    "Authorization": user.token
                }
            }).then(response => { console.log(response); window.location.reload(); });
        } catch (err) {
            console.log(err);
        }

    }

    return (

        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => {  }}>
                <div className="flex items-end justify-center pt-60 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-10 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <button onClick={() => { setOpen(false); setEmail(false); getDatasets(); window.location.replace('/') }} className="float-right focus:outline-none">
                                <FaTimesCircle className="text-xl text-red-700" />
                            </button>
                            {email ? (
                                <UploadEmail setEmail={setEmail} setUploadInProgress={setUploadInProgress} setOpen={setOpen} />
                            ) :
                                <>
                                    <div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Select Dataset Type
                                            </Dialog.Title>
                                            <div className="mt-2 px-4">
                                                <p className="text-sm text-gray-500">
                                                    What type of data do you need to label?
                                                </p>
                                            </div>
                                        </div>
                                        <Listbox value={selected} onChange={setSelected}>
                                            {({ open }) => (
                                                <>
                                                    <div className="mt-1 relative">
                                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                            <span className="w-full inline-flex truncate">
                                                                <span className="truncate">{selected.type}</span>
                                                                <span className="ml-2 truncate text-gray-500">{selected.format}</span>
                                                            </span>
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            </span>
                                                        </Listbox.Button>

                                                        <Transition
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-20 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                                {dataset_types.map((dataset_type) => (
                                                                    <Listbox.Option
                                                                        key={dataset_type.format}
                                                                        className={({ active }) =>
                                                                            classNames(
                                                                                active ? 'text-white bg-blue-600' : 'text-gray-900',
                                                                                'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                            )
                                                                        }
                                                                        value={dataset_type}
                                                                    >
                                                                        {({ selected, active }) => (
                                                                            <>
                                                                                <div className="flex">
                                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                                                                                        {dataset_type.type}
                                                                                    </span>
                                                                                    <span className={classNames(active ? 'text-blue-200' : 'text-gray-500', 'ml-2 truncate')}>
                                                                                        {dataset_type.format}
                                                                                    </span>
                                                                                </div>

                                                                                {selected ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                            active ? 'text-white' : 'text-blue-600',
                                                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                        )}
                                                                                    >
                                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Listbox>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                            onClick={selected.type === 'Email' ? () => setEmail(true) : null}
                                        >
                                            Select
                                        </button>
                                    </div>
                                </>}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>

    )
}