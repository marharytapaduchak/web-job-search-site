export interface UserNotification {
    id: number;
    userId: number;
    allNewVacancies: boolean;
    recommendedVacancies: boolean;
    disableNotifications: boolean;
    sendToMainEmail: boolean;
    sendToOtherEmail: boolean;
}
