function newLinkSubscribe(parent, args, context, info) {
    //Now you can see how we access pubsub on the context and call asyncIterator() passing the string "NEW_LINK" into it. 
    //  This function is used to resolve subscriptions and push the event data.
    return context.pubsub.asyncIterator("NEW_LINK")
}

// subscription resolver with a subscription resolver funnction and a payload returner
const newLink = {
    subscribe: newLinkSubscribe,
    resolve: payload => {
        return payload
    },
}

module.exports = {
    newLink,
}