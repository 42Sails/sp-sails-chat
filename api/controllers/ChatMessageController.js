/**
 * ChatMessageController
 *
 * @description :: Server-side logic for managing Chatmessages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: async (request, response) => {

    //if (!request.isSocket) {
    //  return response.badRequest();
    //}
    var skip = request.body.skip !== undefined ? request.body.skip : 0; // request.body.shift
		var limit = request.body.limit !== undefined ? request.body.shift : 100;
		try {
			let messages = await ChatMessage.find().skip(skip).limit(limit);
			return response.json(messages);
		} catch(err) {
			return response.serverError(messages);
		}
	},

	find: async (request, response) => {

//     if (!request.isSocket) {
//      return response.badRequest();
//     }
//
// 		try {
// 			let messages = await ChatMessage.find().limit(100);
// 			return response.json(messages);
// 		} catch(err) {
// 			return response.serverError(messages);
// 		}
	},


	render: (request, response) => {
		return response.view('chatroom');
	},

	postMessage: async (request, response) => {
		// Make sure this is a socket request (not traditional HTTP)
    if (!request.isSocket) {
      return response.badRequest();
    }

		try {
			let user = await User.findOne({id:request.session.userId});
			let msg = await ChatMessage.create({message:request.body.message, createdBy:user });
			if(!msg.id) {
				throw new Error('Message processing failed!');
			}
			msg.createdBy = user;
			ChatMessage.publishCreate(msg);
		} catch(err) {
			return response.serverError(err);
		}


		return response.ok();
	}
};
