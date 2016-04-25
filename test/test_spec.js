/* eslint-env node, mocha */
const jsdom = require('jsdom');
const assert = require('assert');

const Keys = require('../src/data/keys');

const createMathField = (document, MathWrapper) => {
    const span = document.createElement('span');
    document.body.appendChild(span);

    return new MathWrapper(span);
};

describe('MathQuill', () => {
    let document;
    let MathWrapper;
    let loaded;
    let mathField;

    beforeEach((done) => {
        if (loaded) {
            mathField = createMathField(document, MathWrapper);

            done();
        } else {
            jsdom.env({
                html: '<html><body></body></html>',
                scripts: [
                    // jQuery is hard dep of MathQuill
                    'http://code.jquery.com/jquery.js',
                    'mathquill/mathquill.js',
                ],
                done: function(err, win) {
                    document = win.document;
                    global.window = win;
                    global.document = document;

                    MathWrapper = require('./test-math-wrapper');
                    mathField = createMathField(document, MathWrapper);

                    loaded = true;
                    done();
                },
            });
        }
    });

    afterEach((done) => {
        done();
    });

    describe('Fraction Bar', () => {
        it('should work with no content', () => {
            mathField.pressKey(Keys.FRAC);
            assert.equal(mathField.getContent(), '\\frac{ }{ }');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.FRAC);
            assert.equal(mathField.getContent(), '\\frac{35x^2}{ }');
        });

        it('should work before an expression', () => {
            mathField.setContent('35x^2');
            mathField.moveToStart();
            mathField.pressKey(Keys.FRAC);
            assert.equal(mathField.getContent(), '\\frac{ }{ }35x^2');
        });

        it('should work with a selected expression', () => {
            mathField.setContent('35x^2');
            mathField.selectAll();
            mathField.pressKey(Keys.FRAC);
            assert.equal(mathField.getContent(), '\\frac{35x^2}{ }');
        });
    });

    describe.skip('Parentheses', () => {
        it('should work with no content', () => {
            mathField.setContent('');
            mathField.pressKey(Keys.PARENS);
            assert.equal(mathField.getContent(), '()');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.PARENS);
            assert.equal(mathField.getContent(), '35x^2()');
        });

        it('should work before an expression', () => {
            mathField.setContent('35x^2');
            mathField.moveToStart();
            mathField.pressKey(Keys.PARENS);
            assert.equal(mathField.getContent(), '()35x^2');
        });

        it('should work on a selected expression', () => {
            mathField.setContent('35x + 5');
            mathField.selectAll();
            mathField.pressKey(Keys.PARENS);
            assert.equal(mathField.getContent(), '(35x^2)');
        });
    });

    describe.skip('Squared', () => {
        it('should work after an expression', () => {
            mathField.setContent('35x');
            mathField.pressKey(Keys.EXP_2);
            assert.equal(mathField.getContent(), '35x^2');
        });

        it('should work on a selected expression', () => {
            mathField.setContent('35x+5');
            mathField.selectAll();
            mathField.pressKey(Keys.EXP_2);
            assert.equal(mathField.getContent(), '(35x+5)^2');
        });
    });

    describe('Exponent', () => {
        it('should work with no content', () => {
            mathField.pressKey(Keys.EXP);
            assert.equal(mathField.getContent(), '^{ }');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x');
            mathField.pressKey(Keys.EXP);
            assert.equal(mathField.getContent(), '35x^{ }');
        });

        // TODO(kevinb): makes the expression an exponent when it shouldn't
        it('should work on a selected expression', () => {
            mathField.setContent('35x+5');
            mathField.selectAll();
            mathField.pressKey(Keys.EXP);
            assert.equal(mathField.getContent(), '(35x+5)^{ }');
        });
    });

    describe('Square Root', () => {
        it('should work with no content', () => {
            mathField.pressKey(Keys.SQRT);
            assert.equal(mathField.getContent(), '\\sqrt{ }');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.SQRT);
            assert.equal(mathField.getContent(), '35x^2\\sqrt{ }');
        });

        it('should work on a selected expression', () => {
            mathField.setContent('35x+5');
            mathField.selectAll();
            mathField.pressKey(Keys.SQRT);
            assert.equal(mathField.getContent(), '\\sqrt{35x+5}');
        });
    });

    describe.skip('Radical', () => {
        it('should work with no content', () => {
            mathField.pressKey(Keys.RADICAL);
            assert.equal(mathField.getContent(), '\\sqrt[ ]{ }');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.RADICAL);
            assert.equal(mathField.getContent(), '35x^2\\sqrt[ ]{ }');
        });

        it('should work on a selected expression', () => {
            mathField.setContent('35x+5');
            mathField.selectAll();
            mathField.pressKey(Keys.RADICAL);
            // TODO(kevinb): check cursor location
            assert.equal(mathField.getContent(), '\\sqrt[ ]{35x+5}');
        });
    });

    describe.skip('Log', () => {
        it('should work with no content', () => {
            mathField.pressKey(Keys.LOG);
            assert.equal(mathField.getContent(), '\\log{ }');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.LOG);
            assert.equal(mathField.getContent(), '35x^2\\log{ }');
        });

        it('should work on a selected expression', () => {
            mathField.setContent('35x+5');
            mathField.selectAll();
            mathField.pressKey(Keys.LOG);
            assert.equal(mathField.getContent(), '\\log{35x+5}');
        });
    });

    describe.skip('Log w/ base n', () => {
        it('should work with no content', () => {
            mathField.pressKey(Keys.LOG_N);
            assert.equal(mathField.getContent(), '\\log_{ }{ }');
        });

        it('should work after an expression', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.LOG_N);
            assert.equal(mathField.getContent(), '35x^2\\log_{ }{ }');
        });

        it('should work on a selected expression', () => {
            mathField.setContent('35x+5');
            mathField.selectAll();
            mathField.pressKey(Keys.LOG_N);
            assert.equal(mathField.getContent(), '\\log_{ }{35x+5}');
        });
    });

    describe('Backspace', () => {
        it('should delete an empty fraction from the numerator', () => {
            mathField.setContent('\\frac{ }{ }');
            mathField.moveToStart();
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '');
        });

        it('should convert a fraction when deleting the denominator', () => {
            mathField.setContent('\\frac{35x^2}{ }');
            mathField.pressKey(Keys.LEFT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '35x^2');
        });

        // TODO(kevinb) math isn't selected
        it('should select a fraction when deleting from outside of it', () => {
            mathField.setContent('\\frac{35x+5}{x^2}');
            mathField.pressKey(Keys.BACKSPACE);
            assert(mathField.isSelected());
            assert.equal(mathField.getContent(), '\\frac{35x+5}{x^2}');
        });

        // TODO(kevinb) doesn't delete both
        it('should delete parens when inside empty parens', () => {
            mathField.setContent('()');
            mathField.pressKey(Keys.LEFT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '');
        });

        // TODO(kevinb) math isn't selected
        it('should select an expression when deleting from outside', () => {
            mathField.setContent('(35x+5)');
            mathField.pressKey(Keys.BACKSPACE);
            assert(mathField.isSelected());
            assert.equal(mathField.getContent(), '(35x+5)'); // currently ')'
        });

        // TODO(kevinb) confirm with design we want this behavior be different
        it('should not delete squared exponents', () => {
            mathField.setContent('35x^2');
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '35x^2');
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '35x^{ }');
        });

        it('should not delete non-square exponents', () => {
            mathField.setContent('35x^5');
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '35x^5');
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '35x^{ }');
        });

        it('should delete an empty exponent', () => {
            mathField.setContent('35x^{}');
            mathField.pressKey(Keys.LEFT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '35x');
        });

        it('should delete an empty square root', () => {
            mathField.setContent('\\sqrt{}');
            mathField.pressKey(Keys.LEFT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '');
        });

        it('should delete an empty radical when cursor is in index', () => {
            mathField.setContent('\\sqrt[]{}');
            mathField.moveToStart();
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '');
        });

        it('should move before full radical when cursor is in index', () => {
            mathField.setContent('\\sqrt[]{35x+5}');
            mathField.moveToStart();
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.BACKSPACE);
            // TODO(kevinb) assert cursor position
            assert.equal(mathField.getContent(), '\\sqrt[]{35x+5}');
        });

        it('should select a full square root before deleting it', () => {
            mathField.setContent('\\sqrt{35x+5}');
            mathField.moveToStart();
            mathField.pressKey(Keys.BACKSPACE);
            assert(mathField.isSelected());
            assert.equal(mathField.getContent(), '\\sqrt[]{35x+5}');
        });

        it('should delete log when inside empty log', () => {
            mathField.setContent('\\log\\left(\\right)');
            mathField.pressKey(Keys.LEFT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '');
        });

        it('should select log when inside full log at head', () => {
            mathField.setContent('\\log\\left(35x+5\\right)');
            mathField.moveToStart();
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.BACKSPACE);
            assert(mathField.isSelected());
            assert.equal(mathField.getContent(), '\\log\\left(35x+5\\right)');
        });

        it('should select log when outside full log at tail', () => {
            mathField.setContent('\\log\\left(35x+5\\right)');
            mathField.pressKey(Keys.BACKSPACE);
            assert(mathField.isSelected());
            assert.equal(mathField.getContent(), '\\log\\left(35x+5\\right)');
        });

        it('should delete empty log when at index', () => {
            mathField.setContent('\\log_{ }\\left(\\right)');
            mathField.moveToStart();
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.BACKSPACE);
            assert.equal(mathField.getContent(), '');
        });

        // TODO(kevinb) don't delete the parens... move to the index instead
        it('should move to index from inside empty log with index', () => {
            mathField.setContent('\\log_5\\left(\\right)');
            mathField.pressKey(Keys.LEFT);
            mathField.pressKey(Keys.BACKSPACE);
            // TODO(kevinb) verify cursor position
            assert.equal(mathField.getContent(), '\\log_5\\left(\\right)');
        });

        it('should select full log when deleting from empty index', () => {
            mathField.setContent('log_{ }\\left(x+1\\right)');
            mathField.moveToStart();
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.RIGHT);
            mathField.pressKey(Keys.BACKSPACE);
            assert(mathField.isSelected());
            assert.equal(mathField.getContent(), 'log_{ }\\left(x+1\\right)');
        });
    });

    // TODO(kevinb) requires JUMP_NEXT key
    describe.skip('Jump Next', () => {

    });

    describe.skip('Equals =, !=, <, <=, >, >=', () => {

    });
});