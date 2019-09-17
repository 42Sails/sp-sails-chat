/**
* AuthService.js
*
**/


// Where to display auth errors
const view = 'homepage';

module.exports = {

  sendAuthError: (response, title, message, options) => {
    options = options || {};
    const { uuid, name} = options;
    response.json({ error: {title, message}, uuid, name });
    return false;
  },

  validateSignupForm: (request, response) => {
    if(request.body.name == '') {
      return AuthService.sendAuthError(response, 'Signup Failed!', "You must provide a name to sign up", {uuid:request.body.uuid});
    } else if(request.body.uuid == '') {
      return AuthService.sendAuthError(response, 'Signup Failed!', "You must provide an uuid  to sign up", {name:request.body.name});
    }
    return true;
  },

  checkDuplicateRegistration: async (request, response) => {
    try {
      let existingUser = await User.findOne({uuid:request.body.uuid});
      if(existingUser) {
        const options = {uuid:request.body.uuid, name:request.body.name};
        return AuthService.sendAuthError(response, 'Duplicate Registration!', "The uuid provided has already been registered", options);
      }
      return true;
    } catch (err) {
      response.serverError(err);
      return false;
    }
  },

  registerUser: async (data, response) => {
    try {
      const {name, uuid} = data;
      let newUser = await User.create({name, uuid});
      // Let all sockets know a new user has been created
      // User.publishCreate(newUser);
      return newUser;
    } catch (err) {
      response.serverError(err);
      return false;
    }
  },

  login: async (request, response) => {
    try {
			let user = await User.findOne({uuid:request.body.uuid});
			if(user) { // Login Passed
				//request.session.userId = user.id;
				//request.session.authenticated = true;
				ChatMessage.watch(request);
				return response.json(user);
			} else { // Login Failed
        return AuthService.sendAuthError(response, 'Login Failed!', "The uuid provided is not registered", {uuid:request.body.uuid});
      }
		} catch (err) {
			return response.serverError(err);
		}
  }
}
