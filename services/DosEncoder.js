const extended = Array.from("⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ");
const encodeMap = Object.fromEntries(extended.map((c, i) => [c, i + 127]));
const decodeMap = new Uint16Array(extended.map(c => c.charCodeAt(0)));

export function encode(text) {
    // possibly over-allocate to avoid extra iteration (if contains non-BMP characters)
    const result = new Uint8Array(text.length);

    // iterate each code point, which may be multiple code units (text[i], charCodeAt)
    let i = 0;
    for (const c of text) {
        // all necessary characters are in the BMP, so only the first code unit is needed
        const code = c.charCodeAt(0);
        if (code < 127) {
            result[i] = code;
        } else {
            const cp437Code = encodeMap[c];
            if (cp437Code === undefined) {
                throw new Error(`cannot encode '${c}' (code ${code}) for DOS (CP437)`);
            }
            result[i] = cp437Code;
        }
        i++;
    }
    return result.subarray(0, i);
}

const decoder = new TextDecoder('utf-16');
export function decode(data) {
    const utf16Buffer = new Uint16Array(data.length);
    for (let i = 0; i < data.length; i++) {
        const codeUnit = data[i];
        utf16Buffer[i] = codeUnit > 126
            ? decodeMap[codeUnit - 127]
            : codeUnit;
    }
    return new TextDecoder("utf-16", { ignoreBOM: true }).decode(utf16Buffer);
}
