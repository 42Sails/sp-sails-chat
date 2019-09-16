/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	authenticate: async (request, response) => {
 		const uuid  = request.body.uuid;

 		if(request.body.action == 'signup') {
 			const name = request.body.name;
 			// Validate signup form
 			if(!AuthService.validateSignupForm(request, response)) {
 				return;
 			}
 			// Check if email is registered
 			const duplicateFound = await AuthService.checkDuplicateRegistration(request, response);
 			if(!duplicateFound) {
 				return;
 			}
 			// Create new user
 			const newUser = await AuthService.registerUser({name,uuid}, response);
 			if(!newUser) {
 				return;
 			}
 		}

 		// Attempt to log in
 		const success = await AuthService.login(request, response);
 	},


 };
