import React from 'react';
import { Head } from '@inertiajs/react';

export default function AppHead({ title }) {
    return (
        <Head title={title}>
            <link  ref="icon" type="svg+xml" sizes="48x48" href="img/sport010.svg"/>
        </Head>
    )
}