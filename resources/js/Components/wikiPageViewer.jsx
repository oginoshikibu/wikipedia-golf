import React, { useState, useEffect } from 'react'; // Add useState and useEffect
import parse, { domToReact } from 'html-react-parser';

export default function wikiPageViewer(jaPageTitle) {
    const [wikiContent, setWikiContent] = useState(null);

    useEffect(() => {
        if (jaPageTitle !== null) {
            const fetchContent = async () => {
                const html = await wikiFetchAsync(jaPageTitle);
                setWikiContent(
                    <>
                        {/* {updateLinksToPopups(html, false)} */}
                        {updateLinksToPopups(html, true)}
                    </>
                );
            };
            fetchContent();
        }
    }, [jaPageTitle]);

    const wikiFetch = async (title) => {
        let url = encodeURI(`https://ja.wikipedia.org/w/rest.php/v1/page/${title}/with_html`);
        const rsp = await fetch(url);
        const data = await rsp.json(); // Await the response JSON parsing
        return data.html;
    }

    const wikiFetchAsync = async (title) => {
        try {
            let result = await wikiFetch(title);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    const updateLinksToPopups = (html, flag) => {
        const options = {
            replace: ({ attribs, children, parent }) => {
                if (!attribs || !attribs.href) return;

                // class属性をclassNameに変更
                if (attribs.class) {
                    attribs.className = attribs.class;
                    delete attribs.class;
                }

                // style属性が存在する場合
                if (attribs.style) {
                    // style属性をオブジェクトに変換
                    const styleObject = attribs.style.split(';').reduce((obj, styleDeclaration) => {
                        const parts = styleDeclaration.split(':');
                        if (parts[0] && parts[1]) {
                            obj[parts[0].trim()] = parts[1].trim();
                        }
                        return obj;
                    }, {});
                    attribs.style = styleObject;
                }

                // aタグの場合
                if (attribs.href && parent && parent.name !== 'head') {
                    attribs.href = 'https://ja.wikipedia.org';

                    // console.log(attribs,"attribs");
                    // console.log(children,"children");
                    // console.log(parent,"parent");
                    // console.log(domToReact(children, options),"domToReact(children, options)");
                    // return;

                    return (
                        <a
                            {...attribs}
                            onClick={(e) => {
                                e.preventDefault();
                                console.log(attribs);
                            }}
                        >
                            {domToReact(children, options)}
                        </a>
                    );
                }
            }
        }

        if (flag) {
            return parse(html, options);
        } else {
            return parse(html);
        }
    }

    if (jaPageTitle === null || wikiContent === null) {
        return (
            <>
                <p>loading...</p>
            </>
        )
    }

    return wikiContent;
}