import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { User } from "./src/models/userModel.js";
import { Status } from "./src/models/statusModel.js";

mongoose.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateRandomUsers = async (numUsers) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const hashedPass = await bcrypt.hash(faker.internet.password(), 10);

    const user = new User({
      fullName: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashedPass,
      avatar: faker.image.avatar(),
      followers: [],
      following: [],
    });
    users.push(user.save());
  }
  return Promise.all(users);
};

const addRandomFollowersAndFollowing = async (users) => {
  for (let user of users) {
    const otherUsers = users.filter(
      (u) => u._id.toString() !== user._id.toString()
    );

    // Shuffle other users array to ensure randomness
    const shuffledUsers = otherUsers.sort(() => Math.random() - 0.5);

    // Select first 5 users from shuffled list for followers and following
    const followers = shuffledUsers.slice(0, 5).map((u) => u._id);
    const following = shuffledUsers.slice(0, 5).map((u) => u._id);

    user.followers = followers;
    user.following = following;

    await user.save();
  }
};

const generateRandomStatusesForEachUser = async (users) => {
  const statuses = [];

  for (let user of users) {
    for (let i = 0; i < 5; i++) {
      const status = new Status({
        status: faker.image.avatar(),
        statusCaption: faker.lorem.sentence(),
        postedBy: user._id,
        likedBy: [],
        comments: [],
      });

      const uniqueLikers = new Set();
      while (uniqueLikers.size < 5) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser._id.toString() !== user._id.toString()) {
          uniqueLikers.add(randomUser._id);
        }
      }
      status.likedBy = Array.from(uniqueLikers);

      // Generate exactly 5 comments for this status
      const uniqueCommenters = new Set();
      while (uniqueCommenters.size < 5) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser._id.toString() !== user._id.toString()) {
          uniqueCommenters.add(randomUser._id);
        }
      }

      status.comments = Array.from(uniqueCommenters).map((userId) => ({
        user: userId,
        comment: faker.lorem.sentence(),
      }));

      statuses.push(status.save());
    }
  }

  return Promise.all(statuses);
};

const run = async () => {
  try {
    const numUsers = 100;
    const users = await generateRandomUsers(numUsers);

    await addRandomFollowersAndFollowing(users);

    await generateRandomStatusesForEachUser(users);

    console.log("Data successfully generated and inserted.");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close();
  }
};

run();
