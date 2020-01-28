import { User } from "../../models/user.model";
import {
  registerValidation,
  loginValidation
} from "../../utils/validation/user.validation";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RefreshToken } from "../../models/refreshtoken.model";

import {sendMail} from '../../utils/mail/sendMail';

//registration route
export const register = async (req, res) => {
  // res.json({ msg: "Reginster" });

  //validate user input
  try {
    const validate = await registerValidation.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ msg: err.details[0].message });
  }

  //check if user already exists
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ msg: "Email already exists" });
    }
  } catch (err) {
    return res.sendStatus(500)
  }

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create an verify token to mail to users
  const verifyToken = jwt.sign(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    process.env.VERIFY_TOKEN_SECRET,
    {
      expiresIn: "15m"
    }
  );

  //mail the token to user
  sendMail(req.body.email,'Verify your account', `<a href="http://127.0.0.1:3000/api/auth/verify/${verifyToken}">Verify</a>`)
  
  res.json({msg : 'Verification link has been sent to your email'})
};

//verification route
export const verifyUser = async (req, res) => {
  const token = req.params.token
  if(!token){
    return res.sendStatus(400)
  }
  let verify = undefined
  try{
    verify = jwt.verify(token,process.env.VERIFY_TOKEN_SECRET)
  }catch(err){
    return res.sendStatus(403)
  }

  try{
    const emailVerified = await User.findOne({email: verify.email})
    if(emailVerified){
      return res.status(400).json({msg: 'Email already verified'})
    }
  }catch(err){
    console.log(err);
    return res.sendStatus(500)
  }

  const user = new User(verify);

  try {
    const savedUser = await user.save();
    res.json({ _id: savedUser._id });
  } catch (error) {
    return res.sendStatus(500);
  }
};

//login route
export const login = async (req, res) => {
  // res.json({ msg: "Login" });

  //Input validation
  try {
    const validation = await loginValidation.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ msg: err.details[0].message });
  }

  //check if email exists
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ msg: "Email and Password pair don't match" });
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json({ msg: "Email and Password pair don't match" });
  }

  //generate auth token
  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m"
    }
  );

  //generate refresh token
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );

  try {
    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken },
      { upsert: true }
    );
  } catch (error) {
    res.sendStatus(500);
  }
  res.json({ accessToken, refreshToken });
};

export const logout = async (req, res) => {
  const userId = req.user._id;
  try {
    await RefreshToken.findOneAndRemove({ userId });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const refresh = async (req, res) => {
  //check for refresh token in request
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  let userId = undefined;

  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    userId = verified._id;
  } catch (err) {
    return res.sendStatus(403);
  }

  try {
    const tokenDB = await RefreshToken.findOne({ userId });
    if (tokenDB.token !== refreshToken) return res.sendStatus(401);

    const newToken = jwt.sign(
      { _id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    res.json({
      accessToken: newToken
    });
  } catch (error) {
    res.sendStatus(401);
  }
};
