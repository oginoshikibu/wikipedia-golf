import React, { useState, useEffect } from 'react'; // Add useState and useEffect
import parse, { domToReact } from 'html-react-parser';

export default function wikiPageViewer(jaPageTitle, updateCurrentPage, canUpdate) {
    const [wikiContent, setWikiContent] = useState(null);
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        try {
            let result = await wikiFetch(title);
            setLoading(false);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    const updateLinksToPopups = (html) => {
        const options = {
            replace: ({ attribs, children, name, parent }) => {

                if (!attribs || !attribs.href) return;

                if (attribs.rel === 'stylesheet') {
                    attribs.href = 'css/wiki.css'
                    return;
                }

                // 外部リンクの場合、リンクを削除する
                if (attribs.href.match(/^(http|https):\/\//) || attribs.href.match(/^\/\/ja.wikipedia.org/)) {
                    attribs.href = null;
                    return;
                }

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
                                    if (!canUpdate) {
                                        return;
                                    }
                                    setLoading(true);
                                    const nextPageTitle = attribs.href.replace('./', '');
                                    updateCurrentPage(nextPageTitle);
                                    window.scrollTo({ top: 0, behavior: "smooth" })
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
                                    alert("無効なリンクです。");
                                }}
                            >
                                {domToReact(children, options)}
                            </a >
                        );
                    }
                }
            }
        }

        return parse(html, options);
    }

    if (loading || wikiContent === null) {
        return (
            <>
                <p>loading...</p>
            </>
        )
    }

    return wikiContent;
}