export class UserNotification {
    constructor(
      public id: number,
      public userId: number,
      public allNewVacancies: boolean,
      public recommendedVacancies: boolean,
      public disableNotifications: boolean,
      public sendToMainEmail: boolean,
      public sendToOtherEmail: boolean,
    ) {}
  }