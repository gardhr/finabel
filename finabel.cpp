#include "finabel.hpp"
#include "gmp.h"

namespace gardhr {

/*
 Convert a utf-8 string to hexadecimal digits
*/

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
  BigInt() { mpz_init(data); }

  BigInt(std::string const& text, size_t base = 10) {
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

/*
 Separators improve immalleability
*/

static std::string record_separator = toHex("\x1e");
static std::string field_separator = toHex("\x1c");
static size_t minimum_digits;

/*
 Key stretching function
*/

BigInt stretch(BigInt const& value) {
  std::string hexadecimal = value.toString(16);
  std::string buffer = hexadecimal;
  do {
    buffer += record_separator + hexadecimal;
  } while (buffer.size() < minimum_digits);
  return BigInt(buffer, 16);
}

/*
 Calculate X * Y mod P
*/

BigInt congruence(BigInt const& lhs, BigInt const& rhs, BigInt const& mod) {
  BigInt tmp, res;
  mpz_mul(tmp.data, lhs.data, rhs.data);
  mpz_mod(res.data, tmp.data, mod.data);
  return res;
}

/*
 Cycle once through our finite fields
*/

BigInt cycle(BigInt const& V,
             BigInt const& A,
             BigInt const& B,
             BigInt const& C) {
  BigInt Q = stretch(V);
  BigInt R = congruence(Q, A, B);
  BigInt S = stretch(R);
  return congruence(Q, S, C);
}

/*
 Hash function interface
*/

std::string finabel(std::vector<std::string> const& keys,
                    size_t rounds = 0,
                    size_t digits = 0,
                    size_t cost = 0) {
  static BigInt A, B, C;
  static char lookupCode[256];
  static bool uninitialized = true;

  if (uninitialized) {
    uninitialized = false;

    /*
     A few large safe primes
  */

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

    /*
     Static lookup tables
  */

    for (size_t index = 0x30; index < 0x3a; ++index)
      lookupCode[index] = index - 0x30;
    for (size_t index = 0x61; index < 0x67; ++index)
      lookupCode[index] = index - 0x57;

    minimum_digits = C.toString(16).size();
  }

  if (rounds == 0)
    rounds = 1024;

  if (cost == 0)
    cost = 512;
  cost *= 1024;

  /*
   Initial construction: concatenate keys/salt
*/

  std::string merged = record_separator;
  for (size_t index = 0, limit = keys.size(); index < limit; ++index) {
    const std::string& next = keys[index];
    if (next != "")
      merged += toHex(next) + field_separator;
  }

  BigInt V = BigInt(merged, 16);

  /*
   Estimate the number of rounds needed to construct the result
*/

  size_t window = cost / minimum_digits + 1;
  size_t discards = (window > rounds) ? 0 : rounds - window;

  /*
   Spin through "discard" rounds
*/

  while (discards-- > 0)
    V = cycle(V, A, B, C);

  /*
   Finish off with enough rounds needed satisfy our memory quota
*/

  std::string buffer = "";
  while (true) {
    V = cycle(V, A, B, C);
    buffer += V.toString(16);
    if (buffer.size() >= cost)
      break;
  }

  /*
   Build the result using memory-dependant construction, back to front
*/

  std::string result = "";
  size_t current = buffer.size() - 1;
  while(true) {
    size_t read = current;
    size_t accumulator = 0;

    while (accumulator < window) {
      accumulator <<= 4;
      accumulator |= lookupCode[buffer[read]];
      if (read-- == 0)
        break;
    }

    size_t offset = accumulator % window + 1;
    if (offset >= current)
      break;
    current -= offset;
    result += buffer[current];
  }

  /*
   Truncate or pad the result, if necessary
*/

  if (digits > 0) {
    size_t length = result.size();
    if (length > digits)
      return result.substr(0, digits);
    while (length++ < digits)
      result += "0";
  }

  return result;
}

}  // namespace gardhr

using gardhr::finabel;
