const normalizeContent = (formattedText) => {
    let links = [];

    // TODO: burn this thing

    formattedText = formattedText?.replace(
        /(\[[^\]]+\])(https?:\/\/[^\s]+)/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/(https?:\/\/[^\s | ^\)]+)/g)[0]
            });
            return (
                `%%${links.length - 1}%%`
            )
        }
    );

    formattedText = formattedText?.replace(
        /(@[\d\w-]+)\(([^\)]+)\)/g,
        (match) => {
            links.push({
                signature: match.match(/\(([^\(]+)\)/g)[0].replace(/\(|\)/g, ''),
                link: match.match(/(@[\d\w-]+)/g)[0]
            });
            return (
                `%%${links.length - 1}%%`
            );
        }
    );

    formattedText = formattedText?.replace(
        /(\[[^\]]+\])\(([^\s]+)\)/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/\(([^\s]+)\)/g)[0].replace(/\(|\)/g, '')
            });
            return (
                `%%${links.length - 1}%%`
            );
        }
    );

    formattedText = formattedText?.replace(
        /(\[[^\]]+\])(https:\/\/[^\s]+[^\.])/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/(https:\/\/[^\s]+[^\.])/g)[0]
            });
            return (
                `%%${links.length - 1}%%`
            );
        }
    );

    formattedText = formattedText?.replace(
        /(\[[^\]]+\])([^\s]*@[^\s]*\.[^\a]*)/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/([^\s]*@[^\s]*\.[^\a]*)/g)[0]
            });
            return (
                `%%${links.length - 1}%%`
            );
        }
    );

    formattedText = formattedText?.replace(
        /(\[[^\]]+\])\((https?:\/\/[^\s]+)\)/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/(https?:\/\/[^\s | ^\)]+)/g)[0]
            });
            return (
                `%%${links.length - 1}%%`
            );
        }
    );

  formattedText = formattedText?.replace(
    /(\[[^\]]+\])(mailto?:[^\s]+[^\.])/g,
    (match) => {
      links.push({
        signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
          link: match.match(/(mailto?:[^\s]+[^\.])/g)[0]
      });
      return (
        `%%${links.length - 1}%%`
      );
    }
  );

    formattedText = formattedText?.replace(
        /(https?:\/\/[^\s]+)/g,
        (match) => {
            links.push({signature: '', link: match});
            return(
                `%%${links.length - 1}%%`
            )
        }
    );

    formattedText = formattedText?.replace(
        /\*\*.+\*\*/g,
        (match) => (
            `<span style="font-weight: 700;">${match.match(/.+/g)[0].replace(/\*\*/g, '')}</span>`
        )
    );

    formattedText = formattedText?.replace(
        /(_.+?_)/g,
        (match) => (
                `<span style="font-style: italic;">${match.match(/([^\.]+)/g)[0].replace(/_/g, '')}</span>`
            )
        )

    formattedText = formattedText?.replace(
        /%%([\d]+)%%/g,
        (match) => (
            `<span key=${links[match.replace(/%%/g, '')].link} class="newsPage__link">
                ${links[match.replace(/%%/g, '')]?.signature ? links[match.replace(/%%/g, '')]?.signature : 'ссылка'}
             </span>`
        )
    );

    formattedText = formattedText?.replace(
        /@@.+@@/g,
        (match) => (
            `<div class="newsPage__quote">«${match.match(/.+/g)[0].replace(/@@/g, '')}»</div>`
        )
    )

    formattedText = formattedText?.split(/\n\n/).map((text) => {
        return text.replace(/\@\@.+/g, (match) => (
            `<div class="newsPage__quote">«${match.match(/.+/g)[0].replace(/@@/g, '')}»</div>`
        ));
    });

    formattedText = formattedText?.map((text) => {
        return text.replace(/###.+/g, (match) => (
            `<span style="font-weight: 900;">${match.match(/.+/g)[0].replace(/###/g, '')}</span>`
        ));
    });

    formattedText = formattedText?.map((text) => {
        return text.replace(/##.+/g, (match) => (
            `<span style="font-weight: 900;">${match.match(/.+/g)[0].replace(/##/g, '')}</span>`
        ));
    });

    return (formattedText);
};

export default normalizeContent;
