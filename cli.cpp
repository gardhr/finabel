/*
 Simple test harness to compare with Javascript implementation

 NOTE: You'll need to have the GNU Multiprecision Library (GMP) installed

 Then compile with:

 g++ -I PATH_TO_GMP -L PATH_TO_GMP/.libs -o cli cli.cpp -lgmp
*/

#include <cstring>
#include <iostream>
#include <string>
#include <vector>
#include "gmp.h"

using namespace std;

string toHex(string const& text) {
  char hex[] = "0123456789abcdef";
  string result;
  for (size_t index = 0, limit = text.size(); index < limit; ++index) {
    unsigned char byte = text[index];
    result += hex[byte >> 4];
    result += hex[byte & 0xf];
  }
  return result;
}

/*
 mpz_t RAII wrapper
*/
struct BigInt {
  BigInt(const string& text = "", size_t base = 10) {
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

  string toString(size_t base = 10) const {
    char* buffer = mpz_get_str(NULL, base, data);
    string text = buffer;
    void (*freefunc)(void*, size_t);
    mp_get_memory_functions(NULL, NULL, &freefunc);
    freefunc(buffer, 0);
    return text;
  }

  ~BigInt() { mpz_clear(data); }

  mpz_t data;
};

size_t minimum_digits;
string record_separator = toHex("\x1e");
string field_separator = toHex("\x1c");

BigInt stretch(BigInt const& value) {
  string hex = value.toString(16);
  string buffer = hex;
  do {
    buffer += record_separator + hex;
  } while (buffer.size() < minimum_digits);
  return BigInt(buffer, 16);
}

string finabel(vector<string> const& keys, size_t rounds = 0,
               size_t digits = 0) {
  static BigInt A, B, C;
  static bool uninitialized = true;

  if (uninitialized) {
  
    uninitialized = false;
    
    A = BigInt(
        "90086843365112375319585743415488659286349207571888721438704682"
        "94068098052833612962771759906636851615301839972438960776231651"
        "57756007099732429029873106259069821886766195661979481563101826"
        "42979757089086647351353189878577489641892661505972081523766411"
        "6812063491035355207065882456370964859448027182804663");

    B = BigInt(
        "90674648893112227992308781677425426254932596102120368687102459"
        "39602733644836408374612756513538399124782763129892319071367774"
        "34371442297783809058139703704548112582549231057887119837609961"
        "27549469859402846442493813923681278632518057368536571605457887"
        "8269276609138278646089652565880503149299047623725983");
    
    C = BigInt(
        "93596367994515962161810813565073160231612346284473991896679105"
        "40022206214547335159626318385581670717149434157815025035121080"
        "93455147689164719674990397035764248808486754562236727013255473"
        "89408057502297154067703744975027301479452840766745465013157645"
        "4015775014701175216242011377646611112897139737772263");

    minimum_digits = C.toString(16).size();
  }

  string merged = record_separator;
  for (size_t index = 0, limit = keys.size(); index < limit; ++index) {
    const string& next = keys[index];
    if (next != "") merged += toHex(next) + field_separator;
  }

  BigInt Q, R, F, temp;
  BigInt result = BigInt(merged, 16);
  do {
    Q = stretch(result);
    mpz_mul(temp.data, Q.data, A.data);
    mpz_mod(temp.data, temp.data, B.data);
    R = stretch(temp);
    mpz_mul(temp.data, Q.data, R.data);
    mpz_mod(F.data, temp.data, C.data);
    result = F;
  } while (rounds-- != 0);

  string text = result.toString(16);

  if (digits > 0) {
    size_t length = text.size();
    if (length > digits) return text.substr(0, digits);
    while (length++ < digits) text += "0";
  }

  return text;
}

int main(int argc, char** argv) {
  cout << "Usage: " << argv[0] << " [KEY] [SALT] [ROUNDS] [DIGITS]" << endl;
  string key = "";
  if (argc > 1) key = argv[1];
  string salt = "";
  if (argc > 2) key = argv[2];
  size_t rounds = 0;
  if (argc > 3) rounds = atoi(argv[3]);
  size_t digits = 0;
  if (argc > 4) digits = atoi(argv[4]);
  vector<string> keys;
  keys.push_back(key);
  keys.push_back(salt);
  cout << finabel(keys, rounds, digits) << endl;
}
