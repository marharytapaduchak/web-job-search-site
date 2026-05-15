export class UserRecommendation {
    constructor(
      public id: number,
      public userId: number,
      public name: string,
      public email: string,
      public message: string,
      public skills: string[],
    ) {}
  }