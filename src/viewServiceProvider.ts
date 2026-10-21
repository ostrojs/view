import ServiceProvider from '@ostro/support/serviceProvider';
import ViewManager from './viewManager';

class ViewServiceProvider extends ServiceProvider {

    /**
     * register method.
     */
    public override register(): void {
        this.$app.singleton('view', function(app: any): ViewManager {
            return new ViewManager(app);
        });
    }

    /**
     * boot method.
     */
    public override boot(): void {}

}

export default ViewServiceProvider;