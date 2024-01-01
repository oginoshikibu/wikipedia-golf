import { useEffect } from "react";

export default function Iframe({ src, className = '', ...props }) {


    return (
        <iframe {...props} src={src} className={className} />
    );
}
