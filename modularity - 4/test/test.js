
process.env.NODE_ENV = "test";


let chai = require("chai");
let chaiHttp = require("chai-http");
let request = require("request");
let server = require("../server/server.js");

let should = chai.should();
let expect = require("chai").expect;

chai.use(chaiHttp);


"use strict";

let host = "http://127.0.0.1:3000";

describe("pages.", () => {
  it("homepage should load successfully.", (done) => {
    request
      .get(`${host}/`, (err, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(response).to.have.header("content-Type", "text/html");
        expect(body).include("Hello from NodeJS");
        done();
      });
  });

  it("/index.html should load successfully.", (done) => {
    request
      .get(`${host}/index.html`, (err, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(response).to.have.header("content-Type", "text/html");
        expect(body).include("Hello from NodeJS");
        done();
      });
  });

  it("/about.html should load successfully.", (done) => {
    request
      .get(`${host}/about.html`, (err, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(response).to.have.header("content-Type", "text/html");
        expect(body).include("About NodeJS");
        done();
      });
  });

  it("/contact.html should load successfully.", (done) => {
    request
      .get(`${host}/contact.html`, (err, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(response).to.have.header("content-Type", "text/html");
        expect(body).include("Hello from NodeJS");
        done();
      });
  });

  it("/scripts.js should load successfully.", (done) => {
    request
      .get(`${host}/scripts.js`, (err, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(response).to.have.header("content-Type", "application/javascript");
        expect(body).include("local JS file works");
        done();
      });
  });

  it("/style.css should load successfully.", (done) => {
    request
      .get(`${host}/style.css`, (err, response, body) => {
        expect(response.statusCode).to.equal(200);
        expect(response).to.have.header("content-Type", "text/css");
        expect(body).include("#main");
        done();
      });
  });

  it("/invalid.html should return 404.", (done) => {
    request
      .get(`${host}/invalid.html`, (err, response, body) => {
        expect(response.statusCode).to.equal(404);
        done();
      });
  });

  it("any POST should echo back.", (done) => {
    let message = "ehlo";

    request
      .post(
        { url: `${host}/index.html`,
          body: message,
          headers: { "content-Type": "text/plain" }
        },
        (err, response, body) => {
          expect(response.statusCode).to.equal(200);
          expect(body).to.equal(message);
          done();
        }
      );
  });

  it("unsupported method should return 405.", (done) => {
    request
      .put(`${host}/index.html`, (err, response, body) => {
        expect(response.statusCode).to.equal(405);
        done();
      });
  });
});

