var finabel = require("./finabel");
var assert = require("assert");

const complain = console.error;
const print = console.log;
const crlf = () => print();

var tests = 0;
var errors = 0;

function report(useCase, expected, key, salt, rounds) {
  ++tests;
  useCase += " == " + expected;
  try {
    assert.equal(finabel(key, salt, rounds), expected);
    print(useCase, ": passed");
  } catch (error) {
    ++errors;
    let maxLength = 120;
    let message = error.toString();
    if (message.length > maxLength)
      message = message.substr(0, maxLength) + "...";
    complain(useCase, ": FAILED (" + message + ")");
  }
  crlf();
}

crlf();
print("****************** Unit Test ******************");
crlf();

report(
  "finabel()",
  "a8397aa0c74d66998c1cc5ea162529eb3c2c52ab2408c92df20330f528c77d79c80aebaf28cff8bd09822704583371d876618214be040e2dfd1e0503ed0f1e3053567219ca35f60ebcffe30026cf9a160e771676f6132c15dfb38111fd11f644c494c3fa5bc8f9ea5e39e0a176f7b5fe63199bcc99d124ee8e76dbee7"
);

report(
  "finabel('foo', 'bar')",
  "305fdfb803d4e75ee42390ffe58a68ea38c092476024456d3e30fa4990b442d216bdbeda3bd940b5f6b4223011f44b473bc6d0ceebef40c5ba3dc8cc68758f27af38ee938227e9921ffa9351536fd06f1da2c42bef548af519904af8745455d584fdf9dff2a850e56179e63d2cf0a6a8b0ac85e199383862ec87d35e0",
  "foo",
  "bar"
);

report(
  "finabel('foobar')",
  "7272140bba533c81c4173581e1bd24cbd2f82b84ad7077aaccf62d8c4cf9abc984e7738f3aaadf2f60679feb93ffc7228e3d80b6d21a0b38fd3f5bd42d18e2614d589f587c0aa746c675df3e1f51528d840d4bc688aa1e713d3b1c8ecd35a130130d3c55c29a0d6909876b243deafb7e0ae063ec40a0262de596a715",
  "foobar"
);

report(
  "finabel('foo', 'bar', 500)",
  "953f9bb0168f6c9460b73262a278d041fada2484d1226981c9b5dc8335c5e635d7cea23116496ed08c50ce5ddb201184d0370294659261e0c23496a313d8fce7c26a000d87be3b2802427ae6105d2ec00b980e26fabe441138da7caf34a59b26e1d7d8919401f748b19e23685c359fa0edae4bcd61a76a4f9be64abdf",
  "foo",
  "bar",
  500
);

report(
  "finabel('😃🧘🏻‍♂️🌍🍞🚗', '📞🎉♥️🏁')",
  "14a958cc9d64d59d3d22deedd0c1b3e9c11b614d248189e6c9ab00782a72b44320007f2f5d158cef05b9215fa82cead81b1ec2331d174f07306fb3b7539eac6eaaad472d68a08bb0341890c4d608af788b8c07cdc43b7b383319374ff58fd9631c28788b5a25af82e6d43bc02ea24e4e85f47d39a365ab1854eb20595d",
  "😃🧘🏻‍♂️🌍🍞🚗",
  "📞🎉♥️🏁"
);

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

var code = undefined;

if (errors) {
  complain(" Passed", tests - errors, "of", tests, "tests.");
  code = EXIT_FAILURE;
} else {
  print(" All tests passed.");
  code = EXIT_SUCCESS;
}

crlf();
print("***********************************************");
crlf();

process.exit(code);
