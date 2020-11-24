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
  "5f4496fdad14e32b3af6dd66244ee8d090305289c5f2ea5b522b229f49ac4dda8d8bc99e9fa1f2246b4f93ead5510fbc89e64e5e0d03ac0c18736b6c953ace2487432e502c48c9c8e8b550cb423f66fe6a8e5bb85c15762604ca1c8c212ccff2133a40a2837040ca662f436af78a08d8945aa68837d1743f7bd3e54c6"
);

report(
  "finabel('foo', 'bar')",
  "953f9bb0168f6c9460b73262a278d041fada2484d1226981c9b5dc8335c5e635d7cea23116496ed08c50ce5ddb201184d0370294659261e0c23496a313d8fce7c26a000d87be3b2802427ae6105d2ec00b980e26fabe441138da7caf34a59b26e1d7d8919401f748b19e23685c359fa0edae4bcd61a76a4f9be64abdf",
  "foo",
  "bar"
);

report(
  "finabel('foobar')",
  "4e5b386b5a3a8f2b08afa9d2ca0e3db46e7dd002177f9d2ea146c98d71f3014e62a790b91d243d32ebea569d3c713de85c219f5fd8c1ecb5a9224d584267d1ad5f3033410f9301fb070f124796940cfc23b3121a3e5b8ab420238f1ec894462d874a5d6276a9d3d62f2a748179c05301c7c6064722946b6626abcb3f6",
  "foobar"
);

report(
  "finabel('foo', 'bar', 1000)",
  "a0338afacff78bd22c213f338f071e892e588885dbce0083c96c963ebc0c9bb2d8bdb8dd32a23c18d130f8e0033f6c0d6a29461d8a0ecffeae2ee898608e5aca48a22b8c60099f6ce5703bcaced712f1659be93ceba78a28c2444849f4d19acb48ec8bb4fe0ca87215cd68cb999033a77f854b5eece4fdc8e98b55c08",
  "foo",
  "bar",
  1000
);

report(
  "finabel('😃🧘🏻‍♂️🌍🍞🚗', '📞🎉♥️🏁')",
  "a982b6bdada258da66e9c751cbf0b51e49294aa3d942a9b63f509b92dac84413747ecf103ff055cf06ee9c86d0861ca3348399b873802fda2c160dfe36aa436566010b6023e89ee07e79ec52f013088ca839237805218060ec4c68d6d40cc8ba426e45d77a4796dfd8c4a74b1d0bdd54d727e0876e1a4e6e41b74f66f",
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
