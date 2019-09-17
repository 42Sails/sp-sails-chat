/**
 * ChatMessageController
 *
 * @description :: Server-side logic for managing Chatmessages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: async (request, response) => {

    if (!request.isSocket) {
     return response.badRequest();
    }

    let messages = [];
    request.body = request.body === undefined ? [] :  request.body;
    var skip = request.body.skip !== undefined ? request.body.skip : 0;
		var limit = request.body.limit !== undefined ? request.body.limit : 100;

		var isSystem = request.body.isSystem !== undefined ? request.body.isSystem : false;



		try {

      if (request.body.createdAt === undefined || request.body.createdAt === "" || request.body.createdAt === null || request.body.createdAt === Nan){
		    if (request.body.search === undefined || request.body.search === "" || request.body.search === null || request.body.search === Nan ) {
		  		  if (isSystem === true) {
		           messages = await ChatMessage.find({isSystem: true}).skip(skip).limit(limit).populate(createdBy);
		       } else {
		           messages = await ChatMessage.find().skip(skip).limit(limit).populate(createdBy);
		        }
		    } else {
		           messages = await ChatMessage.find({ message: { 'contains': request.body.search }}).skip(skip).limit(limit).populate(createdBy);
		    }
      } else {
        messages = await ChatMessage.find({ createdAt: { ">" : request.body.createdAt } }).skip(skip).limit(limit).populate(createdBy);

      }

			return response.json(messages);
		} catch(err) {
			return response.serverError(messages);
		}
	},

// 	render: (request, response) => {
// 		return response.view('chatroom');
// 	},

	postMessage: async (request, response) => {
		// Make sure this is a socket request (not traditional HTTP)
    if (!request.isSocket) {
      return response.badRequest();
    }

		try {
			let user = await User.findOne({uuid:request.body.uuid});
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
