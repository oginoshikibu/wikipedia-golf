import React from "react";
import { Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AccountCircle({ auth, ...props }) {
    return (
        <>
            <div {...props}>
                <Dropdown>
                    <Dropdown.Trigger>
                        <button type="button" className="h-full w-full">
                            <img src="img/account_circle_FILL0_wght200_GRAD-25_opsz24.svg" className="h-full" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Link href={route('dashboard')}>Dashboard</Dropdown.Link>
                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </>

    )

}