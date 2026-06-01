const express = require('express');
const userController = require('../controllers/user');
const { verify } = require("../auth");
const router = express.Router();


router.post("/check-email", userController.checkEmailExists);


router.get("/failed", (req,res)=>{
	console.log("User is not authenticated");
	res.send("Failed")
})

router.get("/success", (req,res)=>{
	console.log("You are now logged in");
	console.log(req.user)
	res.send(`Welcome ${req.user.displayName}`)
});

router.get("/logout", (req, res)=> {
	req.session.destroy((err) => {
		if(err){
			console.log(err)
		}
		else{
			req.logout(()=>{
				console.log("You are logged out");
				res.redirect("/")
			})
		}
	})
})

// register
router.post("/register", userController.registerUser);
// login
router.post("/login", userController.loginUser);
// retrieve user details
router.get("/details", verify, userController.getProfile);
// update password
router.patch("/update-password", verify, userController.updatePassword);
// admin
router.patch(
	"/:userId/set-as-admin",
	 verify, 
	 userController.setAsAdmin
);

module.exports = router;
