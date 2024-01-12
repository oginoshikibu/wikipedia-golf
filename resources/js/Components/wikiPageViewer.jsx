

export default function wikiPageViewer({jaPageTitle}){

    const wikiFetch = async (title) => {
        let url = encodeURI(`https://ja.wikipedia.org/w/rest.php/v1/page/${title}/with_html`);
        const rsp = await fetch(url);
        const data = await rsp.json();
        return data;
    }

    const wikiFetchAsync = async (title) => {
        try {
            let result = await wikiFetch(title);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    const updateLinksToPopups = (html) => {
        const options = {
            replace: ({ attribs, children, parent }) => {
                if (!attribs || !attribs.href) return;

                // class属性をclassNameに変更
                if (attribs.class) {
                    attribs.className = attribs.class;
                    delete attribs.class;
                }

                // aタグの場合
                if (attribs.href && parent && parent.name !== 'head') {
                    return React.createElement('a', {
                        ...attribs,
                        onClick: (e) => {
                            e.preventDefault();
                            console.log(attribs)
                            onClickWikiLink(children[0].data, attribs.href);
                        }
                    }, domToReact(children, options));

                }
            }
        }
        return parse(html, options);
    }

    return(
        <>
            {updateLinksToPopups(wikiFetchAsync(title))}
        </>
    )

}