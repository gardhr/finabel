def toHex(text):
    if not hasattr(toHex, "initialized"):
        toHex.initialized = True
        hexadecimal = "0123456789abcdef"
        toHex.lookup = []
        for index in range(256):
            toHex.lookup.append(hexadecimal[index >> 4] + hexadecimal[index & 0xF])
    result = ""
    bytes = text.encode()
    for index in range(len(bytes)):
        result += toHex.lookup[bytes[index]]
    return result

A = 900868433651123753195857434154886592863492075718887214387046829406809805283361296277175990663685161530183997243896077623165157756007099732429029873106259069821886766195661979481563101826429797570890866473513531898785774896418926615059720815237664116812063491035355207065882456370964859448027182804663

B = 906746488931122279923087816774254262549325961021203686871024593960273364483640837461275651353839912478276312989231907136777434371442297783809058139703704548112582549231057887119837609961275494698594028464424938139236812786325180573685365716054578878269276609138278646089652565880503149299047623725983

C = 935963679945159621618108135650731602316123462844739918966791054002220621454733515962631838558167071714943415781502503512108093455147689164719674990397035764248808486754562236727013255473894080575022971540677037449750273014794528407667454650131576454015775014701175216242011377646611112897139737772263

minimum_digits = len(hex(C)[2:])
record_separator = toHex("\u001e")
field_separator = toHex("\u001c")

def stretch(value):
    hexadecimal = hex(value)[2:]
    buffer = hexadecimal
    while True:
        buffer += record_separator + hexadecimal
        if len(buffer) >= minimum_digits:
            break
    return int(buffer, 16)

def finabel(key, salt, rounds, digits):
    if rounds is None or rounds == 0:
        rounds = 500
    keys = key if isinstance(key, list) else [key]
    keys.append(salt)
    merged = record_separator
    for index in range(len(keys)):
        next = keys[index]
        if next is None or next == "":
            continue
        merged += toHex(next) + field_separator
    V = int(merged, 16)
    while True:
        Q = stretch(V)
        R = (Q * A) % B
        S = stretch(R)
        V = (Q * S) % C
        if rounds == 0:
            break
        rounds -= 1
    text = hex(V)[2:]
    if digits > 0:
        length = len(text)
        if length > digits:
            return text[0:digits]
        while length < digits:
            text += "0"
            length += 1
    return text

