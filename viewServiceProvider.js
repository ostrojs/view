const ServiceProvider = require('@ostro/support/serviceProvider');
const ViewManager = require('./viewManager')
class ViewServiceProvider extends ServiceProvider {

    register() {
        this.$app.singleton('view', function(app) {
            return new ViewManager(app)
        })
    }
    boot() {}

}
module.exports = ViewServiceProvider