function getValueFromPropertyNameRec(object : any, path: string) {
    return path.split(/[\.\[\]\'\"]/) // Split with . or [ ]
    .filter(p => p) // Delete empty result based on previous split
    .reduce((o, p) => (o && typeof(o) === 'object') ? o[p] : undefined, object)
}


export function replaceMustache(str :string, msg : any) {
    if (typeof str !== "string")
        return str;

    const matches = str.match(/\{\{.+?\}\}/g)
    let result = str

    if (matches.length > 0) { // if the string has at least a double brackets like {{ foo }}
        for (const match of matches) {
            const path = match.replace(/\{\{(.*?)\}\}/g, '$1')
            const firstProp = path.split(/[\.\[\]\'\"]/)[0]
            let replace : string | undefined
            switch (firstProp) {
                case 'msg' :
                    replace = getValueFromPropertyNameRec({ msg : msg }, path)
                    break
                case 'env' :
                    replace = getValueFromPropertyNameRec({ env : process.env }, path)
                    break
                default:
                    replace = undefined;
            }
            result = result.replace(match, replace)
        }

    } 
    return result;
}