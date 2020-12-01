#include <string>
#include <vector>

namespace gardhr {

std::string finabel(std::vector<std::string> const& keys,
                    size_t rounds,
                    size_t digits,
                    size_t cost);

inline std::string finabel(std::string const& key,
                           size_t rounds = 0,
                           size_t digits = 0,
                           size_t cost = 0) {
  std::vector<std::string> keys;
  keys.push_back(key);
  return finabel(keys, rounds, digits, cost);
}

inline std::string finabel(std::string const& key,
                           std::string const& salt,
                           size_t rounds = 0,
                           size_t digits = 0,
                           size_t cost = 0) {
  std::vector<std::string> keys;
  keys.push_back(key);
  keys.push_back(salt);
  return finabel(keys, rounds, digits, cost);
}

}  // namespace gardhr

using gardhr::finabel;

