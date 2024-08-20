import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import session, { SessionOptions, MemoryStore } from "express-session";

const store = new MemoryStore();

const expresscofig = (app: Express): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(process.env.COOKIEPARSERSECRET));
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 60 * 60 * 1000,
        httpOnly: false,
      },
      store: store,
    } as SessionOptions)
  );
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(express.static("public/"));
};

export default expresscofig;
