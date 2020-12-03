/*
 NOTE: You'll need to have the GNU Multiprecision Library (GMP) installed

 Then compile with:

 g++ -I PATH_TO_GMP -L PATH_TO_GMP/.libs -o cli cli.cpp -lgmp
*/

#include <iostream>
#include "finabel.cpp"

using namespace std;

int main(int argc, char** argv) {
  if (argc <= 1)
    cout << "Usage: " << argv[0] << " [KEY] [SALT] [ROUNDS] [DIGITS] [COST]"
         << endl;
  string key = "";
  if (argc > 1)
    key = argv[1];
  string salt = "";
  if (argc > 2)
    salt = argv[2];
  size_t rounds = 0;
  if (argc > 3)
    rounds = atoi(argv[3]);
  size_t digits = 0;
  if (argc > 4)
    digits = atoi(argv[4]);
  size_t cost = 0;
  if (argc > 5)
    cost = atoi(argv[5]);
  vector<string> keys;
  keys.push_back(key);
  keys.push_back(salt);
  cout << finabel(keys, rounds, digits, cost) << endl;
}

