const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('pass123', 10);
console.log(hash);