var finabel = require("./finabel");
var assert = require("assert");

const complain = console.error;
const print = console.log;
const crlf = () => print();

var tests = 0;
var errors = 0;

function report(useCase, expected, key, salt, rounds) {
  ++tests;
  useCase += " == " + expected + " :";
  try {
    assert.equal(finabel(key, salt, rounds), expected);
    print(useCase, "passed");
  } catch (error) {
    ++errors;
    complain(useCase, "FAILED");
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
  "finabel('foobar')",
  "e93d89404463776f45362c8892911e1fc0dc1e0015c481f677e37f0ed85eec28b288f0be8a1ff669ebf77a6f2284deebe6d64052eabaa3f7d65bc5508baf096fc37bb78789b3e38c224dc4158c685675e13a667128ee76a0e6ec33053abb62af120825adeeb1f65ad504e7027528813ae5d76b79da56a3600f192b2e6",
  "foobar"
);

report(
  "finabel('foo', 'bar')",
  "a0338afacff78bd22c213f338f071e892e588885dbce0083c96c963ebc0c9bb2d8bdb8dd32a23c18d130f8e0033f6c0d6a29461d8a0ecffeae2ee898608e5aca48a22b8c60099f6ce5703bcaced712f1659be93ceba78a28c2444849f4d19acb48ec8bb4fe0ca87215cd68cb999033a77f854b5eece4fdc8e98b55c08",
  "foo",
  "bar"
);

report(
  "finabel('foo', 'bar', 1000)",
  "a0338afacff78bd22c213f338f071e892e588885dbce0083c96c963ebc0c9bb2d8bdb8dd32a23c18d130f8e0033f6c0d6a29461d8a0ecffeae2ee898608e5aca48a22b8c60099f6ce5703bcaced712f1659be93ceba78a28c2444849f4d19acb48ec8bb4fe0ca87215cd68cb999033a77f854b5eece4fdc8e98b55c08",
  "foo",
  "bar",
  1000
);

report(
  "finabel('foo', 'bar', 2000)",
  "67648d9bab82dcfababc1c22a565deee0d950bf2f9bcfb67696fc79b199fc3e512edfa8e5840fe3ab5614fda93266df055ca65caace9297219ba79d2f9bfc8409908013556346dfdf83077457b78269e123a7f0569cd9c184036b6e7298e9e5283d5ee92ee7b94dd03851f3b91eb7379f0e6bbe79e52cede8cad8d97b",
  "foo",
  "bar",
  2000
);

report(
  "finabel('😃🧘🏻‍♂️🌍🍞🚗', '📞🎉♥️🏁')",
  "f022031c569ecd88e0fa4b277336a55843d84f8d388d172343a177f22777288ad37bf1dd7f064a878a79b4eab68b06e2365f1e8b1a792752b3610380be0da1ab59a31e6c670f54ff8271710eb7aa6d7e1d604dcecc8c1b427bc7a01d242a91e28ecd8bb5fdbcc9ab054371f73a5ed8161b988f1f0d5ce00a83107574c",
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

