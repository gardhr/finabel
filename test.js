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
  "be79bc7b2d231365157bfda7722582fbff5861d6c45073e7341116ab58fc572d2f471e9e97d5062572c353e921ac2d5318efd944ce2ab1cab9356392c9cd546334782ff9ef7b9238790d38d92b3c247411bb210566fd766249adac52cc4f923a91c9c2740ff352d794c2a51463ac6b75fab04312b6bcec06abc7ad886"
);

report(
  "finabel('foo', 'bar')",
  "a0338afacff78bd22c213f338f071e892e588885dbce0083c96c963ebc0c9bb2d8bdb8dd32a23c18d130f8e0033f6c0d6a29461d8a0ecffeae2ee898608e5aca48a22b8c60099f6ce5703bcaced712f1659be93ceba78a28c2444849f4d19acb48ec8bb4fe0ca87215cd68cb999033a77f854b5eece4fdc8e98b55c08",
  "foo",
  "bar"
);

report(
  "finabel('foobar')",
  "e93d89404463776f45362c8892911e1fc0dc1e0015c481f677e37f0ed85eec28b288f0be8a1ff669ebf77a6f2284deebe6d64052eabaa3f7d65bc5508baf096fc37bb78789b3e38c224dc4158c685675e13a667128ee76a0e6ec33053abb62af120825adeeb1f65ad504e7027528813ae5d76b79da56a3600f192b2e6",
  "foobar"
);

report(
  "finabel('foo', 'bar', 2000)",
  "953f9bb0168f6c9460b73262a278d041fada2484d1226981c9b5dc8335c5e635d7cea23116496ed08c50ce5ddb201184d0370294659261e0c23496a313d8fce7c26a000d87be3b2802427ae6105d2ec00b980e26fabe441138da7caf34a59b26e1d7d8919401f748b19e23685c359fa0edae4bcd61a76a4f9be64abdf",
  "foo",
  "bar",
  2000
);

report(
  "finabel('😃🧘🏻‍♂️🌍🍞🚗', '📞🎉♥️🏁')",
  "9695deb170e671fea4e38d384e6033d04dc22587fe1310bcdf1ecaf3a5a2292a8d16f3fd3167652e9dc4f8a55f9beeaa718bd3400a43bfd8fe1619f715318535486e59e99a82a97be5e4380e3a0e9d72010078a31107f76092e1102a00b7836f520ba857267df42541d75765877be7d5f7e4337d3a883e564f72b38ca",
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
