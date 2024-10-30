const express = require("express");

const {
  adminRegisterHandler,
  adminSignInHandler,
  giveInstructorAccess,
  getUsersData,
  deleteUser,
  getInstructorData,
  deactivateInstructor,
  deactivateUser,
  deleteInstructor,
} = require("../controller/admin.controller");
const {
  adminRefreshTokenHandler,
  verifyInstructorToken,
  verifyAdminToken,
} = require("../utils/jwt");

const router = express.Router();

//auth
router.post("/register", adminRegisterHandler);
router.post("/login", adminSignInHandler);
router.get("/refresh", adminRefreshTokenHandler);

//admin course access

router.put("/instructor-access", verifyAdminToken, giveInstructorAccess);

// all users
router.get("/all-users", getUsersData);
router.put("/user/deactivate", deactivateUser);

// delete a user
router.delete("/delete/:userId", deleteUser);

router.get("/instructors", getInstructorData);
router.put("/instructors/deactivate", deactivateInstructor);
router.delete("instructors/delete", deleteInstructor);

module.exports = router;
