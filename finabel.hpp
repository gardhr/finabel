#include <string>
#include <vector>

namespace gardhr {

std::string finabel(std::vector<std::string> const& keys,
                    size_t rounds,
                    size_t digits);

inline std::string finabel(std::string const& key,
                           size_t rounds = 0,
                           size_t digits = 0) {
  std::vector<std::string> keys;
  keys.push_back(key);
  return finabel(keys, rounds, digits);
}

inline std::string finabel(std::string const& key,
                           std::string const& salt,
                           size_t digits = 0,
                           size_t rounds = 0) {
  std::vector<std::string> keys;
  keys.push_back(key);
  keys.push_back(salt);
  return finabel(keys, rounds, digits);
}

}  // namespace gardhr

using gardhr::finabel;

