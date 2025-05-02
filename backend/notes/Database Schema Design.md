# Database Schema Design

Based on the analysis of your React components (`Dashboard.jsx`, `LiftSideDash.jsx`, `WeeklyProgress.jsx`, `ActiveChallenges.jsx`), here is a proposed database schema design using Mongoose for your MongoDB database. This design aims to capture all the necessary data points identified in the frontend.

## 1. User Schema (`models/User.js`)

This schema stores information about each user.

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true // Remember to hash passwords before saving!
  },
  rank: {
    type: String, // Or Number, depending on how rank is calculated/used
    default: "N/A"
  },
  profileImage: {
    type: String,
    default: "/path/to/default/profile.jpg" // Default image path
  },
  // We might not need to store enrolledChallenges directly here
  // if we use the ChallengeEnrollment model to link users and challenges.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add methods for password hashing/comparison here if needed

module.exports = mongoose.model("User", userSchema);
```

**Fields Explained:**
*   `name`: User's display name.
*   `email`: User's unique email for login.
*   `password`: User's hashed password.
*   `rank`: User's overall rank (as seen in `LiftSideDash`).
*   `profileImage`: Path or URL to the user's profile picture.
*   `createdAt`: Timestamp for when the user account was created.

## 2. Challenge Schema (`models/Challenge.js`)

This schema defines the structure for the challenges available in the application.

```javascript
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or path to challenge image
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  progressGoal: {
    type: Number,
    required: true
  },
  goalUnit: {
    type: String, // e.g., 'steps', 'km', 'minutes'
    required: true
  },
  duration: {
    type: Number, // Duration value
    required: true
  },
  durationUnit: { // Unit for duration
    type: String, // e.g., 'days', 'hours'
    required: true,
    enum: ["days", "hours"] // Example enum
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Challenge", challengeSchema);
```

**Fields Explained:**
*   `title`, `description`, `shortDescription`: Text content for the challenge.
*   `image`: Visual representation of the challenge.
*   `category`: Helps in filtering challenges.
*   `progressGoal`, `goalUnit`: Defines the target for the challenge (e.g., 10000 steps).
*   `duration`, `durationUnit`: Defines how long the challenge lasts (e.g., 7 days).
*   `createdAt`: Timestamp for challenge creation.

## 3. Challenge Enrollment Schema (`models/ChallengeEnrollment.js`)

This schema links users to challenges they are participating in and tracks their specific progress.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const challengeEnrollmentSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: "Challenge", // Reference to the Challenge model
    required: true
  },
  status: {
    type: String,
    enum: ["enrolled", "completed", "failed"],
    default: "enrolled"
  },
  progress: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number // Rank within this specific challenge
    // This might need to be calculated dynamically based on other enrollments
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date // Calculated based on challenge duration and start date
  },
  lastUpdated: {
      type: Date,
      default: Date.now
  }
});

// Indexing for faster queries
challengeEnrollmentSchema.index({ userId: 1, challengeId: 1 }, { unique: true }); // User can enroll in a challenge only once
challengeEnrollmentSchema.index({ userId: 1, status: 1 }); // For fetching active challenges per user

// Method to calculate end date (example)
challengeEnrollmentSchema.pre("save", function(next) {
  if (this.isNew) {
    // Find the challenge to get duration
    mongoose.model("Challenge").findById(this.challengeId).then(challenge => {
      if (challenge) {
        const durationInMs = challenge.durationUnit === 'days' ? challenge.duration * 24 * 60 * 60 * 1000 : challenge.duration * 60 * 60 * 1000;
        this.endDate = new Date(this.startDate.getTime() + durationInMs);
      }
      next();
    }).catch(err => next(err));
  } else {
    this.lastUpdated = Date.now();
    next();
  }
});

module.exports = mongoose.model("ChallengeEnrollment", challengeEnrollmentSchema);
```

**Fields Explained:**
*   `userId`, `challengeId`: Links to the User and Challenge documents.
*   `status`: Tracks if the user is currently 'enrolled', has 'completed', or 'failed' the challenge.
*   `progress`: User's current progress towards the `progressGoal` of the linked challenge.
*   `rank`: User's rank among participants in this specific challenge (may require separate calculation logic).
*   `startDate`, `endDate`: Defines the participation period.
*   `lastUpdated`: Tracks when progress was last updated.

## 4. Progress Schema (`models/Progress.js`)

This schema tracks daily or periodic progress entries for activities like cardio and resistance, as seen in `WeeklyProgress.jsx`.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["cardio", "resistance"] // Types of progress tracked
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String, // e.g., 'km', 'minutes'
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now // Records the date of the progress entry
  }
});

// Indexing for efficient querying of progress by user and date range
progressSchema.index({ userId: 1, date: -1 });
progressSchema.index({ userId: 1, type: 1, date: -1 });

module.exports = mongoose.model("Progress", progressSchema);
```

**Fields Explained:**
*   `userId`: Links the progress entry to a specific user.
*   `type`: Specifies the activity type (cardio or resistance).
*   `value`: The amount of progress made (e.g., 5 km, 30 minutes).
*   `unit`: The unit of measurement for the value.
*   `date`: The date the progress was achieved/logged.

This schema allows you to store individual progress entries. You would then aggregate these entries (e.g., sum up values for the past week) in your backend logic to display the weekly progress as shown in the `WeeklyProgress.jsx` component.

---

This design provides a solid foundation. We can refine it further if needed. Next, I will implement these schemas as Mongoose models in separate `.js` files within the `models` directory.
