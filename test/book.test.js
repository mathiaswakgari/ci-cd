const request = require("supertest");
const mongoose = require("mongoose");
const { beforeEach, afterEach, after, before } = require("mocha");
const chai = require("chai");
const chaiSubset = require("chai-subset");

const { Book } = require("../models/book");

let server = require("../index");

chai.use(chaiSubset);
const expect = chai.expect;

describe("Book API", () => {
  before(() => {
    server = require("../index");
  });
  after(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Book.deleteMany({});
  });
  afterEach(async () => {
    await Book.deleteMany({});
  });

  describe("POST /", () => {
    it("should", async () => {
      const bookData = {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        publishedYear: 1925,
        genre: "Fiction",
        available: true,
      };

      const res = await request(server).post("/api/books").send(bookData);
      expect(res.status).to.equal(201);
    });
  });
});
