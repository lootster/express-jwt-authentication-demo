const User = require("../model/user");

async function registerNewUser(req, res) {
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ user: { username: user.username, email: user.email } });
}

const status = require("http-status");

async function login(req, res) {
  const email = req.body.user.email;
  const password = req.body.user.password;

  let user = await User.findOne({ email: email });
  if (!user || !user.validPassword(password)) {
    return res.status(status.UNAUTHORIZED).json({
      error: { message: "email or password is invalid" }
    });
  }

  const token = user.generateJWT();
  return res.json({
    user: { username: user.username, email: user.email, token: token }
  });
}

async function changePassword(req, res) {
  // const userId = req.user.userid;
  // const user = await User.findById(userId);
  const user = req.user;

  const newUserProfile = req.body.user;
  if (newUserProfile.password) {
    user.setPassword(newUserProfile.password);
  }

  await user.save();
  return res.json({ status: "done" });
}

module.exports = {
  registerNewUser,
  login,
  changePassword
};
