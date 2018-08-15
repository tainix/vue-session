const mix = {

    created() {

    },

    beforeRouteEnter(to, from, next) {
        
        Vue.$session.toLoginOrContinue(to, from, next)
    },


}