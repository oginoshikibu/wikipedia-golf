import React, { useState, useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';

const WIKIPEDIA_API_BASE_URL = 'https://ja.wikipedia.org/w/rest.php/v1/page';

/**
 * WikiPageViewer component for displaying Wikipedia pages
 * @param {string} jaPageTitle - The title of the Japanese Wikipedia page
 * @param {function} updateCurrentPage - Callback function to update the current page
 * @param {boolean} canUpdate - Whether the component can trigger page updates
 */
export default function WikiPageViewer({ jaPageTitle, updateCurrentPage, canUpdate }) {
    const [wikiContent, setWikiContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (jaPageTitle !== null) {
            fetchWikiContent();
        }
    }, [jaPageTitle]);

    const fetchWikiContent = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const html = await fetchWikiPageHTML(jaPageTitle);
            setWikiContent(processWikiHTML(html));
        } catch (err) {
            console.error('Error fetching wiki content:', err);
            setError('ページの読み込みに失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    const fetchWikiPageHTML = async (title) => {
        const url = `${WIKIPEDIA_API_BASE_URL}/${encodeURIComponent(title)}/with_html`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.html;
    };

    const processWikiHTML = (html) => {
        return parse(html, {
            replace: (domNode) => processHTMLNode(domNode),
        });
    };

    const processHTMLNode = ({ attribs, children, name, parent }) => {
        if (!attribs) return;

        // Handle stylesheets
        if (attribs.rel === 'stylesheet') {
            return React.createElement(name, {
                ...attribs,
                href: 'css/wiki.css'
            });
        }

        // Handle external links
        if (attribs.href && isExternalLink(attribs.href)) {
            return createDisabledLink(attribs, children, name);
        }

        // Process attributes
        const processedAttribs = processAttributes(attribs);

        // Handle internal Wikipedia links
        if (attribs.href && parent && parent.name !== 'head') {
            const isValidInternalLink = /^\.\/(?!.*(#cite|\?))[^\/]*$/.test(attribs.href);
            
            if (isValidInternalLink) {
                return createInternalLink(processedAttribs, children, attribs.href);
            } else {
                return createDisabledLink(processedAttribs, children, 'span');
            }
        }

        return undefined;
    };

    const isExternalLink = (href) => {
        return /^(http|https|\/\/|mw-data)/.test(href);
    };

    const createDisabledLink = (attribs, children, tagName = 'span') => {
        const processedAttribs = processAttributes({ ...attribs, href: null });
        return React.createElement(tagName, processedAttribs, 
            children && domToReact(children, { replace: processHTMLNode })
        );
    };

    const createInternalLink = (attribs, children, href) => {
        return (
            <a
                {...attribs}
                onClick={handleInternalLinkClick(href)}
            >
                {children && domToReact(children, { replace: processHTMLNode })}
            </a>
        );
    };

    const handleInternalLinkClick = (href) => (e) => {
        e.preventDefault();
        
        if (!canUpdate) {
            return;
        }
        
        setLoading(true);
        const nextPageTitle = href.replace('./', '');
        updateCurrentPage(nextPageTitle);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const processAttributes = (attribs) => {
        const processed = { ...attribs };
        
        // Convert class to className
        if (processed.class) {
            processed.className = processed.class;
            delete processed.class;
        }
        
        // Convert style string to object
        if (processed.style && typeof processed.style === 'string') {
            processed.style = parseStyleString(processed.style);
        }
        
        return processed;
    };

    const parseStyleString = (styleString) => {
        return styleString.split(';').reduce((obj, styleDeclaration) => {
            const [property, value] = styleDeclaration.split(':');
            if (property && value) {
                const camelCaseProperty = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                obj[camelCaseProperty] = value.trim();
            }
            return obj;
        }, {});
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">読み込み中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return <div className="wiki-content">{wikiContent}</div>;
}