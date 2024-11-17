export interface IAdToken {
    generateAdminTokens(adminId: string): {
        adminAccessToken: string;
    };
    verifyAdminAccessToken(token: string): any;
  }
  