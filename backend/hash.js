const bcrypt = require("bcrypt");

(async () => {
  const newHash = await bcrypt.hash("admin123", 10);
  console.log(newHash);
})();
