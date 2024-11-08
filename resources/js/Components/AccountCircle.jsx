import React from "react";
import Dropdown from "@/Components/Dropdown";

export default function AccountCircle({ auth, ...props }) {
    return (
        <>
            <div {...props}>
                <div type="button" className="h-full w-full">
                    <img src="img/account_circle_FILL0_wght200_GRAD-25_opsz24.svg" className="h-full" />
                </div>
            </div>
        </>

    )

}