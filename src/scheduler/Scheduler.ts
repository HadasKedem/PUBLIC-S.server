const schedule = require('node-schedule')

export class Scheduler {
    private readonly f: () => any;
    private readonly cron: string;
    public constructor(f: ()=>any, cron: string) {
        this.f = f;
        this.cron = cron;
    }

    public run = () => {
        schedule.scheduleJob(this.cron, this.f)
    }
}
