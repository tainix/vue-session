const mix = {

    beforeRouteEnter(to, from, next) {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            Vue.$session.toLoginOrContinue(to, from, next)
        } else {
            next()
        }
    },

}