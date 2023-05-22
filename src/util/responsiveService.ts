
export class ResponsiveService {
    private mobile: boolean;
    constructor() {
        this.mobile = true;
        this.CheckWidth();
    }

    private onMobileChange(status: boolean) {
        this.mobile = status;
    }

    public IsMobileDevice() : boolean {
        this.CheckWidth();
        return this.mobile;
    }

    public CheckWidth() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.onMobileChange(true);
        } else if (width > 768 && width <= 992) {
            this.onMobileChange(true);
        } else {
            this.onMobileChange(false);
        }
    }
}

export const responsiveCtr: ResponsiveService = new ResponsiveService();