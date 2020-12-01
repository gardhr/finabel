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
  "fadce657b430900b53bf44a6d24845830f2b2870af873b4ee7b3a5fcfcbcbfeb636419144d66f42d869c81329cb32a6a6f422589b8d69c999d0188e2e83d9b1e6e49dc37df87965c21628272157750691a7330732a2bec147e4f2b54067000339160d5f872e621466dba507d412fe85d4fca40d420e5f1972fdd8d215"
);

report(
  "finabel('foobar')",
  "3aa90a1955e90167dff420ebd61f3f290e84641145c8c123f6204b8e7947ed153adcb84715d3bcf2abbe0975bfcee8563afbca50b0f6b8863b50d4d47493878edc082f9870e64628eb4dc6c588c7b1eb3468a45235dd12021cb69d97db6dfcb10406d0ee6f559784f9028e680449819b937496e3e6a1b3cc0c97e287b",
  "foobar"
);

report(
  "finabel('foo', 'bar')",
  "453763e9591cd81fbed0341d1aca93b4d146ce4eb57f1380643edb6953dc54b49f1baf738f90a82fe04578524454ea74c9d485fcc49824993b017fa3e0271b39c474b7bb7d7d87dc8fb9f3ec55d1ebb87357227615014ab4342170205a3fda50e705cd5376e365fca2c6c2c0d43eda69182592c5c3fff03c75b81f3a4",
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
  "69293b3004fbf8bf6ba6afef0f5d10a1f0b89b293fa2e4e2c1d4cb0f9a91f013493f34c4a8b3f2888a51e2c6c85ac0d57a1a7623506378539bdf18ca3bd46d86f423ff90ea3dce4202c749fdebb949cec0d83b9491ed3818bb0a0162c52544ddaedeeaac3a59c1725cdcb06ad76cade959864a8b84e6f866605c11b36",
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

