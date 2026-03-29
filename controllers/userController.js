const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require(`${__dirname}/../models/user`);

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Invalid parameters");
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }

    const flag = await bcrypt.compare(password, user.password);
    if (!flag) {
      return res.status(400).send("Invalid username or password");
    }

    const SECRETKEY = process.env.SECRETKEY;
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      SECRETKEY,
      {
        expiresIn: "1d",
      },
    );

    res.send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.register = async (req, res) => {
  try {
    let { name, username, password, role, number, whatsapp } = req.body;

    if (!name || !username || !password || !number || !whatsapp) {
      return res.status(400).send("Invalid parameters");
    }

    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(409).send("This username is already taken");
    }

    password = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name,
      username: username,
      password: password,
      role: role === "farmer" ? "farmer" : "buyer",
      number: number,
      whatsapp: whatsapp,
    });

    const SECRETKEY = process.env.SECRETKEY;
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
      SECRETKEY,
      {
        expiresIn: "1d",
      },
    );

    res.send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getUser = async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username: username }).select("-password");

    if (!user) {
      return res.status(404).send("No such user");
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { password } = req.body;
    const { username } = req.user;
    if (!password) {
      return res.status(400).send("Invalid parameters");
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }

    const flag = await bcrypt.compare(password, user.password);
    if (!flag) {
      return res.status(400).send("Invalid username or password");
    }

    const deletedUser = await User.deleteOne({ username: username });

    res.send(deletedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { current_password } = req.body;
    const current_username = req.user.username;
    if (!current_username || !current_password) {
      return res.status(400).send("Invalid parameters");
    }
    const user = await User.findOne({ username: current_username });
    if (!user) {
      return res.status(400).send("Invalid username");
    }

    const flag = await bcrypt.compare(current_password, user.password);
    if (!flag) {
      return res.status(400).send("Invalid password");
    }

    let { name, username, password, number, whatsapp } = req.body;

    if (username) {
      const existing = await User.findOne({ username: username });
      if (existing && username !== current_username) {
        return res.status(409).send("This username is already taken");
      }
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    await User.updateOne(
      { username: current_username },
      {
        name: name || user.name,
        username: username || user.username,
        password: password || user.password,
        number: number || user.number,
        whatsapp: whatsapp || user.whatsapp,
      },
    );
    const SECRETKEY = process.env.SECRETKEY;
    const token = jwt.sign({ id: user._id, username: username || user.username, role: user.role }, SECRETKEY, {
      expiresIn: "1d",
    });
    res.send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
