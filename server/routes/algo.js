const arr = ['a', 'a$b', 'a$b$c$d', 'a$b$c$d$e', 'a$b$c$d$e$f$g'];

const n = arr.length;
const result = [];
let prvString = '';
for (let i = 0; i < n; i++) {
  if (i === 0) {
    prvString = arr[i];
    result.push(arr[i]);
    continue;
  }
  const currString = arr[i];
  if (currString.length <= prvString.length) {
    prvString = currString;
    result.push(currString);
    continue;
  }
  let prefix = 1;
  for (let j = 0; j < prvString.length; j += 1) {
    if (prvString[j] !== currString[j]) {
      prefix = 0;
      break;
    }
  }
  let nestingLevel = 0;
  for (let j = prvString.length; j < currString.length; j += 1)
    if (currString[j] === '$') nestingLevel += 1;
  if (nestingLevel > 1) result.push(currString);

  prvString = currString;
}

for (let i = 0; i < result.length; i += 1) console.log(result[i] + ', ');
