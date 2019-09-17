/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  render: async (request, response) => {
    try {
      let data = await User.findOne({uuid:request.body.uuid});

      if (!data) {
        return response.notFound('The user was NOT found!');
      }
      response.json(data);
    } catch (err) {
      response.serverError(err);
    }
  },

  nick: (request, response) => {
      let nick = "User" + Math.floor(Math.random() * (1000 - 100)) + 10;
      response.json({"nick": nick});
  },

  update: async (request, response) => {

      request.body = request.body === undefined ? [] :  request.body;
      let user = await User.update({uuid:request.body.uuid}, {name: request.body.new_nick});
      response.json(...user);
  }

};
