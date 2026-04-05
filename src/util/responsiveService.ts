
export class ResponsiveService {
    private mobile: boolean;
    private listeners: Array<(isMobile: boolean) => void> = [];

    constructor() {
        this.mobile = true;
        this.CheckWidth();
        // Re-evaluate on resize so layout updates without a full reload
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => {
                const wasMobile = this.mobile;
                this.CheckWidth();
                if (wasMobile !== this.mobile) {
                    this.listeners.forEach(cb => cb(this.mobile));
                }
            });
        }
    }

    private onMobileChange(status: boolean) {
        this.mobile = status;
    }

    public IsMobileDevice(): boolean {
        return this.mobile;
    }

    public CheckWidth() {
        const width = window.innerWidth;
        this.onMobileChange(width <= 992);
    }

    /** Subscribe to breakpoint change events */
    public onChange(cb: (isMobile: boolean) => void): () => void {
        this.listeners.push(cb);
        return () => {
            this.listeners = this.listeners.filter(l => l !== cb);
        };
    }
}

export const responsiveCtr: ResponsiveService = new ResponsiveService();
