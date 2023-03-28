export interface UserContextApi {
  userInfo: {
    businessName: string;
    businessNumber: string;
    businessType: string;
  };
  updateUserInfo: (newInfo: any) => void;
}
