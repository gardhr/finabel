import java.math.BigInteger;

public class Finabel {
    static String hexadecimal = "0123456789abcdef";
    static String lookup[] = new String[256];
    static boolean uninitialized = true;

    private static String toHex(String text) {
        if (uninitialized == true) {
            uninitialized = false;
            for (int index = 0; index < 256; ++index)
                lookup[index] = String.valueOf(hexadecimal.charAt(index >> 4)) +
                String.valueOf(hexadecimal.charAt(index & 0xf));
        }
        String result = "";
        byte encoded[] = null;
        try {
            encoded = text.getBytes("UTF8");
        } catch (java.io.UnsupportedEncodingException error) {}
        for (int index = 0; index < encoded.length; ++index)
            result = result.concat(lookup[encoded[index] & 0xff]);
        return result;
    }

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
    static String record_separator = toHex("\u001e");
    static String field_separator = toHex("\u001c");

    private static BigInteger stretch(BigInteger value) {
        String hexadecimal = value.toString(16);
        String buffer = hexadecimal;
        do {
            buffer = buffer.concat(record_separator + hexadecimal);
        } while (buffer.length() < minimum_digits);
        return new BigInteger(buffer, 16);
    }

    public String hash(String keys[], int rounds, int digits) {
        if (rounds == 0)
            rounds = 500;
        String merged = record_separator;
        for (int index = 0, limit = keys.length; index < limit; ++index) {
            String next = keys[index];
            if (next == null || next == "") continue;
            merged = merged.concat(toHex(next) + field_separator);
        }

        var V = new BigInteger(merged, 16);
        do {
            var Q = stretch(V);
            var R = Q.multiply(A).mod(B);
            var S = stretch(R);
            V = Q.multiply(S).mod(C);
        } while (rounds-- > 0);

        String text = V.toString(16);

        if (digits > 0) {
            int length = text.length();
            if (length > digits) return text.substring(0, digits);
            while (length++ < digits) text = text.concat("0");
        }
        
        return text;
    }

    public static void main(String[] argv) {
        System.out.println("Usage: java Finabel.java [KEY] [SALT] [ROUNDS] [DIGITS]");
        int argc = argv.length;
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
        String keys[] = {
            key,
            salt
        };
        Finabel finabel = new Finabel();
        System.out.println(finabel.hash(keys, rounds, digits));
    }
}
