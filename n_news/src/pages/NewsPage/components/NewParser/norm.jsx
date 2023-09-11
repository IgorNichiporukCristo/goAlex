const normalizeContent = (formattedText) => {
    let links = [];

    formattedText = formattedText?.replace(
        /(\[[^\]]+\])(https?:\/\/[^\s]+)/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[^\]]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/(https?:\/\/[^\s | ^\)]+)/g)[0]
            });
            return (
                `%%${links.length - 1}%%`;
        )}
    );

    formattedText = formattedText?.replace(
        /(\[[a-zA-Zа-яёА-ЯЁ|0-9|\s|\.]+\])\((https?:\/\/[^\s]+)\)/g,
        (match) => {
            links.push({
                signature: match.match(/(\[[a-zA-Zа-яёА-ЯЁ|0-9|\s|\.]+\])/g)[0].replace(/\[|\]/g, ''),
                link: match.match(/(https?:\/\/[^\s | ^\)]+)/g)[0]
            });
            return (
                `%%${links.length - 1}%%`
            );
        }
    );

  formattedText = formattedText?.replace(
    /(\[[a-zA-Zа-яёА-ЯЁ|0-9|\s|\.]+\])\((mailto?:[^\s]+)\)/g,
    (match) => {
      links.push({
        signature: match.match(/(\[[a-zA-Zа-яёА-ЯЁ|0-9|\s|\.]+\])/g)[0].replace(/\[|\]/g, ''),
        link: match.match(/(https?:\/\/[^\s | ^\)]+)/g)[0]
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
    );

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

const tokenize = (textObj) => {

    const reg_obj = [
        {
            reg: /(\[[a-zA-Zа-яёА-ЯЁ|0-9|\s|\.]+\])\((https?:\/\/[^\s]+)\)/g,
            type: "desk_link"
        },
        {
            reg: /(\[[a-zA-Zа-яёА-ЯЁ|0-9|\s|\.]+\])\((mailto?:[^\s]+)\)/g,
            type: "mail_link"
        },
        {
            reg: /(https?:\/\/[^\s]+)/g,
            type: "nd_link",            
        },
        {
            reg: /\*\*.+\*\*/g,
            type: "italic",
        },
        {
            reg: /%%([\d]+)%%/g,
            type: "post_link",
        },
        {
            reg: "/@@.+@@/g",
            type: "quote"
        },
        {
            reg: "/@@.+@@/g",
            type: "quote"
        },
        {
            reg: /###.+/g,
            type: "bold"
        },
        {
            reg: /##.+/g,
            type: "bold"
        },
        
    ];
   
};

const normalizeContentToken = (formattedText) => {
    let iter = 0 ;
    let ret = [{
        type: "raw_text",
        text: formattedText
    }];

    while (tokenize(ret) && iter <= 1000)
        iter++;
    
    return ;
};

export default normalizeContent;


