const{mean, median, mode} = require('./operations');

describe("mean", function() {
    test("calculates mean", function() {
        expect(mean([1, 2, 3, 4, 5])).toEqual(3);
    });
    }
);

describe("median", function() {
    test("calculates median", function() {
        expect(median([1, 2, 3, 4, 5])).toEqual(3);
        expect(median([1, 2, 3, 4, 5, 6])).toEqual(3.5);
    });
    }
);

describe("mode", function() {
    test("calculates mode", function() {
        expect(mode([1, 2, 2, 3, 4, 5])).toEqual('2');
    });
    }
);



// const { MarkovMachine } = require("./markov");

// describe("markovMachine", function() {
//   let mm;
//   let text;

//   beforeEach(function() {
//     mm = new MarkovMachine("the cat in the hat");
//     text = mm.makeText();
//   });

//   test("makes correct markov chain", function() {
//     // Convert map to a plain object for the comparison
//     const chainsObj = Object.fromEntries(mm.chains);
//     expect(chainsObj).toEqual({
//       the: ["cat", "hat"],
//       cat: ["in"],
//       in: ["the"],
//       hat: [null]
//     });
//   });

//   test("produces proper text", function() {
//     expect(text).toEqual(expect.any(String));
//     expect(text.split(" ").length).toBeGreaterThan(0);
//   });
// });
