const dateFormatYMD = require('./dateFormatFr');
const dateDiff = require('./dateDif');

test('create today date format YMD', () => {
    expect(dateFormatYMD(new Date('2020-05-13'))).toBe("13 Mai 2020");
});

test('get number of days until date', () => {
    expect(dateDiff('2020-05-17')).toBe(4);
});

