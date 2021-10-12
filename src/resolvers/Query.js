function feed(parent, args, context, info) { // get all the links regardless. SELECT * FROM links
    return context.prisma.link.findMany()
}

module.exports = {
    feed,
}