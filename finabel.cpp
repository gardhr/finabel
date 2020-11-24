#include "finabel.hpp"
#include "gmp.h"

namespace gardhr {

std::string toHex(std::string const& text) {
  char hexadecimal[] = "0123456789abcdef";
  std::string result;
  for (size_t index = 0, limit = text.size(); index < limit; ++index) {
    unsigned char byte = text[index];
    result += hexadecimal[byte >> 4];
    result += hexadecimal[byte & 0xf];
  }
  return result;
}

/*
 Basic mpz_t RAII wrapper
*/
struct BigInt {
  BigInt(std::string const& text = "", size_t base = 10) {
    mpz_init(data);
    mpz_set_str(data, text.c_str(), base);
  }

  BigInt(BigInt const& rhs) {
    mpz_init(data);
    mpz_set_str(data, rhs.toString(16).c_str(), 16);
  }

  BigInt operator=(BigInt const& rhs) {
    mpz_set_str(data, rhs.toString(16).c_str(), 16);
    return *this;
  }

  std::string toString(size_t base = 10) const {
    char* buffer = mpz_get_str(NULL, base, data);
    std::string text = buffer;
    void (*freefunc)(void*, size_t);
    mp_get_memory_functions(NULL, NULL, &freefunc);
    freefunc(buffer, 0);
    return text;
  }

  ~BigInt() { mpz_clear(data); }

  mpz_t data;
};

static size_t minimum_digits;
static std::string record_separator = toHex("\x1e");
static std::string field_separator = toHex("\x1c");

BigInt stretch(BigInt const& value) {
  std::string hexadecimal = value.toString(16);
  std::string buffer = hexadecimal;
  do {
    buffer += record_separator + hexadecimal;
  } while (buffer.size() < minimum_digits);
  return BigInt(buffer, 16);
}

std::string finabel(std::vector<std::string> const& keys,
                    size_t rounds = 0,
                    size_t digits = 0) {
  static BigInt A, B, C;
  static bool uninitialized = true;

  if (uninitialized) {
    uninitialized = false;

    A = BigInt(
        "90086843365112375319585743415488659286349207571888"
        "72143870468294068098052833612962771759906636851615"
        "30183997243896077623165157756007099732429029873106"
        "25906982188676619566197948156310182642979757089086"
        "64735135318987857748964189266150597208152376641168"
        "12063491035355207065882456370964859448027182804663");

    B = BigInt(
        "90674648893112227992308781677425426254932596102120"
        "36868710245939602733644836408374612756513538399124"
        "78276312989231907136777434371442297783809058139703"
        "70454811258254923105788711983760996127549469859402"
        "84644249381392368127863251805736853657160545788782"
        "69276609138278646089652565880503149299047623725983");

    C = BigInt(
        "93596367994515962161810813565073160231612346284473"
        "99189667910540022206214547335159626318385581670717"
        "14943415781502503512108093455147689164719674990397"
        "03576424880848675456223672701325547389408057502297"
        "15406770374497502730147945284076674546501315764540"
        "15775014701175216242011377646611112897139737772263");

    minimum_digits = C.toString(16).size();
  }

  if (rounds == 0)
    rounds = 1000;
  std::string merged = record_separator;
  for (size_t index = 0, limit = keys.size(); index < limit; ++index) {
    const std::string& next = keys[index];
    if (next != "")
      merged += toHex(next) + field_separator;
  }

  BigInt Q, R, S, tmp;
  BigInt V = BigInt(merged, 16);
  do {
    Q = stretch(V);
    mpz_mul(tmp.data, Q.data, A.data);
    mpz_mod(R.data, tmp.data, B.data);
    S = stretch(R);
    mpz_mul(tmp.data, Q.data, S.data);
    mpz_mod(V.data, tmp.data, C.data);
  } while (rounds-- != 0);

  std::string text = V.toString(16);

  if (digits > 0) {
    size_t length = text.size();
    if (length > digits)
      return text.substr(0, digits);
    while (length++ < digits)
      text += "0";
  }

  return text;
}

}  // namespace gardhr

using gardhr::finabel;

