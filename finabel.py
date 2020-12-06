import math

# Static lookup tables

lookupHex = [None] * 256
lookupCode = [None] * 256
uninitialized = True

# Convert a utf-8 string to hexadecimal digits

def toHex(text):
    global lookupHex
    result = ''
    bytes = text.encode()
    for index in range(len(bytes)):
        result += lookupHex[bytes[index]]
    return result

# A few large safe primes

A = 900868433651123753195857434154886592863492075718887214387046829406809805283361296277175990663685161530183997243896077623165157756007099732429029873106259069821886766195661979481563101826429797570890866473513531898785774896418926615059720815237664116812063491035355207065882456370964859448027182804663

B = 906746488931122279923087816774254262549325961021203686871024593960273364483640837461275651353839912478276312989231907136777434371442297783809058139703704548112582549231057887119837609961275494698594028464424938139236812786325180573685365716054578878269276609138278646089652565880503149299047623725983

C = 935963679945159621618108135650731602316123462844739918966791054002220621454733515962631838558167071714943415781502503512108093455147689164719674990397035764248808486754562236727013255473894080575022971540677037449750273014794528407667454650131576454015775014701175216242011377646611112897139737772263

minimum_digits = len(hex(C)[2:])

# Separators improve immalleability

record_separator = None
field_separator = None

# Key stretching function

def stretch(value):
    global record_separator, minimum_digits
    hexadecimal = hex(value)[2:]
    buffer = hexadecimal
    while True:
        buffer += record_separator + hexadecimal
        if len(buffer) >= minimum_digits:
            break
    return int(buffer, 16)

# Cycle once through our finite fields

def cycle(V):
    global A, B, C
    Q = stretch(V)
    R = Q * A % B
    S = stretch(R)
    return Q * S % C

# Hash function interface

def finabel(
    key,
    salt,
    rounds,
    digits,
    cost,
    ):
    global uninitialized, lookupHex, lookupCode, record_separator, \
        field_separator, minimum_digits
    if uninitialized:
        uninitialized = False
        hexadecimal = '0123456789abcdef'
        for index in range(256):
            lookupHex[index] = hexadecimal[index >> 4] \
                + hexadecimal[index & 0xF]
        for index in range(0x30, 0x3a):
            lookupCode[index] = index - 0x30
        for index in range(0x61, 0x67):
            lookupCode[index] = index - 0x57
        record_separator = toHex("\u001e")
        field_separator = toHex("\u001c")
    if rounds is None or rounds == 0:
        rounds = 1024
    if cost is None or cost == 0:
        cost = 512
    cost *= 1024
    keys = (key if isinstance(key, list) else [key])
    keys.append(salt)

# Initial construction: concatenate keys/salt

    merged = record_separator
    for index in range(len(keys)):
        next = keys[index]
        if next is None or next == '':
            continue
        merged += toHex(next) + field_separator
    V = int(merged, 16)

# Estimate the number of rounds needed to construct the result

    window = math.floor(cost / minimum_digits) + 1
    discards = (rounds - window if window <= rounds else 0)

# Spin through "discard" rounds

    while discards > 0:
        discards -= 1
        V = cycle(V)

# Finish off with enough rounds needed satisfy our memory quota

    buffer = ''
    while True:
        V = cycle(V)
        buffer += hex(V)[2:]
        if len(buffer) >= cost:
            break

# Build the result using memory-dependant construction, back to front

    result = ''
    current = len(buffer) - 1
    while True:
        read = current
        accumulator = 0
        while accumulator < window:
            if read == 0:
                break
            read -= 1        
            accumulator <<= 4
            accumulator |= lookupCode[buffer[read].encode()[0]]
        offset = math.floor(accumulator % window) + 1
        if offset >= current:
            break
        current -= offset
        result += buffer[current]

# Truncate or pad the result, if necessary

    if digits > 0:
        length = len(result)
        if length > digits:
            return result[0:digits]
        while length < digits:
            result += '0'
            length += 1
    return result

