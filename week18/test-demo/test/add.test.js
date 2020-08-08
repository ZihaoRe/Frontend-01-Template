import assert from 'assert';
import {add} from "../src/add.js";

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('add', function () {
    it('should return 7 when the 3 + 4', function () {
        assert.equal(add(3, 4), 7);
    });
});