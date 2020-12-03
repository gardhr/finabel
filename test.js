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
  "c4fd3a8dfb5917d7cc10fbe61e2a5bd71cdc221113efb6779ec429e014faeaef1c381c3a9d54c1e6357ec3e85256ac73105c86fa88eacf23a34e618d018f44b3ef79980c78722bd8efbd91deb5a33e10d232f698ba15f0e4e01f358cc2dd6509b2c1eb58c53c7db7f03741fa1ba6f5dcb38966451be46298edef41af2c0f96c8a44de2c67661af2eeeff6ea905d5ec20233ea10c2cd7f1ba1f837baddc436d6aa31b7a090bff811708835f899e9ff604998b71a4b217c0d7109a94730d98b6fb2f96022a14f22a6bb1f01cbbaece2efb593392424693ba435a013dfc1d8ddb5ea6b0deebf220925986c00fb9444b6972f0899a88f4551a51d7249731"
);

report(
  "finabel('foobar')",
  "71a8ea3ad2eaaa5c10ff31cde3b257523573d83dfd73471fe6047a1fe0a56cf8efa1ec453e706aa2016077010ef09efe810248bd03b908dd5728f4fba1c8b3ebf1b2891b3ae959d5f2a7db618e314776a79a686cf8ce0c629d950cc4126150a8468570ca65e5277e8488bc826ac70aeb8a150e9eaa2ce10a9dab3e62753d7545588aefba58866441243a6864f49c4bd82b6ed2aac34ed17e2b0f8de4ca756d8e5154ee6ead9ff7e1151632924c7a82b5d5b9069836ac4086d70fe4f85e5493ea2d1ae37ddfe69715ef5c4656b204735f5e1938405b17870f196a95821cef6885012f74c0aba2098386ebee5fb58a51dda2d0494b0d53ebbdae9f2a946d87adeb4841",
  "foobar"
);

report(
  "finabel('foo', 'bar')",
  "464385e2d7b9af9b03394e3cf7567b68c2ea744e4afc90befbcb7a43aeee9d0e411c52b8568510c2660bd168ac0271f7284bce67b5cf90bbd5d3a459be904784b8aff96bef9fb0fdf53b761b1a924b48b34c3e1c2803aa3cfb6c9372a9c1c4f1d20f9810a3818e862f2d1e123ab428af4ba28f1f76c4ea67911afa9e4eb9014e7491c0987e814edda4b01ee2eed0fb36712b4270ede57434df3e9e03f8a3cd83fe6a927698ef495799ef7ac222f22374be0a944afe1eac5d8fde64aa0731081e2dc1ed47317589b12da82fb96c7400f3ecd6a450fa912562bc31494c4108a3d4c0686040e483e5db294c3922d2f5cac6a95c48b232fa47fa5041e946903ad4e",
  "foo",
  "bar"
);

report(
  "finabel('bar', 'foo')",
  "1c16f47ab49e88bd4a6e68cdc6a695d92ae97d400c757b4b713e0b0a376f470f27be8c7514dde4003d58eddb96f2310193cf9cbfba9b08b55e5729cd5591c5a1250ddd5c3fd1b1c27b6d2fd7cca00809a22e981fa9ccc190959c3a761c0c08cb9b6f93bca3dea7befa628590dd64450e77249b946d541bbfd6955fdeb43a8320ad1e12359670b29fa38af842400fee18f889d53b0ac2726b597975011e0f17e1422bab1045e502f90d6517cf42c1dced4986b2c65b9cf49711ddee03d3aa3fb628e38fdf5f5215c57599c8dbf4ef97bb9b6cad0f6dfe485337e4480a141dfc18a2c1435a4f1aea62c2201f6502bc6e633373886ed872d0d345",
  "bar",
  "foo"
);

report(
  "finabel('foo', 'bar', 8192)",
  "cda12dbfe0cef58f568f545da08eb600f5895e3e38078e0b134f96b42a90be8b83b050962bc9e3d76ec1223eb585b954fcfe7dec35129818034e3b39e0e3c7d697ab396ad2a3131fad4360a749f06763b710f91bb46fe895b8bfb8cf16f470eebee105d13aa5f386d1f51d6592b89d5d91e7710da87264302f3e09321656d99170c894ec5bd920ec9ee5af0f56c0b578a9016335bbc78a1769e4f5304ff1f359155fde60089564e842ddb9b05f727710dbc78061d38b99d35a530abd2bf9deed04de90018654566ec4bc50b97e0cc808ae97f1f7eceb4e1150fbd2a00239daf41e68cd59f8d3eb37d615dbf02711b69b5a39d0ec912fc5c769e273f9d670a36",
  "foo",
  "bar",
  8192
);

report(
  "finabel('foo', 'bar', 4096)",
  "3a9cdaabde8cdc7c462f942a832b3f3f773646252c8cc9801bed896a39e1fe05da1c326012400a2100e0546fce02ee36fb1e2bce86fbf47829d9f76d9d49fb3691a65cc22db67a3308afa2a686d667f8cc651fd4d6fc9fbb8b14afd7dffe65350c3879ef28cf39ef2bf78c3d3bc0e550b746ab9bb041292f859e26ab5d41a139a62b8f01ec959a749f14f84d22a462d9538cfa324f1b9b2e6e91b15da8713e25c3f0bc77bfdf3fea7d0ec827fa4c87864ad92ee246630e8a5e4629a8a86698306eb9594c876e360123ad5d8df341a0fbafdca3c68aed77068f10f7f2f52bddc366805f174cb2f90917f07495cb61bad86365ca5cd319525",
  "foo",
  "bar",
  4096
);

report(
  "finabel('😃🧘🏻‍♂️🌍🍞🚗', '📞🎉♥️🏁')",
  "ccf88b5d895db2b329b59eb42041ad1d1e639e48b5bcf2c2fc1f488f46779f5c0c6029eb65a18fea2d61df1c46b631ef12282166bb2e53c4396572b3ee6262a2fda1ad6bc9d0ab64f27dfa4d1062104e75866c401dde2e5664e3d3ba482a92fb207115457275938dc1a0a0dc26173f24cfb14463db350eda5f66e0b9e99da1e4a4934ef81dcd00e9ab6c39cc5307d0d65d6ea9eb3fd2b8bb9a4e261e036c027625c3ea74e0ce1abf0430b377f51856db3592bf462366a4ec128e251a0be79919cac7fcad4ed49a595f1f0427ee021db15ac8d10ccde7a7af324cfb98a88cd5856289c04c560a9557f4ec8b7cd316ab6a7407f3f32e3a5f158d7492d930",
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
