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
            replace: ({ attribs, children, name, parent }) => {
                if (!attribs || !attribs.href) return;

                // class属性をclassNameに変更
                if (attribs.class) {
                    attribs.className = attribs.class;
                    delete attribs.class;
                }
                // style属性が存在し、それが文字列である場合
                if (attribs.style && typeof attribs.style === 'string') {
                    // style属性をオブジェクトに変換
                    const styleObject = attribs.style.split(';').reduce((obj, styleDeclaration) => {
                        const parts = styleDeclaration.split(':');
                        if (parts[0] && parts[1]) {
                            let property = parts[0].trim();
                            // CSSプロパティをcamelCaseに変換
                            property = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
                            obj[property] = parts[1].trim();
                        }
                        return obj;
                    }, {});
                    attribs.style = styleObject;
                }

                // aタグの場合
                if (attribs.href && parent && parent.name !== 'head') {
                    // 一階層下のリンクのみを対象にする ex. ./hoge
                    const isChildLink = attribs.href.match(/^\.\/[^\/]*$/);

                    if (isChildLink) {
                        return (
                            <a
                                {...attribs}
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log("有効リンク");
                                }}
                            >
                                {domToReact(children, options)}
                            </a>
                        );
                    } else {
                        return (
                            <a
                                {...attribs}
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log("無効リンク");
                                }}
                            >
                                {domToReact(children, options)}
                            </a >
                        );
                    }
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