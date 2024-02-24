const { MarkovMachine } = require("./markov");

describe("markovMachine", function() {
  let mm;
  let text;

  beforeEach(function() {
    mm = new MarkovMachine("the cat in the hat");
    text = mm.makeText();
  });

  test("makes correct markov chain", function() {
    // Convert map to a plain object for the comparison
    const chainsObj = Object.fromEntries(mm.chains);
    expect(chainsObj).toEqual({
      the: ["cat", "hat"],
      cat: ["in"],
      in: ["the"],
      hat: [null]
    });
  });

  test("produces proper text", function() {
    expect(text).toEqual(expect.any(String));
    expect(text.split(" ").length).toBeGreaterThan(0);
  });
});
