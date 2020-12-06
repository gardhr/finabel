import java.math.BigInteger;

public class Finabel {

    static String hexadecimal = "0123456789abcdef";
    static String lookupHex[] = new String[256];
    static int lookupCode[] = new int[256];
    static String record_separator = null;
    static String field_separator = null;
    static boolean uninitialized = true;

    Finabel() {
        if (uninitialized) {
            uninitialized = false;

            /*
 Static lookup tables
*/
            for (int index = 0; index < 256; ++index)
                lookupHex[index] = String.valueOf(hexadecimal.charAt(index >> 4)) +
                String.valueOf(hexadecimal.charAt(index & 0xf));

            for (int index = 0x30; index < 0x3a; ++index)
                lookupCode[index] = index - 0x30;
            for (int index = 0x61; index < 0x67; ++index)
                lookupCode[index] = index - 0x57;

            /*
 Separators improve immalleability 
*/

            record_separator = toHex("\u001e");
            field_separator = toHex("\u001c");
        }
    }

    /*
 Convert a utf-8 string to hexadecimal digits
*/

    private static String toHex(String text) {
        String result = "";
        byte encoded[] = null;
        try {
            encoded = text.getBytes("UTF8");
        } catch (java.io.UnsupportedEncodingException error) {}
        for (int index = 0; index < encoded.length; ++index)
            result += lookupHex[encoded[index] & 0xff];
        return result;
    }

    /*
 A few large safe primes
*/

    static BigInteger A = new BigInteger(
        "90086843365112375319585743415488659286349207571888" +
        "72143870468294068098052833612962771759906636851615" +
        "30183997243896077623165157756007099732429029873106" +
        "25906982188676619566197948156310182642979757089086" +
        "64735135318987857748964189266150597208152376641168" +
        "12063491035355207065882456370964859448027182804663"
    );

    static BigInteger B = new BigInteger(
        "90674648893112227992308781677425426254932596102120" +
        "36868710245939602733644836408374612756513538399124" +
        "78276312989231907136777434371442297783809058139703" +
        "70454811258254923105788711983760996127549469859402" +
        "84644249381392368127863251805736853657160545788782" +
        "69276609138278646089652565880503149299047623725983"
    );

    static BigInteger C = new BigInteger(
        "93596367994515962161810813565073160231612346284473" +
        "99189667910540022206214547335159626318385581670717" +
        "14943415781502503512108093455147689164719674990397" +
        "03576424880848675456223672701325547389408057502297" +
        "15406770374497502730147945284076674546501315764540" +
        "15775014701175216242011377646611112897139737772263"
    );

    static int minimum_digits = C.toString(16).length();

    /*
 Key stretching function
*/

    private static BigInteger stretch(BigInteger value) {
        String hexadecimal = value.toString(16);
        String buffer = hexadecimal;
        do {
            buffer += (record_separator + hexadecimal);
        } while (buffer.length() < minimum_digits);
        return new BigInteger(buffer, 16);
    }

    /*
 Cycle once through our finite fields
*/

    private static BigInteger cycle(BigInteger V) {
        BigInteger Q = stretch(V);
        BigInteger R = Q.multiply(A).mod(B);
        BigInteger S = stretch(R);
        return Q.multiply(S).mod(C);
    }

    /*
 Hash function interface
*/

    public String hash(String keys[], int rounds, int digits, int cost) {

        if (rounds == 0)
            rounds = 1024;
        if (cost == 0)
            cost = 512;
        cost *= 1024;
        /*
 Initial construction: concatenate keys/salt
*/
        String merged = record_separator;
        for (int index = 0, limit = keys.length; index < limit; ++index) {
            String next = keys[index];
            if (next == null || next == "") continue;
            merged += toHex(next) + field_separator;
        }

        BigInteger V = new BigInteger(merged, 16);

        /*
 Estimate the number of rounds needed to construct the result
*/

        int window = cost / minimum_digits + 1;
        int discards = (window <= rounds) ? rounds - window : 0;

        /*
 Spin through "discard" rounds   
*/

        while (discards-- > 0) V = cycle(V);

        /*
 Finish off with enough rounds needed satisfy our memory quota   
*/

        String buffer = "";
        while (true) {
            V = cycle(V);
            buffer += V.toString(16);
            if (buffer.length() >= cost)
                break;
        }

        /*
  Build the result using memory-dependant construction, back to front
*/
        String result = "";
        int current = buffer.length() - 1;
        while(true) {
            int read = current;
            int accumulator = 0;

            while (accumulator < window) {
                if (read-- == 0) break;
                accumulator <<= 4;
                accumulator |= lookupCode[buffer.codePointAt(read)];
            }
            int offset = (int)(Math.floor(accumulator % window) + 1);
            if (offset >= current) break;
            current -= offset;
            result += buffer.charAt(current);
        }

        /*
  Truncate or pad the result, if necessary
*/
        if (digits > 0) {
            int length = result.length();
            if (length > digits) return result.substring(0, digits);
            while (length++ < digits) result = result.concat("0");
        }

        return result;
    }

    /*
  Example usage
*/

    public static void main(String[] argv) {

        int argc = argv.length;
        if (argc <= 1)
            System.out.println("Usage: java Finabel.java [KEY] [SALT] [ROUNDS] [DIGITS] [COST]");
        String key = "";
        if (argc > 0)
            key = argv[0];
        String salt = "";
        if (argc > 1)
            salt = argv[1];
        int rounds = 0;
        if (argc > 2)
            rounds = Integer.parseInt(argv[2]);
        int digits = 0;
        if (argc > 3)
            digits = Integer.parseInt(argv[3]);
        int cost = 0;
        if (argc > 4)
            cost = Integer.parseInt(argv[4]);
        String keys[] = {
            key,
            salt
        };

        Finabel finabel = new Finabel();
        System.out.println(finabel.hash(keys, rounds, digits, cost));
    }
}
