1. test current validators to see their error output
2. add xss sanitization to all input
3. add transform - trim, lowerCase - to string input
4. add rootBlock to block mongo model
5. add pattern: /\w/ to any input that is a stirng
6. change message in ErrorSchema to errors (array)
