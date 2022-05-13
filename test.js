/**
 *
 * by littlefean
 */
let item = [0, Infinity, false, true, undefined, null, NaN, Number.MAX_VALUE, Number.MIN_VALUE, Number.NaN, Number.NEGATIVE_INFINITY];
for (let i = 0; i < item.length; i++) {
    for (let j = i; j < item.length; j++) {
        console.log(item[i] == item[j], item[i] === item[j], "\t", item[i], "=", item[j],);
    }
}
